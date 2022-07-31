import dynamic from 'next/dynamic';
import Image from 'next/image';

import ConnectButton from './ConnectButton';
import Prose from './Prose';
import projectConfig from '../config/projectConfig';
import Link from "next/link";
import MOCKO_LOGO_IMG from "../public/assets/mt.sitelogo.png";

const ReactTooltip = dynamic(() => import('react-tooltip'), {
    ssr: false,
});

export default function Header() {

    return (
        <div className="">
            <header className="py-4 mx-auto">
                <div className="container mx-auto">
                    {/*<div className="flex justify-end pr-4">*/}
                    {/*    <ConnectButton/>*/}
                    {/*</div>*/}
                    <div className="flex justify-center  w-full p-6 mx-auto">
                        <div className="w-3/5 mx-auto ">
                            <Image src={MOCKO_LOGO_IMG} alt={projectConfig.nftName}/>
                        </div>

                    </div>
                </div>
                <Prose>
                    <div className="flex justify-center text-center items-center sm:space-x-20 space-x-5">
                        <div className="font-inter text-sm text-dark_choco font-black w-full">
                            <a href={projectConfig.twitterUrl}
                                  rel="noopener noreferrer"
                                  target="_blank"
                            >TWITTER</a>
                        </div>

                        <div className="font-inter text-sm text-dark_choco font-black w-full">
                            {/*<Link href={projectConfig.openseaCollectionUrl}*/}
                            {/*      rel="noopener noreferrer"*/}
                            {/*      target="_blank"*/}
                            {/*>OPENSEA</Link>*/}
                            <Link href=""
                                  rel="noopener noreferrer"
                                  target="_blank"
                            >OPENSEA (Soon)</Link>
                        </div>
                        <div className="font-inter text-sm text-dark_choco font-black w-full">
                            <Link href=""
                                  rel="noopener noreferrer"
                                  target="_blank"
                            >ETHERSCAN (Soon)</Link>
                            {/*<a href={projectConfig.scanUrl}*/}
                            {/*      rel="noopener noreferrer"*/}
                            {/*      target="_blank"*/}
                            {/*>ETHERSCAN</a>*/}
                        </div>

                    </div>
                </Prose>
            </header>
        </div>
    );
}
