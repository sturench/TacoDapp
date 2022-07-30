import Footer from './Footer';
import Header from './Header';
import Meta from './Meta';
import Image from "next/image";
import MOCKO_LOGO_IMG from "../public/assets/mockotaco_logo.png";
import projectConfig from "../config/projectConfig";

type Props = {
  children: React.ReactNode;
  pageTitle?: string;
};

export default function Layout({ children, pageTitle }: Props) {
  return (
    <>
      <Meta pageTitle={pageTitle} />
        <div className="flex items-center justify-between p-6 container mx-auto">
      <div className="w-380 mx-auto">
          <Image src={MOCKO_LOGO_IMG} alt={projectConfig.nftName}/>
      </div>
        </div>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
