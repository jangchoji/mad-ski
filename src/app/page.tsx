import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Courses } from "@/components/Courses";
import { Director } from "@/components/Director";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { MobileCta } from "@/components/MobileCta";
import { Navigation } from "@/components/Navigation";
import { Programs } from "@/components/Programs";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <About />
        <Courses />
        <Programs />
        <Director />
        <Contact />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
