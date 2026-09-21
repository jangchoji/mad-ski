const SEARCH_TOPICS = [
  {
    title: "비발디파크 스키 강습",
    desc: "MAD INTER SKI SCHOOL은 대명 소노벨 비발디파크에서 진행하는 스키 강습을 중심으로 초급 입문, 자세교정, 카빙, 숏턴까지 수준별 커리큘럼을 운영합니다.",
  },
  {
    title: "어린이 스키 강습",
    desc: "어린이와 주니어 회원은 장비 적응, 안전한 넘어짐과 일어서기, 기본 턴, 등급 준비까지 단계적으로 지도합니다.",
  },
  {
    title: "성인 스키 강습",
    desc: "성인 강습은 개인의 신체 조건과 운동 경험, 현재 스키 수준을 먼저 확인하고 무전 피드백과 영상 분석으로 움직임을 교정합니다.",
  },
  {
    title: "스키 자세교정",
    desc: "같은 동작을 반복시키기보다 왜 안 되는지 찾고, 체중 이동과 밸런스, 턴 타이밍을 이해할 수 있도록 설명합니다.",
  },
];

export function SeoContent() {
  return (
    <section
      id="ski-lesson-guide"
      className="relative mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-32"
    >
      <div className="grid gap-10 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-4">
          <span className="text-[10px] font-semibold tracking-[0.4em] text-neon-orange md:text-xs">
            GUIDE
          </span>
          <h2 className="mt-3 text-3xl font-black leading-[1.15] text-snow md:mt-4 md:text-5xl">
            검색으로 찾는
            <br />
            스키 강습 안내
          </h2>
        </div>

        <div className="grid gap-4 md:col-span-8 sm:grid-cols-2">
          {SEARCH_TOPICS.map((topic) => (
            <article
              key={topic.title}
              className="border border-midnight-border bg-midnight-card p-5 md:p-6"
            >
              <h3 className="text-base font-bold text-snow md:text-lg">
                {topic.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-snow-dim md:text-base">
                {topic.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
