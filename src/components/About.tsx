const FEATURES = [
  {
    tag: "01",
    title: "실시간 무전기 피드백",
    desc: "슬로프 위에서 바로 잡아드립니다. 무전기 대여 무료, 인이어는 개별 구매.",
  },
  {
    tag: "02",
    title: "캠코더 촬영 & 자세 분석",
    desc: "매 강습 촬영, 당일 영상 · 피드백 전송. 눈으로 확인하는 자세 교정.",
  },
  {
    tag: "03",
    title: "봄내스포츠 파트너",
    desc: "스키 장비 · 의류 · 액세서리 파격 할인 혜택. 시즌 회원 전용.",
  },
];

export function About() {
  return (
    <section
      id="about"
      className="relative mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-40"
    >
      <div className="grid gap-10 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <span className="text-[10px] font-semibold tracking-[0.4em] text-neon-orange md:text-xs">
            ABOUT
          </span>
          <h2 className="mt-3 text-3xl font-black leading-[1.15] text-snow md:mt-4 md:text-5xl">
            자세 하나가
            <br />
            라이딩을 바꿉니다.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-snow-muted md:mt-6 md:text-base">
            비발디파크 <strong className="text-snow">MAD_INTER SKI</strong>는
            자세 교정 (Posture Correction)에 집중하는 스키 스쿨입니다. 화려한
            기술보다 먼저, 나만의 밸런스와 라인을 찾도록 돕습니다.
          </p>
        </div>

        <ul className="grid gap-3 md:col-span-7 md:gap-4">
          {FEATURES.map((f) => (
            <li
              key={f.tag}
              className="group flex gap-5 rounded-2xl border border-midnight-border bg-midnight-card p-5 transition hover:border-neon-orange/40 md:gap-6 md:p-6"
            >
              <span className="font-display text-2xl text-neon-orange md:text-3xl">
                {f.tag}
              </span>
              <div>
                <h3 className="text-base font-semibold text-snow md:text-lg">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-snow-dim">
                  {f.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
