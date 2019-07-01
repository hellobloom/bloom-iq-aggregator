import * as express from 'express'

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
    const xForwardProto = (req.headers['x-forwarded-proto'] as string) || ''
    isHTTPS = xForwardProto.substring(0, 5) === 'https'
  }
  if (isHTTPS) {
    return next()
  }
  // Only redirect GET methods
  if (req.method === 'GET' || req.method === 'HEAD') {
    res.redirect(301, 'https://' + req.headers.host + req.originalUrl)
  } else {
    res.status(403).send('Please use HTTPS when submitting data to this server.')
  }
}
