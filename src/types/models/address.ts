import * as B from "@src/types/models/base"

export type TS = B.Serialize<T>

export type T = {
  addr: Buffer // primary key
  subject_id: string
  created?: string
  updated?: string
}
