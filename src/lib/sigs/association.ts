import * as S from "@src/types/sigs"
import * as B from "@src/lib/sigs/base"

let allowAssociationFields: Array<keyof S.IAllowAssociationStr> = [
  "type",
  "timestamp",
  "aggregator_addr"
]
let allowAssociationType: S.IAllowAssociationStr["type"] =
  "bloomiq-allow_association"
export const validateAllowAssociation = (txt: string, sig: Buffer) => {
  let p: Partial<S.IAllowAssociationStr> = JSON.parse(txt)
  B.checkFieldsPresent(p, allowAssociationFields)
  B.checkTimestamp(p)
  B.checkAggregatorAddr(p)
  B.checkType(p, allowAssociationType)
}
