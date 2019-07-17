import * as S from '@src/types/sigs'
import * as B from '@src/lib/sigs/base'

// IPerformAttestationStr
let performAttestationFields: Array<keyof S.IPerformAttestationStr> = ['type', 'timestamp', 'aggregator_addr']
let performAttestationType: S.IPerformAttestationStr['type'] = 'bloomiq-perform_attestation'

export const validatePerformAttestation = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IPerformAttestationStr>> => {
  let p = B.parseSigText<S.IPerformAttestationStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(p, performAttestationFields, performAttestationType, 'subject_sig', sig, txt, addr)),
    await B.checkValidAddr(p, 'attestation_addr'),
  ])

  return B.errorCheck<S.IPerformAttestationStr>(errors, p)
}

// IListAttestationStr
let listAttestationFields: Array<keyof S.IListAttestationStr> = ['type', 'timestamp', 'aggregator_addr']
let listAttestationType: S.IListAttestationStr['type'] = 'bloomiq-list_attestation'

export const validateListAttestation = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IListAttestationStr>> => {
  let p = B.parseSigText<S.IListAttestationStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(p, listAttestationFields, listAttestationType, 'subject_sig', sig, txt, addr)),
  ])

  return B.errorCheck<S.IListAttestationStr>(errors, p)
}

// IShowAttestationStr
let showAttestationFields: Array<keyof S.IShowAttestationStr> = [
  'type',
  'timestamp',
  'aggregator_addr',
  'attestation_id',
]
let showAttestationType: S.IShowAttestationStr['type'] = 'bloomiq-show_attestation'

export const validateShowAttestation = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IShowAttestationStr>> => {
  let p = B.parseSigText<S.IShowAttestationStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(p, showAttestationFields, showAttestationType, 'subject_sig', sig, txt, addr)),
    await B.checkValidAddr(p, 'attestation_addr'),
  ])

  return B.errorCheck<S.IShowAttestationStr>(errors, p)
}

// IDeleteAttestationStr
let deleteAttestationFields: Array<keyof S.IDeleteAttestationStr> = [
  'type',
  'timestamp',
  'aggregator_addr',
  'attestation_id',
]
let deleteAttestationType: S.IDeleteAttestationStr['type'] = 'bloomiq-delete_attestation'

export const validateDeleteAttestation = async (
  txt: string,
  sig: string,
  addr: string
): Promise<B.TValidationResult<S.IDeleteAttestationStr>> => {
  let p = B.parseSigText<S.IDeleteAttestationStr>(txt)
  let errors: Array<B.TFieldErr> = B.onlyErrors([
    ...(await B.globalSigChecks(p, deleteAttestationFields, deleteAttestationType, 'subject_sig', sig, txt, addr)),
    await B.checkValidAddr(p, 'attestation_addr'),
  ])
  return B.errorCheck<S.IDeleteAttestationStr>(errors, p)
}
