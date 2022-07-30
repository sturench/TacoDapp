import {useEffect} from 'react';
import {FaWallet, FaSignOutAlt} from 'react-icons/fa';
import {providers} from 'ethers';
import Web3Modal from "web3modal";

import getProviderOptions from "../config/web3ModalConfig";
import Jazzicon, {jsNumberForAddress} from "react-jazzicon";
import {useWallet} from "../context/AppContext";

export default function ConnectButton() {
    const {
        setWeb3Modal,
        setWeb3Provider,
        setEthersProvider,
        setWalletAddress,
        setChainId,
        setIsConnecting,
        setIsConnected,
        web3Modal,
        web3Provider,
        walletAddress,
        isConnecting,
        isConnected,
        disconnectWallet
    } = useWallet()

    useEffect(() => {
        const providerOptions = getProviderOptions();

        const newWeb3Modal = new Web3Modal({
            cacheProvider: true, // very important
            network: "kovan",
            providerOptions,
        });

        setWeb3Modal(newWeb3Modal);
    }, []);


    useEffect(() => {
        // connect automatically and without a popup if user is already connected
        console.debug("Checking if we have cached provider")
        console.debug("Currently connected? " + isConnected);
        if (web3Modal && web3Modal.cachedProvider) {
            console.debug("we have one")
            console.debug(web3Modal);
            console.debug(web3Modal.cachedProvider)
            connectWallet()
        }
    }, [web3Modal])

    async function connectWallet() {

        setIsConnecting(true);
        console.debug("Entering ConnectTheWallet");
        try {
            console.debug(web3Modal);
            const provider = await web3Modal?.connect();
            setWeb3Provider(provider);
            console.debug(provider);
            console.debug('------');
            const ethersProvider = new providers.Web3Provider(provider);
            setEthersProvider(ethersProvider);
            console.debug(ethersProvider);
            const userAddress = await ethersProvider.getSigner().getAddress();
            console.debug(userAddress);
            setWalletAddress(userAddress);
            const providerChainId = provider.chainId;
            console.debug("provider chain id: " + providerChainId);
            console.debug(typeof providerChainId);
            if(typeof providerChainId == "number") {
                console.debug("doing a number");
                setChainId(providerChainId);
            } else {
                console.debug("doing a hex");
                setChainId(parseInt(provider.chainId, 16));
            }
            setIsConnected(true);
            setIsConnecting(false);
        } catch (error) {
            console.error('There was an error: ' + error);
            setIsConnecting(false);
        }
    }


    useEffect(() => {
        if (web3Provider?.on) {
            const handleAccountsChanged = (accounts: string[]) => {
                console.debug("Received an account changed event");
                if(accounts.length) {
                    setWalletAddress(accounts[0]);
                } else {
                    disconnectWallet();
                }
            };

            // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
            const handleChainChanged = (_hexChainId: string) => {
                console.debug("Caught a chainChangedEvent")
                window.location.reload()
            }

            const handleDisconnect = () => {
                console.debug('Caught a disconnect event')
                disconnectWallet();
            };

            web3Provider.on("accountsChanged", handleAccountsChanged);
            web3Provider.on('chainChanged', handleChainChanged)
            web3Provider.on("disconnect", handleDisconnect);

            return () => {
                if (web3Provider.removeListener) {
                    web3Provider.removeListener("accountsChanged", handleAccountsChanged);
                    web3Provider.removeListener("chainChanged", handleChainChanged);
                    web3Provider.removeListener('disconnect', handleDisconnect)
                }
            };
        }
    }, [web3Provider]);


    return (
        <div className="flex justify-center">
            {isConnected && walletAddress ?
                (
                    <span className="flex items-center space-x-2 p-1 bg-dark_choco rounded-lg">
                  <Jazzicon
                      diameter={32}
                      seed={jsNumberForAddress(walletAddress.toLowerCase())}
                  />
                  <span className="text-white text-sm">
                    {`${walletAddress.substring(0, 6)}...${walletAddress.substring(
                        walletAddress.length - 4
                    )}`}
                  </span>
                <FaSignOutAlt className='text-white' onClick={disconnectWallet}/>
                </span>
                ) : (
                    isConnecting ? (
                        <button
                            type="button"
                            className="flex justify-center items-center border-2 bg-dark_choco rounded-lg px-4 py-1 w-40 cursor-not-allowed text-white"
                            disabled
                        >
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Connecting
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="flex justify-center items-center space-x-2 hover:border-gray-400 bg-dark_choco rounded-lg px-4 py-1 w-40"
                            onClick={connectWallet}
                        >
                            <FaWallet className="text-white"/>
                            <span className="text-white">Connect</span>
                        </button>
                    ))
            }
        </div>
    );
}
