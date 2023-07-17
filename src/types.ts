import { JsonObject } from "@cosmjs/cosmwasm-stargate"
import { GasPrice } from "@cosmjs/stargate";
import { HdPath } from "@cosmjs/crypto";

export interface SmartContractQuery {
    queryContractSmart(address: string, queryMsg: Record<string, unknown>): Promise<JsonObject>
}



export interface Options {
  readonly httpUrl: string;
  readonly networkId: string;
  readonly feeToken: string;
  readonly bech32prefix: string;
  readonly hdPath: HdPath;
  readonly faucetUrl?: string;
  readonly defaultKeyFile: string;
  readonly fees: {
    upload: number;
    init: number;
    exec: number;
  };
  readonly gasPrice: GasPrice;
}