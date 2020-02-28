import * as express from "express"
import { env, getFeature } from "@src/environment"
import { appFn, applyApiRouters } from "@src/api/base"
import * as http from "http"
import { TApiRoutes } from "@src/types/api/basetypes"

import AssociationsRouter from "@src/api/ctrl/associations"
import VCsRouter from "@src/api/ctrl/vcs"
import ReportersRouter from "@src/api/ctrl/reporters"
import ReportsRouter from "@src/api/ctrl/reports"
import SubjectsRouter from "@src/api/ctrl/subjects"

export const getRoutes = async (): Promise<TApiRoutes<any, any>[]> => {
  return [
    ...AssociationsRouter,
    ...VCsRouter,
    ...ReportersRouter,
    ...ReportsRouter,
    ...((await getFeature('open_subject_registration')) ? SubjectsRouter : [])
  ]
}

export const BloomIQ = async () => {
  let e = await env()

  const app = await appFn()

  const routes = await getRoutes()

  applyApiRouters(app, routes)

  const appAsAny = app as any

  appAsAny.server = http.createServer(app)
  const listenPort = process.env.PORT || e.app_port
  console.log("Attempting to listen on", listenPort, e.express_bind)
  if (e.express_bind) {
    appAsAny.server.listen(listenPort, e.express_bind)
  } else {
    appAsAny.server.listen(listenPort)
  }

  app.all(
    "*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.log("Unhandled request")

      res.status(404).json({ success: false, error: "Not found" })
    }
  )
}

BloomIQ()
  .then(() => {
    console.log("BloomIQ initiated without error")
  })
  .catch(err => {
    console.log("BloomIQ initiation failed", err)
  })
