import * as B from "@src/types/models/base"
export type TS = B.Serialize<T>

export type T = {
  id?: string // uuid
  created: string
  updated: string

  subject_id: string
  subject_addr: string

  reporter_id: string
  reporter_addr: string
  reporter_sig: string

  report_hash: string
}
