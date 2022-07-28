import {createContext, useContext, ReactNode, useState, Dispatch, SetStateAction} from "react";
import Web3Modal from "web3modal";
import {Web3Provider} from "@ethersproject/providers";

type walletContextType = {
    setWeb3Modal: Dispatch<SetStateAction<Web3Modal | undefined>>;
    setWeb3Provider: Dispatch<SetStateAction<Web3Provider | undefined>>;
    setEthersProvider: Dispatch<SetStateAction<Web3Provider | undefined | null>>;
    setWalletAddress: Dispatch<SetStateAction<string>>;
    setChainId: Dispatch<SetStateAction<number | string | undefined>>;
    setIsConnecting: Dispatch<SetStateAction<boolean>>;
    setIsConnected: Dispatch<SetStateAction<boolean>>;
    web3Modal: Web3Modal | undefined | null,
    web3Provider: Web3Provider | undefined | null,
    ethersProvider: Web3Provider | undefined | null;
    walletAddress: string,
    chainId: number | string | undefined,
    isConnecting: boolean,
    isConnected: boolean,
    disconnectWallet: () => void;
};

const initialState: walletContextType = {
    setWeb3Modal: () => { },
    setWeb3Provider: () => { },
    setEthersProvider: () => {},
    setWalletAddress: () => { },
    setChainId: () => { },
    setIsConnecting: () => { },
    setIsConnected: () => { },
    web3Modal: null,
    web3Provider: null,
    ethersProvider: null,
    walletAddress: "",
    chainId: 0,
    isConnecting: false,
    isConnected: false,
    disconnectWallet: () => { },
}

const WalletContext = createContext<walletContextType>(initialState);

export function useWallet() {
    return useContext(WalletContext);
}

type Props = {
    children: ReactNode;
};

export function WalletProvider({children}: Props) {
    const [web3Modal, setWeb3Modal] = useState<Web3Modal | undefined>();
    const [web3Provider, setWeb3Provider] = useState<Web3Provider | undefined>();
    const [ethersProvider, setEthersProvider] = useState<Web3Provider | undefined | null>();
    const [walletAddress, setWalletAddress] = useState<string>("");
    const [chainId, setChainId] = useState<number | string | undefined>();
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const disconnectWallet = async () => {
        console.debug("Called the disconnect function in AppContext")
        await web3Modal?.clearCachedProvider();
        refreshState();
    };

    const refreshState = () => {
        setWalletAddress("");
        setChainId(undefined);
        setIsConnected(false);
    };


    const value = {
        setWeb3Modal,
        setWeb3Provider,
        setEthersProvider,
        setWalletAddress,
        setChainId,
        setIsConnecting,
        setIsConnected,
        web3Modal,
        web3Provider,
        ethersProvider,
        walletAddress,
        chainId,
        isConnecting,
        isConnected,
        disconnectWallet,
    };
    return (
        <>
            <WalletContext.Provider value={value}>
                {children}
            </WalletContext.Provider>
        </>
    );
}