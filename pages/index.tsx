import type {NextPage} from 'next';
import Head from 'next/head';
import Image from 'next/image';

import Layout from '../components/Layout';
import Prose from '../components/Prose';
import Minting from '../components/Minting';
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
import Script from "next/script";

const Home: NextPage = () => {
    return (
        <Layout>

            {/*<Script strategy="lazyOnload"*/}
            {/*        src={`https://www.googletagmanager.com/gtag/js?id=G-TG3P8592B2`} />*/}
            {/*<Script id="google-analytics" strategy={"lazyOnload"}>*/}
            {/*    {`*/}
            {/*     <!-- Global site tag (gtag.js) - Google Analytics -->*/}
            {/*        window.dataLayer = window.dataLayer || [];*/}
            {/*        function gtag(){dataLayer.push(arguments);}*/}
            {/*        gtag('js', new Date());*/}
            {/*        gtag('config', 'G-TG3P8592B2', {*/}
            {/*        page_path: window.location.pathname,*/}
            {/*        });*/}
            {/*    `}*/}
            {/*</Script>*/}
            <Head>
                <title>{projectConfig.nftName}</title>
            </Head>

            <Image src={topImage} alt={projectConfig.nftName}/>

            <div className="bg-gray-800 py-8">
                <Prose>
                    <h1 className="text-5xl font-bold mb-2">{projectConfig.nftName}</h1>
                    <p className="text-xl">
                        This is a site where you can grab a bunch of &quot;NOT&quot; NFT collections.
                    </p>
                    <p><strong>All rights are reserved to the original creators. This is for testing only</strong></p>
                    <p><strong>You are limited to 5 NFTs from each collection</strong></p>
                </Prose>
            </div>

            <div className="py-8">
                <Prose>
                    <Minting CollectionName={"Mocko Taco"} TokenSymbol={'TACO'}
                             ContractAddress={"0x6Dd4F0cc3300681fA9A2AFE787Ed28df2Bfd1C3E"} ABI={MOCKOTACO_ABI}
                             CollectionImage={NCX_IMG}
                    />
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

            <div className="bg-gray-800 py-8">
                <Prose>
                    <Team/>
                </Prose>
            </div>
        </Layout>
    );
};

export default Home;
