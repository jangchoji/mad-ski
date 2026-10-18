import type { Metadata } from "next";
import { SITE, SITE_URL } from "@/lib/site";

export function pageMetadata(path: string, title: string, description: string, image = SITE.ogImage): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const shareTitle = path === "/" ? SITE.title : `${title} | ${SITE.koreanName}`;
  return {
    title: { absolute: shareTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: SITE.koreanName,
      url,
      title: shareTitle,
      description,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [image],
    },
  };
}
