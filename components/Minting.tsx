import {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {IconContext} from 'react-icons';
import {FaMinusCircle, FaPlusCircle} from 'react-icons/fa';

import rpcConfig from '../config/rpcConfig';
import projectConfig from '../config/projectConfig';
import {useWallet} from "../context/AppContext";
import Image from "next/image";

interface Props {
    CollectionName: string,
    TokenSymbol: string,
    ContractAddress: string,
    ABI: any,
    CollectionImage: any,
}
export default function Minting(props:Props) {
    const {CollectionName, TokenSymbol, ContractAddress, ABI, CollectionImage} = props;
    const {
        web3Provider,
        ethersProvider,
        walletAddress,
        chainId,
        isConnected,
    } = useWallet()

    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [connErrMsg, setConnErrMsg] = useState('');
    const [totalSupply, setTotalSupply] = useState('?');
    const [maxSupply, setMaxSupply] = useState('?');
    const [isPending, setIsPending] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [mintAmount, setMintAmount] = useState(1);
    const [finalMintPrice, setMintPrice] = useState(0);
    const [priceName, setPriceName] = useState('');
    const [isMintActive, setMintActive] = useState(false);

    async function mintNFTs() {
        setErrorMessage('');
        setMessage('');
        console.debug('minting');
        console.debug(web3Provider);
        if (walletAddress && ethersProvider) {
            console.debug('minting 2');
            const totalMintCost = (finalMintPrice * mintAmount).toString();
            const totalWei = ethers.utils.parseEther(totalMintCost).toBigInt();
            setMessage('');
            setIsPending(true);
            try {
                const signer = ethersProvider?.getSigner();
                const contract = new ethers.Contract(
                    ContractAddress,
                    ABI,
                    signer
                );
                console.debug("the contract");
                console.debug(contract);
                const transaction = await contract.mintAllowlistTaco(mintAmount, {
                    value: totalWei,
                });

                setIsPending(false);
                setIsMinting(true);
                console.debug("the transaction");
                console.debug(transaction);
                await transaction.wait();

                setIsMinting(false);
                setMessage(
                    `Yay! ${mintAmount} ${
                        TokenSymbol
                    } successfully sent to ${walletAddress.substring(
                        0,
                        6
                    )}...${walletAddress.substring(walletAddress.length - 4)}`
                );
                setTotalSupply((await contract.totalSupply()).toString());

            } catch (error) {
                setIsPending(false);
                setErrorMessage("Something went wrong with the mint (could be over max mint)");
                console.error("I got an error!: " + error);
                console.debug(error);
            }
        }
    }

    function decrementMintAmount() {
        if (mintAmount > 1) {
            setMintAmount(mintAmount - 1);
        }
    }

    function incrementMintAmount() {
        if (mintAmount < projectConfig.maxMintAmountPerTxn) {
            setMintAmount(mintAmount + 1);
        }
    }

    useEffect(() => {
        if (!isConnected) {
            console.debug("We are not connected to wallet = showing that message");
            setConnErrMsg('Not connected to your wallet.');
        } else {
            console.debug(chainId + "   " + projectConfig.chainId);
            if (chainId !== projectConfig.chainId) {
                setConnErrMsg(`Change the network to ${projectConfig.networkName}.`);
            } else {
                setConnErrMsg('');
            }
        }
    }, [isConnected, chainId]);

    useEffect(() => {

    }, [finalMintPrice]);

    useEffect(() => {
        async function fetchTotalSupply() {
            if (!isConnected || chainId == 0 || walletAddress == "") {
                console.debug("Not ready 3")
            }
            const web3Provider = new ethers.providers.JsonRpcProvider(
                rpcConfig(process.env.NEXT_PUBLIC_INFURA_KEY)
            );
            const contract = new ethers.Contract(
                ContractAddress,
                ABI,
                web3Provider
            );
            console.debug('fetching supply');
            setMaxSupply(projectConfig.maxSupply.toString());
            setTotalSupply((await contract.totalSupply()).toString());
        }

        fetchTotalSupply();
        const interval = setInterval(() => fetchTotalSupply(), 300000)
        // cleanup
        return () => {
            setTotalSupply('?');
            clearInterval(interval);
        }
    }, [walletAddress, isConnected, chainId]);

    // useEffect(() => {
    //     async function fetchMintPrice() {
    //         if (!isConnected || chainId == 0 || walletAddress == "") {
    //             console.debug("Not ready 1");
    //             return;
    //         }
    //         if (walletAddress == null) {
    //             console.debug("no account yet: " + walletAddress);
    //             return;
    //         }
    //         console.debug('account: ' + walletAddress);
    //         const web3Provider = new ethers.providers.JsonRpcProvider(
    //             rpcConfig(process.env.NEXT_PUBLIC_INFURA_KEY)
    //         );
    //         const contract = new ethers.Contract(
    //             ContractAddress,
    //             ABI,
    //             web3Provider
    //         );
    //         let partnerEligible;
    //         // debugger;
    //         if(typeof contract.isEligiblePartnerMint === 'function') {
    //             partnerEligible = (await contract.isEligiblePartnerMint(walletAddress));
    //         } else {
    //             partnerEligible = false;
    //         }
    //         if (partnerEligible) {
    //             const mintPrice = Number(ethers.utils.formatEther(await contract.partnerMintPrice()));
    //             console.debug("Getting partner price " + mintPrice);
    //             setMintPrice(mintPrice);
    //             setPriceName("(Partner Price)");
    //         } else {
    //             const mintPrice = Number(ethers.utils.formatEther(await contract.mintPrice()));
    //             console.debug('Getting standard price ' + mintPrice);
    //             setMintPrice(mintPrice);
    //             setPriceName("");
    //         }
    //
    //     }
    //
    //     fetchMintPrice();
    //     // cleanup
    //     return () => setMintPrice(0);
    // }, [isConnected, walletAddress, chainId]);

    useEffect(() => {
        async function fetchMintStatus() {
            if (!isConnected || chainId == 0 || walletAddress == "") {
                console.debug("Not ready 2");
                return;
            }
            const web3Provider = new ethers.providers.JsonRpcProvider(
                rpcConfig(process.env.NEXT_PUBLIC_INFURA_KEY)
            );
            const contract = new ethers.Contract(
                ContractAddress,
                ABI,
                web3Provider
            );
            console.debug('fetching mint status');
            const mintActive = await contract.publicSaleActive();
            setMintActive(mintActive);
        }

        fetchMintStatus();
        if (!isConnected || chainId == 0 || walletAddress == "") {
            console.debug("Not ready 4");
            return;
        }
        const interval = setInterval(() => fetchMintStatus(), 600000)
        // cleanup
        return () => {
            setMintActive(false);
            clearInterval(interval);
        }
    }, [walletAddress, isConnected, chainId]);

    return (
        <>
        <h2 className="text-4xl mb-4">{CollectionName}</h2>
            <p>
        <a href={`https://kovan.etherscan.io/address/${ContractAddress}`} target="_blank" rel="noreferrer">Etherscan {ContractAddress}</a>
            </p>

            <div
                className="bg-gray-800 border border-t-red-300 border-r-blue-300 border-b-green-300 border-l-yellow-300 rounded p-8 space-y-4">
                <div className="m-auto text-center w-56">
                    {CollectionImage ? (<Image className="" src={CollectionImage} alt={CollectionName}/>):
                    <span className="text-xl">No image available</span>}
                </div>
                <div className="text-3xl font-bold text-center">
                    <span className="text-pink-500">{totalSupply}</span> /{' '}
                    {maxSupply}
                </div>

                <div className="text-center">
                    <p className="text-xl">
                        Total price: {finalMintPrice * mintAmount}{' '}
                        {projectConfig.chainName} {priceName}
                    </p>
                    <p className="text-gray-400">(excluding gas fees)</p>
                </div>

                <div className="flex justify-center items-center space-x-4">
                    <IconContext.Provider value={{size: '1.5em'}}>
                        <button
                            type="button"
                            className={mintAmount <= 1 ? 'text-gray-500 cursor-default' : ''}
                            onClick={decrementMintAmount}
                            disabled={false}
                        >
                            <FaMinusCircle/>
                        </button>
                        <span className="text-xl">{mintAmount}</span>
                        <button
                            type="button"
                            className={
                                mintAmount >= projectConfig.maxMintAmountPerTxn
                                    ? 'text-gray-500 cursor-default'
                                    : ''
                            }
                            onClick={incrementMintAmount}
                            disabled={false}
                        >
                            <FaPlusCircle/>
                        </button>
                    </IconContext.Provider>
                </div>

                <div className="flex justify-center">
                    {isConnected && !connErrMsg ? (
                        <>
                            {isPending || isMinting ? (
                                <button
                                    type="button"
                                    className="flex justify-center items-center rounded px-4 py-2 bg-red-700 font-bold w-40 cursor-not-allowed"
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
                                    {isPending && 'Pending'}
                                    {isMinting && 'Minting'}
                                    {!isPending && !isMinting && 'Processing'}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className={isMintActive ? `rounded px-4 py-2 bg-blue-700 hover:bg-blue-600 font-bold w-40` : `rounded px-4 py-2 bg-gray-700 font-bold w-40 cursor-not-allowed`}
                                    onClick={mintNFTs}
                                    disabled={!isMintActive}
                                >
                                    {isMintActive ? "Mint" : "Mint Not Active"}
                                </button>
                            )}
                        </>
                    ) : (
                        <button
                            type="button"
                            className={`rounded px-4 py-2 bg-gray-700 font-bold w-40 cursor-not-allowed`}
                            disabled={true}
                            onClick={mintNFTs}
                        >
                            Mint
                        </button>
                    )}
                </div>

                {message && <div className="text-green-500 text-center">{message}</div>}
                {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}
                {connErrMsg && (
                    <div className="text-red-500 text-center">{connErrMsg}</div>
                )}
            </div>

            <div className="text-gray-400 mt-2">
                Please make sure you are connected to the correct address and the
                correct network ({projectConfig.networkName}) before purchasing. The
                operation cannot be undone after purchase.
            </div>
        </>
    );
}
