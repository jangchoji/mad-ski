const PARTNERS = [
  "BOMNAE SPORTS",
  "ROSSIGNOL",
  "PHENIX",
  "SMITH",
  "소담송하",
  "대명 소노벨 비발디파크",
];

const isKorean = (s: string) => /[가-힯]/.test(s);

export function Marquee() {
  const doubled = [...PARTNERS, ...PARTNERS, ...PARTNERS];
  return (
    <section
      aria-label="파트너"
      className="relative shrink-0 border-y border-black bg-white"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between border-b border-black/15 px-5 py-2 md:px-8">
        <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-snow-dim md:text-[10px]">
          Official Partners
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-neon-orange md:text-[10px]">
          26 / 27 Season
        </span>
      </div>

      <div className="flex overflow-hidden py-4 md:py-5">
        <div className="marquee-track flex shrink-0 items-center gap-8 whitespace-nowrap pr-8 md:gap-12 md:pr-12">
          {doubled.map((p, i) => (
            <span key={i} className="flex items-center gap-8 md:gap-12">
              <span
                className={
                  isKorean(p)
                    ? "font-display-kr text-lg text-snow md:text-2xl"
                    : "font-display text-lg tracking-[0.08em] text-snow md:text-2xl"
                }
              >
                {p}
              </span>
              <StarSeparator />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function StarSeparator() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="inline-block h-4 w-4 shrink-0 fill-neon-orange md:h-6 md:w-6"
      aria-hidden
    >
      <path d="M12 1.5L13.35 9.65L21.5 11L13.35 12.35L12 20.5L10.65 12.35L2.5 11L10.65 9.65L12 1.5Z" />
    </svg>
  );
}
