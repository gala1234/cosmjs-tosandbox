import { useState, useEffect } from 'react';
import { NymMixnetContractClient, NymMixnetContractQueryClient } from './NymMixnetContract.client';
// import {  } from './NymMixnetContract.types';
import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

export const Delegations = () => {
    const [client, setClient] = useState<NymMixnetContractQueryClient | null>(null);
    const [signingClient, setSigningClient] = useState<NymMixnetContractClient | null>(null);
    const [trigger, setTrigger] = useState(0);
    const [delegations, setDelegations] = useState<any>();

    const init = async () => {
        const cosmWasmClient = await CosmWasmClient.connect("rpc.nymtech.net:443");
        const queryClient = new NymMixnetContractQueryClient(cosmWasmClient, "n17srjznxl9dvzdkpwpw24gg668wc73val88a6m5ajg6ankwvz9wtst0cznr");

        const signer = await DirectSecp256k1HdWallet.fromMnemonic("head mirror misery task legend sure pink master remain iron grocery family wheel electric latin cereal panther kidney canoe frequent discover chase spell barrel");
        const cosmWasmSigningClient = await SigningCosmWasmClient.connectWithSigner("rpc.nymtech.net:443", signer);
        const signingClient = new NymMixnetContractClient(cosmWasmSigningClient, 'n1wuv23u5dwde5qvu4m0c35d9ev9tgg9a0ftuwva', 'n17srjznxl9dvzdkpwpw24gg668wc73val88a6m5ajg6ankwvz9wtst0cznr');

        setClient(queryClient);
        setSigningClient(signingClient);
    };

    const getDelegations = async () => {
        if(!client) {
            return;
        }

        const resp = await client.getDelegatorDelegations({ delegator: 'n1wuv23u5dwde5qvu4m0c35d9ev9tgg9a0ftuwva' });
        setDelegations(resp.delegations);
    }

    const doDelegation = async () => {
        if(!signingClient) {
            return null;
        }

        const resp = await signingClient.delegateToMixnode({ mixId: 657}, "auto", "hello world", [{ amount: '1000000', denom: 'unym'}]);
        const hash = resp.transactionHash;
    }

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        getDelegations();
    }, [client]);

    // return <div>
    //     {(delegations || []).map(d => (
    //         <div>{d.mix_id} - {Math.floor(d.amount.amount / 1e6)}</div>
    //     ))}
    //     <pre>{JSON.stringify(delegations, null, 2)}</pre>
    // </div>;
}