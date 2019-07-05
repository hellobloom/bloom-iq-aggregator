import { TRespE, TReq } from "@src/types/api/basetypes"
import * as Association from "@src/types/models/association"

export type reqBody = {
  list_association: {
    plaintext: string
    subject_sig: string
  }
}
export type reqParams = {}
export type reqQuery = {
  subject_addr: string
}

export type respBody = {
  success: true
  associations: Array<Association.TS>
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
