import type { Metadata } from "next";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { MobileCta } from "@/components/MobileCta";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "ABOUT",
  description:
    "MAD INTER SKI SCHOOL의 자세교정 중심 스키 강습 철학과 강습 방식을 소개합니다.",
};

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
