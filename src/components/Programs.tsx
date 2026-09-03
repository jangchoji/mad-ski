const PROGRAMS = [
  {
    tag: "감독반",
    title: "장우진 감독 직강",
    highlight: true,
    time: ["오전 10-12시", "오후 14-16시", "야간 19-21시 (월·화·목)"],
    rows: [
      { label: "1:1 · 8회", price: "280만" },
      { label: "1:1 · 주말 7회", price: "260만" },
      { label: "1:2 · 8회", price: "150만" },
      { label: "1:2 · 주말 7회", price: "133만" },
    ],
    note: "그룹반 평일 8회 130만원 (3인 기준, 3인↑ 1인당 10만 할인)",
  },
  {
    tag: "코치반",
    title: "정예 코치 · 감독 피드백",
    time: ["오전 9시·11시", "오후 13시·15시", "야간 19-21시 (월·화·목)"],
    rows: [
      { label: "1:1 · 8회", price: "130만" },
      { label: "1:2 · 8회", price: "90만" },
      { label: "레벨2↑ 1:1", price: "150만" },
      { label: "레벨2↑ 1:2", price: "110만" },
    ],
    note: "감독이 영상 확인 후 코치에게 직접 피드백",
  },
  {
    tag: "주니어반",
    title: "26/27 등급제 속성반",
    time: ["첫 시즌 최대 4등급 취득", "KSIA 등급 인증서 · 뱃지 발급"],
    rows: [
      { label: "주 1회 1:1 · 8회", price: "150만" },
      { label: "주 1회 1:2 · 8회", price: "110만" },
      { label: "주 1회 1:3 · 8회", price: "90만" },
      { label: "1회 단기 (1:1)", price: "20만" },
    ],
    note: "패찰비 포함 · 검정료 등급당 1.5만 별도",
  },
];

export function Programs() {
  return (
    <section
      id="programs"
      className="relative mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-40"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.4em] text-neon-orange md:text-xs">
            PROGRAMS
          </span>
          <h2 className="mt-3 text-3xl font-black leading-[1.15] text-snow md:mt-4 md:text-5xl">
            프로그램 & 요금.
          </h2>
        </div>
        <p className="max-w-xs text-sm text-snow-muted">
          모든 반은 강습 허가권 포함 · 시즌 총 8회 (주말 7회) 기준.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
        {PROGRAMS.map((p) => (
          <article
            key={p.tag}
            className={`relative flex flex-col rounded-2xl border p-6 md:p-7 ${
              p.highlight
                ? "border-neon-orange/50 bg-linear-to-b from-neon-orange/10 via-midnight-card to-midnight-card shadow-[0_0_40px_-10px_rgba(255,61,0,0.35)]"
                : "border-midnight-border bg-midnight-card"
            }`}
          >
            {p.highlight && (
              <span className="absolute right-5 top-5 rounded-full bg-neon-orange px-2.5 py-1 text-[9px] font-bold tracking-[0.2em] text-white shadow-[0_0_16px_rgba(255,61,0,0.6)] md:right-6 md:top-6 md:px-3 md:text-[10px]">
                DIRECTOR
              </span>
            )}
            <span className="font-display-kr text-3xl text-snow md:text-4xl">
              {p.tag}
            </span>
            <p className="mt-1 text-xs text-neon-amber md:text-sm">
              {p.title}
            </p>

            <ul className="mt-5 space-y-1.5 border-t border-midnight-border pt-4 md:pt-5">
              {p.time.map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2 text-xs text-snow-dim md:text-sm"
                >
                  <ClockIcon />
                  {t}
                </li>
              ))}
            </ul>

            <dl className="mt-5 grid gap-2.5 border-t border-midnight-border pt-4 md:pt-5">
              {p.rows.map((r) => (
                <div
                  key={r.label}
                  className="flex items-baseline justify-between gap-3"
                >
                  <dt className="text-sm text-snow-dim">{r.label}</dt>
                  <dd className="font-display text-lg tracking-wider text-snow md:text-xl">
                    <span className="text-neon-amber">{r.price}</span>
                    <span className="ml-0.5 text-xs text-snow-muted">원</span>
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 text-[11px] leading-relaxed text-snow-muted md:text-xs">
              {p.note}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-8 text-center text-[11px] text-snow-muted md:mt-10 md:text-xs">
        * 1인 요금 기준. 그룹 인원 미달 시 추가 요금 발생.
      </p>
    </section>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-3.5 w-3.5 shrink-0 text-neon-orange"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}
