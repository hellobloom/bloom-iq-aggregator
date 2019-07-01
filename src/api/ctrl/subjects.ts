// import {} from "src/models/index"
import { renderError } from "@src/api/renderError"
import { TApiRoutes } from "@src/types/api/basetypes"
import * as T from "@src/types/api/subjects"

const post = async (req: T.post.req): Promise<T.post.res> => {
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
    method: "post",
    paths: "/api/v1/:subjectAddr/association",
    fn: create
  },
  {
    method: "post",
    paths: "/api/v1/:subjectAddr/association",
    fn: create
  },
  {
    method: "del",
    paths: "/api/v1/:subjectAddr/association",
    fn: del
  }
]

export default routes
