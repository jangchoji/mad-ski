import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { MobileCta } from "@/components/MobileCta";
import { Navigation } from "@/components/Navigation";
import { NoticeDetail } from "@/components/Notices";
import { getPublishedNoticeById } from "@/lib/notices";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/notice/[id]">): Promise<Metadata> {
  const { id } = await params;
  const notice = await getPublishedNoticeById(id);

  if (!notice) {
    return {
      title: "공지사항",
    };
  }

  const description = notice.content.replace(/\s+/g, " ").slice(0, 120);

  return pageMetadata(`/notice/${encodeURIComponent(id)}`, notice.title, description, notice.imageUrl ?? undefined);
}

export default async function NoticeDetailPage({
  params,
}: PageProps<"/notice/[id]">) {
  const { id } = await params;
  const notice = await getPublishedNoticeById(id);

  if (!notice) {
    notFound();
  }

  return (
    <>
      <Navigation />
      <main className="flex-1 pt-14 md:pt-16">
        <NoticeDetail id={id} />
        <Contact />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
