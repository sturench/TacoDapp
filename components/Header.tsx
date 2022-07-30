import dynamic from 'next/dynamic';
import Image from 'next/image';
import {FaTwitter, FaDiscord, FaShip, FaInfinity, FaEthereum} from 'react-icons/fa';

import ConnectButton from './ConnectButton';
import Container from './Container';
import Prose from './Prose';
import NextLink from './NextLink';
import projectConfig from '../config/projectConfig';
import Logo from '../public/assets/logo.png';
import Link from "next/link";

const ReactTooltip = dynamic(() => import('react-tooltip'), {
    ssr: false,
});

export default function Header() {

    return (
        <div className="">
            <header className="py-2">
                <Prose>
                    <div className="grid grid-cols-3  items-center border">
                        <div className="col-start-2 flex items-center w-3/5 border">
                            <div className="font-inter text-sm text-dark_choco font-black pr-10">
                                <Link href={projectConfig.twitterUrl}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                >TWITTER</Link>
                            </div>

                            <div className="font-inter text-sm text-dark_choco font-black">
                                <Link href={projectConfig.openseaCollectionUrl}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                >OPENSEA</Link>
                            </div>
                            <div className="font-inter text-sm text-dark_choco font-black pl-10">
                                <Link href={projectConfig.scanUrl}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                >ETHERSCAN</Link>
                            </div>
                        </div>
                        <div className="col-start-3 justify-self-end w-1/5">
                            <div className="flex items-center space-x-2 ml-2 sm:ml-0">
                                <ConnectButton/>
                            </div>
                        </div>
                    </div>
                </Prose>
            </header>
        </div>
    );
}
