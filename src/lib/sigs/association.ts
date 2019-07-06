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
): Promise<B.TSuccess | Array<B.TFieldErr>> => {
  let p: Partial<S.IAllowAssociationStr> = JSON.parse(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(
      p,
      allowAssociationFields,
      allowAssociationType,
      "subject_sig",
      sig,
      txt,
      addr
    )),
    await B.checkAggregatorAddr(p)
  ])

  return B.errorCheck(errors)
}

// IListAssociationStr
let listAssociationFields: Array<keyof S.IListAssociationStr> = [
  "type",
  "timestamp"
]
let listAssociationType: S.IListAssociationStr["type"] =
  "bloomiq-list_association"

export const validateListAssociation = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TSuccess | Array<B.TFieldErr>> => {
  let p: Partial<S.IListAssociationStr> = JSON.parse(txt)
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

  return B.errorCheck(errors)
}
