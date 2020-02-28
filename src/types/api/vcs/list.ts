import { TRespE, TReq } from "@src/types/api/basetypes"
import * as VC from "@src/types/models/vc"

export type reqBody = {
  list_vc: {
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
  vcs: Array<VC.TS>
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
