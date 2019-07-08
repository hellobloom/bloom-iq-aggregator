import { TRespE, TReq } from "@src/types/api/basetypes"
import * as Association from "@src/types/models/association"

export type reqBody = {
  show_association: {
    plaintext: string
    subject_sig: string
  }
}
export type reqParams = {
  subject_addr: string
  association_id: string
}
export type reqQuery = {}

export type respBody = {
  association: Association.TS
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
