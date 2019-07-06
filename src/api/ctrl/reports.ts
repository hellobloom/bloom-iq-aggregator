// import {} from "src/models/index"
import { renderError } from "@src/api/renderError"
import { TApiRoutes } from "@src/types/api/basetypes"
import * as T from "@src/types/api/reports"

const index = async (req: T.getReports.req): Promise<T.getReports.res> => {
  return { status: 200, json: { success: true } }
}

const show = async (req: T.getReport.req): Promise<T.getReport.res> => {
  return { status: 200, json: { success: true } }
}

const routes: Array<TApiRoutes<any, any>> = [
  {
    method: "get",
    paths: "/api/v1/:subject_addr/reports",
    fn: index
  },
  {
    method: "get",
    paths: "/api/v1/:subject_addr/reports/:reportId",
    fn: show
  }
]

export default routes
