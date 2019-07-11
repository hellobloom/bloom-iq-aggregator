import * as B from '@src/types/models/base'
export type TS = B.Serialize<T>

export type T = {
  id?: string // uuid
  created: string
  updated: string

  subject_id: string
  subject_addr: Buffer

  reporter_id: string
  reporter_addr: Buffer
  reporter_sig: Buffer

  report_hash: Buffer
  report_encrypted: Buffer

  revoke_sig: Buffer
  revoke_plaintext: string
}
