// import {} from "src/models/index"
import { renderError } from "@src/api/renderError"
import { TApiRoutes } from "@src/types/api/basetypes"
import * as T from "@src/types/api/associations"
import { Association } from "@src/models"

const list = async (req: T.list.req): Promise<T.list.res> => {
  return { status: 200, json: { success: true } }
}

const show = async (req: T.show.req): Promise<T.show.res> => {
  return { status: 200, json: { success: true } }
}

const create = async (req: T.create.req): Promise<T.create.res> => {
  return { status: 200, json: { success: true } }
}

const del = async (req: T.del.req): Promise<T.del.res> => {
  return { status: 200, json: { success: true } }
}

const routes: Array<TApiRoutes<any, any>> = [
  {
    method: "get",
    paths: "/api/v1/:subjectAddr/associations",
    fn: list
  },
  {
    method: "get",
    paths: "/api/v1/:subjectAddr/associations/:association_id",
    fn: show
  },
  {
    method: "post",
    paths: "/api/v1/:subjectAddr/associations",
    fn: create
  },
  {
    method: "delete",
    paths: "/api/v1/:subjectAddr/associations/:association_id",
    fn: del
  }
]

export default routes
