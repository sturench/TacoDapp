import dynamic from 'next/dynamic';
import {
    FaHome,
    FaTwitter,
    FaDiscord,
    FaShip,
    FaInfinity, FaEthereum,
} from 'react-icons/fa';

import Container from './Container';
import projectConfig from '../config/projectConfig';

const ReactTooltip = dynamic(() => import('react-tooltip'), {
    ssr: false,
});

const getCurrentYear = () => new Date().getFullYear();

export default function Footer() {
    return (
        <footer className="">
            <Container>
                <div className="flex justify-center items-center space-x-2 mb-1 sm:mb-0">
                    <ReactTooltip
                        id="footer"
                        place="top"
                        type="dark"
                        effect="solid"
                        textColor="#e2e8f0"
                    />
                    <a
                        href={projectConfig.scanUrl}
                        aria-label={`${projectConfig.nftName} on Etherscan`}
                        rel="noopener noreferrer"
                        target="_blank"
                        data-tip="Etherscan"
                        data-for="footer"
                        className="bg-dark_choco hover:bg-choco text-taco_2 rounded-full p-2"
                    >
                        <FaEthereum/>
                    </a>
                    <a
                        href={projectConfig.twitterUrl}
                        aria-label={`${projectConfig.nftName} on Twitter`}
                        rel="noopener noreferrer"
                        target="_blank"
                        data-tip="Twitter"
                        data-for="footer"
                        className="bg-dark_choco hover:bg-choco text-taco_2 rounded-full p-2"
                    >
                        <FaTwitter/>
                    </a>
                    <a
                        href={projectConfig.openseaCollectionUrl}
                        aria-label={`${projectConfig.nftName} on OpenSea`}
                        rel="noopener noreferrer"
                        target="_blank"
                        data-tip="OpenSea"
                        data-for="footer"
                        className="bg-dark_choco hover:bg-choco text-taco_2 rounded-full p-2"
                    >
                        <FaShip/>
                    </a>
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-center items-center py-4 text-sm">
                    <div>
                        © {getCurrentYear()} MockoTaco | A project by *redacted.*
                    </div>
                </div>
            </Container>
        </footer>
    );
}
