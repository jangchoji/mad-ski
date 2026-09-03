const COURSES = [
  {
    tag: "LEVEL 01",
    title: "BEGINNER",
    subtitle: "초급 · 첫 슬로프",
    items: [
      "장비 착용 & 넘어지고 일어서기",
      "장비 적응 훈련",
      "스노우플라우 턴",
      "프루그화렌 → 스노우플라우 턴",
    ],
  },
  {
    tag: "LEVEL 02",
    title: "INTERMEDIATE",
    subtitle: "중급 · 자세 교정",
    items: [
      "스노우플라우턴 숙달 및 자세교정",
      "체중이동의 이해",
      "스템 턴",
      "베이직 롱 턴 → 다이나믹 롱 턴",
      "베이직 숏 턴 → 다이나믹 숏 턴",
    ],
  },
  {
    tag: "LEVEL 03",
    title: "ADVANCED",
    subtitle: "상급 · 카빙 & 숏턴",
    items: [
      "턴의 리듬 · 타이밍 & 폴 플랜팅",
      "스텝 턴을 이용한 정확한 체중이동",
      "급경사 숏 턴 + 스키딩 + 카빙 숏 턴",
      "카빙 턴 위주 상급 라인",
    ],
    featured: true,
  },
];

export function Courses() {
  return (
    <section
      id="courses"
      className="relative mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-40"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.4em] text-neon-orange md:text-xs">
            COURSES
          </span>
          <h2 className="mt-3 text-3xl font-black leading-[1.15] text-snow md:mt-4 md:text-5xl">
            레벨별 커리큘럼.
          </h2>
        </div>
        <p className="max-w-xs text-sm text-snow-muted">
          모든 레벨은 영상 피드백과 1:1 코칭 세션이 포함됩니다.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
        {COURSES.map((c) => (
          <article
            key={c.tag}
            className={`group relative flex flex-col overflow-hidden rounded-2xl border p-6 transition md:p-8 ${
              c.featured
                ? "border-neon-orange/40 bg-linear-to-b from-neon-orange/10 via-midnight-card to-midnight-card"
                : "border-midnight-border bg-midnight-card hover:border-snow-dim/30"
            }`}
          >
            {c.featured && (
              <span className="absolute right-5 top-5 rounded-full bg-neon-orange px-2.5 py-1 text-[9px] font-bold tracking-[0.2em] text-midnight md:right-6 md:top-6 md:px-3 md:text-[10px]">
                POPULAR
              </span>
            )}

            <span className="text-[10px] font-semibold tracking-[0.35em] text-snow-muted md:text-xs">
              {c.tag}
            </span>
            <h3 className="mt-3 font-display text-2xl tracking-widest text-snow md:mt-4 md:text-4xl">
              {c.title}
            </h3>
            <p className="mt-1 text-xs text-neon-amber md:text-sm">
              {c.subtitle}
            </p>

            <ul className="mt-5 space-y-2 border-t border-midnight-border pt-5 md:mt-6 md:space-y-2.5 md:pt-6">
              {c.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-relaxed text-snow-dim"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neon-orange"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-midnight-border text-sm font-semibold text-snow transition group-hover:border-neon-orange/50 group-hover:text-neon-orange md:mt-8 md:h-auto md:justify-start md:border-0 md:px-0"
            >
              신청하기 <span aria-hidden>→</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
