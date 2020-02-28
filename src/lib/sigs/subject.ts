import * as S from "@src/types/sigs"
import * as B from "@src/lib/sigs/base"

// ICreateSubjectStr
let createSubjectFields: Array<keyof S.ICreateSubjectStr> = [
  "type",
  "timestamp",
]
let createSubjectType: S.ICreateSubjectStr["type"] =
  "bloomiq-create_subject"

export const validateCreateSubject = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.ICreateSubjectStr>> => {
  let p = B.parseSigText<S.ICreateSubjectStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      createSubjectFields,
      createSubjectType,
      "subject_sig",
      sig,
      txt,
      addr
    ))
  ])

  return B.errorCheck<S.ICreateSubjectStr>(errors, p)
}

// IShowSubjectStr
let showSubjectFields: Array<keyof S.IShowSubjectStr> = [
  "type",
  "timestamp",
]
let showSubjectType: S.IShowSubjectStr["type"] =
  "bloomiq-show_subject"

export const validateShowSubject = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IShowSubjectStr>> => {
  let p = B.parseSigText<S.IShowSubjectStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      showSubjectFields,
      showSubjectType,
      "subject_sig",
      sig,
      txt,
      addr
    ))
  ])

  return B.errorCheck<S.IShowSubjectStr>(errors, p)
}

// IDeleteSubjectStr
let deleteSubjectFields: Array<keyof S.IDeleteSubjectStr> = [
  "type",
  "timestamp",
]
let deleteSubjectType: S.IDeleteSubjectStr["type"] =
  "bloomiq-delete_subject"

export const validateDeleteSubject = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IDeleteSubjectStr>> => {
  let p = B.parseSigText<S.IDeleteSubjectStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      deleteSubjectFields,
      deleteSubjectType,
      "subject_sig",
      sig,
      txt,
      addr
    ))
  ])

  return B.errorCheck<S.IDeleteSubjectStr>(errors, p)
}
