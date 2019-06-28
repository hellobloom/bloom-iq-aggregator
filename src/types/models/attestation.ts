import * as B from "@src/types/models/base"
export type TS = B.Serialize<T>

export type T = {
  id?: string // uuid
  created: string
  updated: string
  user_id: string
  aggregator_id: string
  type: string
  types: string[]
  data: any
}
