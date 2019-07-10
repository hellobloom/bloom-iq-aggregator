// import { renderError } from "@src/api/renderError"
import { TApiRoutes } from "@src/types/api/basetypes"
import * as T from "@src/types/api/reports"
import { Subject, Report, ReportPermission } from "@src/models"
import * as S from "@src/lib/sigs/report"
import { toBuffer } from "ethereumjs-util"

const list = async (req: T.list.req): Promise<T.list.res> => {
  let validation = await S.validateListReport(
    req.body.list_report.plaintext,
    req.body.list_report.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return { status: 400, json: { success: false, validation } }
  }
  let reports = await Report.Q.where({
    subject_addr: req.params.subject_addr
  })
  return {
    status: 200,
    json: {
      success: true,
      reports: reports.map(Report.serialize)
    }
  }
}

const show = async (req: T.show.req): Promise<T.show.res> => {
  let validation = await S.validateShowReport(
    req.body.show_report.plaintext,
    req.body.show_report.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return { status: 400, json: { success: false, validation } }
  }
  if (validation.obj!.report_id! !== req.params.report_id) {
    return {
      status: 400,
      json: { success: false, error: "report_addr_doesnt_match_sig" }
    }
  }
  let report = await Report.FindWhere({
    id: toBuffer(req.params.report_id)
  })
  return {
    status: 200,
    json: {
      success: true,
      report: Report.serialize(report)
    }
  }
}

const create = async (req: T.create.req): Promise<T.create.res> => {
  let subject = await Subject.FindWhere({
    addr: toBuffer(req.params.subject_addr)
  })
  let validation = await S.validateAllowReport(
    req.body.allow_report.plaintext,
    req.body.allow_report.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return { status: 400, json: { success: false, validation } }
  }
  if (validation.obj!.report_addr! !== req.params.report_addr) {
    return {
      status: 400,
      json: { success: false, error: "report_addr_doesnt_match_sig" }
    }
  }
  let report = await Report.FindWhere({
    addr: toBuffer(req.params.report_addr)
  })
  if (!report) {
    report = await Report.Create({
      addr: toBuffer(req.params.report_addr)
    })
  }
  await ReportPermission.Create({
    subject_id: subject.id,
    subject_addr: toBuffer(req.params.subject_addr),
    report_id: report.id,
    report_addr: toBuffer(req.params.report_addr),
    permit_sig: toBuffer(req.body.allow_report.subject_sig),
    permit_plaintext: req.body.allow_report.plaintext
  })
  return {
    status: 200,
    json: { success: true }
  }
}

const del = async (req: T.del.req): Promise<T.del.res> => {
  let validation = await S.validateRevokeReport(
    req.body.revoke_report.plaintext,
    req.body.revoke_report.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return { status: 400, json: { success: false, validation } }
  }
  if (validation.obj!.report_addr! !== req.params.report_addr) {
    return {
      status: 400,
      json: { success: false, error: "report_addr_doesnt_match_sig" }
    }
  }
  await ReportPermission.Q.where({
    subject_addr: toBuffer(req.params.subject_addr),
    report_addr: toBuffer(req.params.report_addr)
  })
    .whereNull("revoke_sig")
    .whereNull("revoke_plaintext")
    .update({
      revoke_sig: toBuffer(req.body.revoke_report.subject_sig),
      revoke_plaintext: req.body.revoke_report.plaintext
    })

  return { status: 200, json: { success: true } }
}

const routes: Array<TApiRoutes<any, any>> = [
  {
    method: "get",
    paths: "/api/v1/:subject_addr/reports",
    fn: list,
    middleware: { subjectIsActive: true, adminRequired: false }
  },
  {
    method: "get",
    paths: "/api/v1/:subject_addr/reports/:report_addr",
    fn: show,
    middleware: { subjectIsActive: true, adminRequired: false }
  },
  {
    method: "post",
    paths: "/api/v1/:subject_addr/reports",
    fn: create,
    middleware: { subjectIsActive: true, adminRequired: false }
  },
  {
    method: "delete",
    paths: "/api/v1/:subject_addr/reports/:report_addr",
    fn: del,
    middleware: { subjectIsActive: true, adminRequired: false }
  }
]

export default routes
