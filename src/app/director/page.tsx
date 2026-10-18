import { pageMetadata } from "@/lib/seo";
import { Contact } from "@/components/Contact";
import { Director } from "@/components/Director";
import { Footer } from "@/components/Footer";
import { MobileCta } from "@/components/MobileCta";
import { Navigation } from "@/components/Navigation";

export const metadata = pageMetadata("/director", "장우진 감독·코치진 소개", "MAD INTER SKI SCHOOL 장우진 감독과 코치진의 자격, 경력, 강습 방향을 소개합니다.");

export default function DirectorPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-14 md:pt-16">
        <Director asPage />
        <Contact />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
