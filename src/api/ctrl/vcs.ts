// import { renderError } from "@src/api/renderError"
import {TApiRoutes} from '@src/types/api/basetypes'
import * as T from '@src/types/api/vcs'
import {Subject, VC} from '@src/models'
import * as S from '@src/lib/sigs/vc'
import * as G from '@src/lib/vcs'
import {envPr} from '@src/environment'
import {toBuffer, bufferToHex} from 'ethereumjs-util'
import {HashingLogic as HL} from '@bloomprotocol/attestations-lib'

const list = async (req: T.list.req): Promise<T.list.res> => {
  const validation = await S.validateListVC(
    req.body.list_vc.plaintext,
    req.body.list_vc.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return {status: 400, json: {success: false, validation}}
  }

  const subject = await Subject.FindWhere({
    addr: toBuffer(req.params.subject_addr),
  })
  if (!subject) return {status: 400, json: {success: false, error: 'no_subject'}}
  const vcs = await VC.Where({
    subject_id: subject.id,
  })
  return {
    status: 200,
    json: {
      success: true,
      vcs: vcs.map(VC.serialize),
    },
  }
}

const show = async (req: T.show.req): Promise<T.show.res> => {
  const validation = await S.validateShowVC(
    req.body.show_vc.plaintext,
    req.body.show_vc.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return {status: 400, json: {success: false, validation}}
  }
  if (validation.obj!.vc_id! !== req.params.vc_id) {
    return {
      status: 400,
      json: {success: false, error: 'vc_id_doesnt_match_sig'},
    }
  }
  const vc = await VC.FindWhere({
    id: req.params.vc_id,
  })

  if (vc.submitted && !vc.batch_proof) {
    if (!vc.data.batchLayer2Hash) {
      return {status: 200, json: {success: false, error: 'batch_layer_2_hash_missing'}}
    }
    try {
      const batch_proof = await G.getProof(vc.data.batchLayer2Hash)
      await VC.UpdateOne(vc.id, {batch_proof})
    } catch (e) {
      console.log('Failed to retrieve batch proof')
    }
  }

  return {
    status: 200,
    json: {
      success: true,
      vc: VC.serialize(vc),
    },
  }
}

const create = async (req: T.create.req): Promise<T.create.res> => {
  const subject = await Subject.FindWhere({
    addr: toBuffer(req.params.subject_addr),
  })
  const validation = await S.validateIssueVC(
    req.body.perform_vc.plaintext,
    req.body.perform_vc.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return {status: 400, json: {success: false, validation}}
  }

  const data = await G.generateVCData(toBuffer(req.params.subject_addr), validation.obj!)

  const e = await envPr

  const vc = await VC.Create({
    subject_id: subject.id,
    subject_addr: toBuffer(req.params.subject_addr),
    aggregator_addr: e.vcs.aggregator_address,
    type: 'meta',
    types: ['meta'],
    data: data,
  })

  return {
    status: 200,
    json: {
      success: true,
      vc: VC.serialize(vc),
    },
  }
}

const sign = async (req: T.sign.req): Promise<T.sign.res> => {
  const e = await envPr

  const subject = await Subject.FindWhere({
    addr: toBuffer(req.params.subject_addr),
  })
  if (!subject) return {status: 400, json: {success: false, error: 'no_subject'}}

  const vc = await VC.FindWhere({
    subject_addr: toBuffer(req.params.subject_addr),
  })
  if (!vc) return {status: 400, json: {success: false, error: 'no_vc'}}

  const success = HL.validateSignedAgreement(
    req.body.sign_vc.subject_sig,
    e.vcs.contract_address,
    vc.data.layer2Hash,
    vc.data.requestNonce,
    bufferToHex(vc.subject_addr)
  )

  if (success) {
    await G.updateVCToBatch(vc, req.body.sign_vc.subject_sig)
    await G.submit(vc.data.batchLayer2Hash!)
    await VC.UpdateOne(vc.id, {submitted: true})
    return {
      status: 200,
      json: {success: true},
    }
  } else {
    return {
      status: 400,
      json: {success: false, error: 'invalid_sig'},
    }
  }
}

const del = async (req: T.del.req): Promise<T.del.res> => {
  const validation = await S.validateDeleteVC(
    req.body.revoke_vc.plaintext,
    req.body.revoke_vc.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return {status: 400, json: {success: false, validation}}
  }
  if (validation.obj!.vc_id! !== req.params.vc_id) {
    return {
      status: 400,
      json: {success: false, error: 'vc_id_doesnt_match_sig'},
    }
  }
  await VC.Q()
    .where({
      subject_addr: toBuffer(req.params.subject_addr),
      vc_id: toBuffer(req.params.vc_id),
    })
    .whereNull('revoke_sig')
    .whereNull('revoke_plaintext')
    .update({
      revoke_sig: toBuffer(req.body.revoke_vc.subject_sig),
      revoke_plaintext: req.body.revoke_vc.plaintext,
    })

  return {status: 200, json: {success: true}}
}

const routes: Array<TApiRoutes<any, any>> = [
  {
    method: 'get',
    paths: '/api/v1/subjects/:subject_addr/vcs',
    fn: list,
    middleware: {subjectIsActive: true, adminRequired: false},
  },
  {
    method: 'get',
    paths: '/api/v1/subjects/:subject_addr/vcs/:vc_id',
    fn: show,
    middleware: {subjectIsActive: true, adminRequired: false},
  },
  {
    method: 'post',
    paths: '/api/v1/subjects/:subject_addr/vcs',
    fn: create,
    middleware: {subjectIsActive: true, adminRequired: false},
  },
  {
    method: 'post',
    paths: '/api/v1/subjects/:subject_addr/vcs/:vc_id/sign',
    fn: sign,
    middleware: {subjectIsActive: true, adminRequired: false},
  },
  {
    method: 'delete',
    paths: '/api/v1/subjects/:subject_addr/vcs/:vc_id',
    fn: del,
    middleware: {subjectIsActive: true, adminRequired: false},
  },
]

export default routes
