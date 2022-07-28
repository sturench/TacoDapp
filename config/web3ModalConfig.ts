import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";

export default function getProviderOptions() {
    return  {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: process.env.NEXT_PUBLIC_INFURA_KEY,
            },
            rpc: 42,
        }
    };

}

// // const providerOptions = {
// //     walletconnect: {
// //         package: WalletConnectProvider,
// //         options: {
// //             infuraId: process.env.NEXT_PUBLIC_INFURA_KEY,
// //         },
// //         rpc: 42,
// //     }
// // };
//
// const newWeb3Modal = new Web3Modal({
//     cacheProvider: true, // very important
//     network: "kovan",
//     providerOptions,
// });