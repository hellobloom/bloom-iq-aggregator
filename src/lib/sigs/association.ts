import * as S from "@src/types/sigs"
import * as B from "@src/lib/sigs/base"

let allowAssociationFields: Array<keyof S.IAllowAssociationStr> = [
  "type",
  "timestamp",
  "aggregator_addr"
]
let allowAssociationType: S.IAllowAssociationStr["type"] =
  "bloomiq-allow_association"
export const validateAllowAssociation = async (
  txt: string,
  sig: Buffer
): Promise<B.TSuccess | Array<B.TFieldErr>> => {
  let p: Partial<S.IAllowAssociationStr> = JSON.parse(txt)
  let errors: Array<B.TFieldResult> = [
    ...(await B.checkFieldsPresent(p, allowAssociationFields)),
    await B.checkTimestamp(p),
    await B.checkAggregatorAddr(p),
    await B.checkType(p, allowAssociationType)
  ]

  let filteredErrors: Array<B.TFieldErr> = errors.filter(
    (x): x is B.TFieldErr => x.success === false
  )

  if (filteredErrors.length === 0) {
    return { success: true }
  } else {
    return filteredErrors
  }
}
