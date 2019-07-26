import * as B from '@src/types/models/base'
import {HashingLogic as HL} from '@bloomprotocol/attestations-lib'
import {IBatchProof} from '@bloomprotocol/verify-kit'
import * as S from '@src/types/sigs'
export type TS = B.Serialize<T>

export type T = {
  id?: string // uuid
  created: string
  updated: string
  subject_id: string
  subject_addr: Buffer
  aggregator_addr: Buffer
  type: string
  types: string[]
  data: HL.IBloomBatchMerkleTreeComponents | IUnsignedBloomBatchMerkleTreeComponents
  submitted: boolean
  batch_proof?: IBatchProof
}

type Overwrite<T1, T2> = {[P in Exclude<keyof T1, keyof T2>]: T1[P]} & T2

export type IUnsignedBloomBatchMerkleTreeComponents = Overwrite<
  HL.IBloomBatchMerkleTreeComponents,
  {
    subjectSig?: string
    batchAttesterSig?: string
    batchLayer2Hash?: string
  }
>

export type ISignedBloomBatchMerkleTreeComponents = Overwrite<HL.IBloomBatchMerkleTreeComponents, {}>

export interface TCriteriaW {
  criteria: S.IPerformAttestationStr
}

export type TUnsignedAttData = IUnsignedBloomBatchMerkleTreeComponents & TCriteriaW
export type TSignedAttData = ISignedBloomBatchMerkleTreeComponents & TCriteriaW
