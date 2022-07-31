import {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {MerkleTree} from 'merkletreejs'

const keccak = require('keccak256')

import allowlist from '../config/allowlist.json';
import projectConfig from "../config/projectConfig";

const {addresses} = allowlist

interface Props {
    ContractAddress: string,
}

export default function MintFromContract(props: Props) {
    const {ContractAddress} = props;

    const [message, setMessage] = useState('');
    const [merkleProof, setMerkleProof] = useState<string>("");

    const [walletAddress, setWalletAddress] = useState<string | undefined>("")
    const [walletAddressField, setWalletAddressField] = useState<string | undefined>("")

    useEffect(() => {
        async function checkWalletAddress() {
            if (!walletAddressField) {
                return;
            }
            const isValidAddress = ethers.utils.isAddress(walletAddressField)
            console.debug(`${walletAddressField} is valid? ${isValidAddress}`)
            if (isValidAddress) {
                setWalletAddress(walletAddressField)
            } else {
                setMerkleProof("")
            }
        }

        checkWalletAddress();
        if (!walletAddressField) {
            return;
        }
        // cleanup
        return () => {
            setWalletAddress("");
        }
    }, [walletAddressField]);

    useEffect(() => {
        async function calculateMerkleProof() {
            if (walletAddress == "") {
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


            setMerkleProof(walletMerkleProof.toString())
            const onList = merkleTree.verify(walletMerkleProof, keccak(walletAddress), rootHash)
            console.debug("pasted On allowlist? ", onList)
            console.debug(merkleProof.toString().length)
        }

        calculateMerkleProof();
        if (walletAddress == "") {
            return;
        }
        // cleanup
        return () => {
            setMerkleProof("");
        }
    }, [walletAddress]);

    const onChange = (event: { target: { value: string; }; }) => {
        const newAddress: string = event.target.value;
        setWalletAddressField(newAddress);
    }

    const copyMerkle = () => {
        navigator.clipboard.writeText(merkleProof ? merkleProof : "")
        setMessage("Copied!")
        setTimeout(() => {
            setMessage("");
        }, 1000)
    }

    return (
        <>
            <div className="bg-choco rounded-lg p-8 space-y-4">
                <h1 className="text-white text-center">
                    Would you rather mint <br/>from the <a
                    href={projectConfig.scanUrl}
                    target="_blank"
                    rel="noreferrer">contract</a>?
                </h1>
                <div className="flex justify-center items-center">
                    <input placeholder="Your 0x Wallet Address" value={walletAddressField}
                           onChange={onChange}
                           className="flex justify-center items-center rounded w-80 text-choco text-xs p-2 placeholder:text-choco placeholder:text-center placeholder:opacity-60"
                    />
                </div>
                <div className="flex justify-center text-white">
                    {merkleProof.length == 0 ? (
                        <>
                            <button
                                type="button"
                                className="flex justify-center items-center rounded px-4 py-2 bg-gray-300  font-bold cursor-not-allowed"
                                onClick={copyMerkle}
                                disabled={true}
                            >
                                Enter Your Address
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="flex justify-center items-center rounded px-4 py-2 bg-white hover:bg-gray-300 active:bg-choco font-bold text-choco"
                                onClick={copyMerkle}
                                disabled={false}
                            >
                                Copy Merkle Proof
                            </button>

                        </>
                    )
                    }
                    <div className="flex justify-end items-center text-white">{message}</div>
                </div>
                <div className="flex justify-center items-center ">
                    <div className="text-center text-white w-3/5 text-sm">Head over to <a href={projectConfig.scanUrl} target="_blank" rel="noreferrer">Etherscan</a> ({projectConfig.contractAddress}) and look for the <span
                        className="font-extrabold">mintAllowlistTaco</span> function. Paste the value in <span
                        className="font-extrabold">_merkleProof</span> field and you are good to go!
                    </div>
                </div>
            </div>
        </>
    );
}
