// import {} from "src/models/index"
import { renderError } from "@src/api/renderError"
import { TApiRoutes } from "@src/types/api/basetypes"
import * as T from "@src/types/api/reporters"

const getReporters = async (
  req: T.getReporters.req
): Promise<T.getReporters.res> => {
  return { status: 200, json: { success: true } }
}

const getReporter = async (
  req: T.getReporter.req
): Promise<T.getReporter.res> => {
  return { status: 200, json: { success: true } }
}

const routes: Array<TApiRoutes<any, any>> = [
  {
    method: "get",
    paths: "/api/v1/:subject_addr/reporters",
    fn: getReporters
  },
  {
    method: "get",
    paths: "/api/v1/:subject_addr/reporters/:reporterId",
    fn: getReporter
  }
]

export default routes
