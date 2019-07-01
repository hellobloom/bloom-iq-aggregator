import { AttestationData as AD } from "@bloomprotocol/attestations-lib"
export type TDate = string

export interface allowAssociationStr {
  type: "bloom-iq-allow-association"
  timestamp: TDate
  aggregator: "0x..."
}

export interface revokeAssociationStr {
  type: "bloom-iq-revoke-association"
  timestamp: TDate
  aggregator: string // "0x..."
}

export interface listReporterStr {
  type: "bloom-iq-list-reporter"
  timestamp: TDate
}

export interface allowReporterStr {
  type: "bloom-iq-allow-reporter"
  timestamp: TDate
  reporterAddr: "0x..."
}

export interface revokeReporterStr {
  type: "bloom-iq-revoke-reporter"

  timestamp: TDate

  reporterAddr: "0x..."
}

export interface submitReportStr {
  type: "bloom-iq-submit-report"
  timestamp: TDate
  subjectAddr: string
  report: reportStr<AD.IBaseAttUtility | AD.IBaseAttLoan> //, encrypted for subject public key),
  reportSha: string // sha256 of report
}

export interface revokeReportStr {
  type: "bloom-iq-revoke-report"

  timestamp: TDate

  reportId: "..."

  subjectAddr: "..."
}

export interface performAttestationStr {
  type: "bloom-iq-perform-attestation"
  timestamp: TDate
  aggregatorAddr: "0x..."
}

export interface reportStr<AttestationType> {
  nonce: "fbfa9ebca9b0993298fab098ca..."
  attestationData: AD.IClaimNode<AttestationType>
}
