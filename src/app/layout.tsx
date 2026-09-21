import type { Metadata } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import { SITE, SITE_URL } from "@/lib/site";
import "./globals.css";

const archivo = Archivo_Black({
  weight: "400",
  variable: "--font-archivo-black",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE.name,
  title: {
    default: `${SITE.title} | 제대로 배우면, 스키가 달라집니다`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: SITE.keywords,
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE.name,
    title: `${SITE.title} | 제대로 배우면, 스키가 달라집니다`,
    description: SITE.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "비발디파크 스키 강습 MAD INTER SKI SCHOOL",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.title} | 제대로 배우면, 스키가 달라집니다`,
    description: SITE.description,
    images: ["/twitter-image"],
  },
  other: {
    thumbnail: SITE.ogImage,
    "og:image": SITE.ogImage,
    "og:image:secure_url": SITE.ogImage,
    "og:image:type": "image/png",
    "twitter:image": `${SITE_URL}/twitter-image`,
  },
  category: "sports education",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${archivo.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
