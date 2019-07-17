import { TRespE, TReq } from "@src/types/api/basetypes"
import * as ReportPermission from "@src/types/models/report_permission"
import * as Attestation from "@src/types/models/attestation"

export type reqBody = {
  list_attestation: {
    plaintext: string
    subject_sig: string
  }
}
export type reqParams = {
  subject_addr: string
}
export type reqQuery = {}

export type respBody = {
  success: true
  report_permissions: Array<ReportPermission.TS>
  attestations: Array<Attestation.TS>
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
