import { TRespE, TReq } from "@src/types/api/basetypes"
import { HashingLogic as HL } from "@bloomprotocol/attestations-lib"

export type reqBody = {
  perform_attestation: {
    subject_sig: string
    plaintext: string
  }
}
export type reqParams = {
  subject_addr: string
}

export type reqQuery = {}

export type respBody = {
  success: true
  attestation: HL.IClaimNode
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
