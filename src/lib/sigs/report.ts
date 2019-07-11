import * as S from '@src/types/sigs'
import * as B from '@src/lib/sigs/base'

// IListReportAsSubjectStr
let listReportAsSubjectStrFields: Array<keyof S.IListReportAsSubjectStr> = ['type', 'timestamp', 'aggregator_addr']
let listReportAsSubjectStrType: S.IListReportAsSubjectStr['type'] = 'bloomiq-list_report-subject'

export const validateListReportAsSubject = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IListReportAsSubjectStr>> => {
  let p = B.parseSigText<S.IListReportAsSubjectStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      listReportAsSubjectStrFields,
      listReportAsSubjectStrType,
      'subject_sig',
      sig,
      txt,
      addr
    )),
  ])

  return B.errorCheck<S.IListReportAsSubjectStr>(errors, p)
}

// IShowReportAsSubjectStr
let showReportAsSubjectFields: Array<keyof S.IShowReportAsSubjectStr> = [
  'type',
  'timestamp',
  'aggregator_addr',
  'report_id',
]
let showReportAsSubjectType: S.IShowReportAsSubjectStr['type'] = 'bloomiq-show_report-subject'

export const validateShowReportAsSubject = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IShowReportAsSubjectStr>> => {
  let p = B.parseSigText<S.IShowReportAsSubjectStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(p, showReportAsSubjectFields, showReportAsSubjectType, 'subject_sig', sig, txt, addr)),
    await B.checkValidAddr(p, 'reporter_addr'),
  ])

  return B.errorCheck<S.IShowReportAsSubjectStr>(errors, p)
}

// IListReportAsReporterStr
let listReportAsReporterStrFields: Array<keyof S.IListReportAsReporterStr> = ['type', 'timestamp', 'aggregator_addr']
let listReportAsReporterStrType: S.IListReportAsReporterStr['type'] = 'bloomiq-list_report-reporter'

export const validateListReportAsReporter = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IListReportAsReporterStr>> => {
  let p = B.parseSigText<S.IListReportAsReporterStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      listReportAsReporterStrFields,
      listReportAsReporterStrType,
      'subject_sig',
      sig,
      txt,
      addr
    )),
  ])

  return B.errorCheck<S.IListReportAsReporterStr>(errors, p)
}

// IShowReportAsReporterStr
let showReportAsReporterFields: Array<keyof S.IShowReportAsReporterStr> = [
  'type',
  'timestamp',
  'aggregator_addr',
  'report_id',
]
let showReportAsReporterType: S.IShowReportAsReporterStr['type'] = 'bloomiq-show_report-reporter'

export const validateShowReportAsReporter = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IShowReportAsReporterStr>> => {
  let p = B.parseSigText<S.IShowReportAsReporterStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      showReportAsReporterFields,
      showReportAsReporterType,
      'subject_sig',
      sig,
      txt,
      addr
    )),
    await B.checkValidAddr(p, 'reporter_addr'),
  ])

  return B.errorCheck<S.IShowReportAsReporterStr>(errors, p)
}

// IRevokeReportStr
let revokeReportFields: Array<keyof S.IRevokeReportStr> = [
  'type',
  'timestamp',
  'aggregator_addr',
  'report_hash',
  'report_id',
]
let revokeReportType: S.IRevokeReportStr['type'] = 'bloomiq-revoke_report'

export const validateRevokeReport = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IRevokeReportStr>> => {
  let p = B.parseSigText<S.IRevokeReportStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(p, revokeReportFields, revokeReportType, 'subject_sig', sig, txt, addr)),
    await B.checkValidAddr(p, 'reporter_addr'),
  ])
  return B.errorCheck<S.IRevokeReportStr>(errors, p)
}

// ISubmitReportSubj
let submitReportFields: Array<keyof S.ISubmitReportStr> = [
  'type',
  'timestamp',
  'aggregator_addr',
  'subject_addr',
  'report_sha',
]
let submitReportType: S.ISubmitReportStr['type'] = 'bloomiq-submit_report'

export const validateSubmitReport = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.ISubmitReportStr>> => {
  let p = B.parseSigText<S.ISubmitReportStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(p, submitReportFields, submitReportType, 'subject_sig', sig, txt, addr)),
    await B.checkValidAddr(p, 'reporter_addr'),
  ])

  return B.errorCheck<S.ISubmitReportStr>(errors, p)
}
