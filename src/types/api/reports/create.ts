import {TRespE, TReq} from '@src/types/api/basetypes'

export type reqBody = {
  submit_report: {
    reporter_sig: string
    plaintext: string
  }
  reporter_addr: string
  report_hash: string
  report_encrypted: string
}
export type reqParams = {
  subject_addr: string
}
export type reqQuery = {}

export type respBody = {
  success: true
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
