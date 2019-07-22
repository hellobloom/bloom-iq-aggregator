// import { renderError } from "@src/api/renderError"
import {TApiRoutes} from '@src/types/api/basetypes'
import * as T from '@src/types/api/attestations'
import {Subject, Attestation} from '@src/models'
import * as S from '@src/lib/sigs/attestation'
import * as G from '@src/lib/attestations'
import {envPr} from '@src/environment'
import {toBuffer, bufferToHex} from 'ethereumjs-util'
import {HashingLogic as HL} from '@bloomprotocol/attestations-lib'

const list = async (req: T.list.req): Promise<T.list.res> => {
  const validation = await S.validateListAttestation(
    req.body.list_attestation.plaintext,
    req.body.list_attestation.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return {status: 400, json: {success: false, validation}}
  }

  const subject = await Subject.FindWhere({
    addr: toBuffer(req.params.subject_addr),
  })
  if (!subject) return {status: 400, json: {success: false, error: 'no_subject'}}
  const attestations = await Attestation.Where({
    subject_id: subject.id,
  })
  return {
    status: 200,
    json: {
      success: true,
      attestations: attestations.map(Attestation.serialize),
    },
  }
}

const show = async (req: T.show.req): Promise<T.show.res> => {
  const validation = await S.validateShowAttestation(
    req.body.show_attestation.plaintext,
    req.body.show_attestation.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return {status: 400, json: {success: false, validation}}
  }
  if (validation.obj!.attestation_id! !== req.params.attestation_id) {
    return {
      status: 400,
      json: {success: false, error: 'attestation_id_doesnt_match_sig'},
    }
  }
  const attestation = await Attestation.FindWhere({
    id: req.params.attestation_id,
  })
  return {
    status: 200,
    json: {
      success: true,
      attestation: Attestation.serialize(attestation),
    },
  }
}

const create = async (req: T.create.req): Promise<T.create.res> => {
  const subject = await Subject.FindWhere({
    addr: toBuffer(req.params.subject_addr),
  })
  const validation = await S.validatePerformAttestation(
    req.body.perform_attestation.plaintext,
    req.body.perform_attestation.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return {status: 400, json: {success: false, validation}}
  }

  const data = await G.generateAttestationData(toBuffer(req.params.subject_addr), validation.obj!)

  const e = await envPr

  const attestation = await Attestation.Create({
    subject_id: subject.id,
    subject_addr: toBuffer(req.params.subject_addr),
    aggregator_addr: e.attestations.attester_address,
    type: 'meta',
    types: ['meta'],
    data: data,
  })
  return {
    status: 200,
    json: {
      success: true,
      attestation: Attestation.serialize(attestation),
    },
  }
}

const sign = async (req: T.sign.req): Promise<T.sign.res> => {
  const e = await envPr

  const subject = await Subject.FindWhere({
    addr: toBuffer(req.params.subject_addr),
  })
  if (!subject) return {status: 400, json: {success: false, error: 'no_subject'}}

  const attestation = await Attestation.FindWhere({
    subject_addr: toBuffer(req.params.subject_addr),
  })
  if (!attestation) return {status: 400, json: {success: false, error: 'no_attestation'}}

  const success = HL.validateSignedAgreement(
    req.body.sign_attestation.subject_sig,
    e.attestations.contract_address,
    attestation.data.layer2Hash,
    attestation.data.requestNonce,
    bufferToHex(attestation.subject_addr)
  )

  if (success) {
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
  const validation = await S.validateDeleteAttestation(
    req.body.revoke_attestation.plaintext,
    req.body.revoke_attestation.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return {status: 400, json: {success: false, validation}}
  }
  if (validation.obj!.attestation_id! !== req.params.attestation_id) {
    return {
      status: 400,
      json: {success: false, error: 'attestation_id_doesnt_match_sig'},
    }
  }
  await Attestation.Q()
    .where({
      subject_addr: toBuffer(req.params.subject_addr),
      attestation_id: toBuffer(req.params.attestation_id),
    })
    .whereNull('revoke_sig')
    .whereNull('revoke_plaintext')
    .update({
      revoke_sig: toBuffer(req.body.revoke_attestation.subject_sig),
      revoke_plaintext: req.body.revoke_attestation.plaintext,
    })

  return {status: 200, json: {success: true}}
}

const routes: Array<TApiRoutes<any, any>> = [
  {
    method: 'get',
    paths: '/api/v1/subjects/:subject_addr/attestations',
    fn: list,
    middleware: {subjectIsActive: true, adminRequired: false},
  },
  {
    method: 'get',
    paths: '/api/v1/subjects/:subject_addr/attestations/:attestation_id',
    fn: show,
    middleware: {subjectIsActive: true, adminRequired: false},
  },
  {
    method: 'post',
    paths: '/api/v1/subjects/:subject_addr/attestations',
    fn: create,
    middleware: {subjectIsActive: true, adminRequired: false},
  },
  {
    method: 'post',
    paths: '/api/v1/subjects/:subject_addr/attestations/:attestation_id/sign',
    fn: sign,
    middleware: {subjectIsActive: true, adminRequired: false},
  },
  {
    method: 'delete',
    paths: '/api/v1/subjects/:subject_addr/attestations/:attestation_id',
    fn: del,
    middleware: {subjectIsActive: true, adminRequired: false},
  },
]

export default routes
