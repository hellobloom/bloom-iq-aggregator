// import { renderError } from "@src/api/renderError"
import { TApiRoutes } from "@src/types/api/basetypes"
import * as T from "@src/types/api/associations"
import { Association } from "@src/models"
import * as S from "@src/lib/sigs/association"
import { toBuffer } from "ethereumjs-util"

const list = async (req: T.list.req): Promise<T.list.res> => {
  return { status: 200, json: { success: true } }
}

const show = async (req: T.show.req): Promise<T.show.res> => {
  return { status: 200, json: { success: true } }
}

const create = async (req: T.create.req): Promise<T.create.res> => {
  let validation = await S.validateAllowAssociation(
    req.body.allow_association.plaintext,
    req.body.allow_association.subject_sig,
    req.params.subject_addr
  )
  if (validation instanceof Array) {
    // aka is Array<IFieldErr>
    return { status: 400, json: { success: false, validation } }
  }
  await Association.Create({
    subject_addr: toBuffer(req.params.subject_addr),
    allow_association_sig: toBuffer(req.body.allow_association.subject_sig),
    allow_association_plaintext: req.body.allow_association.plaintext
  })
  return { status: 200, json: { success: true } }
}

const del = async (req: T.del.req): Promise<T.del.res> => {
  return { status: 200, json: { success: true } }
}

const routes: Array<TApiRoutes<any, any>> = [
  {
    method: "get",
    paths: "/api/v1/:subject_addr/associations",
    fn: list
  },
  {
    method: "get",
    paths: "/api/v1/:subject_addr/associations/:association_id",
    fn: show
  },
  {
    method: "post",
    paths: "/api/v1/:subject_addr/associations",
    fn: create
  },
  {
    method: "delete",
    paths: "/api/v1/:subject_addr/associations/:association_id",
    fn: del
  }
]

export default routes
