import { TRespE, TReq } from "@src/types/api/basetypes"

export type reqBody = {}
export type reqParams = {}
export type reqQuery = {}

export type respBody = {}

export type req = TReq<reqBody, reqParams>
export type resp = TRespE<respBody>
