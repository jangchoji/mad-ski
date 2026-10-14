import type { Metadata } from "next";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { MobileCta } from "@/components/MobileCta";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "MAD INTER SKI SCHOOL의 비발디파크 스키 강습과 라이딩 현장 사진입니다.",
};

export const dynamic = "force-dynamic";

export default function GalleryPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-14 md:pt-16">
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
