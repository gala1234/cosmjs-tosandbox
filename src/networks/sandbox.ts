import { GasPrice, makeCosmoshubPath } from "@cosmjs/stargate";
import path from "path";
import process from "os";
import { Options } from "../types";

export const sandBoxOptions: Options = {
    // httpUrl: 'https://sandbox-validator1.nymtech.net',
    httpUrl: 'https://qa-validator.qa.nymte.ch/', // good one
    // httpUrl: 'https://qa-validator.nymtech.net',
    networkId: 'nymnet',
    bech32prefix: 'n',
    feeToken: 'unym',
    hdPath: makeCosmoshubPath(0),
    defaultKeyFile: path.join(process.homedir(), ".new.key"),
    fees: {
        upload: 2500000,
        init: 1000000,
        exec: 500000,
    },
    gasPrice: GasPrice.fromString("0.025unym"),
}