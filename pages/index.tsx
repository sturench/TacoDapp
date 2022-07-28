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
import CLONEX_ABI from '../config/notclonexABI.json';
import COOLCATS_ABI from '../config/coolcatsABI.json';
import NOTDOODLES_ABI from '../config/notdoodlesABI.json';
import NOTMOONBIRDS_ABI from '../config/notmoonbirdsABI.json';
import NOTMFERS_ABI from '../config/notmfersABI.json';
import NOTBEEBIT_ABI from '../config/meetbitsABI.json';
import NCOOL_IMG from '../public/assets/NCOOL.png';
import NCX_IMG from '../public/assets/NCX.webp';
import NDOOD_IMG from '../public/assets/NDOOD.png';
import NMB_IMG from '../public/assets/NMB.png';
import NMFER_IMG from '../public/assets/NMFER.png';
import NMEEBIT_IMG from '../public/assets/NMEEBIT.png';
import Script from "next/script";

const Home: NextPage = () => {
    return (
        <Layout>

            <Script strategy="lazyOnload"
                    src={`https://www.googletagmanager.com/gtag/js?id=G-TG3P8592B2`} />
            <Script id="google-analytics" strategy={"lazyOnload"}>
                {`
                 <!-- Global site tag (gtag.js) - Google Analytics -->
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-TG3P8592B2', {
                    page_path: window.location.pathname,
                    });
                `}
            </Script>
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
                    <Minting CollectionName={"Not CloneX"} TokenSymbol={'NCX'}
                             ContractAddress={"0x55f6463854bf37f8B99B5409CA039137138d27F6"} ABI={CLONEX_ABI}
                             CollectionImage={NCX_IMG}
                    />
                </Prose>
            </div>
            <div className="py-8">
                <Prose>
                    <Minting CollectionName={"Not Cool Cats"} TokenSymbol={'NCOOL'}
                             ContractAddress={"0x45EC72F863bd52a6B9f1a81Cefe1031fe77cBDBE"} ABI={COOLCATS_ABI}
                             CollectionImage={NCOOL_IMG}/>
                </Prose>
            </div>
            <div className="py-8">
                <Prose>
                    <Minting CollectionName={"Not Doodles"} TokenSymbol={'NDOOD'}
                             ContractAddress={"0x2E5F0B3551917B3E2d7BC4062Edc2f05B2EE009d"} ABI={NOTDOODLES_ABI}
                             CollectionImage={NDOOD_IMG}/>
                </Prose>
            </div>

            <div className="py-8">
                <Prose>
                    <Minting CollectionName={"Not Moonbirds"} TokenSymbol={'NMB'}
                             ContractAddress={"0x1691E53184478f9b90F5E2E08bCbF49D1751EF31"} ABI={NOTMOONBIRDS_ABI}
                             CollectionImage={NMB_IMG}/>
                </Prose>
            </div>

            <div className="py-8">
                <Prose>
                    <Minting CollectionName={"Not mfers"} TokenSymbol={'NMFER'}
                             ContractAddress={"0x4f36f655700D1d54B20f8370E0eDBd710460C510"} ABI={NOTMFERS_ABI}
                             CollectionImage={NMFER_IMG}/>
                </Prose>
            </div>
            <div className="py-8">
                <Prose>
                    <Minting CollectionName={"Not Meebits"} TokenSymbol={'NMEBT'}
                             ContractAddress={"0xB6c0d095b9B772C0601faAE65F7e290E5e42CB70"} ABI={NOTBEEBIT_ABI}
                             CollectionImage={NMEEBIT_IMG}/>
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
