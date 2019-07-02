import { TRespE, TReq } from "@src/types/api/basetypes"
import * as Association from "@src/types/models/association"

export type reqBody = {
  listAssociation: {
    plaintext: string
    subjectSig: string
  }
}
export type reqParams = {}
export type reqQuery = {}

export type respBody = {
  success: true
  associations: Array<Association.TS>
}

export type req = TReq<reqBody, reqParams>
export type resp = TRespE<respBody>
