import { TRespE, TReq } from "@src/types/api/basetypes"

export type reqBody = {
  reporter_addr: string
  revoke_report: {
    reporter_sig: string
    plaintext: string
  }
}
export type reqParams = {}
export type reqQuery = {
  subject_addr: string
}

export type respBody = {
  success: true
}

export type req = TReq<reqBody, reqParams>
export type resp = TRespE<respBody>
