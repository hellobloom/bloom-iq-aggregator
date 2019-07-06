import { TRespE, TReq } from "@src/types/api/basetypes"
import * as Association from "@src/types/models/reporter"

export type reqBody = {
  list_reporter: {
    plaintext: string
    subject_sig: string
  }
}
export type reqParams = {
  subject_addr: string
}
export type reqQuery = {}

export type respBody = {
  success: true
  reporters: Array<Association.TS>
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
