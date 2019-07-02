import * as B from "@src/types/models/base"

export type TS = B.Serialize<T>

export type T = {
  id?: string // uuid
  created: string
  updated: string

  subject_id: string
  subject_addr: Buffer

  allow_association_sig: Buffer
  allow_association_plaintext: string

  revoke_association_sig: Buffer
  revoke_association_plaintext: string
}
