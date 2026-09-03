import type { Metadata } from "next";
import { Monoton } from "next/font/google";
import "./globals.css";

const monoton = Monoton({
  weight: "400",
  variable: "--font-monoton",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MAD _ INTER SKI | 비발디파크 매드인터스키스쿨",
  description:
    "Posture Correction · Director 장우진 · 비발디파크에서 만나는 프리미엄 스키 강습.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${monoton.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
