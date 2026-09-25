import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Courses } from "@/components/Courses";
import { Director } from "@/components/Director";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { MobileCta } from "@/components/MobileCta";
import { Navigation } from "@/components/Navigation";
import { Programs } from "@/components/Programs";
import { SeoContent } from "@/components/SeoContent";
import { StructuredData } from "@/components/StructuredData";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <StructuredData />
      <Navigation />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <About />
        <Courses />
        <Programs />
        <Director />
        <Gallery />
        <SeoContent />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
