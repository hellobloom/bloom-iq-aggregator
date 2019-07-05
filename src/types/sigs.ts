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
export type TSigType = string

export interface IBaseSigStr {
  type: TSigType
  timestamp: TDatetime
}

// ASSOCIATIONS
export interface IAllowAssociationStr extends IBaseSigStr {
  type: "bloomiq-allow_association"
  timestamp: TDatetime
  aggregator_addr: TAddr
}

export interface IListAssociationStr extends IBaseSigStr {
  type: "bloomiq-list_association"
  timestamp: TDatetime
}

export interface IShowAssociationStr extends IBaseSigStr {
  type: "bloomiq-show_association"
  timestamp: TDatetime
  association_id: TUuid
}

export interface IRevokeAssociationStr extends IBaseSigStr {
  type: "bloomiq-revoke_association"
  timestamp: TDatetime
  aggregator: TAddr
}

// REPORTERS
export interface IAllowReporterStr extends IBaseSigStr {
  type: "bloomiq-allow_reporter"
  timestamp: TDatetime
  reporter_addr: TAddr
}

export interface IListReporterStr extends IBaseSigStr {
  type: "bloomiq-list_reporter"
  timestamp: TDatetime
}

export interface IShowReporterStr extends IBaseSigStr {
  type: "bloomiq-show_reporter"
  timestamp: TDatetime
  reporter_id: TUuid
}

export interface IRevokeReporterStr extends IBaseSigStr {
  type: "bloomiq-revoke_reporter"
  timestamp: TDatetime
  reporter_addr: TAddr
}

// REPORTS
// Submitted by reporter:
export interface ISubmitReportStr extends IBaseSigStr {
  type: "bloomiq-submit_report"
  timestamp: TDatetime
  subject_addr: TAddr
  report: IReportStr<AD.IBaseAttUtility | AD.IBaseAttLoan> //, encrypted for subject public key),
  report_sha: THash
}

export interface IRevokeReportStr extends IBaseSigStr {
  type: "bloomiq-revoke_report"
  timestamp: TDatetime
  report_id: TUuid
  subject_addr: TAddr
}

// Submitted by subject:
export interface IListReportStr extends IBaseSigStr {
  type: "bloomiq-list_report"
  timestamp: TDatetime
}

export interface IShowReportStr extends IBaseSigStr {
  type: "bloomiq-show_report"
  timestamp: TDatetime
  report_id: TUuid
}

// ATTESTATIONS
export interface IPerformAttestationStr extends IBaseSigStr {
  type: "bloomiq-perform_attestation"
  timestamp: TDatetime
  aggregator_addr: TAddr
  dt_start: TDatetime
  dt_end: TDatetime
}

export interface IDeleteAttestationStr extends IBaseSigStr {
  type: "bloomiq-delete_attestation"
  timestamp: TDatetime
  attestation_id: TUuid
  aggregator_addr: TAddr
}

export interface IShowAttestationStr extends IBaseSigStr {
  type: "bloomiq-show_attestation"
  timestamp: TDatetime
  attestation_id: TUuid
  aggregator_addr: TAddr
}

export interface IListAttestationStr extends IBaseSigStr {
  type: "bloomiq-list_attestation"
  timestamp: TDatetime
  aggregator_addr: TAddr
}

export interface IReportStr<AttestationType> extends IBaseSigStr {
  type: "bloomiq-report"
  timestamp: TDatetime
  nonce: TNonce
  attestation_data: HL.IClaimNode // of AttestationType
}
