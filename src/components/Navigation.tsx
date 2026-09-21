import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

const NAV_ITEMS = [
  { href: "#about", label: "About" },
  { href: "#courses", label: "Curriculum" },
  { href: "#programs", label: "Programs" },
  { href: "#director", label: "Director" },
  { href: "#contact", label: "Contact" },
];

export function Navigation() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-midnight-border/60 bg-midnight/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 md:h-16 md:px-6">
        <Link href="/" aria-label="MAD INTER SKI SCHOOL 홈" className="block">
          <Image
            src="/images/logo.jpeg"
            alt="MAD INTER SKI SCHOOL"
            width={700}
            height={200}
            priority
            className="h-6 w-auto md:h-8"
          />
        </Link>
        <ul className="hidden items-center gap-10 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm font-medium text-snow-dim transition-colors hover:text-snow"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a
            href="tel:010-2007-2883"
            aria-label="전화 문의"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-midnight-border text-snow-dim transition hover:border-neon-orange/50 hover:text-neon-orange md:hidden"
          >
            <PhoneIcon />
          </a>
          <a
            href={SITE.reservationUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-neon rounded-full bg-midnight-elev px-4 py-2 text-[11px] font-semibold tracking-wider text-neon-orange md:px-5 md:text-xs"
          >
            예약하기
          </a>
        </div>
      </nav>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
