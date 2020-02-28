import {TRespE, TReq} from '@src/types/api/basetypes'
import * as VC from '@src/types/models/vc'

export type reqBody = {
  show_vc: {
    plaintext: string
    subject_sig: string
  }
}
export type reqParams = {
  subject_addr: string
  vc_id: string
}
export type reqQuery = {}

export type respBody = {
  vc: VC.TS
}

export type req = TReq<reqBody, reqParams>
export type res = TRespE<respBody>
