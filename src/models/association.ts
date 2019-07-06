import * as B from "@src/models/base"
import { T as _T, TS as _TS } from "@src/types/models/association"
import { bufferToHex } from "ethereumjs-util"

export type T = _T
export type TS = _TS

// Serializer

export const serialize = (a: T): TS => {
  return {
    ...a,
    subject_addr: bufferToHex(a.subject_addr),
    allow_association_sig: bufferToHex(a.allow_association_sig),
    revoke_association_sig: a.revoke_association_sig
      ? (bufferToHex(a.revoke_association_sig) as string)
      : undefined // as Serialize<Buffer> | undefined
  }
}

export type TID = Pick<T, "id">["id"]
export type TAttr = keyof T

export const Q = B.db("associations")

export const Create = B.mkCreate<T>(Q)
export const FindById = B.mkFindById<T, "id">(Q, "id")
export const FindWhere = B.mkFindWhere<T>(Q)
export const Where = B.mkWhere<T>(Q)
export const All = B.mkAll<T>(Q)
export const DeleteOne = B.mkDeleteOne<T, "id">(Q, "id")
export const DeleteAll = B.mkDeleteAll<T>(Q)
export const UpdateOne = B.mkUpdateOne<T, "id">(Q, "id")
export const UpdateAll = B.mkUpdateAll<T>(Q)

export default Q
