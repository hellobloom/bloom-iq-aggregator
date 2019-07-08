import { TRespE, TReq } from "@src/types/api/basetypes"

export type reqBody = {
  allow_reporter: {
    subject_sig: string
    plaintext: string
  }
}
export type reqParams = {
  subject_addr: string
  reporter_addr: string
}
export type reqQuery = {}

export type respBody = {
  success: true
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
