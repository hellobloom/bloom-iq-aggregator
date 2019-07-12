// import { renderError } from "@src/api/renderError"
import {TApiRoutes} from '@src/types/api/basetypes'
import * as T from '@src/types/api/reports'
import {Subject, Reporter, Report /* ReportPermission */} from '@src/models'
import * as S from '@src/lib/sigs/report'
import {canReportOnSubject} from '@src/lib/util'
import {toBuffer} from 'ethereumjs-util'

const listAsSubject = async (req: T.listAsSubject.req): Promise<T.listAsSubject.res> => {
  let validation = await S.validateListReportAsSubject(
    req.body.list_report.plaintext,
    req.body.list_report.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return {status: 400, json: {success: false, validation}}
  }
  let reports = await Report.Q.where({
    subject_addr: req.params.subject_addr,
  })
  return {
    status: 200,
    json: {
      success: true,
      reports: reports.map(Report.serialize),
    },
  }
}

const listAsReporter = async (req: T.listAsReporter.req): Promise<T.listAsReporter.res> => {
  let validation = await S.validateListReportAsReporter(
    req.body.list_report.plaintext,
    req.body.list_report.reporter_sig,
    req.params.reporter_addr
  )
  if (!validation.success) {
    return {status: 400, json: {success: false, validation}}
  }
  let reports = await Report.Q.where({
    reporter_addr: req.params.reporter_addr,
  })
  return {
    status: 200,
    json: {
      success: true,
      reports: reports.map(Report.serialize),
    },
  }
}

const showAsSubject = async (req: T.showAsSubject.req): Promise<T.showAsSubject.res> => {
  let validation = await S.validateShowReportAsSubject(
    req.body.show_report.plaintext,
    req.body.show_report.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return {status: 400, json: {success: false, validation}}
  }
  if (validation.obj!.report_id! !== req.params.report_id) {
    return {
      status: 400,
      json: {success: false, error: 'report_id_doesnt_match_sig'},
    }
  }
  let report = await Report.FindWhere({
    id: validation.obj!.report_id,
    subject_addr: toBuffer(req.params.subject_addr),
  })
  if (!report) return {status: 404, json: {success: false, error: 'not_found'}}
  return {
    status: 200,
    json: {
      success: true,
      report: Report.serialize(report),
    },
  }
}

const showAsReporter = async (req: T.showAsReporter.req): Promise<T.showAsReporter.res> => {
  let validation = await S.validateShowReportAsReporter(
    req.body.show_report.plaintext,
    req.body.show_report.reporter_sig,
    req.params.reporter_addr
  )
  if (!validation.success) {
    return {status: 400, json: {success: false, validation}}
  }
  if (validation.obj!.report_id! !== req.params.report_id) {
    return {
      status: 400,
      json: {success: false, error: 'report_id_doesnt_match_sig'},
    }
  }
  let report = await Report.FindWhere({
    id: validation.obj!.report_id,
    reporter_addr: toBuffer(req.params.reporter_addr),
  })
  if (!report) return {status: 404, json: {success: false, error: 'not_found'}}
  return {
    status: 200,
    json: {
      success: true,
      report: Report.serialize(report),
    },
  }
}

const create = async (req: T.create.req): Promise<T.create.res> => {
  let validation = await S.validateSubmitReport(
    req.body.submit_report.plaintext,
    req.body.submit_report.reporter_sig,
    req.body.reporter_addr
  )
  if (!validation.success) {
    return {status: 400, json: {success: false, validation}}
  }
  let subjectAddr = validation.obj!.subject_addr

  // Return error on signed subject_addr not matching one in URL.  Just a sanity check, it relies on the signed one for other logic.
  if (subjectAddr !== req.params.subject_addr) {
    return {
      status: 400,
      json: {success: false, error: 'subject_addr_doesnt_match_sig'},
    }
  }

  // Check for active permission to report on subject (implies existing Reporter)
  if (!canReportOnSubject(toBuffer(subjectAddr), toBuffer(req.body.reporter_addr))) {
    return {
      status: 400,
      json: {success: false, error: 'no_report_permission'},
    }
  }

  // Make sure subject exists
  let subject = await Subject.FindWhere({addr: toBuffer(subjectAddr)})
  if (!subject) {
    return {status: 404, json: {success: false, error: 'subject_not_found'}}
  }

  // Make sure reporter exists
  let reporter = await Reporter.FindWhere({addr: toBuffer(req.body.reporter_addr)})
  if (!reporter) {
    return {status: 404, json: {success: false, error: 'reporter_not_found'}}
  }

  // Create report
  let reportAttrs: Partial<Report.T> = {
    subject_id: subject.id,
    subject_addr: toBuffer(subject.addr),

    reporter_id: reporter.id,
    reporter_addr: toBuffer(req.body.reporter_addr),
    reporter_sig: toBuffer(req.body.submit_report.reporter_sig),

    report_hash: toBuffer(validation.obj!.report_hash),
    report_encrypted: toBuffer(req.body.report_encrypted),
  }
  if (validation.obj!.tags) {
    reportAttrs.tags = validation.obj!.tags
  }
  let report = await Report.Create(reportAttrs)

  return {
    status: 200,
    json: {success: true, report_id: report.id!},
  }
}

const revoke = async (req: T.revoke.req): Promise<T.revoke.res> => {
  let validation = await S.validateRevokeReport(
    req.body.revoke_report.plaintext,
    req.body.revoke_report.reporter_sig,
    req.body.reporter_addr
  )
  if (!validation.success) {
    return {status: 400, json: {success: false, validation}}
  }
  let reportId = validation.obj!.report_id!
  if (reportId !== req.params.report_id) {
    return {
      status: 400,
      json: {success: false, error: 'report_id_doesnt_match_sig'},
    }
  }
  if (req.params.subject_addr !== validation.obj!.subject_addr) {
    return {status: 400, json: {success: false, error: 'subject_addr_doesnt_match_sig'}}
  }
  let report = await Report.FindWhere({
    id: reportId,
    report_hash: toBuffer(validation.obj!.report_hash),
    subject_addr: toBuffer(validation.obj!.subject_addr),
    reporter_addr: toBuffer(req.body.reporter_addr),
  })
  if (!report) {
    return {status: 404, json: {success: false, error: 'not_found'}}
  }

  await Report.Q.where({
    id: report.id,
  })
    .whereNull('revoke_sig')
    .whereNull('revoke_plaintext')
    .update({
      revoke_sig: toBuffer(req.body.revoke_report.reporter_sig),
      revoke_plaintext: req.body.revoke_report.plaintext,
    })

  return {status: 200, json: {success: true}}
}

const routes: Array<TApiRoutes<any, any>> = [
  {
    method: 'get',
    paths: '/api/v1/subjects/:subject_addr/reports',
    fn: listAsSubject,
    middleware: {subjectIsActive: true, adminRequired: false},
  },
  {
    method: 'get',
    paths: '/api/v1/subjects/:subject_addr/reports/:report_id',
    fn: showAsSubject,
    middleware: {subjectIsActive: true, adminRequired: false},
  },
  {
    method: 'get',
    paths: '/api/v1/reporters/:reporter_addr/reports',
    fn: listAsReporter,
    middleware: {subjectIsActive: true, adminRequired: false},
  },
  {
    method: 'get',
    paths: '/api/v1/reporters/:reporter_addr/reports/:report_id',
    fn: showAsReporter,
    middleware: {subjectIsActive: true, adminRequired: false},
  },
  {
    method: 'post',
    paths: '/api/v1/subjects/:subject_addr/reports',
    fn: create,
    middleware: {subjectIsActive: true, adminRequired: false},
  },
  {
    method: 'delete',
    paths: '/api/v1/subjects/:subject_addr/reports/:report_id',
    fn: revoke,
    middleware: {subjectIsActive: true, adminRequired: false},
  },
]

export default routes
