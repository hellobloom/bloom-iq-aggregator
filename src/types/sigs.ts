import {
  AttestationData as AD,
  HashingLogic as HL
} from "@bloomprotocol/attestations-lib"
export type TDate = string
export type TUuid = string
export type TAddr = string
export type TSha256 = string
export type TNonce = string

// Associations
export interface allowAssociationStr {
  type: "bloomiq-allow_association"
  timestamp: TDate
  aggregator_addr: TAddr
}

export interface listAssociationStr {
  type: "bloomiq-list_association"
  timestamp: TDate
}

export interface showAssociationStr {
  type: "bloomiq-show_association"
  timestamp: TDate
}

export interface revokeAssociationStr {
  type: "bloomiq-revoke_association"
  timestamp: TDate
  aggregator: TAddr
}

// Reporters
export interface allowReporterStr {
  type: "bloomiq-allow_reporter"
  timestamp: TDate
  reporter_addr: TAddr
}

export interface listReporterStr {
  type: "bloomiq-list_reporter"
  timestamp: TDate
}

export interface revokeReporterStr {
  type: "bloomiq-revoke_reporter"
  timestamp: TDate
  reporter_addr: TAddr
}

export interface submitReportStr {
  type: "bloomiq-submit_report"
  timestamp: TDate
  subject_addr: TAddr
  report: reportStr<AD.IBaseAttUtility | AD.IBaseAttLoan> //, encrypted for subject public key),
  report_sha: TSha256
}

export interface revokeReportStr {
  type: "bloomiq-revoke_report"
  timestamp: TDate
  report_id: TUuid
  subject_addr: TAddr
}

export interface performAttestationStr {
  type: "bloomiq-perform_attestation"
  timestamp: TDate
  aggregator_addr: TAddr
}

export interface reportStr<AttestationType> {
  nonce: TNonce
  attestation_data: HL.IClaimNode // of AttestationType
}
