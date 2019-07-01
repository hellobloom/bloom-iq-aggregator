import {RequestHandler} from 'express'
import * as express from 'express'

const noOp: RequestHandler = (req, res, next: express.NextFunction) => {
  next()
}

// Mock our request handlers to just approve the request
export const requestHandlerMocks: {[key: string]: RequestHandler} = {
  loggedInSession: noOp,
  apiOnly: noOp,
  webhookOnly: noOp,
  userRateLimited: () => noOp,
  ipRateLimited: () => noOp,
  requireFeature: () => noOp,
}
