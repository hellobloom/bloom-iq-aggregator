import {TRespE, TReq} from '@src/types/api/basetypes'

export type reqBody = {
  sign_attestation: {
    subject_sig: string
    plaintext: string
  }
}
export type reqParams = {
  subject_addr: string
  attestation_id: string
}
export type reqQuery = {}

export type respBody = {
  success: true
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
