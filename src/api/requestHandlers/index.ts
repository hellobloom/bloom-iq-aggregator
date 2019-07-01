import * as express from 'express-serve-static-core'
import {RequestHandler} from 'express-serve-static-core'
import {App} from '@src/models'
import {sha256} from 'ethereumjs-util'
import {env} from '@src/environment'
// import {logMessage} from '@src/logger'

const hasValidHashFor = (hash: string, cnf: {keySha: string}) => hash === cnf.keySha

export const prometheusWebhookOnly: RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const e = await env()

  const t = (req.headers.authorization as string).replace('Bearer ', '')
  const hash = sha256(t).toString('hex')
  if (hasValidHashFor(hash, e.prometheus)) {
    next()
  } else {
    // 415 = Unsupported media type
    console.log('prometheusWebhookOnly violation')
    res.status(403).send('{"success":false,"message":"Unauthorized"}')
  }
}

export const apiOnly: RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const hash = sha256(req.headers['app-key'] as string).toString('hex')
  const appNameHeader = req.headers['app-name']
  const appName = Array.isArray(appNameHeader) ? appNameHeader[0] : appNameHeader
  let app = await App.FindWhere({name: appName, key_sha: hash})
  if (app) {
    ;(req as any).app = app
    next()
  } else {
    // 415 = Unsupported media type
    console.log('txServiceWebhookOnly violation')
    res.status(403).send('{"success":false,"message":"Unauthorized"}')
  }
}
