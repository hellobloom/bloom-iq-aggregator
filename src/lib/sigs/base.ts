import * as EthU from "ethereumjs-util"
import * as D from "date-fns"
import * as wallet from "ethereumjs-wallet"
// import * as S from "@src/types/sigs"
import { envPr } from "@src/environment"

export type TSuccess<TSigType = undefined> = {
  success: true
  obj?: TSigType
}
export type TFieldErr = {
  success: false
  field: string
  err: string
  details: any
}

export type TValidationErr = {
  success: false
  errors: Array<TFieldErr>
}

export type TFieldResult = TSuccess | TFieldErr

export type TValidationResult<TSigType> = TSuccess<TSigType> | TValidationErr

/**
 * Validate a hex encoded signature string
 *
 * @param signatureString A signature string like "0x123456..."
 */
export const isValidSignatureString = (signatureString: string): boolean => {
  let signature: EthU.Signature
  try {
    signature = EthU.fromRpcSig(signatureString)
  } catch {
    return false
  }
  const { v, r, s } = signature
  return EthU.isValidSignature(v, r, s, true)
}

export const signatureMatches = (
  rpcSig: string,
  plaintext: string,
  ethAddress: string
) => {
  const recoveredSigner: Buffer = recoverEthAddressFromPersonalRpcSig(
    plaintext,
    rpcSig
  )
  return recoveredSigner.equals(EthU.toBuffer(ethAddress))
}

export const recoverEthAddressFromDigest = (
  digest: Buffer,
  rpcSig: string
): Buffer => {
  // Extract the signature parts so we can recover the public key
  const sigParts = EthU.fromRpcSig(rpcSig)
  // Recover public key from the hash of the message we constructed and the signature the user provided
  const recoveredPubkey = EthU.ecrecover(
    digest,
    sigParts.v,
    sigParts.r,
    sigParts.s
  )
  // Convert the recovered public key into the corresponding ethereum address
  const recoveredAddress = wallet
    .fromPublicKey(new Buffer(recoveredPubkey, "hex"))
    .getAddressString()

  return new Buffer(EthU.stripHexPrefix(recoveredAddress), "hex")
}

/**
 * Recover an Ethereum address string from an RPC signature.
 *
 * The data types involved here are important to understand because recovery and signature
 * can mean many things:
 *
 * - An RPC signature is a string still of the format "0x123456...". This is what web3 produces
 *   while most libraries expect a hash contains values `v`, `r`, and `s`
 *
 * - The signed text here should be the actual ASCII text that the end user would see. If they
 *   signed the text "Hello, Bloom!" then you should pass that in here. Other libraries will need
 *   you to call `sha3` on the input before recovering or add a prefix to the string before calling
 *   the function.
 *
 * - This function returns a `Buffer` of the Ethereum address. The `ecrecover` function shipped with
 *   ethereumjs-util returns the *public key* which is different.
 *
 * - This function recovers signatures that were produced with `web3.personal.sign` which is *different*
 *   from `web3.eth.sign`. The `personal.sign` function is for ascii text the user sees. The `eth.sign`
 *   is for signing raw transaction data.
 *
 * @param text a string like "Hello, Bloom!" that the user signed in order to produce `rpcSig`
 * @param rpcSig a user provided RPC signature string (like "0x123456") produced from the `signedText`
 * @return The ETH address used to sign the text
 */
export const recoverEthAddressFromPersonalRpcSig = (
  text: string,
  rpcSig: string
): Buffer => {
  // Hash the text the same way web3 does with the weird "Ethereum Signed Message" text
  const hashed = EthU.hashPersonalMessage(EthU.toBuffer(text))

  return recoverEthAddressFromDigest(hashed, rpcSig)
}

// Validation functions
export const fieldErr = (
  field: string,
  err: string,
  details?: any
): TFieldErr => {
  return {
    success: false,
    field,
    err,
    details
  }
}

export const success: TSuccess = { success: true }

export const checkFieldsPresent = async (
  obj: any,
  keys: Array<string>
): Promise<Array<TFieldResult>> => {
  return keys.map((f: string) => {
    if (!(f in obj)) {
      return fieldErr(f, "field_missing")
    } else {
      return success
    }
  })
}

export const checkTimestamp = async (obj: any): Promise<TFieldResult> => {
  let e = await envPr
  let now = new Date()
  let threshold = D.subSeconds(now, e.sig_max_seconds_ago)
  let comparison = D.compareAsc(threshold, D.parse(obj.timestamp))
  if (comparison === 1) {
    return fieldErr("timestamp", "too_old", {
      timestamp: obj.timestamp,
      max_seconds_ago: e.sig_max_seconds_ago,
      threshold
    })
  }
  return success
}

export const checkAggregatorAddr = async (obj: any): Promise<TFieldResult> => {
  let e = await envPr
  if (e.aggregator_addresses.indexOf(obj.aggregator_addr) === -1) {
    return fieldErr("aggregator_addr", "unlisted", {
      specified: obj.aggregator_addr,
      listed: e.aggregator_addresses
    })
  }
  return success
}

export const checkType = async (
  obj: any,
  sigType: string
): Promise<TFieldResult> => {
  if (obj.type !== sigType) {
    return fieldErr("type", "invalid", {
      specified: obj.Type,
      required: obj.type
    })
  }
  return success
}

export const checkValidAddr = async (
  obj: any,
  field: string
): Promise<TFieldResult> => {
  let addr = obj[field]
  if (typeof addr === "undefined") {
    return fieldErr(field, "not_specified")
  }
  if (typeof addr !== "string") {
    return fieldErr(field, "not_string")
  }
  if (addr.length !== 42) {
    return fieldErr(field, "invalid_length")
  }
  return success
}

export const checkValidSig = async (
  sig: any,
  field: any,
  text: string,
  addr: string
): Promise<TFieldResult> => {
  if (!isValidSignatureString(sig)) {
    return fieldErr(field, "invalid_sig_format")
  }
  let resultAddr = recoverEthAddressFromPersonalRpcSig(text, sig)
  let addrBuffer = EthU.toBuffer(addr)
  if (resultAddr !== addrBuffer) {
    return fieldErr(field, "invalid_sig", {
      text,
      sig,
      expectedAddr: addr,
      resultAddr
    })
  }
  return success
}

export const onlyErrors = (
  results: Array<TFieldErr | TSuccess>
): Array<TFieldErr> => {
  return results.filter((x): x is TFieldErr => x.success === false)
}

export const globalSigChecks = async <T extends any>(
  sigObj: T,
  fields: Array<keyof T>,
  sigType: T["type"],
  sigField: string,
  sig: string,
  txt: string,
  addr: string
) => {
  return [
    ...(await checkFieldsPresent(sigObj, fields)),
    await checkAggregatorAddr(sigObj),
    await checkTimestamp(sigObj),
    await checkType(sigObj, sigType),
    await checkValidSig(sig, sigField, txt, addr)
  ]
}

export const errorCheck = <TSigType>(
  errors: Array<TFieldErr>,
  sigObj: TSigType
): TValidationResult<TSigType> => {
  if (errors.length === 0) {
    let resp = { success: true, obj: sigObj } as TSuccess<TSigType>
    return resp
  } else {
    return { success: false, errors }
  }
}

export const validationSucceeded = (
  validation: Array<TFieldErr> | TSuccess
) => {
  return !(validation instanceof Array)
}

export const parseSigText = <TSigType>(text: string) => {
  return JSON.parse(text) as TSigType
}
