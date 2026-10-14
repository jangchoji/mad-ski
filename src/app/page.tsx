import { AboutSummary } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Courses } from "@/components/Courses";
import { Director } from "@/components/Director";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { GallerySummary } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { MobileCta } from "@/components/MobileCta";
import { Navigation } from "@/components/Navigation";
import { NoticesSummary } from "@/components/Notices";
import { PopupAdModal } from "@/components/PopupAdModal";
import { Programs } from "@/components/Programs";
import { Reviews } from "@/components/Reviews";
import { SeoContent } from "@/components/SeoContent";
import { StructuredData } from "@/components/StructuredData";
import { getActivePopupAd } from "@/lib/popup-ads";

export const dynamic = "force-dynamic";

export default async function Home() {
  const popupAd = await getActivePopupAd();

  return (
    <>
      <StructuredData />
      <Navigation />
      <PopupAdModal popupAd={popupAd} />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <AboutSummary />
        <Courses />
        <Programs />
        <Director />
        <Reviews />
        <GallerySummary />
        <SeoContent />
        <Faq />
        <Contact />
        <NoticesSummary />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
