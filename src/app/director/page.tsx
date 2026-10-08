import type { Metadata } from "next";
import { Contact } from "@/components/Contact";
import { Director } from "@/components/Director";
import { Footer } from "@/components/Footer";
import { MobileCta } from "@/components/MobileCta";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Director",
  description:
    "MAD INTER SKI SCHOOL 장우진 감독과 코치진의 자격, 경력, 강습 방향을 소개합니다.",
};

export default function DirectorPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-14 md:pt-16">
        <Director />
        <Contact />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
