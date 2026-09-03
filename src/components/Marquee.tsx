const PHRASES = [
  "POSTURE CORRECTION",
  "26 / 27 SEASON",
  "BOMNAE SPORTS",
  "ROSSIGNOL",
  "PHENIX",
  "SMITH",
  "소담송하",
  "VIVALDI PARK",
];

export function Marquee() {
  const doubled = [...PHRASES, ...PHRASES];
  return (
    <section
      aria-hidden
      className="relative border-y border-midnight-border/70 bg-midnight-elev/40 py-4 md:py-6"
    >
      <div className="flex overflow-hidden">
        <div className="marquee-track flex shrink-0 gap-8 whitespace-nowrap pr-8 md:gap-12 md:pr-12">
          {doubled.map((p, i) => (
            <span
              key={i}
              className="font-display text-lg tracking-[0.2em] text-snow-dim md:text-4xl"
            >
              {p}
              <span className="mx-4 text-neon-orange md:mx-6">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
