import { pageMetadata } from "@/lib/seo";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { MobileCta } from "@/components/MobileCta";
import { Navigation } from "@/components/Navigation";

export const metadata = pageMetadata("/gallery", "비발디파크 스키 강습 사진", "MAD INTER SKI SCHOOL의 비발디파크 스키 강습과 라이딩 현장 사진입니다.");

export const dynamic = "force-dynamic";

export default function GalleryPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-14 md:pt-16">
        <header className="mx-auto max-w-7xl px-5 pt-12 md:px-6 md:pt-20">
          <h1 className="text-3xl font-black text-snow md:text-5xl">비발디파크 스키 강습 사진</h1>
        </header>
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
