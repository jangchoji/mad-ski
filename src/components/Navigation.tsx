import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/#about", label: "About", mobileLabel: "소개" },
  { href: "/#courses", label: "Curriculum", mobileLabel: "과정" },
  { href: "/#reviews", label: "Reviews", mobileLabel: "후기" },
  { href: "/#contact", label: "Contact", mobileLabel: "문의" },
];

export function Navigation() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-midnight-border/60 bg-midnight/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-3 px-4 md:h-16 md:px-6">
        <Link
          href="/"
          aria-label="MAD INTER SKI SCHOOL 홈"
          className="block shrink-0"
        >
          <Image
            src="/images/logo.jpeg"
            alt="MAD INTER SKI SCHOOL"
            width={700}
            height={200}
            priority
            className="h-4 w-auto sm:h-5 md:h-8"
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

        <ul className="flex min-w-0 items-center justify-end text-[10px] font-semibold text-snow-dim sm:text-[11px] md:hidden">
          {NAV_ITEMS.map((item, index) => (
            <li key={item.href} className="flex shrink-0 items-center">
              <Link
                href={item.href}
                className="px-1.5 transition hover:text-neon-orange sm:px-2"
              >
                {item.mobileLabel}
              </Link>
              {index < NAV_ITEMS.length - 1 ? (
                <span className="text-snow-muted/60" aria-hidden>
                  |
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
