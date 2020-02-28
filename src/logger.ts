import {env} from '@src/environment'
import * as Sentry from '@sentry/node'
import axios from 'axios'

export type TLogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly'
export const LogLevels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly']

export type TLogMsg = Error | string

enum ELogTypes {
  message = 'message',
  error = 'error',
  event = 'event',
}

type TLogstashBody = ILogstashEventBody | ILogstashErrorBody

interface ILogstashEventBody {
  name: string
  event: {[key: string]: any}
}

interface ILogstashErrorBody {
  name: string
  error: {message: string; tags?: TSentryTags | undefined}
}

export type TLogstashLogType = 'event' | 'error'

interface IEventLog {
  logType: ELogTypes.event
  event: ILogstashEventBody
}

interface IErrorLog {
  logType: ELogTypes.error
  error: Error
  tags?: TSentryTags
}

export interface ILogMsgOpts {
  level: TLogLevel
}

interface IMessageLog {
  logType: ELogTypes.message
  msg: any
  opts: ILogMsgOpts
}

type TLog = IEventLog | IErrorLog | IMessageLog

// type TSentryTagKeys = 'logging' | 'models' | 'api' | 'worker' | 'services' | 'event-worker'
type TSentryTagKeys = 'logger' | 'label'
type TSentryTags = {[key in TSentryTagKeys]?: string}

export interface ILogstashMsg {
  $app: string
  $type: TLogstashLogType
  $body: any
}

export const stringify = (x: any) => {
  try {
    if (typeof x === 'object') {
      return circularStringify(x) || `Couldn't stringify`
    } else {
      return JSON.stringify(x)
    }
  } catch (err) {
    return `{"success":false,"error":"error encountered during stringification"}`
  }
}

export const getStack = () => {
  try {
    throw new Error()
  } catch (e) {
    return stringify(e.stack)
  }
}

let envPr = env()

export const sentry = envPr.then(e => {
  Sentry.init({
    dsn: e.sentry_dsn,
    environment: e.pipeline_stage,
    release: e.source_version,
  })
  Sentry.configureScope(scope => {
    scope.setTag('app_id', e.app_id)
  })
  return Sentry
})

export const sendToSentry = async (
  msg: TLogMsg,
  sentryInstance: any,
  tags?: TSentryTags
) => {
  try {
    stringify(msg)
  } catch (err) {
    msg = stringify(msg)
  }
  sentryInstance.withScope((scope: any) => {
    if (tags) {
      Object.keys(tags).forEach((tagKey: string) => {
        scope.setTag(tagKey, tags![tagKey])
      })
    }
    sentryInstance.captureException(msg instanceof Error ? msg : Error(msg))
  })
}

export const logToSentry = async (msg: Error, tags?: TSentryTags) => {
  let sentryInstance: any
  // Initiate Sentry instance
  try {
    sentryInstance = await sentry
  } catch (err) {
    console.log('Initiating Sentry instance failed')
    return false
  }
  // Log error to Sentry
  try {
    await sendToSentry(msg, sentryInstance, tags)
  } catch (err) {
    try {
      let normalizedMsg: string
      if (msg instanceof Error) {
        try {
          normalizedMsg = `Failed error message with stack: ${
            msg.message
          } ${stringify(msg.stack)}`
        } catch {
          normalizedMsg = `Failed error message: ${msg.message}`
        }
      } else {
        normalizedMsg = "Sentry error logging failed (can't log message)"
      }
      await sendToSentry(normalizedMsg, sentryInstance, tags)
    } catch (err) {
      console.log('Major Sentry logging failure, giving up')
    }
  }
  return true
}

const logToConsole = (msg: any, level: TLogLevel) => {
  try {
    console.log(
      'logger:',
      level,
      new Date().toString(),
      typeof msg === 'string' || msg instanceof Error ? msg : stringify(msg)
    )
  } catch (err) {
    void logToSentry(
      new Error(
        `
          Console log failed
          log: ${stringify(msg)}
          err: ${stringify(err)}
          `
      ),
      {logger: 'logger', label: 'console'}
    )
    console.log('Error logging failed')
  }
}

export const sendToLogstash = async (
  msg: TLogstashBody,
  msgType: TLogstashLogType
) => {
  let e = await envPr
  if (!e.logstash) {
    return false
  }
  let payload: ILogstashMsg = {
    $app: e.app_id,
    $type: msgType,
    $body: stringify(msg),
  }
  await axios({
    url: e.logstash.host,
    auth: {
      username: e.logstash.username,
      password: e.logstash.password,
    },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: stringify({message: payload}),
  })
  return true
}

export const logToLogstash = async (
  msg: TLogstashBody,
  msgType: TLogstashLogType
) => {
  try {
    await sendToLogstash(msg, msgType)
  } catch (err) {
    await logToSentry(
      new Error(
        `
          Logstash request failed
          log: ${stringify(msg)}
          err: ${stringify(err)}
          `
      ),
      {logger: 'logger', label: 'logstash'}
    )
  }
}

const logHandler = (log: TLog) => {
  switch (log.logType) {
    case ELogTypes.message:
      void logToConsole(log.msg, log.opts.level)
      break
    case ELogTypes.event:
      void logToConsole(stringify(log.event), 'info')
      void logToLogstash(log.event, 'event')
      break
    case ELogTypes.error:
      void logToConsole(log.error, 'error')
      void logToSentry(log.error, log.tags)
      void logToLogstash(
        {name: 'error', error: {message: stringify(log.error), tags: log.tags}},
        'error'
      )
      break
    default:
      void logToSentry(
        new Error(
          `
          Logging configured incorrectly
          log: ${stringify(log)}
          `
        ),
        {logger: 'logging', label: 'logHandler'}
      )
      console.log('WARNING: Logging configured incorrectly', stringify(log))
      break
  }
  return
}

/**
 * Log a message, warning or error to console
 * All messages get picked up by Filebeat and can be streamed or queried at kiba.bloom.co
 * @param msg string, array, object or Error
 * @param opts defaults to {level: info} or specify 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly'
 */
export const logMessage = (msg: any, opts: ILogMsgOpts = {level: 'info'}) =>
  logHandler({logType: ELogTypes.message, msg: msg, opts: opts})

/**
 * Log an event containing key value pairs to track
 * All events get posted to Logstash and can be streamed or queried at kiba.bloom.co
 * @param event key value pairs containing metrics to track
 */
export const logEvent = (event: ILogstashEventBody) =>
  logHandler({logType: ELogTypes.event, event: event})

/**
 * Send an alert to the development team via Sentry
 * @param error Error instance
 * @param tags Optionally include tags to give the error context. Add more tag types to TSentryTagKeys
 */
export const logError = (error: Error, tags?: TSentryTags) =>
  logHandler({logType: ELogTypes.error, error: error, tags: tags})

export const circularStringify = (o: any): string => {
  var cache: null | any[] = []
  let str = JSON.stringify(o, function(key: string, value: any) {
    if (typeof value === 'object' && value !== null) {
      if (cache!.indexOf(value) !== -1) {
        // Duplicate reference found, discard key
        return '[Circular]'
      }
      // Store value in our collection
      cache!.push(value)
    }
    return value
  })
  cache = null // Enable garbage collection
  return str
}
