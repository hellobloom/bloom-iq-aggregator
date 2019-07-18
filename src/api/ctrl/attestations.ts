// import { renderError } from "@src/api/renderError"
import { TApiRoutes } from "@src/types/api/basetypes"
import * as T from "@src/types/api/reporters"
import { Subject, Reporter, ReportPermission } from "@src/models"
import * as S from "@src/lib/sigs/reporter"
import { toBuffer } from "ethereumjs-util"

const list = async (req: T.list.req): Promise<T.list.res> => {
  let validation = await S.validateListReporter(
    req.body.list_reporter.plaintext,
    req.body.list_reporter.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return { status: 400, json: { success: false, validation } }
  }
  let report_permissions = await ReportPermission.Where({
    subject_addr: toBuffer(req.params.subject_addr)
  })
  let reporters = await Reporter.Q().whereIn(
    "id",
    report_permissions.map(x => x.reporter_id)
  )
  return {
    status: 200,
    json: {
      success: true,
      reporters: reporters.map(Reporter.serialize),
      report_permissions: report_permissions.map(ReportPermission.serialize)
    }
  }
}

const show = async (req: T.show.req): Promise<T.show.res> => {
  let validation = await S.validateShowReporter(
    req.body.show_reporter.plaintext,
    req.body.show_reporter.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return { status: 400, json: { success: false, validation } }
  }
  if (validation.obj!.reporter_addr! !== req.params.reporter_addr) {
    return {
      status: 400,
      json: { success: false, error: "reporter_addr_doesnt_match_sig" }
    }
  }
  let reporter = await Reporter.FindWhere({
    addr: toBuffer(req.params.reporter_addr)
  })
  let report_permissions = await ReportPermission.Where({
    reporter_addr: toBuffer(req.params.reporter_addr),
    subject_addr: toBuffer(req.params.subject_addr)
  })
  return {
    status: 200,
    json: {
      success: true,
      reporter: Reporter.serialize(reporter),
      report_permissions: report_permissions.map(ReportPermission.serialize)
    }
  }
}

const create = async (req: T.create.req): Promise<T.create.res> => {
  let subject = await Subject.FindWhere({
    addr: toBuffer(req.params.subject_addr)
  })
  let validation = await S.validateAllowReporter(
    req.body.allow_reporter.plaintext,
    req.body.allow_reporter.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return { status: 400, json: { success: false, validation } }
  }
  if (validation.obj!.reporter_addr! !== req.params.reporter_addr) {
    return {
      status: 400,
      json: { success: false, error: "reporter_addr_doesnt_match_sig" }
    }
  }
  let reporter = await Reporter.FindWhere({
    addr: toBuffer(req.params.reporter_addr)
  })
  if (!reporter) {
    reporter = await Reporter.Create({
      addr: toBuffer(req.params.reporter_addr)
    })
  }
  await ReportPermission.Create({
    subject_id: subject.id,
    subject_addr: toBuffer(req.params.subject_addr),
    reporter_id: reporter.id,
    reporter_addr: toBuffer(req.params.reporter_addr),
    permit_sig: toBuffer(req.body.allow_reporter.subject_sig),
    permit_plaintext: req.body.allow_reporter.plaintext
  })
  return {
    status: 200,
    json: { success: true }
  }
}

const del = async (req: T.del.req): Promise<T.del.res> => {
  let validation = await S.validateRevokeReporter(
    req.body.revoke_reporter.plaintext,
    req.body.revoke_reporter.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return { status: 400, json: { success: false, validation } }
  }
  if (validation.obj!.reporter_addr! !== req.params.reporter_addr) {
    return {
      status: 400,
      json: { success: false, error: "reporter_addr_doesnt_match_sig" }
    }
  }
  await ReportPermission.Q().where({
    subject_addr: toBuffer(req.params.subject_addr),
    reporter_addr: toBuffer(req.params.reporter_addr)
  })
    .whereNull("revoke_sig")
    .whereNull("revoke_plaintext")
    .update({
      revoke_sig: toBuffer(req.body.revoke_reporter.subject_sig),
      revoke_plaintext: req.body.revoke_reporter.plaintext
    })

  return { status: 200, json: { success: true } }
}

const routes: Array<TApiRoutes<any, any>> = [
  {
    method: "get",
    paths: "/api/v1/subjects/:subject_addr/reporters",
    fn: list,
    middleware: { subjectIsActive: true, adminRequired: false }
  },
  {
    method: "get",
    paths: "/api/v1/subjects/:subject_addr/reporters/:reporter_addr",
    fn: show,
    middleware: { subjectIsActive: true, adminRequired: false }
  },
  {
    method: "post",
    paths: "/api/v1/subjects/:subject_addr/reporters",
    fn: create,
    middleware: { subjectIsActive: true, adminRequired: false }
  },
  {
    method: "delete",
    paths: "/api/v1/subjects/:subject_addr/reporters/:reporter_addr",
    fn: del,
    middleware: { subjectIsActive: true, adminRequired: false }
  }
]

export default routes
