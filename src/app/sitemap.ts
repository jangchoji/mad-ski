import type { MetadataRoute } from "next";
import { getPublishedNoticeIds } from "@/lib/notices";
import { SITE, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const noticeIds = await getPublishedNoticeIds();
  // Omit lastModified until actual edit timestamps are available.
  return [
    ...["", "/about", "/director", "/gallery", "/notice", "/lessons/junior", "/pricing"].map((path) => ({
      url: `${SITE_URL}${path}`,
      images: path ? [SITE.image] : [SITE.image, SITE.logo],
    })),
    ...noticeIds.map((id) => ({ url: `${SITE_URL}/notice/${encodeURIComponent(id)}` })),
  ];
}
