import Image from "next/image";
import { COACHES, DIRECTOR_PROFILE } from "@/lib/site";

const DIRECTOR_TAGS = [
  "KSIA 레벨3+",
  "SBAK 티칭3",
  "2526 기선전 14위",
  "데몬선발전 7위",
];

const DIRECTOR_STATS = [
  { label: "KSIA", value: "레벨3+" },
  { label: "SBAK", value: "티칭3" },
  { label: "2526 기선전", value: "14위" },
  { label: "2324 데몬선발전", value: "7위" },
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
              {DIRECTOR_PROFILE.name} {DIRECTOR_PROFILE.title}
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:mt-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <div className="overflow-hidden border border-midnight-border bg-midnight-card">
              <div className="grid grid-cols-[132px_1fr] gap-0 sm:grid-cols-[168px_1fr]">
                <figure className="relative min-h-52 overflow-hidden border-r border-midnight-border bg-midnight-elev sm:min-h-64">
                  <Image
                    src={DIRECTOR_PROFILE.profileImage}
                    alt={`${DIRECTOR_PROFILE.name} 감독 프로필 사진`}
                    fill
                    sizes="(min-width: 768px) 168px, 132px"
                    className="object-cover object-top"
                    priority
                  />
                </figure>

                <div className="p-4 sm:p-5 md:p-6">
                  <span className="text-[10px] font-semibold tracking-[0.3em] text-neon-orange">
                    DIRECTOR
                  </span>
                  <div className="mt-2 text-4xl font-black text-snow md:text-5xl">
                    {DIRECTOR_PROFILE.name}
                  </div>
                  <div className="mt-1 text-xs text-snow-dim">
                    {DIRECTOR_PROFILE.romanizedName}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {DIRECTOR_TAGS.map((t, i) => (
                      <span
                        key={t}
                        className={
                          i === 0
                            ? "border border-neon-orange bg-neon-orange/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-neon-orange"
                            : "border border-midnight-border px-2.5 py-1 text-[10px] font-semibold tracking-wider text-snow-dim"
                        }
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 border-t border-midnight-border">
                {DIRECTOR_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="border-b border-midnight-border p-4 odd:border-r md:p-5 [&:nth-last-child(-n+2)]:border-b-0"
                  >
                    <div className="text-[9px] font-semibold tracking-[0.25em] text-snow-muted">
                      {stat.label}
                    </div>
                    <div className="mt-2 font-display-kr text-xl text-snow md:text-2xl">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-midnight-border p-2">
                {DIRECTOR_PROFILE.galleryImages.map((image) => (
                  <figure
                    key={image.src}
                    className="relative aspect-4/3 overflow-hidden bg-midnight-elev"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 768px) 280px, 50vw"
                      className="object-cover"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="border border-midnight-border bg-midnight-card p-5 md:p-8">
              <h3 className="text-lg font-black text-snow md:text-2xl">
                자격 및 경력
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-snow-dim md:text-base">
                스키어의 신체 조건과 움직임을 먼저 보고, 영상 분석과 반복
                훈련으로 습관을 교정하는 강습을 지향합니다.
              </p>

              <div className="mt-6">
                <div className="text-[10px] font-semibold tracking-[0.3em] text-neon-orange">
                  소속 데모
                </div>
                <p className="mt-3 text-sm leading-relaxed text-snow-dim md:text-base">
                  {DIRECTOR_PROFILE.affiliations.join(" · ")}
                </p>
              </div>

              <ul className="mt-6 grid gap-2">
                {[
                  "2324 대한스키지도자연맹 데몬선발전 7위",
                  "2526 한국스키장경영협회 기선전 14위",
                  "춘천시스키협회 이사",
                  "유튜브 장초지TV 운영",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-snow-dim">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-neon-orange" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <details className="mt-6 border-t border-midnight-border pt-5">
                <summary className="cursor-pointer list-none text-sm font-bold text-snow">
                  전체 경력 보기
                  <span className="ml-2 text-neon-orange" aria-hidden>
                    +
                  </span>
                </summary>
                <ul className="mt-4 grid gap-2 text-sm leading-relaxed text-snow-dim sm:grid-cols-2">
                  {[...DIRECTOR_PROFILE.career, ...DIRECTOR_PROFILE.credentials]
                    .filter(
                      (item) =>
                        ![
                          "2324 대한스키지도자연맹 데몬선발전 7위",
                          "2526 한국스키장경영협회 기선전 14위",
                          "춘천시스키협회 이사",
                          "유튜브 장초지TV 운영",
                        ].includes(item),
                    )
                    .map((item) => (
                      <li
                        key={item}
                        className="border-l border-midnight-border pl-3"
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              </details>
            </div>
          </div>
        </div>

        {/* Coach row */}
        <div className="mt-10 border-t border-midnight-border pt-8 md:mt-16 md:pt-10">
          <div className="max-w-3xl">
            <span className="text-[10px] font-semibold tracking-[0.4em] text-neon-orange md:text-xs">
              COACH
            </span>
            <h3 className="mt-3 text-3xl font-black leading-[1.15] text-snow md:mt-4 md:text-5xl">
              코치진
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-snow-dim md:text-base">
              감독이 직접 선별하고, 감독의 커리큘럼을 주 2회 이상 함께
              교육받는 정예 코치진입니다. 회원 라이딩 영상은 감독이 직접 검토
              후 코치에게 전달되어 코치반에서도 감독의 코칭 방향이 그대로
              이어집니다.
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:mt-10 md:grid-cols-2">
            {COACHES.map((coach) => (
              <article
                key={coach.name}
                className="overflow-hidden border border-midnight-border bg-midnight-card"
              >
                <div
                  className={
                    coach.profileImage
                      ? "grid grid-cols-[132px_1fr] gap-0 sm:grid-cols-[168px_1fr]"
                      : "grid gap-0"
                  }
                >
                  {coach.profileImage ? (
                    <figure className="relative min-h-48 overflow-hidden border-r border-midnight-border bg-midnight-elev sm:min-h-56">
                      <Image
                        src={coach.profileImage}
                        alt={`${coach.name} 코치 프로필 사진`}
                        fill
                        sizes="(min-width: 768px) 168px, 132px"
                        className="object-cover object-top"
                      />
                    </figure>
                  ) : null}

                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-semibold tracking-[0.3em] text-neon-orange">
                          COACH
                        </span>
                        <h4 className="mt-2 text-3xl font-black text-snow md:text-4xl">
                          {coach.name}
                        </h4>
                        <p className="mt-1 text-xs text-snow-dim">
                          {coach.romanizedName}
                        </p>
                      </div>
                      <span className="shrink-0 border border-midnight-border px-2 py-1 text-[10px] font-semibold text-snow-muted">
                        코치
                      </span>
                    </div>

                    <ul className="mt-5 grid gap-2">
                      {coach.credentials.map((credential) => (
                        <li
                          key={credential}
                          className="flex gap-2 text-xs leading-relaxed text-snow-dim sm:gap-3 sm:text-sm"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-neon-orange" />
                          <span>{credential}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {coach.galleryImages?.length ? (
                  <div className="grid grid-cols-2 gap-2 border-t border-midnight-border p-2">
                    {coach.galleryImages.map((image) => (
                      <figure
                        key={image.src}
                        className="relative aspect-4/3 overflow-hidden bg-midnight-elev"
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(min-width: 768px) 300px, 50vw"
                          className="object-cover"
                        />
                      </figure>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
