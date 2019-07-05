import { TRespE, TReq } from "@src/types/api/basetypes"

export type reqBody = {
  delete_attestation: {
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
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
