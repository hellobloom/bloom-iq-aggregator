import { AttestationData as AD } from "@bloomprotocol/attestations-lib"
export type TDate = string
export type TUuid = string
export type TAddr = string
export type TSha256 = string

export interface allowAssociationStr {
  type: "bloom-iq-allow-association"
  timestamp: TDate
  aggregator: TAddr
}

export interface revokeAssociationStr {
  type: "bloom-iq-revoke-association"
  timestamp: TDate
  aggregator: TAddr
}

export interface listReporterStr {
  type: "bloom-iq-list-reporter"
  timestamp: TDate
}

export interface allowReporterStr {
  type: "bloom-iq-allow-reporter"
  timestamp: TDate
  reporterAddr: TAddr
}

export interface revokeReporterStr {
  type: "bloom-iq-revoke-reporter"
  timestamp: TDate
  reporterAddr: TAddr
}

export interface submitReportStr {
  type: "bloom-iq-submit-report"
  timestamp: TDate
  subjectAddr: TAddr
  report: reportStr<AD.IBaseAttUtility | AD.IBaseAttLoan> //, encrypted for subject public key),
  reportSha: TSha256
}

export interface revokeReportStr {
  type: "bloom-iq-revoke-report"
  timestamp: TDate
  reportId: TUuid
  subjectAddr: TAddr
}

export interface performAttestationStr {
  type: "bloom-iq-perform-attestation"
  timestamp: TDate
  aggregatorAddr: TAddr
}

export interface reportStr<AttestationType> {
  nonce: "fbfa9ebca9b0993298fab098ca..."
  attestationData: AD.IClaimNode<AttestationType>
}
