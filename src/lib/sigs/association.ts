import * as S from "@src/types/sigs"
import * as B from "@src/lib/sigs/base"

// IAllowAssociationStr
let allowAssociationFields: Array<keyof S.IAllowAssociationStr> = [
  "type",
  "timestamp",
  "aggregator_addr"
]
let allowAssociationType: S.IAllowAssociationStr["type"] =
  "bloomiq-allow_association"

export const validateAllowAssociation = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IAllowAssociationStr>> => {
  let p = B.parseSigText<S.IAllowAssociationStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      allowAssociationFields,
      allowAssociationType,
      "subject_sig",
      sig,
      txt,
      addr
    ))
  ])

  return B.errorCheck<S.IAllowAssociationStr>(errors, p)
}

// IListAssociationStr
let listAssociationFields: Array<keyof S.IListAssociationStr> = [
  "type",
  "timestamp",
  "aggregator_addr"
]
let listAssociationType: S.IListAssociationStr["type"] =
  "bloomiq-list_association"

export const validateListAssociation = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IListAssociationStr>> => {
  let p = B.parseSigText<S.IListAssociationStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      listAssociationFields,
      listAssociationType,
      "subject_sig",
      sig,
      txt,
      addr
    ))
  ])

  return B.errorCheck<S.IListAssociationStr>(errors, p)
}

// IShowAssociationStr
let showAssociationFields: Array<keyof S.IShowAssociationStr> = [
  "type",
  "timestamp",
  "aggregator_addr",
  "association_id"
]
let showAssociationType: S.IShowAssociationStr["type"] =
  "bloomiq-show_association"

export const validateShowAssociation = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IShowAssociationStr>> => {
  let p = B.parseSigText<S.IShowAssociationStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      showAssociationFields,
      showAssociationType,
      "subject_sig",
      sig,
      txt,
      addr
    ))
  ])

  return B.errorCheck<S.IShowAssociationStr>(errors, p)
}

// IRevokeAssociationStr
let revokeAssociationFields: Array<keyof S.IRevokeAssociationStr> = [
  "type",
  "timestamp",
  "aggregator_addr"
]
let revokeAssociationType: S.IRevokeAssociationStr["type"] =
  "bloomiq-revoke_association"

export const validateRevokeAssociation = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IRevokeAssociationStr>> => {
  let p = B.parseSigText<S.IRevokeAssociationStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      revokeAssociationFields,
      revokeAssociationType,
      "subject_sig",
      sig,
      txt,
      addr
    ))
  ])

  return B.errorCheck<S.IRevokeAssociationStr>(errors, p)
}
