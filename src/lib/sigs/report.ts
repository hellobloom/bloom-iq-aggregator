import * as S from "@src/types/sigs"
import * as B from "@src/lib/sigs/base"

// IAllowReportStr
let submitReportFields: Array<keyof S.ISubmitReportStr> = [
  "type",
  "timestamp",
  "aggregator_addr",
  "subject_addr",
  "report_sha"
]
let submitReportType: S.ISubmitReportStr["type"] = "bloomiq-submit_report"

export const validateSubmitReport = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.ISubmitReportStr>> => {
  let p = B.parseSigText<S.ISubmitReportStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      submitReportFields,
      submitReportType,
      "subject_sig",
      sig,
      txt,
      addr
    )),
    await B.checkValidAddr(p, "reporter_addr")
  ])

  return B.errorCheck<S.ISubmitReportStr>(errors, p)
}

// IListReportStr
let listReportFields: Array<keyof S.IListReportStr> = [
  "type",
  "timestamp",
  "aggregator_addr"
]
let listReportType: S.IListReportStr["type"] = "bloomiq-list_report"

export const validateListReport = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IListReportStr>> => {
  let p = B.parseSigText<S.IListReportStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      listReportFields,
      listReportType,
      "subject_sig",
      sig,
      txt,
      addr
    ))
  ])

  return B.errorCheck<S.IListReportStr>(errors, p)
}

// IShowReportStr
let showReportFields: Array<keyof S.IShowReportStr> = [
  "type",
  "timestamp",
  "aggregator_addr",
  "report_id"
]
let showReportType: S.IShowReportStr["type"] = "bloomiq-show_report"

export const validateShowReport = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IShowReportStr>> => {
  let p = B.parseSigText<S.IShowReportStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      showReportFields,
      showReportType,
      "subject_sig",
      sig,
      txt,
      addr
    )),
    await B.checkValidAddr(p, "reporter_addr")
  ])

  return B.errorCheck<S.IShowReportStr>(errors, p)
}

// IRevokeReportStr
let revokeReportFields: Array<keyof S.IRevokeReportStr> = [
  "type",
  "timestamp",
  "aggregator_addr",
  "report_sha",
  "report_id"
]
let revokeReportType: S.IRevokeReportStr["type"] = "bloomiq-revoke_report"

export const validateRevokeReport = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IRevokeReportStr>> => {
  let p = B.parseSigText<S.IRevokeReportStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      revokeReportFields,
      revokeReportType,
      "subject_sig",
      sig,
      txt,
      addr
    )),
    await B.checkValidAddr(p, "reporter_addr")
  ])
  return B.errorCheck<S.IRevokeReportStr>(errors, p)
}
