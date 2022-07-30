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
import Script from "next/script";

const Home: NextPage = () => {
    return (
        <Layout>
            <Head>
                <title>{projectConfig.nftName}</title>
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

                <div className="py-8">
                    <Prose>
                        <Minting CollectionName={"Mocko Taco"} TokenSymbol={'TACO'}
                                 ContractAddress={"0x5c3ae745a6104e53248330c3281e47e7af772eee"} ABI={MOCKOTACO_ABI}
                                 CollectionImage={NCX_IMG}
                        />
                    </Prose>
                </div>

                <div className="py-8">
                    <Prose>
                        <MintFromContract ContractAddress={"0x5c3ae745a6104e53248330c3281e47e7af772eee"}/>
                    </Prose>
                </div>

                <div className="py-8 flex">

                    <div className="flex justify-center items-center">
                        <Image src={MOCKO_CHARACTER} alt={projectConfig.nftName}/>
                    </div>
                    <Prose>
                        <div className="flex justify-center items-center">
                            <h1>Save the Choco Taco!!</h1>
                            <p>Yes, we’ve heard the news! We’re devastated that the Choco Taco has been discontinued. But we’re fighters! We’re believers! It may be gone now, but we believe it’s not gone forever!

                            <br/>Let’s stand up for the nostalgic memories of our childhood. Let’s do something about the future frozen treats of our children. Let’s save the Choco Taco!</p>
                        </div>
                    </Prose>

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
            </div>
        </Layout>
    );
};

export default Home;
