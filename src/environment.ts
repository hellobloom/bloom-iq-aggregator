import * as dotenv from "dotenv"

dotenv.config()

export const env = async () => {
  let p = process.env
  return {
    appPort: envVar(p, "APP_PORT", "int"),
    expressBind: envVar(p, "EXPRESS_BIND", "string"),
    aggregator_addresses: envVar(p, "AGGREGATOR_ADDRESSES", "json"),
    sig_max_seconds_ago: envVar(p, "SIG_MAX_SECONDS_AGO", "int")
  }
}

export const envPr = env()

export type TEnvType =
  | "string"
  | "json"
  | "int"
  | "float"
  | "bool"
  | "buffer"
  | "object"
  | "enum"

export const envVar = (
  source: any,
  name: string,
  type: TEnvType = "string",
  required: boolean = true,
  opts: {
    default?: any
    enum?: any
    baseToParseInto?: number
  } = {}
): any => {
  const val = source[name]
  if (["buffer", "object"].indexOf(type) !== -1) {
    throw new Error(
      `Env var type ${type} specified, but is only allowed for env service clients`
    )
  }
  if (typeof val === "undefined") {
    if (required) {
      throw new Error(`Expected environment variable ${name}`)
    } else {
      if (typeof opts.default !== "undefined") {
        return opts.default
      } else {
        if (type === "bool") {
          return false
        }
      }
    }
  }
  switch (type) {
    case "string":
      return val
    case "json":
      try {
        return JSON.parse(val)
      } catch (err) {
        console.log(`JSON failed to parse: ${name}, ${val}`)
        return {} // Fail somewhat gracefully
      }
    case "int":
      return parseInt(val, opts && opts.baseToParseInto)
    case "float":
      return parseFloat(val)
    case "bool":
      return testBool(val)
    case "enum":
      if (!opts || !opts.enum) {
        throw new Error(`Enum env var has no specified enum`)
      }
      if (!opts.enum.includes(val)) {
        throw new Error(
          `Value specified for enum env var not contained in enum`
        )
      }
      return val
    default:
      throw new Error(`unsupported type: ${type}`)
  }
}

export const testBool = (value: string) =>
  (["true", "t", "yes", "y"] as any).includes(value.toLowerCase())
