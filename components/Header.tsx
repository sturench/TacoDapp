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
import MOCKO_LOGO_IMG from "../public/assets/mt.sitelogo.png";

const ReactTooltip = dynamic(() => import('react-tooltip'), {
    ssr: false,
});

export default function Header() {

    return (
        <div className="">
            <header className="py-4 mx-auto w-max">
                <div className="">
                    <div className="flex justify-end">
                        <ConnectButton/>
                    </div>
                    <div className="flex items-center justify-between p-6 container mx-auto">
                        <div className="px-20 mx-auto">
                            <Image src={MOCKO_LOGO_IMG} alt={projectConfig.nftName}/>
                        </div>

                    </div>
                </div>
                <Prose>
                    <div className="flex justify-center items-center space-x-20">
                        <div className="font-inter text-sm text-dark_choco font-black">
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
                        <div className="font-inter text-sm text-dark_choco font-black">
                            <Link href={projectConfig.scanUrl}
                                  rel="noopener noreferrer"
                                  target="_blank"
                            >ETHERSCAN</Link>
                        </div>

                    </div>
                </Prose>
            </header>
        </div>
    );
}
