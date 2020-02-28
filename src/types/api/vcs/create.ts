import {TRespE, TReq} from '@src/types/api/basetypes'
import {VC} from '@src/models'

export type reqBody = {
  perform_vc: {
    subject_sig: string
    plaintext: string
  }
}
export type reqParams = {
  subject_addr: string
  vc_id: string
}
export type reqQuery = {}

export type respBody = {
  success: true
  vc: VC.TS
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
