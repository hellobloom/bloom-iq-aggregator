import * as S from '@src/types/sigs'
import {AttestationData as AD} from '@bloomprotocol/attestations-lib'

export interface TAttMetaReport extends AD.IBaseAttMeta {
  date: string
}

let context = 'https://github.com/hellobloom/attestations-lib/blob/master/src/AttestationData.ts'

export const generateAttestation = async (performArgs: S.IPerformAttestationStr): Promise<TAttMetaReport> => {
  return {
    '@context': context,
    generality: 1,
    date: new Date().toISOString(),
    data: reports.map(x => x.report_hash),
  }
}
