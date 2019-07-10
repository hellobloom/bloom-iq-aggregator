import { envPr } from "@src/environment"
import * as express from "express"
import * as U from "@src/lib/util"
import { toBuffer } from "ethereumjs-util"
import { sha256 } from "ethereumjs-util"

export const getVersionedApiPath = (url: string, version: number = 1) => {
  const unversionedUrlRegex = /\/api\/([^v].*)/gi
  const regexExecArr = unversionedUrlRegex.exec(url)

  if (regexExecArr !== null) {
    return `/api/v${version}/${regexExecArr[1]}`
  }
  return url
}

export const rewriteUnversionedApiUrls: express.Handler = async (
  req,
  _,
  next: express.NextFunction
) => {
  req.url = getVersionedApiPath(req.originalUrl)
  next()
}

export const enforceHTTPS: express.RequestHandler = (
  req,
  res,
  next: express.NextFunction
) => {
  let isHTTPS = req.secure

  // Second, if the request headers can be trusted (e.g. because they are send
  // by a proxy), check if x-forward-proto is set to https
  if (!isHTTPS) {
    const xForwardProto = (req.headers["x-forwarded-proto"] as string) || ""
    isHTTPS = xForwardProto.substring(0, 5) === "https"
  }
  if (isHTTPS) {
    return next()
  }
  // Only redirect GET methods
  if (req.method === "GET" || req.method === "HEAD") {
    res.redirect(301, "https://" + req.headers.host + req.originalUrl)
  } else {
    res.status(403).json({ success: false, error: "https_required" })
  }
}

export const subjectIsActiveMiddleware: express.RequestHandler = async (
  req,
  res,
  next
) => {
  if (await U.subjectIsActive(toBuffer(req.params.subject_addr))) {
    return next()
  }
  res
    .status(400)
    .json({ success: false, error: "no_active_association_for_subject" })
}

export const hasValidHashFor = (str: string, cnf: { keySha: string }) => {
  const hash = sha256(str).toString("hex")
  return hash === cnf.keySha
}

export const prometheusWebhookOnly: express.RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const e = await envPr

  const t = (req.headers.authorization as string).replace("Bearer ", "")
  if (hasValidHashFor(t, e.prometheus)) {
    next()
  } else {
    // 415 = Unsupported media type
    console.log("prometheusWebhookOnly violation")
    res.status(403).send('{"success":false,"message":"Unauthorized"}')
  }
}
