import * as dotenv from 'dotenv'
import {AttestationTypeID} from '@bloomprotocol/attestations-lib'

dotenv.config()

export type TWebhookIn = {
  keySha: string // hash of incoming key
}
export type TWebhookOut = {
  address: string // outgoing host
  key: string // outgoing key
}

export type TFlexEndpoint = {
  url: string
  interpolations: {
    [k: string]: Array<string>
  }
  method: 'get' | 'post' | 'patch' | 'put' | 'delete'
  headers: {
    [k: string]: string
  }
}

export interface ILogstash {
  host: string
  username: string
  password: string
}

export interface Features {
  open_subject_registration: boolean
}

export const getFeature = async (featureName: keyof Features, opts?: {}) => {
  let e = await env()
  return !!e.features[featureName]
}

export const env = async () => {
  let p = process.env
  return {
    app_port: envVar(p, 'APP_PORT', 'int'),
    app_id: envVar(p, 'APP_ID', 'int'),
    express_bind: envVar(p, 'EXPRESS_BIND', 'string'),
    sentry_dsn: envVar(p, 'SENTRY_DSN', 'string', false),
    logstash: envVar(p, 'LOGSTASH', 'json', false) as ILogstash,
    source_version: envVar(p, 'SOURCE_VERSION', 'string'),
    sig_max_seconds_ago: envVar(p, 'SIG_MAX_SECONDS_AGO', 'int'),
    prometheus: envVar(p, 'PROMETHEUS', 'json') as TWebhookIn,
    pipeline_stage: envVar(p, 'PIPELINE_STAGE', 'string') as PipelineStages,
    features: envVar(p, 'FEATURES', 'json', false, { default: {}}) as Features,
    vcs: {
      type: envVar(p, 'VC_TYPE', 'string') as keyof typeof AttestationTypeID,
      provider: envVar(p, 'VC_PROVIDER', 'string'),
      expiration_seconds: envVar(p, 'VC_EXPIRATION_SECONDS', 'int', false, {default: 2678400}),
      aggregator_private_key: envVar(p, 'ISSUER_PRIVKEY', 'string'),
      aggregator_address: envVar(p, 'ISSUER_ADDR', 'string'),
      contract_address: envVar(p, 'ANCHORING_CONTRACT_ADDR', 'string'),
      anchor_vcs: envVar(p, 'ANCHOR_VCS', 'bool'),
      service: {
        default_headers: envVar(p, 'VC_SUBMISSION_HEADERS', 'json'),
        submit: envVar(p, 'VC_SUBMISSION_SUBMIT', 'json') as TFlexEndpoint,
        get_proof: envVar(p, 'VC_SUBMISSION_GET_PROOF', 'json') as TFlexEndpoint,
      },
    },
  }
}

export const envPr = env()

export type TEnvType = 'string' | 'json' | 'int' | 'float' | 'bool' | 'buffer' | 'object' | 'enum'

export const envVar = (
  source: any,
  name: string,
  type: TEnvType = 'string',
  required: boolean = true,
  opts: {
    default?: any
    enum?: any
    baseToParseInto?: number
  } = {}
): any => {
  const val = source[name]
  if (['buffer', 'object'].indexOf(type) !== -1) {
    throw new Error(`Env var type ${type} specified, but is only allowed for env service clients`)
  }
  if (typeof val === 'undefined') {
    if (required) {
      throw new Error(`Expected environment variable ${name}`)
    } else {
      if (typeof opts.default !== 'undefined') {
        return opts.default
      } else {
        if (type === 'bool') {
          return false
        }
      }
    }
  }
  switch (type) {
    case 'string':
      return val
    case 'json':
      try {
        return JSON.parse(val)
      } catch (err) {
        console.log(`JSON failed to parse: ${name}, ${val}`)
        return {} // Fail somewhat gracefully
      }
    case 'int':
      return parseInt(val, opts && opts.baseToParseInto)
    case 'float':
      return parseFloat(val)
    case 'bool':
      return testBool(val)
    case 'enum':
      if (!opts || !opts.enum) {
        throw new Error(`Enum env var has no specified enum`)
      }
      if (!opts.enum.includes(val)) {
        throw new Error(`Value specified for enum env var not contained in enum`)
      }
      return val
    default:
      throw new Error(`unsupported type: ${type}`)
  }
}

export const testBool = (value: string) => (['true', 't', 'yes', 'y'] as any).includes(value.toLowerCase())

export enum PipelineStages {
  development = 'development',
  ci = 'ci',
  staging = 'staging',
  production = 'production',
  review = 'review',
}

