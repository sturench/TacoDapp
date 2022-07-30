import {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {IconContext} from 'react-icons';
import {FaMinusCircle, FaPlusCircle} from 'react-icons/fa';
import {MerkleTree} from 'merkletreejs'

const keccak = require('keccak256')

import rpcConfig from '../config/rpcConfig';
import projectConfig from '../config/projectConfig';
import {useWallet} from "../context/AppContext";
import Image from "next/image";
import allowlist from '../config/allowlist.json';

const {addresses} = allowlist

interface Props {
    CollectionName: string,
    TokenSymbol: string,
    ContractAddress: string,
    ABI: any,
    CollectionImage: any,
}

export default function Minting(props: Props) {
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
    const [isOnAllowList, setIsOnAllowlist] = useState(false);
    const [merkleProof, setMerkleProof] = useState<string[] | null>();
    const [merkleRoot, setMerkleRoot] = useState<Buffer | undefined>();

    async function mintNFTs() {
        setErrorMessage('');
        setMessage('');
        console.debug(web3Provider);
        if (walletAddress && ethersProvider) {
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
                const transaction = await contract.mintAllowlistTaco(mintAmount, merkleProof, {
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
        // const interval = setInterval(() => fetchTotalSupply(), 300000)
        // cleanup
        return () => {
            setTotalSupply('?');
            // clearInterval(interval);
        }
    }, [walletAddress, isConnected, chainId]);

    useEffect(() => {
        async function fetchMintStatus() {
            if (!isConnected || chainId == 0 || walletAddress == "") {
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
            const mintActive = await contract.allowListSaleActive();
            setMintActive(mintActive);
        }

        fetchMintStatus();
        if (!isConnected || chainId == 0 || walletAddress == "") {
            return;
        }
        const interval = setInterval(() => fetchMintStatus(), 600000)
        // cleanup
        return () => {
            setMintActive(false);
            clearInterval(interval);
        }
    }, [walletAddress, isConnected, chainId]);

    useEffect(() => {
        async function calculateMerkleProof() {
            if (!isConnected || chainId == 0 || walletAddress == "") {
                return;
            }

            const leafNodes = addresses.map(addr => keccak(addr));
            const merkleTree = new MerkleTree(leafNodes, keccak, {sortPairs: true})
            const rootHash = merkleTree.getRoot()
            const buf2hex = (x: Buffer) => '0x' + x.toString('hex')
            const root = buf2hex(rootHash)
            console.debug("Root Hash", root.toString())
            console.log(walletAddress)
            const walletMerkleProof = merkleTree.getHexProof(keccak(walletAddress))
            console.log(walletMerkleProof.toString())


            setMerkleProof(walletMerkleProof)
            setMerkleRoot(rootHash)
            const onList = merkleTree.verify(walletMerkleProof, keccak(walletAddress), rootHash)
            console.debug("On allowlist? ", onList)
            setIsOnAllowlist(onList)
        }

        calculateMerkleProof();
        if (!isConnected || chainId == 0 || walletAddress == "") {
            return;
        }
        // cleanup
        return () => {
            setMerkleProof(null);
        }
    }, [isConnected, chainId, walletAddress]);

    return (
        <>
            {/*<h2 className="text-4xl mb-4">{CollectionName}</h2>*/}
            {/*<p>*/}
            {/*    <a href={`https://kovan.etherscan.io/address/${ContractAddress}`} target="_blank"*/}
            {/*       rel="noreferrer">Etherscan {ContractAddress}</a>*/}
            {/*</p>*/}

            <div
                className="bg-stone-50 rounded-lg p-8 space-y-4">
                <h1 className="text-center">Mint your Mocko Taco!</h1>
                {/*<div className="m-auto text-center w-56">*/}
                {/*    {CollectionImage ? (<Image className="" src={CollectionImage} alt={CollectionName}/>) :*/}
                {/*        <span className="text-xl">No image available</span>}*/}
                {/*</div>*/}
                <div className="text-4xl font-bold text-dark_choco text-center">
                    <span className="text-dark_choco">{totalSupply}</span> /{' '}
                    {maxSupply}
                </div>

                <div className="text-center">
                    <p className="text-xl text-dark_choco">
                        Total price: {finalMintPrice * mintAmount}{' '}
                        {projectConfig.chainName} {priceName} (excluding gas fees)
                    </p>
                </div>

                {/*<div className="flex justify-center items-center space-x-4">*/}
                {/*    <IconContext.Provider value={{size: '1.5em'}}>*/}
                {/*        <button*/}
                {/*            type="button"*/}
                {/*            className={mintAmount <= 1 ? 'text-gray-500 cursor-default' : ''}*/}
                {/*            onClick={decrementMintAmount}*/}
                {/*            disabled={false}*/}
                {/*        >*/}
                {/*            <FaMinusCircle/>*/}
                {/*        </button>*/}
                {/*        <span className="text-xl">{mintAmount}</span>*/}
                {/*        <button*/}
                {/*            type="button"*/}
                {/*            className={*/}
                {/*                mintAmount >= projectConfig.maxMintAmountPerTxn*/}
                {/*                    ? 'text-gray-500 cursor-default'*/}
                {/*                    : ''*/}
                {/*            }*/}
                {/*            onClick={incrementMintAmount}*/}
                {/*            disabled={false}*/}
                {/*        >*/}
                {/*            <FaPlusCircle/>*/}
                {/*        </button>*/}
                {/*    </IconContext.Provider>*/}
                {/*</div>*/}

                <div className="flex justify-center text-white">
                    {isConnected && !connErrMsg ? (
                        <>
                            {isPending || isMinting ? (
                                <button
                                    type="button"
                                    className="flex justify-center items-center rounded px-4 py-2 bg-choco font-bold w-40 cursor-not-allowed"
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
                                    className={isMintActive ? `rounded-lg px-4 py-2 bg-choco hover:bg-dark_choco font-bold w-40` : `rounded-lg px-4 py-2 bg-choco font-bold w-40 cursor-not-allowed`}
                                    onClick={mintNFTs}
                                    disabled={!isMintActive}
                                >
                                    {isMintActive ? (isOnAllowList ? "Mint" : "Not on allowlist") : "Mint Not Active"}
                                </button>
                            )}
                        </>
                    ) : (
                        <button
                            type="button"
                            className={`rounded-lg px-4 py-2 bg-choco font-bold w-40 cursor-not-allowed`}
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

            {/*<div className="text-gray-400 mt-2">*/}
            {/*    Please make sure you are connected to the correct address and the*/}
            {/*    correct network ({projectConfig.networkName}) before purchasing. The*/}
            {/*    operation cannot be undone after purchase.*/}
            {/*</div>*/}
        </>
    );
}
