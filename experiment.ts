import fs from "fs"
import { IndexedTx, GasPrice } from "@cosmjs/stargate"
import { EncodeObject, OfflineDirectSigner, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing"
import {
    getUserSignerFromMnemonic,
    getContractVersion,
    getRewardingParams,
    getDelegatorDelegations,
    getStateParams,
    getMixnodesDetailed,
    getAllDelegations,
    bondMixNode,
    delegateToMixNode,
} from "./src/methods"
import { loadOrCreateWallet, connect } from "./src/cosmwasmClient"
import { sandBoxOptions } from "./src/networks/sandbox"

// const mnemonic =
//     "drastic local august alert gloom cabbage letter series onion bitter confirm address spawn sleep adapt increase wisdom anger napkin valve fish bread wild stem"
// const prefix = "n"

// const rpc = "https://qa-validator.qa.nymte.ch/"

// const contractAddressSandBox = "n1xr3rq8yvd7qplsw5yx90ftsr2zdhg4e9z60h5duusgxpv72hud3sjkxkav"

const contractAddressQA = "n10qt8wg0n7z740ssvf3urmvgtjhxpyp74hxqvqt7z226gykuus7eq5u9pvq"
// const contactIdQA =

const runAll = async (): Promise<void> => {
    // const stargateClient = await StargateClient.connect(rpc)
    // console.log(
    //     "With client, chain id:",
    //     await stargateClient.getChainId(),
    //     ", height:",
    //     await stargateClient.getHeight()
    // )
    // const filename = "testnet.nym.mnemonic.key"
    // const encrypted = fs.readFileSync(filename, "utf8")
    // console.log("Encrypted:", encrypted)

    // const userSigner: OfflineDirectSigner = await getUserSignerFromMnemonic(nmemonic, prefix)
    // const userAddress = (await userSigner.getAccounts())[0].address
    // console.log("Alice's address from signer", userAddress)

    // const balance = await stargateClient.getAllBalances(userAddress) // <-- replace with your generated address
    // console.log("Balance:", balance)

    const wallet = await loadOrCreateWallet(sandBoxOptions, "password", ".new.key")

    console.log("Mnemonic:", wallet.mnemonic)

    const walletAccounts = await wallet.getAccounts()

    const walletAddress = walletAccounts[0].address

    console.log(
        // "Wallet:", wallet,
        "WalletAddress --->",
        walletAddress
    )

    const client = await connect(sandBoxOptions.httpUrl, wallet, {
        gasPrice: GasPrice.fromString("0.025unym"),
    })

    // console.log("Client:", client)

    const mixnodesDetailed = await getMixnodesDetailed(client, contractAddressQA)

    const bondInformation = mixnodesDetailed[0].bond_information

    const nodeToBond = bondInformation.mix_node

    const costParams = bondInformation

    console.log("nodeToBond --->", nodeToBond, "costParams --->", costParams)

    const contractVersion = await getContractVersion(client, contractAddressQA)

    // console.log("Contract version:", contractVersion)

    const rewardingParams = await getRewardingParams(client, contractAddressQA)

    // console.log("Rewarding params:", rewardingParams)

    const stateParams = await getStateParams(client, contractAddressQA)

    console.log("State params:", stateParams)

    const allDelegations = await getAllDelegations(client, contractAddressQA)

    const oneDelegation = allDelegations.delegations[0]

    const delegationOwner = oneDelegation.owner
    const delegationMixId = oneDelegation.mix_id

    console.log("oneDelegator --->", delegationOwner, "oneDelegation --->", delegationMixId)

    const delegations = await getDelegatorDelegations(client, contractAddressQA, delegationOwner)

    console.log("Delegations --->", delegations)

    // const bond = await bondMixNode(client, contractAddressQA, walletAddress, nodeToBond)

    // console.log("Delegation --->", bond)

    // const delegate = await delegateToMixNode(client, contractAddressQA, delegationOwner, delegationMixId, { amount: "10000", denom: "unym" })

    // console.log("Delegation --->", delegate)
}

runAll()
