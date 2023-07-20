import { DirectSecp256k1HdWallet, EncodeObject, OfflineDirectSigner } from "@cosmjs/proto-signing"
import { mixNodeCostParams, TMixNode, ownerSignature } from "./model"
import { Coin, DeliverTxResponse, SignerData, StdFee, IndexedTx } from "@cosmjs/stargate"
import { ExecuteResult, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"

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
    client: SigningCosmWasmClient,
    mixnetContractAddress: string
): Promise<String> => {
    return await client.queryContractSmart(mixnetContractAddress, { get_contract_version: {} })
}

export const getStateParams = async (
    client: SigningCosmWasmClient,
    mixnetContractAddress: string
): Promise<String> => {
    return await client.queryContractSmart(mixnetContractAddress, {
        get_state_params: {},
    })
}

export const getRewardingParams = async (
    client: SigningCosmWasmClient,
    mixnetContractAddress: string
): Promise<String> => {
    return await client.queryContractSmart(mixnetContractAddress, { get_rewarding_params: {} })
}

export const getMixnodesDetailed = async (
    client: SigningCosmWasmClient,
    mixnetContractAddress: string
): Promise<any[]> => {
    let mixNodes: any[] = []
    const pagedResponse = await client.queryContractSmart(mixnetContractAddress, {
        get_mix_nodes_detailed: {},
    })
    mixNodes = mixNodes.concat(pagedResponse.nodes)
    return mixNodes
}

export const getMixnodeDetails = async (
    client: SigningCosmWasmClient,
    mixnetContractAddress: string,
    mix_id: string
): Promise<void> => {
    return await client.queryContractSmart(mixnetContractAddress, {})
}

export const getDelegatorDelegations = async (
    client: SigningCosmWasmClient,
    mixnetContractAddress: string,
    delegator: string
): Promise<String> => {
    return await client.queryContractSmart(mixnetContractAddress, {
        get_delegator_delegations: { delegator },
    })
}

export const getAllDelegations = async (
    client: SigningCosmWasmClient,
    mixnetContractAddress: string
): Promise<{ delegations: any[] }> => {
    return await client.queryContractSmart(mixnetContractAddress, { get_all_delegations: {} })
}

export const bondMixNode = async (
    client: SigningCosmWasmClient,
    mixnetContractAddress: string, // senderAddress
    contractAddress: string, // contractAddress
    ourNode: number,
    amount?: Coin,
    fee?: StdFee | "auto" | number,
    memo?: string
): Promise<ExecuteResult> => {
    const msg = {
        bond_mixnode: {
            mix_node: ourNode,
            cost_params: mixNodeCostParams,
            owner_signature: ownerSignature,
        },
    }

    return await client.execute(
        mixnetContractAddress,
        contractAddress,
        msg,
        fee || "auto",
        memo || "let's bond a mixnode",
        [amount || { amount: "100000000", denom: "unym" }]
    )
}

export const delegateToMixNode = async (
    client: SigningCosmWasmClient,
    mixnetContractAddress: string, // senderAddress
    contractAddress: string, // contractAddress
    mixId: number,
    amount: Coin,
    fee?: StdFee | 'auto' | number,
    memo?: string,
): Promise<ExecuteResult> => {
    const msg = {
        delegate_to_mixnode: {
            mix_id: mixId,
    },
}
    return await client.execute(mixnetContractAddress, contractAddress, msg, fee || 'auto', memo || 'let\'s delegate to a mixnode', [amount])
}
