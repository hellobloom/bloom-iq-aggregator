import { TRespE, TReq } from "@src/types/api/basetypes"
import * as Report from "@src/types/models/report"

export type reqBody = {
  show_report: {
    plaintext: string
    subject_sig: string
  }
}
export type reqParams = {
  subject_addr: string
  report_id: string
}
export type reqQuery = {}

export type respBody = {
  report: Report.TS
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
