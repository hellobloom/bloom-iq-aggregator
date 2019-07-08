import * as S from "@src/types/sigs"
import * as B from "@src/lib/sigs/base"

// IAllowReporterStr
let allowReporterFields: Array<keyof S.IAllowReporterStr> = [
  "type",
  "timestamp",
  "aggregator_addr",
  "reporter_addr"
]
let allowReporterType: S.IAllowReporterStr["type"] = "bloomiq-allow_reporter"

export const validateAllowReporter = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IAllowReporterStr>> => {
  let p = B.parseSigText<S.IAllowReporterStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      allowReporterFields,
      allowReporterType,
      "subject_sig",
      sig,
      txt,
      addr
    )),
    await B.checkValidAddr(p, "reporter_addr")
  ])

  return B.errorCheck<S.IAllowReporterStr>(errors, p)
}

// IListReporterStr
let listReporterFields: Array<keyof S.IListReporterStr> = [
  "type",
  "timestamp",
  "aggregator_addr"
]
let listReporterType: S.IListReporterStr["type"] = "bloomiq-list_reporter"

export const validateListReporter = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IListReporterStr>> => {
  let p = B.parseSigText<S.IListReporterStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      listReporterFields,
      listReporterType,
      "subject_sig",
      sig,
      txt,
      addr
    ))
  ])

  return B.errorCheck<S.IListReporterStr>(errors, p)
}

// IShowReporterStr
let showReporterFields: Array<keyof S.IShowReporterStr> = [
  "type",
  "timestamp",
  "aggregator_addr",
  "reporter_addr"
]
let showReporterType: S.IShowReporterStr["type"] = "bloomiq-show_reporter"

export const validateShowReporter = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IShowReporterStr>> => {
  let p = B.parseSigText<S.IShowReporterStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      showReporterFields,
      showReporterType,
      "subject_sig",
      sig,
      txt,
      addr
    )),
    await B.checkValidAddr(p, "reporter_addr")
  ])

  return B.errorCheck<S.IShowReporterStr>(errors, p)
}

// IRevokeReporterStr
let revokeReporterFields: Array<keyof S.IRevokeReporterStr> = [
  "type",
  "timestamp",
  "aggregator_addr",
  "reporter_addr"
]
let revokeReporterType: S.IRevokeReporterStr["type"] = "bloomiq-revoke_reporter"

export const validateRevokeReporter = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IRevokeReporterStr>> => {
  let p = B.parseSigText<S.IRevokeReporterStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      revokeReporterFields,
      revokeReporterType,
      "subject_sig",
      sig,
      txt,
      addr
    )),
    await B.checkValidAddr(p, "reporter_addr")
  ])
  return B.errorCheck<S.IRevokeReporterStr>(errors, p)
}
