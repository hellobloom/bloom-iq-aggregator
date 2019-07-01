import * as express from 'express'
import {TBaseRequest} from '@src/types/api/basetypes'

export enum ContentType {
  /**
   * Generic MIME type, only requires returned data to be well-formed JSON.
   */
  webapp = 'application/json',

  /**
   * This MIME type is reserved for communication using the (confusingly named)
   * "JSON API" protocol: http://jsonapi.org.
   *
   * Note that "JSON API" in this context **does not mean** any API based on JSON.
   * It's a framework for building APIs that allow the client to fetch and modify
   * interrelated entities.
   *
   * The vendor prefix (vnd.) indicates that it is custom for this vendor. The
   * +json indicates that it can be parsed as JSON, but the media type should
   * define further semantics on top of JSON.
   *
   */
  webhook = 'application/vnd.api+json',

  /**
   * Our custom MIME type to check if the request is coming from a mobile client.
   */
  mobile = 'application/vnd.mobile+json',

  /**
   * Custom MIME type to check if request is coming from an iOS device
   */
  iOS = 'application/vnd.ios+json',

  /**
   * Custom MIME type to check if request is coming from an android device
   */
  android = 'application/vnd.android+json',

  /**
   * Our custom MIME type to check if the request is coming from a webview client.
   */
  webview = 'text/vnd.webview+html',

  /**
   * Represents any kind of binary data.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
   */
  any = '*/*',
}

export const hasMobileContentType = (req: TBaseRequest | express.Request) => {
  const contentType = req.headers['content-type']
  if (!contentType) {
    return false
  }

  const mobileContentTypes: string[] = [
    ContentType.mobile,
    ContentType.iOS,
    ContentType.android,
  ]
  return mobileContentTypes.indexOf(contentType) > -1
}

export type TMobileClientPlatform = 'ios' | 'android'
export type TClientPlatform = TMobileClientPlatform | 'web'

export const isMobileClientPlatform = (clientPlatform: TClientPlatform) =>
  clientPlatform !== 'web'

export const getClientPlatform = (
  req: TBaseRequest | express.Request
): TClientPlatform => {
  const contentType = req.headers['content-type']
  switch (contentType) {
    case ContentType.mobile:
    case ContentType.iOS:
      return 'ios'
    case ContentType.android:
      return 'android'
    default:
      return 'web'
  }
}
