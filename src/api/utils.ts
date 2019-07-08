import * as express from "express-serve-static-core"
import { subjectIsActiveMiddleware } from "@src/api/middleware"
import {
  THandlerOptions,
  TBaseRequest,
  TCookie,
  TClearCookie,
  TExpressHttpMethodFns
} from "@src/types/api/basetypes"

import { DEFAULT_ERROR_MESSAGE } from "@src/api/renderError"

export const defaultHandlerOptions = {
  subjectIsActive: true,
  adminRequired: false
}

export const getHandlers = (
  options: THandlerOptions = defaultHandlerOptions,
  method: TExpressHttpMethodFns
) => {
  let handlers: express.RequestHandler[] = []
  if (options.subjectIsActive) {
    handlers.push(subjectIsActiveMiddleware)
  }
  if (options.custom) {
    options.custom.forEach((fn: any) => {
      handlers.push(fn)
    })
  }
  return handlers
}

type TRequestHelpers = {}

export const fnToExpressHandler = (fn: Function): express.RequestHandler => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const requestHelpers: TRequestHelpers = {}
      const baseReq: TBaseRequest = Object.assign(req, requestHelpers)
      try {
        var fnResp = await fn(baseReq)
      } catch (err) {
        console.log("Whoa!  Unhandled error from API handler.", err)
        fnResp = {
          json: {
            success: false,
            error: DEFAULT_ERROR_MESSAGE
          },
          status: 500
        }
      }
      let body: any = ""
      if (fnResp.clearCookies) {
        fnResp.clearCookies.map((x: TClearCookie) => res.clearCookie(x))
      }
      if (fnResp.cookies) {
        fnResp.cookies.map((x: TCookie) => res.cookie(x.key, x.value, x.opts))
      }
      if (fnResp.redirect) {
        return res.redirect(fnResp.redirect)
      }
      let headers = fnResp.headers || {}
      if (fnResp.body) {
        body = fnResp.body
      } else if (fnResp.error) {
        body = { success: false, error: fnResp.error } // JSON.stringify({success: false, error: fnResp.error})
      } else if (fnResp.json) {
        body = fnResp.json
      }
      res.set(headers)
      res.status(fnResp.status || 200)
      res.send(body)
      if (fnResp.continue) {
        next()
      }
    } catch (err) {
      console.log("Unhandled error in fnToExpressHandler", err)
      throw err
    }
  }
}
