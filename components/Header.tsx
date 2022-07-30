import dynamic from 'next/dynamic';
import Image from 'next/image';
import {FaTwitter, FaDiscord, FaShip, FaInfinity, FaEthereum} from 'react-icons/fa';

import ConnectButton from './ConnectButton';
import Container from './Container';
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
                <Container>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2"></div>
                        <div className="font-inter text-base text-dark_choco font-black">
                            <Link href={projectConfig.twitterUrl}
                                  rel="noopener noreferrer"
                                  target="_blank"
                            >TWITTER</Link>
                        </div>

                        <div className="font-inter text-base text-dark_choco font-black">
                            <Link href={projectConfig.openseaCollectionUrl}
                                  rel="noopener noreferrer"
                                  target="_blank"
                            >OPENSEA</Link>
                        </div>
                        <div className="font-inter text-base text-dark_choco font-black">
                            <Link href={projectConfig.scanUrl}
                                  rel="noopener noreferrer"
                                  target="_blank"
                            >ETHERSCAN</Link>
                        </div>
                        {/*<NextLink href="/" className="text-2xl font-bold text-white">*/}
                        {/*  <span className="flex items-center">*/}
                        {/*    <Image*/}
                        {/*      src={Logo}*/}
                        {/*      alt={projectConfig.nftName}*/}
                        {/*      width={35}*/}
                        {/*      height={35}*/}
                        {/*      className="rounded-full"*/}
                        {/*    />*/}
                        {/*    <span className="hidden sm:block ml-2">*/}
                        {/*      {projectConfig.nftName}*/}
                        {/*    </span>*/}
                        {/*  </span>*/}
                        {/*</NextLink>*/}

                        <div className="flex items-center space-x-2 ml-2 sm:ml-0">
                            {/*<ReactTooltip*/}
                            {/*  id="header"*/}
                            {/*  place="bottom"*/}
                            {/*  type="dark"*/}
                            {/*  effect="solid"*/}
                            {/*  textColor="#e2e8f0"*/}
                            {/*/>*/}
                            {/*<a*/}
                            {/*  href={projectConfig.scanUrl}*/}
                            {/*  aria-label={`${projectConfig.nftName} on Etherscan`}*/}
                            {/*  rel="noopener noreferrer"*/}
                            {/*  target="_blank"*/}
                            {/*  data-tip="Etherscan"*/}
                            {/*  data-for="header"*/}
                            {/*  className="bg-gray-700 hover:bg-gray-600 rounded-full p-2"*/}
                            {/*>*/}
                            {/*  <FaEthereum />*/}
                            {/*</a>*/}
                            {/*<a*/}
                            {/*  href={projectConfig.twitterUrl}*/}
                            {/*  aria-label={`${projectConfig.nftName} on Twitter`}*/}
                            {/*  rel="noopener noreferrer"*/}
                            {/*  target="_blank"*/}
                            {/*  data-tip="Twitter"*/}
                            {/*  data-for="header"*/}
                            {/*  className="bg-gray-700 hover:bg-gray-600 rounded-full p-2"*/}
                            {/*>*/}
                            {/*  <FaTwitter />*/}
                            {/*</a>*/}
                            {/*<a*/}
                            {/*  href={projectConfig.discordUrl}*/}
                            {/*  aria-label={`${projectConfig.nftName} on Discord`}*/}
                            {/*  rel="noopener noreferrer"*/}
                            {/*  target="_blank"*/}
                            {/*  data-tip="Discord"*/}
                            {/*  data-for="header"*/}
                            {/*  className="bg-gray-700 hover:bg-gray-600 rounded-full p-2"*/}
                            {/*>*/}
                            {/*  <FaDiscord />*/}
                            {/*</a>*/}
                            <ConnectButton/>

                        </div>
                    </div>
                </Container>
            </header>
        </div>
    );
}
