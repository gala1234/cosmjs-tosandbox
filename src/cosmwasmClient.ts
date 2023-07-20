import fs from "fs"
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing"
import { Decimal } from "@cosmjs/math"
import { SigningCosmWasmClient, SigningCosmWasmClientOptions } from "@cosmjs/cosmwasm-stargate"
import { GasPrice } from "@cosmjs/stargate"
import { Options } from "./types"

export const loadOrCreateWallet = async (
    options: Options,
    password: string,
    filename: string
): Promise<DirectSecp256k1HdWallet> => {
    let encrypted: string
    try {
        encrypted = fs.readFileSync(filename, "utf8")
        console.log("encrypted", encrypted)
    } catch (err) {
        // generate if no file exists
        const wallet = await DirectSecp256k1HdWallet.generate(12, {
            hdPaths: [options.hdPath],
            prefix: options.bech32prefix,
        })
        const encrypted = await wallet.serialize(password)
        fs.writeFileSync(filename, encrypted, "utf8")
        return wallet
    }
    console.log("password", password)
    // otherwise, decrypt the file (we cannot put deserialize inside try or it will over-write on a bad password)
    const wallet = await DirectSecp256k1HdWallet.deserialize(encrypted, password)
    return wallet
}

export const connect = async (
    endpoint: string,
    wallet: DirectSecp256k1HdWallet,
    options: SigningCosmWasmClientOptions = {}
): Promise<SigningCosmWasmClient> => {

    const clientOptions = {
        gasPrice: options.gasPrice,
    }

    return await SigningCosmWasmClient.connectWithSigner(
        endpoint, // rpc address
        wallet,
        clientOptions
    )
}
