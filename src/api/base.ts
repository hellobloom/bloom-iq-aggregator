import express from 'express'
import {PathParams} from 'express-serve-static-core'
import {fnToExpressHandler, getHandlers} from '@src/api/utils'
import {TApiRoutes} from '@src/types/api/basetypes'
import {env, PipelineStages} from '@src/environment'
import helmet from 'helmet'
import morgan from 'morgan'
import * as bodyParser from 'body-parser'
import compress from 'compression'
import * as Prometheus from '@src/lib/prometheus'
import * as middleware from '@src/api/middleware'

/**
 * Iterates over a collection of TApiRoutes, adding handlers to the passsed
 * in express app for the given configurations. Each TApiRoutes can contain
 * multiple paths giving a TApiRoutes the ability to handle, for example a
 * GET to both `/api/v1/test` and `/api/v2/test`, invoking the same handler.
 */
export const applyApiRouters = (
  app: express.Application,
  routes: Array<TApiRoutes<any, any>>
) => {
  routes.forEach(r => {
    const paths: PathParams[] = r.paths instanceof Array ? r.paths : [r.paths]
    paths.forEach(p => {
      let handlers = r.fn instanceof Array ? r.fn : [r.fn]
      let middlewareArray = getHandlers(r.middleware, r.method).concat(
        handlers.map(fnToExpressHandler)
      )
      app[r.method](p, ...middlewareArray)
    })
  })
}

export const appFn = async () => {
  const e = await env()
  const app = express()

  Prometheus.injectMetricsRoute(app)

  app.use(helmet())
  app.use(morgan('tiny'))

  app.use(bodyParser.json({
    type: '*/*',
    limit: '10mb', // https://stackoverflow.com/a/19965089/1165441
  }) as any)

  app.use(compress())

  if (e.pipeline_stage === PipelineStages.development) {
    app.use((req, res, next) => {
      req.headers['x-forwarded-for'] =
        req.headers['x-forwarded-for'] ||
        (req as any).connection.remoteAddress(next as express.NextFunction)()
    })
  }

  // Declaring prior to whitelist middleware to ensure urls are whitelisted
  // based on the rewritten value for unversioned requests.
  app.use(middleware.rewriteUnversionedApiUrls)

  if (e.pipeline_stage !== PipelineStages.development) {
    app.set('trust proxy', 1) // Trust first proxy
    app.use(middleware.enforceHTTPS)
  }

  // Serve static files from the React app
  return app
}
