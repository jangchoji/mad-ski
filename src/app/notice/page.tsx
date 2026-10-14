import type { Metadata } from "next";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { MobileCta } from "@/components/MobileCta";
import { Navigation } from "@/components/Navigation";
import { Notices } from "@/components/Notices";

export const metadata: Metadata = {
  title: "Notice",
  description:
    "MAD INTER SKI SCHOOL의 시즌 운영 안내와 비발디파크 스키 강습 공지사항입니다.",
};

export const dynamic = "force-dynamic";

export default function NoticePage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-14 md:pt-16">
        <Notices />
        <Contact />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
