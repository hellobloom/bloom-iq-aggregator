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

export const env = async () => {
  let p = process.env
  return {
    appPort: envVar(p, 'APP_PORT', 'int'),
    expressBind: envVar(p, 'EXPRESS_BIND', 'string'),
    sig_max_seconds_ago: envVar(p, 'SIG_MAX_SECONDS_AGO', 'int'),
    prometheus: envVar(p, 'PROMETHEUS', 'json') as TWebhookIn,
    attestations: {
      type: envVar(p, 'ATTESTATION_TYPE', 'string') as keyof typeof AttestationTypeID,
      provider: envVar(p, 'ATTESTATION_PROVIDER', 'string'),
      expiration_seconds: envVar(p, 'ATTESTATION_EXPIRATION_SECONDS', 'int', false, {default: 2678400}),
      attester_private_key: envVar(p, 'ATTESTATION_PRIVKEY', 'string'),
      attester_address: envVar(p, 'ATTESTATION_ADDR', 'string'),
      contract_address: envVar(p, 'ATTESTATION_CONTRACT_ADDR', 'string'),
      service: {
        default_headers: envVar(p, 'ATTESTATION_SUBMISSION_HEADERS', 'json'),
        submit: envVar(p, 'ATTESTATION_SUBMISSION_SUBMIT', 'json') as TFlexEndpoint,
        get_proof: envVar(p, 'ATTESTATION_SUBMISSION_GET_PROOF', 'json') as TFlexEndpoint,
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
