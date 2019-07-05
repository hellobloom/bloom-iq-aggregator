import {
  AttestationData as AD,
  HashingLogic as HL
} from "@bloomprotocol/attestations-lib"
export type TDate = string
export type TDatetime = string
export type TUuid = string
export type TAddr = string
export type THash = string
export type TNonce = string

//
// ASSOCIATIONS
//
export interface IAllowAssociationStr {
  type: "bloomiq-allow_association"
  timestamp: TDate
  aggregator_addr: TAddr
}

export interface IListAssociationStr {
  type: "bloomiq-list_association"
  timestamp: TDate
}

export interface IShowAssociationStr {
  type: "bloomiq-show_association"
  timestamp: TDate
  association_id: TUuid
}

export interface IRevokeAssociationStr {
  type: "bloomiq-revoke_association"
  timestamp: TDate
  aggregator: TAddr
}

//
// REPORTERS
//

export interface IAllowReporterStr {
  type: "bloomiq-allow_reporter"
  timestamp: TDate
  reporter_addr: TAddr
}

export interface IListReporterStr {
  type: "bloomiq-list_reporter"
  timestamp: TDate
}

export interface IShowReporterStr {
  type: "bloomiq-show_reporter"
  timestamp: TDate
  reporter_id: TUuid
}

export interface IRevokeReporterStr {
  type: "bloomiq-revoke_reporter"
  timestamp: TDate
  reporter_addr: TAddr
}

//
// REPORTS
//

// Submitted by reporter:
export interface ISubmitReportStr {
  type: "bloomiq-submit_report"
  timestamp: TDate
  subject_addr: TAddr
  report: IReportStr<AD.IBaseAttUtility | AD.IBaseAttLoan> //, encrypted for subject public key),
  report_sha: THash
}

export interface IRevokeReportStr {
  type: "bloomiq-revoke_report"
  timestamp: TDate
  report_id: TUuid
  subject_addr: TAddr
}

// Submitted by subject:
export interface IListReportStr {
  type: "bloomiq-list_report"
  timestamp: TDate
}

export interface IShowReportStr {
  type: "bloomiq-show_report"
  timestamp: TDate
  report_id: TUuid
}

//
// ATTESTATIONS
//

export interface IPerformAttestationStr {
  type: "bloomiq-perform_attestation"
  timestamp: TDate
  aggregator_addr: TAddr
  dt_start: TDatetime
  dt_end: TDatetime
}

export interface IDeleteAttestationStr {
  type: "bloomiq-delete_attestation"
  attestation_id: TUuid
  aggregator_addr: TAddr
}

export interface IShowAttestationStr {
  type: "bloomiq-show_attestation"
  attestation_id: TUuid
  aggregator_addr: TAddr
}

export interface IListAttestationStr {
  type: "bloomiq-list_attestation"
  aggregator_addr: TAddr
}

export interface IReportStr<AttestationType> {
  type: "bloomiq-report"
  nonce: TNonce
  attestation_data: HL.IClaimNode // of AttestationType
}
