import {
  Association, Subject,
  /* Reporter, */ ReportPermission
} from "@src/models"

export const subjectIsActive = async (subject_addr: Buffer) => {
  return (
    !!(await Subject.FindWhere({ addr: subject_addr }))
    && 
    (await Association.Q().where({
      subject_addr
    })
      .whereNull("revoke_sig")
      .whereNull("revoke_plaintext")
      .count("*"))["count"] > 0
  )
}

export const canReportOnSubject = async (
  reporter_addr: Buffer,
  subject_addr: Buffer
) => {
  return
  ;(await ReportPermission.Q().where({
    subject_addr,
    reporter_addr
  })
    .whereNull("revoke_sig")
    .whereNull("revoke_plaintext")
    .count("*"))["count"] > 0
}
