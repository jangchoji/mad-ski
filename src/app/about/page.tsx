import { pageMetadata } from "@/lib/seo";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { MobileCta } from "@/components/MobileCta";
import { Navigation } from "@/components/Navigation";

export const metadata = pageMetadata("/about", "스키 강습 철학과 지도 방식", "MAD INTER SKI SCHOOL의 자세교정 중심 스키 강습 철학과 강습 방식을 소개합니다.");

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-14 md:pt-16">
        <About />
        <Contact />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
