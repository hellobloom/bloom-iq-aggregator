import * as B from '@src/models/base'
import {
  T as _T,
  TS as _TS,
  TUnsignedAttData as _TUnsignedAttData,
  TSignedAttData as _TSignedAttData,
} from '@src/types/models/attestation'
import {bufferToHex} from 'ethereumjs-util'

export type T = _T
export type TS = _TS
export type TUnsignedAttData = _TUnsignedAttData
export type TSignedAttData = _TSignedAttData

// Serializer

export const serialize = (a: T): TS => {
  return {...a, subject_addr: bufferToHex(a.subject_addr), aggregator_addr: bufferToHex(a.aggregator_addr)}
}

export type TID = Pick<T, 'id'>['id']
export type TAttr = keyof T

export const Q = () => B.db('attestations')

export const Create = B.mkCreate<T>(Q)
export const FindById = B.mkFindById<T, 'id'>(Q, 'id')
export const FindWhere = B.mkFindWhere<T>(Q)
export const Where = B.mkWhere<T>(Q)
export const All = B.mkAll<T>(Q)
export const DeleteOne = B.mkDeleteOne<T, 'id'>(Q, 'id')
export const DeleteAll = B.mkDeleteAll<T>(Q)
export const UpdateOne = B.mkUpdateOne<T, 'id'>(Q, 'id')
export const UpdateAll = B.mkUpdateAll<T>(Q)

export default Q
