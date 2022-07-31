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
            <header className="py-4 mx-auto w-max sm:max-w-screen-md">
                <div className="">
                    {/*<div className="flex justify-end pr-4">*/}
                    {/*    <ConnectButton/>*/}
                    {/*</div>*/}
                    <div className="flex items-center justify-between p-6 container mx-auto max-w-screen-md ">
                        <div className="w-3/5 mx-auto">
                            <Image src={MOCKO_LOGO_IMG} alt={projectConfig.nftName}/>
                        </div>

                    </div>
                </div>
                <Prose>
                    <div className="flex justify-center items-center space-x-20">
                        <div className="font-inter text-sm text-dark_choco font-black">
                            <a href={projectConfig.twitterUrl}
                                  rel="noopener noreferrer"
                                  target="_blank"
                            >TWITTER</a>
                        </div>

                        <div className="font-inter text-sm text-dark_choco font-black">
                            {/*<Link href={projectConfig.openseaCollectionUrl}*/}
                            {/*      rel="noopener noreferrer"*/}
                            {/*      target="_blank"*/}
                            {/*>OPENSEA</Link>*/}
                            <Link href=""
                                  rel="noopener noreferrer"
                                  target="_blank"
                            >OPENSEA (Soon)</Link>
                        </div>
                        <div className="font-inter text-sm text-dark_choco font-black">
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
