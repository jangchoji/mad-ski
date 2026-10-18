import type { ReactNode } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Contact } from "@/components/Contact";
import { MobileCta } from "@/components/MobileCta";
import { SITE, SITE_URL } from "@/lib/site";

export function LessonGuide({ path, title, description, children }: {
  path: string; title: string; description: string; children: ReactNode;
}) {
  const url = `${SITE_URL}${path}`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name: title, description, inLanguage: "ko-KR",
        breadcrumb: { "@id": `${url}#breadcrumb` }, about: { "@id": `${url}#service` } },
      { "@type": "Service", "@id": `${url}#service`, name: title, description, url,
        provider: { "@type": "SportsOrganization", name: SITE.name, url: SITE_URL, telephone: SITE.telephone },
        areaServed: { "@type": "Place", name: SITE.locationName } },
      { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: title, item: url },
      ] },
    ],
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
    <Navigation />
    <main className="flex-1 pt-20 md:pt-28">
      <header className="mx-auto max-w-7xl px-5 pt-8 md:px-6 md:pt-16">
        <nav aria-label="현재 위치" className="text-sm text-snow-muted"><Link href="/" className="underline underline-offset-4">홈</Link> / {title}</nav>
        <p className="mt-8 text-xs font-semibold tracking-widest text-neon-orange">26/27 SEASON · 비발디파크</p>
        <h1 className="mt-4 text-3xl font-black leading-tight text-snow md:text-5xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-snow-dim">{description}</p>
      </header>
      {children}
      <Contact />
    </main>
    <Footer /><MobileCta />
  </>;
}
