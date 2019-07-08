import { TRespE, TReq } from "@src/types/api/basetypes"
import * as ReportPermission from "@src/types/models/report_permission"
import * as Reporter from "@src/types/models/reporter"

export type reqBody = {
  show_reporter: {
    plaintext: string
    subject_sig: string
  }
}
export type reqParams = {
  subject_addr: string
  reporter_addr: string
}
export type reqQuery = {}

export type respBody = {
  report_permissions: Array<ReportPermission.TS>
  reporter: Reporter.TS
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
