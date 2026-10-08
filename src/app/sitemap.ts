import type { MetadataRoute } from "next";
import { SITE, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [SITE.image, SITE.logo, SITE.ogImage],
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      images: [SITE.image, SITE.logo],
    },
    {
      url: `${SITE_URL}/director`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      images: [SITE.image, SITE.logo],
    },
  ];
}
