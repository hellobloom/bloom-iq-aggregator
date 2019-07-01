import {logMessage} from '@src/logger'
import {IRespErr} from '@src/types/api/basetypes'

export const DEFAULT_ERROR_MESSAGE = 'Looks like something went wrong.'

export type ErrorType = 'error' | 'scopesError' | 'loginError'

/**
 * Use this class when it's acceptable to display the error message to a user.
 * Otherwise, #renderError will return in the response the DEFAULT_ERROR_MESSAGE.
 * You can think of this class as saying "This is a whitelisted error, safe for
 * the user".
 */
export class ClientFacingError extends Error {
  constructor(m?: string) {
    // Always display the client some message.
    super(m || DEFAULT_ERROR_MESSAGE)
  }
}

export class TypedClientFacingError extends ClientFacingError {
  constructor(m: string, public type: ErrorType) {
    super(m)
  }
}

// More info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
export enum HttpStatus {
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
}

export const stringifyError = (err: Error) =>
  JSON.stringify(err, Object.getOwnPropertyNames(err))

/**
 * This functions (1) logs the error and (2) returns a JSON error. If it's
 * specified to be a ClientFacingError, the logged and returned errors are
 * the same. If not, it logs that error but returns a generic error to shield
 * against displaying internatl data to the client.
 */
export const renderError = (status: number, error?: string | Error): IRespErr => {
  // const errorForLog = error instanceof Sequelize.Error ? error.message : error
  var errorForLog
  if (error instanceof Error) {
    errorForLog = stringifyError(error).substr(0, 2000)
  } else if (typeof error === 'function') {
    errorForLog = 'Unprintable error...'
  } else if (typeof error === 'undefined') {
    errorForLog = 'No error...'
  } else {
    errorForLog = error ? error.toString().substr(0, 2000) : 'Empty error...'
  }
  logMessage(['Request failed!', {error: errorForLog, status}], {level: 'warn'})
  const errorForClient =
    error instanceof ClientFacingError // Only display whitelisted errors
      ? error.message
      : DEFAULT_ERROR_MESSAGE
  return {status: status, json: {success: false, error: errorForClient}}
}
