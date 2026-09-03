const CREDS = [
  { label: "KSIA", value: "지도자 LEVEL 3" },
  { label: "한국스키장경영협회", value: "티칭 3" },
  { label: "인터스키", value: "정 지도자" },
];

const TAGS = ["LEVEL 3", "KSIA", "TEACHING 3", "VIVALDI PARK"];

export function Director() {
  return (
    <section
      id="director"
      className="relative overflow-hidden border-y border-midnight-border bg-midnight-elev/40"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-12 md:gap-16 md:px-6 md:py-40">
        <div className="md:col-span-5">
          <div className="relative overflow-hidden rounded-3xl border border-midnight-border bg-linear-to-br from-neon-orange/15 via-midnight-card to-midnight-card p-1">
            <div className="rounded-[calc(1.5rem-2px)] bg-midnight-card px-6 py-10 md:px-8 md:py-12">
              <span className="font-display text-[10px] tracking-[0.4em] text-neon-orange md:text-xs">
                DIRECTOR
              </span>
              <div className="mt-5 text-5xl font-black text-snow md:mt-6 md:text-7xl">
                장우진
              </div>
              <div className="mt-2 text-xs text-snow-dim md:text-sm">
                Jang Woo-jin
              </div>

              <div className="mt-8 flex flex-wrap gap-2 md:mt-10">
                {TAGS.map((t, i) => (
                  <span
                    key={t}
                    className={
                      i === 0
                        ? "rounded-full border border-neon-orange/40 bg-neon-orange/10 px-3 py-1 text-[10px] font-semibold tracking-wider text-neon-orange md:text-xs"
                        : "rounded-full border border-midnight-border px-3 py-1 text-[10px] font-semibold tracking-wider text-snow-dim md:text-xs"
                    }
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center md:col-span-7">
          <blockquote className="text-xl font-medium leading-relaxed text-snow md:text-3xl">
            &ldquo;성실함과 진정성 있는 강습으로{" "}
            <span className="text-neon-amber">
              최선을 다해 지도할 것을 약속
            </span>
            드립니다.
            <br />
            제 기준의 스키가 아닌, 회원분들의 신체적 특성과 운동 성향을 파악해
            <span className="text-neon-amber">
              {" "}
              항상 회원 입장에서 지도
            </span>
            하겠습니다.&rdquo;
          </blockquote>
          <p className="mt-5 text-xs text-snow-muted md:mt-6 md:text-sm">
            &mdash; 장우진 · MAD_INTER SKI 감독
          </p>

          <dl className="mt-10 grid gap-5 sm:grid-cols-3 md:mt-12 md:gap-6">
            {CREDS.map((c) => (
              <div
                key={c.label}
                className="border-l border-midnight-border pl-4"
              >
                <dt className="text-[10px] tracking-[0.3em] text-snow-muted">
                  {c.label}
                </dt>
                <dd className="mt-2 font-display text-base text-snow md:text-lg">
                  {c.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
