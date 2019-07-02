import { TRespE, TReq } from "@src/types/api/basetypes"
import * as Report from "@src/types/models/report"

export type reqBody = {
  show_report:
    | {
        plaintext: string
        subject_sig: string
        report_id: string
      }
    | {
        plaintext: string
        reporter_sig: string
        report_id: string
      }
}
export type reqParams = {}
export type reqQuery = {
  subject_addr: string
}

export type respBody = {
  report: Report.TS
}

export type req = TReq<reqBody, reqParams>
export type resp = TRespE<respBody>
