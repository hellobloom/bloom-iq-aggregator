import {
  // AttestationData as AD,
  HashingLogic as HL,
} from '@bloomprotocol/attestations-lib'
export type TDate = string
export type TDatetime = string
export type TUuid = string
export type TAddr = string
export type THash = string
export type TNonce = string
export type TSigType = string

export interface IBaseSigStr {
  type: TSigType
  timestamp: TDatetime
}

////////////////////////////
// ASSOCIATIONS
////////////////////////////
export interface IAllowAssociationStr extends IBaseSigStr {
  type: 'bloomiq-allow_association'
  timestamp: TDatetime
  aggregator_addr: TAddr
}

export interface IListAssociationStr extends IBaseSigStr {
  type: 'bloomiq-list_association'
  timestamp: TDatetime
  aggregator_addr: TAddr
}

export interface IShowAssociationStr extends IBaseSigStr {
  type: 'bloomiq-show_association'
  timestamp: TDatetime
  aggregator_addr: TAddr
  association_id: TUuid
}

export interface IRevokeAssociationStr extends IBaseSigStr {
  type: 'bloomiq-revoke_association'
  timestamp: TDatetime
  aggregator_addr: TAddr
}

// REPORTERS
export interface IAllowReporterStr extends IBaseSigStr {
  type: 'bloomiq-allow_reporter'
  timestamp: TDatetime
  aggregator_addr: TAddr
  reporter_addr: TAddr
}

export interface IListReporterStr extends IBaseSigStr {
  type: 'bloomiq-list_reporter'
  timestamp: TDatetime
  aggregator_addr: TAddr
}

export interface IShowReporterStr extends IBaseSigStr {
  type: 'bloomiq-show_reporter'
  timestamp: TDatetime
  aggregator_addr: TAddr
  reporter_addr: TAddr
}

export interface IRevokeReporterStr extends IBaseSigStr {
  type: 'bloomiq-revoke_reporter'
  timestamp: TDatetime
  aggregator_addr: TAddr
  reporter_addr: TAddr
}

////////////////////////////
// REPORTS - Suffixed with string indicating who's submitting the request when both subject and reporter can submit similar request
////////////////////////////

// Submitted by reporter:
export interface ISubmitReportStr extends IBaseSigStr {
  type: 'bloomiq-submit_report'
  timestamp: TDatetime
  aggregator_addr: TAddr
  subject_addr: TAddr
  report_hash: THash // sha256 of IReportStr<AD.IBaseAttUtility | AD.IBaseAttLoan>, which concurrently to this sig message is encrypted for subject public key
  tags?: Array<string>
}

export interface IRevokeReportStr extends IBaseSigStr {
  type: 'bloomiq-revoke_report'
  timestamp: TDatetime
  aggregator_addr: TAddr
  report_id: TUuid
  report_hash: THash
  subject_addr: TAddr
}
export interface IListReportAsReporterStr extends IBaseSigStr {
  type: 'bloomiq-list_report-reporter'
  timestamp: TDatetime
  aggregator_addr: TAddr
  subject_addr?: TAddr
}

export interface IShowReportAsReporterStr extends IBaseSigStr {
  type: 'bloomiq-show_report-reporter'
  timestamp: TDatetime
  aggregator_addr: TAddr
  report_id: TUuid
}

// Submitted by subject:
export interface IListReportAsSubjectStr extends IBaseSigStr {
  type: 'bloomiq-list_report-subject'
  timestamp: TDatetime
  aggregator_addr: TAddr
  reporter_addr?: TAddr
}

export interface IShowReportAsSubjectStr extends IBaseSigStr {
  type: 'bloomiq-show_report-subject'
  timestamp: TDatetime
  aggregator_addr: TAddr
  report_id: TUuid
}

////////////////////////////
// ATTESTATIONS
////////////////////////////
export interface IPerformAttestationStr extends IBaseSigStr {
  type: 'bloomiq-perform_attestation'
  timestamp: TDatetime
  aggregator_addr: TAddr
  dt_start: TDatetime
  dt_end: TDatetime
}

export interface IDeleteAttestationStr extends IBaseSigStr {
  type: 'bloomiq-delete_attestation'
  timestamp: TDatetime
  aggregator_addr: TAddr
  attestation_id: TUuid
}

export interface IShowAttestationStr extends IBaseSigStr {
  type: 'bloomiq-show_attestation'
  timestamp: TDatetime
  aggregator_addr: TAddr
  attestation_id: TUuid
}

export interface IListAttestationStr extends IBaseSigStr {
  type: 'bloomiq-list_attestation'
  timestamp: TDatetime
  aggregator_addr: TAddr
}

export interface IReportStr<AttestationType> extends IBaseSigStr {
  type: 'bloomiq-report'
  timestamp: TDatetime
  aggregator_addr: TAddr
  nonce: TNonce
  attestation_data: HL.IClaimNode // of AttestationType
}
