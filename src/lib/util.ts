import { Association, Subject, Reporter, ReportPermission } from "@src/models"

export const subjectIsActive = async (subject_addr: Buffer) => {
  return (
    (await Association.Q.where({
      subject_addr
    })
      .whereNull("revoke_sig")
      .whereNull("revoke_plaintext")
      .count("*"))["count"] > 0
  )
}

export const canReportOnSubject = async (
  reporter: Reporter.T,
  subject: Subject.T
) => {
  return
  ;(await ReportPermission.Q.where({
    subject_addr: subject.addr,
    reporter_addr: reporter.addr
  })
    .whereNull("revoke_sig")
    .whereNull("revoke_plaintext")
    .count("*"))["count"] > 0
}
