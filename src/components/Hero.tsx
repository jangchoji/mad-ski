import Link from "next/link";
import { SnowField } from "./SnowField";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pt-24 pb-16 md:min-h-screen md:pt-32 md:pb-24">
      <div className="absolute inset-0 slope-grid opacity-70" />
      <div className="absolute inset-0 hero-glow" />
      <div className="absolute inset-0 scanlines" />
      <SnowField />
      <SlopeLines />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-midnight-border bg-midnight-elev/60 px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-snow-dim backdrop-blur md:mb-8 md:px-4 md:py-1.5 md:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-neon-orange shadow-[0_0_10px_#ff3d00,0_0_20px_rgba(255,61,0,0.6)]" />
          VIVALDI PARK · 25 / 26
        </span>

        <h1
          className="font-display leading-[0.88] tracking-[0.04em]"
          aria-label="MAD _ INTER SKI"
        >
          {/* Mobile: 3-line stack */}
          <span className="flex flex-col items-center gap-1 md:hidden">
            <span className="text-[clamp(4.5rem,22vw,7rem)]">
              <span className="neon-orange neon-flicker">MAD</span>
            </span>
            <span className="text-[clamp(4.5rem,22vw,7rem)]">
              <span className="neon-amber">INTER</span>
            </span>
            <span className="text-[clamp(4.5rem,22vw,7rem)]">
              <span className="neon-orange">SKI</span>
            </span>
          </span>
          {/* Desktop: 2-line with underscore */}
          <span className="hidden md:block">
            <span className="block text-[10vw] leading-[0.9] lg:text-[9rem]">
              <span className="neon-orange neon-flicker">MAD</span>
              <span className="mx-2 text-snow-muted">_</span>
              <span className="neon-amber">INTER</span>
            </span>
            <span className="mt-1 block text-[10vw] lg:text-[9rem]">
              <span className="neon-orange">SKI</span>
            </span>
          </span>
        </h1>

        <p className="mt-6 text-[11px] font-medium tracking-[0.4em] text-snow-dim md:mt-8 md:text-sm md:tracking-[0.5em]">
          POSTURE&nbsp;·&nbsp;CORRECTION
        </p>

        <p className="mt-5 max-w-md text-balance px-2 text-lg font-medium leading-snug text-snow md:mt-7 md:max-w-xl md:text-2xl">
          자세가 바뀌면,
          <br className="sm:hidden" />
          <span className="hidden sm:inline"> </span>
          <span className="text-neon-amber">시즌이 바뀝니다.</span>
        </p>

        <div className="mt-9 flex w-full justify-center md:mt-12">
          <Link
            href="#courses"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-midnight-border px-7 text-sm font-semibold text-snow transition hover:border-neon-orange/50 hover:text-neon-orange active:scale-[0.98] md:h-auto md:py-4"
          >
            커리큘럼 살펴보기
            <span aria-hidden>↓</span>
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 text-[10px] font-medium tracking-[0.5em] text-snow-muted md:block">
        SCROLL ↓
      </div>
    </section>
  );
}

function SlopeLines() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full opacity-60"
    >
      <defs>
        <linearGradient id="slope-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF3D00" stopOpacity="0" />
          <stop offset="50%" stopColor="#FF3D00" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FF3D00" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="slope-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00F0FF" stopOpacity="0" />
          <stop offset="50%" stopColor="#00F0FF" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M -100 780 Q 400 500 800 620 T 1600 380"
        fill="none"
        stroke="url(#slope-a)"
        strokeWidth="1.5"
      />
      <path
        d="M -100 860 Q 500 620 900 720 T 1600 460"
        fill="none"
        stroke="url(#slope-b)"
        strokeWidth="1"
      />
      <path
        d="M -100 700 Q 300 420 700 540 T 1600 300"
        fill="none"
        stroke="url(#slope-a)"
        strokeWidth="0.75"
        strokeDasharray="4 8"
      />
    </svg>
  );
}
