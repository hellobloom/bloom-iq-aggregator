import * as S from '@src/types/sigs'
import {Report} from '@src/models'
import {AttestationData as AD} from '@bloomprotocol/attestations-lib'

export interface TAttMetaReport extends AD.IBaseAttMeta {
  date: string
}

let context = 'https://github.com/hellobloom/attestations-lib/blob/master/src/AttestationData.ts'

export const generateAttestationStr = async (
  subjectAddr: Buffer,
  performArgs: S.IPerformAttestationStr
): Promise<TAttMetaReport> => {
  var reports = Report.Q().where({
    subject_addr: subjectAddr,
  })

  if (performArgs.dt_start) reports = reports.where('created', '>=', performArgs.dt_start)

  if (performArgs.dt_end) reports = reports.where('created', '>=', performArgs.dt_end)

  if (performArgs.tags_some) reports = reports.where('tags', '&&', performArgs.tags_some)

  if (performArgs.tags_all) reports = reports.where('tags', '@>', performArgs.tags_all)

  let result = await reports

  return {
    '@context': context,
    generality: 1,
    date: new Date().toISOString(),
    data: {
      attestations: result.map(x => x.report_hash),
    },
  }
}
