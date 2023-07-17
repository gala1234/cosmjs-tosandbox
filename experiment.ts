import fs from "fs"
import { IndexedTx, StargateClient } from "@cosmjs/stargate"
import { EncodeObject, OfflineDirectSigner } from "@cosmjs/proto-signing"
import { getUserSignerFromMnemonic, getContractVersion } from "./src/methods"
import { loadOrCreateWallet, connect } from "./src/cosmwasmClient"
import { sandBoxOptions } from "./src/networks/sandbox"

const nmemonic =
    "head mirror misery task legend sure pink master remain iron grocery family wheel electric latin cereal panther kidney canoe frequent discover chase spell barrel"
const prefix = "n"

const rpc = "https://sandbox-validator1.nymtech.net"

const runAll = async (): Promise<void> => {
    const stargateClient = await StargateClient.connect(rpc)
    console.log(
        "With client, chain id:",
        await stargateClient.getChainId(),
        ", height:",
        await stargateClient.getHeight()
    )
    const filename = "testnet.nym.mnemonic.key"
    const encrypted = fs.readFileSync(filename, "utf8")
    console.log("Encrypted:", encrypted)

    const userSigner: OfflineDirectSigner = await getUserSignerFromMnemonic(nmemonic, prefix)
    const userAddress = (await userSigner.getAccounts())[0].address
    console.log("Alice's address from signer", userAddress)

    const balance = await stargateClient.getAllBalances(userAddress) // <-- replace with your generated address
    console.log("Balance:", balance)

    const wallet = await loadOrCreateWallet(sandBoxOptions, "password", ".new.key")

    console.log("Wallet:", wallet)

    const client = await connect(wallet, sandBoxOptions)

    console.log("Client:", client)

    // const contractVersion = await getContractVersion(client, userAddress)

    // console.log("Contract version:", contractVersion)
}

runAll()
