import * as express from 'express-serve-static-core'
import {logMessage} from '@src/logger'
import {prometheusWebhookOnly} from '@src/api/middleware'

export const client = require('prom-client')

export const collectDefaultMetrics = client.collectDefaultMetrics({
  timeout: 10000,
})

/**
 * Newly added requires
 */
var Register = client.register
var Counter = client.Counter
// var Histogram = require('prom-client').Histogram;
var Summary = client.Summary
var ResponseTime = require('response-time')

/**
 * A Prometheus counter that counts the invocations of the different HTTP verbs
 * e.g. a GET and a POST call will be counted as 2 different calls
 */
export const numOfRequests = new Counter({
  name: 'numOfRequests',
  help: 'Number of requests made',
  labelNames: ['method'],
})

/**
 * A Prometheus counter that counts the invocations with different paths
 * e.g. /foo and /bar will be counted as 2 different paths
 */
export const pathsTaken = new Counter({
  name: 'pathsTaken',
  help: 'Paths taken in the app',
  labelNames: ['path'],
})

/**
 * A Prometheus summary to record the HTTP method, path, response code and response time
 */
export const responses = new Summary({
  name: 'responses',
  help: 'Response time in millis',
  labelNames: ['method', 'path', 'status'],
})

/**
 * This funtion will start the collection of metrics and should be called from within in the main js file
 */
export const startCollection = () => {
  logMessage(
    [`Starting the collection of metrics, the metrics are available on /metrics`],
    {level: 'info'}
  )
  require('prom-client').collectDefaultMetrics()
}

/**
 * This function increments the counters that are executed on the request side of an invocation
 * Currently it increments the counters for numOfPaths and pathsTaken
 */
export const requestCounters = function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.path !== '/api/prometheus/metrics') {
    numOfRequests.inc({method: req.method})
    pathsTaken.inc({path: req.path})
  }
  next()
}

/**
 * This function increments the counters that are executed on the response side of an invocation
 * Currently it updates the responses summary
 */
export const responseCounters = ResponseTime(function(
  req: express.Request,
  res: express.Response,
  time: any
) {
  if (req.url !== '/api/prometheus/metrics') {
    responses.labels(req.method, req.url, res.statusCode).observe(time)
  }
})

/**
 * In order to have Prometheus get the data from this app a specific URL is registered
 */
export const injectMetricsRoute = function(app: express.Application) {
  app.get(
    '/api/prometheus/metrics',
    prometheusWebhookOnly,
    async (req: express.Request, res: express.Response) => {
      res.set('Content-Type', Register.contentType)
      res.end(Register.metrics())
    }
  )
}
