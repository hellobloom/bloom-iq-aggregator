import * as B from "@src/types/models/base"

export type TS = B.Serialize<T>

export type T = {
  id?: string // uuid
  created: string
  updated: string

  subject_id: string
  subject_addr: Buffer

  reporter_id: string
  reporter_addr: Buffer

  permit_plaintext: any
  permit_sig: Buffer

  revoke_plaintext: any
  revoke_sig: Buffer
}
