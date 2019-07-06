import { TRespE, TReq } from "@src/types/api/basetypes"
import * as Report from "@src/types/models/report"

export type reqBody = {
  list_report:
    | {
        plaintext: string
        subject_sig: string
      }
    | {
        plaintext: string
        reporter_sig: string
      }
}
export type reqParams = {
  subject_addr: string
}
export type reqQuery = {}

export type respBody = {
  success: true
  reports: Array<Report.TS>
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
