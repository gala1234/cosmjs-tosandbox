// import fs from "fs"
// import { IndexedTx } from "@cosmjs/stargate"
import { DirectSecp256k1HdWallet, EncodeObject, OfflineDirectSigner } from "@cosmjs/proto-signing"
import { SmartContractQuery } from "./types"

export const buildUserWallet = async (mnemonic: string, prefix: string): Promise<DirectSecp256k1HdWallet> => {
    const signerOptions = { prefix }
    return DirectSecp256k1HdWallet.fromMnemonic(mnemonic, signerOptions)
}

export const getUserSignerFromMnemonic = async (
    mnemonic: string,
    prefix: string
): Promise<OfflineDirectSigner> => {
    const signerOptions = { prefix }
    return DirectSecp256k1HdWallet.fromMnemonic(mnemonic, signerOptions)
}

export const getContractVersion = async (
    client: SmartContractQuery,
    mixnetContractAddress: string
): Promise<String> => {
    return await client.queryContractSmart(mixnetContractAddress, { get_contract_version: {} })
}
