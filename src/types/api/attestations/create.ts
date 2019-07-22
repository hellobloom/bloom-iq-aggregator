import {TRespE, TReq} from '@src/types/api/basetypes'
import {Attestation} from '@src/models'

export type reqBody = {
  perform_attestation: {
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
  attestation: Attestation.TS
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
