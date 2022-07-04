import { providers } from "ethers";
export interface Txn {
    to: string;
    value: string;
    data: string;
}
export declare class RegistryClient {
    provider: providers.JsonRpcProvider;
    registryAddr: string;
    protocol: string;
    constructor(provider: providers.JsonRpcProvider, protocol?: string);
    getRelayers(numRelayers?: number): Promise<string[]>;
    getRelayerLocator(relayerAddr: string): Promise<any>;
    getRelayerFee(relayerAddr: string): Promise<{
        sum: any;
        count: any;
    }>;
    submitTx(relayerLocator: string, txnData: Txn): Promise<any>;
}
