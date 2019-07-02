import { TRespE, TReq } from "@src/types/api/basetypes"

export type reqBody = {
  allow_reporter: {
    subject_sig: string
    plaintext: string
  }
}
export type reqParams = {}
export type reqQuery = {
  subject_addr: string
}

export type respBody = {
  success: true
  reporter_id: string
}

export type req = TReq<reqBody, reqParams>
export type resp = TRespE<respBody>