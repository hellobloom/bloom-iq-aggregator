import { TRespE, TReq } from "@src/types/api/basetypes"

export type reqBody = {
  allowAssociation: {
    subjectSig: string
    plaintext: string
  }
}
export type reqParams = {}
export type reqQuery = {}

export type respBody = {
  success: true
  associationId: string
}

export type req = TReq<reqBody, reqParams>
export type resp = TRespE<respBody>
