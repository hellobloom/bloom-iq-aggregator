import * as S from '@src/types/sigs'
import {Report as R, Attestation as A} from '@src/models'
import {AttestationData as AD, HashingLogic as HL} from '@bloomprotocol/attestations-lib'
import {envPr} from '@src/environment'
import {bufferToHex, toBuffer} from 'ethereumjs-util'
import * as dtf from 'date-fns'

export interface TAttMetaReport extends AD.IBaseAttMeta {
  date: string
  criteria: S.IPerformAttestationStr
}

let context = 'https://github.com/hellobloom/attestations-lib/blob/master/src/AttestationData.ts'

export const generateAttestationStr = async (
  subjectAddr: Buffer,
  performArgs: S.IPerformAttestationStr
): Promise<TAttMetaReport> => {
  var reports = R.Q().where({
    subject_addr: subjectAddr,
  })

  if (performArgs.dt_start) reports = reports.where('created', '>=', performArgs.dt_start)

  if (performArgs.dt_end) reports = reports.where('created', '>=', performArgs.dt_end)

  if (performArgs.tags_some) reports = reports.where('tags', '&&', performArgs.tags_some)

  if (performArgs.tags_all) reports = reports.where('tags', '@>', performArgs.tags_all)

  if (performArgs.addr_whitelist) reports = reports.whereRaw('reporter_addr = ANY(?)', performArgs.addr_whitelist)

  if (performArgs.addr_blacklist) reports = reports.whereRaw('not (reporter_addr = ANY(?))', performArgs.addr_blacklist)

  let result = await reports

  return {
    '@context': context,
    generality: 1,
    date: new Date().toISOString(),
    data: {
      attestations: result.map(x => x.report_hash),
    },
    criteria: performArgs,
  }
}

export const generateAttestationData = async (
  subjectAddr: Buffer,
  performArgs: S.IPerformAttestationStr
): Promise<A.TUnsignedAttData> => {
  const e = await envPr

  const rawClaimNodes: Array<HL.IClaimNode> = [
    {
      data: {
        data: HL.orderedStringify(generateAttestationStr(subjectAddr, performArgs)),
        nonce: HL.generateNonce(),
        version: '3.0.0',
      },
      type: {
        type: e.attestations.type,
        provider: e.attestations.provider,
        nonce: HL.generateNonce(),
      },
      aux: HL.generateNonce(),
    },
  ]

  let now = new Date()

  const components = HL.getSignedMerkleTreeComponents(
    rawClaimNodes,
    now.toISOString(),
    dtf.addSeconds(now, e.attestations.expiration_seconds).toISOString(),
    toBuffer(e.attestations.attester_private_key),
    {
      paddingNodes: Array.from({length: 16}, () => HL.generateNonce()),
      localRevocationLinks: Array.from({length: rawClaimNodes.length}, () => HL.generateNonce()),
      globalRevocationLink: HL.generateNonce(),
    }
  )

  return {
    ...components,
    requestNonce: HL.generateNonce(),
    subject: bufferToHex(subjectAddr),
    criteria: performArgs,
  }
}
