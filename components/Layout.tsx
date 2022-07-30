import Footer from './Footer';
import Header from './Header';
import Meta from './Meta';
import Image from "next/image";
import MOCKO_LOGO_IMG from "../public/assets/mt.sitelogo.png";
import projectConfig from "../config/projectConfig";
import Prose from "./Prose";

type Props = {
    children: React.ReactNode;
    pageTitle?: string;
};

export default function Layout({children, pageTitle}: Props) {
    return (
        <>
            <Meta pageTitle={pageTitle}/>

            <Header/>
            <main>{children}</main>
            <Footer/>
        </>
    );
}
