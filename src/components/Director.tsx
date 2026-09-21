const CREDS = [
  { label: "대한스키지도자연맹", value: "레벨 3+" },
  { label: "한국스키장경영협회", value: "티칭 3" },
];

const DIRECTOR_TAGS = [
  "대한스키지도자연맹 레벨 3+",
  "한국스키장경영협회 티칭 3",
];

export function Director() {
  return (
    <section
      id="director"
      className="relative overflow-hidden border-y border-midnight-border bg-midnight-elev/40"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-40">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.4em] text-neon-orange md:text-xs">
              DIRECTOR
            </span>
            <h2 className="mt-3 text-3xl font-black leading-[1.15] text-snow md:mt-4 md:text-5xl">
              장우진 감독
            </h2>
          </div>
        </div>

        {/* Director card */}
        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="relative overflow-hidden border border-midnight-border bg-midnight-card p-6 md:p-8">
              <span className="text-[10px] font-semibold tracking-[0.4em] text-neon-orange md:text-xs">
                DIRECTOR · 감독
              </span>
              <div className="mt-5 text-5xl font-black text-snow md:mt-6 md:text-7xl">
                장우진
              </div>
              <div className="mt-2 text-xs text-snow-dim md:text-sm">
                Jang Woo-jin
              </div>

              <div className="mt-8 flex flex-wrap gap-2 md:mt-10">
                {DIRECTOR_TAGS.map((t, i) => (
                  <span
                    key={t}
                    className={
                      i === 0
                        ? "border border-neon-orange bg-neon-orange/10 px-3 py-1 text-[10px] font-semibold tracking-wider text-neon-orange md:text-xs"
                        : "border border-midnight-border px-3 py-1 text-[10px] font-semibold tracking-wider text-snow-dim md:text-xs"
                    }
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center md:col-span-7">
            <blockquote className="text-xl font-medium leading-relaxed text-snow md:text-3xl">
              &ldquo;스키는 단순히 많이 탄다고 해서{" "}
              <span className="text-neon-orange">
                빠르게 늘지는 않습니다.
              </span>
              <br />
              자신의 움직임을 정확하게 이해하고, 잘못된 습관을 찾아 교정하며,
              올바른 움직임을 반복해서 몸에 익히는 과정이 필요합니다.&rdquo;
            </blockquote>
            <p className="mt-5 text-xs text-snow-muted md:mt-6 md:text-sm">
              &mdash; 장우진 · MAD INTER SKI SCHOOL 감독
            </p>

            <p className="mt-8 text-sm leading-relaxed text-snow-dim md:text-base">
              스키어마다 다른 신체 조건과 운동 경험, 움직임의 특징, 현재의 스키
              수준을 세심하게 살피고, 그에 맞는 방향으로 기술을 만들어가는
              강습을 지향합니다.
            </p>

            <dl className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-12 md:gap-6">
              {CREDS.map((c) => (
                <div
                  key={c.label}
                  className="border-l border-midnight-border pl-4"
                >
                  <dt className="text-[10px] tracking-[0.3em] text-snow-muted">
                    {c.label}
                  </dt>
                  <dd className="mt-2 font-display-kr text-lg text-snow md:text-xl">
                    {c.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Coach row */}
        <div className="mt-10 border-t border-midnight-border pt-8 md:mt-16 md:pt-10">
          <div className="grid gap-6 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <div className="border border-midnight-border bg-midnight-card p-6 md:p-8">
                <span className="text-[10px] font-semibold tracking-[0.4em] text-neon-orange md:text-xs">
                  COACH · 코치
                </span>
                <div className="mt-5 text-4xl font-black text-snow md:mt-6 md:text-6xl">
                  임준명
                </div>
                <div className="mt-2 text-xs text-snow-dim md:text-sm">
                  Lim Joon Myeong
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center md:col-span-7">
              <p className="text-sm leading-relaxed text-snow-dim md:text-base">
                감독이 직접 선별하고, 감독의 커리큘럼을 주 2회 이상 함께
                교육받는 정예 코치. 회원 라이딩 영상은 감독이 직접 검토 후
                코치에게 전달되어 코치반에서도 감독의 코칭 방향이 그대로
                이어집니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
