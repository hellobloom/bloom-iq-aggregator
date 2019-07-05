import * as EthU from "ethereumjs-util"
import * as D from "date-fns"
import * as wallet from "ethereumjs-wallet"
import { envPr } from "@src/environment"

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
 * @param signedText a string like "Hello, Bloom!" that the user signed in order to produce `rpcSig`
 * @param rpcSig a user provided RPC signature string (like "0x123456") produced from the `signedText`
 * @return The ETH address used to sign the text
 */
export const recoverEthAddressFromPersonalRpcSig = (
  signedText: string,
  rpcSig: string
): Buffer => {
  // Hash the text the same way web3 does with the weird "Ethereum Signed Message" text
  const hashed = EthU.hashPersonalMessage(EthU.toBuffer(signedText))

  return recoverEthAddressFromDigest(hashed, rpcSig)
}

export const checkFieldsPresent = async (obj: any, keys: Array<string>) => {
  keys.forEach((f: string) => {
    if (!(f in obj)) throw new Error("Field missing: " + f)
  })
}

export const checkTimestamp = async (obj: any) => {
  let e = await envPr
  let now = new Date()
  let threshold = D.subSeconds(now, e.sig_max_seconds_ago)
  let comparison = D.compareAsc(threshold, D.parse(obj.timestamp))
  if (comparison === 1) {
    throw new Error(
      `Signature timestamp ${obj.timestamp} is too old.  Needed a date ${
        e.sig_max_seconds_ago
      } seconds before now (compared against ${threshold})`
    )
  }
}

export const checkAggregatorAddr = async (obj: any) => {
  let e = await envPr
  if (e.aggregator_addresses.indexOf(obj.aggregator_addr) === -1) {
    throw new Error(
      `Invalid aggregator address, couldn't find ${
        obj.aggregator_addr
      } in ${JSON.stringify(e.aggregator_addresses)}`
    )
  }
}

export const checkType = async (obj: any, sigType: string) => {
  if (obj.type !== sigType) {
    throw new Error(`Invalid type for ${sigType}: ${obj.type}`)
  }
}
