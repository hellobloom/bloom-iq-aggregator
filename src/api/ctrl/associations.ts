// import { renderError } from "@src/api/renderError"
import { TApiRoutes } from "@src/types/api/basetypes"
import * as T from "@src/types/api/associations"
import { Association } from "@src/models"
import * as S from "@src/lib/sigs/association"
import { toBuffer } from "ethereumjs-util"

const list = async (req: T.list.req): Promise<T.list.res> => {
  let validation = await S.validateListAssociation(
    req.body.list_association.plaintext,
    req.body.list_association.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return { status: 400, json: { success: false, validation } }
  }
  let associations = await Association.Where({
    subject_addr: toBuffer(req.params.subject_addr)
  })
  return {
    status: 200,
    json: {
      success: true,
      associations: associations.map(Association.serialize)
    }
  }
}

const show = async (req: T.show.req): Promise<T.show.res> => {
  let validation = await S.validateShowAssociation(
    req.body.show_association.plaintext,
    req.body.show_association.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return { status: 400, json: { success: false, validation } }
  }
  if (validation.obj!.association_id! !== req.params.association_id) {
    return {
      status: 400,
      json: { success: false, error: "association_id_doesnt_match_sig" }
    }
  }
  let association = await Association.FindWhere({
    id: req.params.association_id,
    subject_addr: toBuffer(req.params.subject_addr)
  })
  return {
    status: 200,
    json: {
      success: true,
      association: Association.serialize(association)
    }
  }
}

const create = async (req: T.create.req): Promise<T.create.res> => {
  let validation = await S.validateAllowAssociation(
    req.body.allow_association.plaintext,
    req.body.allow_association.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return { status: 400, json: { success: false, validation } }
  }
  let association = await Association.Create({
    subject_addr: toBuffer(req.params.subject_addr),
    allow_association_sig: toBuffer(req.body.allow_association.subject_sig),
    allow_association_plaintext: req.body.allow_association.plaintext
  })
  return {
    status: 200,
    json: { success: true, association_id: association.id! }
  }
}

const del = async (req: T.del.req): Promise<T.del.res> => {
  let validation = await S.validateRevokeAssociation(
    req.body.revoke_association.plaintext,
    req.body.revoke_association.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return { status: 400, json: { success: false, validation } }
  }
  await Association.UpdateAll(
    {
      subject_addr: toBuffer(req.params.subject_addr)
    },
    {
      revoke_association_sig: toBuffer(req.body.revoke_association.subject_sig),
      revoke_association_plaintext: req.body.revoke_association.plaintext
    }
  )
  return { status: 200, json: { success: true } }
}

const routes: Array<TApiRoutes<any, any>> = [
  {
    method: "get",
    paths: "/api/v1/:subject_addr/associations",
    fn: list,
    middleware: { subjectIsActive: true, adminRequired: false }
  },
  {
    method: "get",
    paths: "/api/v1/:subject_addr/associations/:association_id",
    fn: show,
    middleware: { subjectIsActive: true, adminRequired: false }
  },
  {
    method: "post",
    paths: "/api/v1/:subject_addr/associations",
    fn: create,
    middleware: { subjectIsActive: false, adminRequired: false }
  },
  {
    method: "delete",
    paths: "/api/v1/:subject_addr/associations/:association_id",
    fn: del,
    middleware: { subjectIsActive: true, adminRequired: false }
  }
]

export default routes
