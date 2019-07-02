import { TRespE, TReq } from "@src/types/api/basetypes"
import * as Attestation from "@src/types/models/attestation"

export type reqBody = {
  show_attestation: {
    plaintext: string
    subject_sig: string
  }
}
export type reqParams = {}
export type reqQuery = {
  subject_addr: string
}

export type respBody = {
  attestation: Attestation.TS
}

export type req = TReq<reqBody, reqParams>
export type resp = TRespE<respBody>
