import * as B from "@src/types/models/base"

export type TS = B.Serialize<T>

export type T = {
  id?: string // uuid
  created: string
  updated: string

  permit_text: any
  permit_sig: Buffer
  revoke_text: any
  revoke_sig: Buffer
}
