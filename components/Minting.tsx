import {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {MerkleTree} from 'merkletreejs'
import {IconContext} from 'react-icons';
import {FaMinusCircle, FaPlusCircle} from 'react-icons/fa';

const keccak = require('keccak256')

import projectConfig from '../config/projectConfig';
import {useWallet} from "../context/AppContext";
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
    const {TokenSymbol, ContractAddress, ABI} = props;
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
    const [theContract, setTheContract] = useState<ethers.Contract>();

    async function mintNFTs() {
        setErrorMessage('');
        setMessage('');
        console.debug(web3Provider);
        if (walletAddress && ethersProvider && theContract) {
            const totalMintCost = (finalMintPrice * mintAmount).toString();
            const totalWei = ethers.utils.parseEther(totalMintCost).toBigInt();
            setMessage('');
            setIsPending(true);
            try {
                let transaction;
                if(projectConfig.allowlistMintActive) {
                    console.debug('minting an AL taco')
                    transaction = await theContract.mintAllowlistTaco(merkleProof);
                } else if (projectConfig.publicMintActive) {
                    console.debug('minting a public taco')
                    transaction = await theContract.mintPublicTaco(mintAmount, {
                        value: totalWei,
                    });
                } else {
                    setErrorMessage('Something has gone wrong. Err. 13');
                    return;
                }


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
                setTotalSupply((await theContract.totalSupply()).toString());

            } catch (error) {
                setIsPending(false);
                // @ts-ignore
                if(error.message.startsWith('cannot estimate') || error.message.length > 100) {
                    setErrorMessage("Something went wrong (Did you already mint?)");
                } else {
                    // @ts-ignore
                    setErrorMessage("Something went wrong.\n" + error.message);
                }
                console.error("I got an error!: " + error);
                // console.debug(error.message);
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
                const signer = ethersProvider?.getSigner();
                const contract = new ethers.Contract(
                    ContractAddress,
                    ABI,
                    signer
                );

                setTheContract(contract);

            }
        }
    }, [isConnected, chainId]);

    useEffect(() => {

    }, [finalMintPrice]);

    useEffect(() => {
        async function fetchTotalSupply() {
            if (!isConnected || chainId == 0 || walletAddress == "") {
                return
            } else if(theContract){

                console.debug('fetching supply');
                if (projectConfig.publicMintActive) {
                    setMintPrice(projectConfig.publicMintPrice)
                }
                setMaxSupply(projectConfig.maxSupply.toString());
                setTotalSupply((await theContract.totalSupply()).toString());
            }
        }

        fetchTotalSupply();
        // const interval = setInterval(() => fetchTotalSupply(), 300000)
        // cleanup
        return () => {
            setTotalSupply('?');
            // clearInterval(interval);
        }
    }, [walletAddress, isConnected, chainId, theContract]);

    useEffect(() => {
        async function fetchMintStatus() {
            if (!isConnected || chainId == 0 || walletAddress == "") {
                return;
            } else if(theContract) {
                console.debug('fetching mint status');
                let mintActive;
                if (projectConfig.allowlistMintActive) {
                    mintActive = await theContract.allowListSaleActive();
                } else if (projectConfig.publicMintActive) {
                    mintActive = await theContract.publicSaleActive();
                }
                setMintActive(mintActive);
            }
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
    }, [walletAddress, isConnected, chainId, theContract]);

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
            // console.log(walletAddress)
            const walletMerkleProof = merkleTree.getHexProof(keccak(walletAddress))
            // console.log(walletMerkleProof.toString())


            setMerkleProof(walletMerkleProof)
            setMerkleRoot(rootHash)
            const onList = merkleTree.verify(walletMerkleProof, keccak(walletAddress), rootHash)
            console.debug("On allowlist? ", onList)
            if(projectConfig.publicMintActive){
                setIsOnAllowlist(true)
            } else {
                setIsOnAllowlist(onList)
            }
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
            <div
                className="bg-stone-50 rounded-lg p-8 space-y-4">
                <h1 className="text-center">Minted Out</h1>
                <div className="text-4xl font-bold text-dark_choco text-center">
                    <span className="text-dark_choco">{totalSupply}</span> /{' '}
                    {maxSupply}
                </div>

                <div className="text-center">
                    <p className="text-xl text-dark_choco">
                        Total price: {finalMintPrice * mintAmount}{' '}
                        {projectConfig.chainName} {priceName} (+gas fees)
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
                                    className={isMintActive ? `rounded-lg px-4 py-2 bg-gray-300 hover:bg-dark_choco font-bold w-40 cursor-not-allowed` : `rounded-lg px-4 py-2 bg-gray-300 font-bold w-40 cursor-not-allowed`}
                                    onClick={mintNFTs}
                                    disabled={false}
                                >
                                    {isMintActive ? (isOnAllowList ? "Minted Out" : "Not on allowlist") : "Mint Not Active"}
                                </button>
                            )}
                        </>
                    ) : (
                        <button
                            type="button"
                            className={`rounded-lg px-4 py-2 bg-gray-300 font-bold w-40 cursor-not-allowed`}
                            disabled={true}
                            onClick={mintNFTs}
                        >
                            Mint
                        </button>
                    )}
                </div>

                {message && <div className="text-green-500 text-center">{message}</div>}
                {errorMessage && <div className="text-red-500 text-center whitespace-pre-line">{errorMessage}</div>}
                {connErrMsg && (
                    <div className="text-red-500 text-center">{connErrMsg}</div>
                )}
            </div>
        </>
    );
}
