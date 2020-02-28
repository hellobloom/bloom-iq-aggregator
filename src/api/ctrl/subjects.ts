// import {} from "src/models/index"
// import { renderError } from "@src/api/renderError"
import { TApiRoutes } from "@src/types/api/basetypes"
import * as T from "@src/types/api/subjects"
import { Subject } from "@src/models"
import { toBuffer } from "ethereumjs-util"
import * as S from "@src/lib/sigs/subject"

const create = async (req: T.create.req): Promise<T.create.res> => {
  let validation = await S.validateCreateSubject(
    req.body.create_subject.plaintext,
    req.body.create_subject.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return { status: 400, json: { success: false, validation } }
  }
  await Subject.Create({
    addr: toBuffer(req.params.subject_addr)
  })
  return { status: 200, json: { success: true } }
}

const show = async (req: T.show.req): Promise<T.show.res> => {
  let validation = await S.validateShowSubject(
    req.body.show_subject.plaintext,
    req.body.show_subject.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return { status: 400, json: { success: false, validation } }
  }
  await Subject.FindWhere({
    addr: toBuffer(req.params.subject_addr)
  })
  return { status: 200, json: { success: true } }
}

const del = async (req: T.del.req): Promise<T.del.res> => {
  let validation = await S.validateDeleteSubject(
    req.body.delete_subject.plaintext,
    req.body.delete_subject.subject_sig,
    req.params.subject_addr
  )
  if (!validation.success) {
    return { status: 400, json: { success: false, validation } }
  }
  await Subject.DeleteAll({
    addr: toBuffer(req.params.subject_addr)
  })
  return { status: 200, json: { success: true } }
  return { status: 200, json: { success: true } }
}

const routes: Array<TApiRoutes<any, any>> = [
  {
    method: "post",
    paths: "/api/v1/subjects/:subject_addr",
    fn: create
  },
  {
    method: "post",
    paths: "/api/v1/subjects/:subject_addr",
    fn: show
  },
  {
    method: "delete",
    paths: "/api/v1/subjects/:subject_addr",
    fn: del
  }
]

export default routes
