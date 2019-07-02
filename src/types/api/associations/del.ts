import { TRespE, TReq } from "@src/types/api/basetypes"

export type reqBody = {
  revokeAssociation: {
    plaintext: string
    subjectSig: string
  }
}
export type reqParams = {}
export type reqQuery = {}

export type respBody = {
  success: true
}

export type req = TReq<reqBody, reqParams>
export type resp = TRespE<respBody>
