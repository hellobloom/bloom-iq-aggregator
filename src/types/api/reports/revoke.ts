import {TRespE, TReq} from '@src/types/api/basetypes'

export type reqBody = {
  revoke_report: {
    plaintext: string
    reporter_sig: string
  }
  reporter_addr: string
}
export type reqParams = {
  subject_addr: string
  report_id: string
}

export type reqQuery = {}

export type respBody = {
  success: true
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
