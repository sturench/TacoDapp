import type {NextPage} from 'next';
import Head from 'next/head';
import Image from 'next/image';

import Layout from '../components/Layout';
import Prose from '../components/Prose';
import Minting from '../components/Minting';
import MintFromContract from '../components/MintFromContract';
import Faq from '../components/Faq';
import Roadmap from '../components/Roadmap';
import Team from '../components/Team';
import projectConfig from '../config/projectConfig';
import topImage from '../public/assets/facucet-header.png';
// import CLONEX_ABI from '../config/notclonexABI.json';
import MOCKOTACO_ABI from '../config/MockoTacoABI.json';
// import COOLCATS_ABI from '../config/coolcatsABI.json';
// import NOTDOODLES_ABI from '../config/notdoodlesABI.json';
// import NOTMOONBIRDS_ABI from '../config/notmoonbirdsABI.json';
// import NOTMFERS_ABI from '../config/notmfersABI.json';
// import NOTBEEBIT_ABI from '../config/meetbitsABI.json';
// import NCOOL_IMG from '../public/assets/NCOOL.png';
import NCX_IMG from '../public/assets/NCX.webp';
// import NDOOD_IMG from '../public/assets/NDOOD.png';
// import NMB_IMG from '../public/assets/NMB.png';
// import NMFER_IMG from '../public/assets/NMFER.png';
// import NMEEBIT_IMG from '../public/assets/NMEEBIT.png';
import MOCKO_LOGO_IMG from '../public/assets/mockotaco_logo.png';
import MOCKO_CHARACTER from '../public/assets/bottom_character.png';
import SAVE_MOCKO from '../public/assets/mt 1.png';
import Script from "next/script";

const Home: NextPage = () => {
    return (
        <Layout>
            <Head>
                <title>{projectConfig.nftName}</title>
                <link rel="stylesheet" href="https://use.typekit.net/bmy6hpx.css"/>
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css"/>
            </Head>
            <div className="">
                {/*<div className="flex py-8">*/}
                {/*    <div className="flex-initial w-380 mx-auto">*/}
                {/*    <Image src={MOCKO_LOGO_IMG} alt={projectConfig.nftName}/>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="py-8">*/}
                {/*    <Prose>*/}
                {/*        <h1 className="text-5xl font-bold mb-2">{projectConfig.nftName}</h1>*/}
                {/*        <p className="text-xl">*/}
                {/*            This is a site where you can grab a bunch of &quot;NOT&quot; NFT collections.*/}
                {/*        </p>*/}
                {/*        <p><strong>All rights are reserved to the original creators. This is for testing only</strong>*/}
                {/*        </p>*/}
                {/*        <p><strong>You are limited to 5 NFTs from each collection</strong></p>*/}
                {/*    </Prose>*/}
                {/*</div>*/}
                <Prose>
                    <div className="wrap mx-auto pt-8">
                        <div className="grid grid-cols-12">
                            <div className="bg-white row-span-full col-start-1 col-span-7 self-center p-4">
                                <h1>The Mocko Taco NFT Mint for the Greater Good</h1>
                                <ul className="list-disc ml-6 font-semibold py-2">
                                    <li>4005 randomly generated Mocko Tacos</li>
                                    <li>1 free Mocko Taco + gas mint per wallet</li>
                                    <li>Reserving 100 Mocko Tacos for Creators</li>
                                    <li>No roadmap. No utility. No Discord. CC0.</li>
                                    <li>You can checkout the contract for yourself.</li>
                                    <li>#SavetheChocoTaco</li>
                                </ul>
                            </div>
                            <div className="row-span-full col-span-6 col-end-13 self-center -z-20">
                                <Image src={SAVE_MOCKO}
                                       alt="Save Mocko Taco"/>
                            </div>
                        </div>
                    </div>

                </Prose>

                <Prose>
                    <div className="py-8">
                        <Minting CollectionName={"Mocko Taco"} TokenSymbol={'TACO'}
                                 ContractAddress={"0x5c3ae745a6104e53248330c3281e47e7af772eee"} ABI={MOCKOTACO_ABI}
                                 CollectionImage={NCX_IMG}
                        />
                    </div>

                    <div className="py-8">
                        <MintFromContract ContractAddress={"0x5c3ae745a6104e53248330c3281e47e7af772eee"}/>
                    </div>

                    <div className="py-8 flex justify-center items-center">

                        <div className="flex-initial w-1/3 px-2">
                            <Image src={MOCKO_CHARACTER} alt={projectConfig.nftName}/>
                        </div>
                        <div className="flex-col justify-center items-center w-2/3 px-2">
                            <h1 className="">Save the Choco Taco!!</h1>
                            <div className="text-xl">
                                <p className="py-2">Yes, we’ve heard the news! We’re devastated that the Choco Taco
                                    has been discontinued. But we’re fighters! We’re believers! It may be gone now, but
                                    we believe it’s not gone forever!</p>

                                <p className="py-2">Let’s stand up for the nostalgic memories of our childhood. Let’s do
                                    something about
                                    the future frozen treats of our children. Let’s save the Choco Taco!</p>
                            </div>
                        </div>

                    </div>

                    {/*<div className="bg-gray-800 py-8">*/}
                    {/*    <Prose>*/}
                    {/*        <Faq/>*/}
                    {/*    </Prose>*/}
                    {/*</div>*/}

                    {/*<div className="py-8">*/}
                    {/*    <Prose>*/}
                    {/*        <Roadmap/>*/}
                    {/*    </Prose>*/}
                    {/*</div>*/}

                    {/*<div className="bg-gray-800 py-8">*/}
                    {/*    <Prose>*/}
                    {/*        <Team/>*/}
                    {/*    </Prose>*/}
                    {/*</div>*/}
                </Prose>
            </div>
        </Layout>
    );
};

export default Home;
