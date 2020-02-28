import * as S from '@src/types/sigs'
import * as B from '@src/lib/sigs/base'

// IIssueVCStr
let performVCFields: Array<keyof S.IIssueVCStr> = ['type', 'timestamp', 'aggregator_addr']
let performVCType: S.IIssueVCStr['type'] = 'bloomiq-perform_vc'

export const validateIssueVC = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IIssueVCStr>> => {
  let p = B.parseSigText<S.IIssueVCStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(p, performVCFields, performVCType, 'subject_sig', sig, txt, addr)),
    await B.checkValidAddr(p, 'reporter_addr'),
  ])

  return B.errorCheck<S.IIssueVCStr>(errors, p)
}

// IListVCStr
let listVCFields: Array<keyof S.IListVCStr> = ['type', 'timestamp', 'aggregator_addr']
let listVCType: S.IListVCStr['type'] = 'bloomiq-list_vc'

export const validateListVC = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IListVCStr>> => {
  let p = B.parseSigText<S.IListVCStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(p, listVCFields, listVCType, 'subject_sig', sig, txt, addr)),
  ])

  return B.errorCheck<S.IListVCStr>(errors, p)
}

// IShowVCStr
let showVCFields: Array<keyof S.IShowVCStr> = [
  'type',
  'timestamp',
  'aggregator_addr',
  'vc_id',
]
let showVCType: S.IShowVCStr['type'] = 'bloomiq-show_vc'

export const validateShowVC = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IShowVCStr>> => {
  let p = B.parseSigText<S.IShowVCStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(p, showVCFields, showVCType, 'subject_sig', sig, txt, addr)),
  ])

  return B.errorCheck<S.IShowVCStr>(errors, p)
}

// IDeleteVCStr
let deleteVCFields: Array<keyof S.IDeleteVCStr> = [
  'type',
  'timestamp',
  'aggregator_addr',
  'vc_id',
]
let deleteVCType: S.IDeleteVCStr['type'] = 'bloomiq-delete_vc'

export const validateDeleteVC = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IDeleteVCStr>> => {
  let p = B.parseSigText<S.IDeleteVCStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(p, deleteVCFields, deleteVCType, 'subject_sig', sig, txt, addr)),
  ])
  return B.errorCheck<S.IDeleteVCStr>(errors, p)
}
