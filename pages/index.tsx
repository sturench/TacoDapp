import type {NextPage} from 'next';
import Head from 'next/head';
import Image from 'next/image';

import Layout from '../components/Layout';
import Prose from '../components/Prose';
import Minting from '../components/Minting';
import MintFromContract from '../components/MintFromContract';
import projectConfig from '../config/projectConfig';
import MOCKOTACO_ABI from '../config/MockoTacoABI.json';
import NCX_IMG from '../public/assets/NCX.webp';
import MOCKO_CHARACTER from '../public/assets/mt.site.2.png';
import SAVE_MOCKO from '../public/assets/mt.site.1.jpg';

const Home: NextPage = () => {
    return (
        <Layout>
            <Head>
                <title>{projectConfig.nftName}</title>
                <link rel="stylesheet" href="https://use.typekit.net/bmy6hpx.css"/>
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css"/>
            </Head>
            <div className="">
                <Prose>
                    <div className="wrap mx-auto pt-8">
                        <div className="sm:grid sm:grid-cols-12">
                            <div className="sm:row-span-full sm:col-span-6 sm:col-end-13 self-center -z-20 sm:w-auto w-2/3 mx-auto">
                                <Image src={SAVE_MOCKO}
                                       alt="Save Mocko Taco"/>
                            </div>
                            <div className="bg-white sm:row-span-full sm:col-start-1 sm:col-span-7 self-center p-10 min-w-content sm:w-auto w-5/6 mx-auto">
                                <h1 className="">The Mocko Taco NFT Mint for the Greater Good</h1>
                                <ul className="list-disc ml-6 font-semibold py-3 sm:text-sm text-xs">
                                    <li className="pb-1">Minting August 8th</li>
                                    <li className="pb-1">4005 randomly generated Mocko Tacos</li>
                                    <li className="pb-1">1 free Mocko Taco + gas mint per wallet</li>
                                    <li className="pb-1">Reserving 100 Mocko Tacos for Creators</li>
                                    <li className="pb-1">No roadmap. No utility. No Discord. CC0.</li>
                                    {/*<li className="pb-1">You can check out the contract for yourself.</li>*/}
                                    <li className="pb-1">#SavetheChocoTaco</li>
                                </ul>
                            </div>

                        </div>
                    </div>

                </Prose>

                <Prose>
                    {projectConfig.allowlistMintActive || projectConfig.publicMintActive ? (
                        <>
                    <div className="py-8">
                        <Minting CollectionName={"Mocko Taco"} TokenSymbol={'TACO'}
                                 ContractAddress={projectConfig.contractAddress} ABI={MOCKOTACO_ABI}
                                 CollectionImage={NCX_IMG}
                        />
                    </div>

                    <div className="py-8">
                        <MintFromContract/>
                    </div> </>) : ( <></>)}

                    <div className="py-8 flex sm:flex-row flex-col justify-center items-center">

                        <div className="flex-initial sm:w-2/5 w-3/5 pr-8">
                            <Image src={MOCKO_CHARACTER} alt={projectConfig.nftName}/>
                        </div>
                        <div className="flex-col justify-center items-center sm:w-3/5 w-4/5 px-2">
                            <h1 className="text-center">Save the Choco Taco!!</h1>
                            <div className="sm:text-sm text-xs">
                                <p className="py-2">Yes, we’ve heard the news! We’re devastated that the Choco Taco
                                    has been discontinued. But we’re fighters! We’re believers! It may be gone now, but
                                    we believe it’s not gone forever!</p>

                                <p className="py-2">Let’s stand up for the nostalgic memories of our childhood. Let’s do
                                    something about
                                    the future frozen treats of our children. Let’s save the Choco Taco!</p>
                            </div>
                        </div>

                    </div>
                </Prose>
            </div>
        </Layout>
    );
};

export default Home;
