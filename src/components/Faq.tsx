const FAQS = [
  {
    question: "비발디파크 스키 강습은 어디에서 진행하나요?",
    answer:
      "MAD INTER SKI SCHOOL은 대명 소노벨 비발디파크에서 성인과 주니어 스키 강습을 진행합니다. 시즌 강습, 단기 강습, 자세교정 상담이 가능합니다.",
  },
  {
    question: "스키를 처음 타는 초보자도 신청할 수 있나요?",
    answer:
      "가능합니다. 비발디파크에서 진행하는 초급 스키 강습은 장비 착용, 넘어지고 일어서기, 장비 적응, 스노우플라우 턴부터 시작해 레벨에 맞춰 단계적으로 지도합니다.",
  },
  {
    question: "비발디파크 자세교정 스키 강습은 어떻게 다른가요?",
    answer:
      "무전기를 활용한 실시간 피드백과 캠코더 촬영, 당일 영상 분석을 통해 체중 이동, 밸런스, 턴 타이밍을 구체적으로 교정합니다.",
  },
  {
    question: "어린이·주니어 강습도 운영하나요?",
    answer:
      "비발디파크에서 진행하는 어린이 스키 강습과 주니어 등급제 속성반을 운영합니다. 첫 시즌 등급 취득을 목표로 KSIA 등급 인증서와 뱃지 발급 과정까지 안내합니다.",
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      className="relative border-y border-midnight-border bg-midnight-elev/40"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-12 md:gap-16 md:px-6 md:py-32">
        <div className="md:col-span-4">
          <span className="text-[10px] font-semibold tracking-[0.4em] text-neon-orange md:text-xs">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl font-black leading-[1.15] text-snow md:mt-4 md:text-5xl">
            비발디파크
            <br />
            스키 강습 안내.
          </h2>
        </div>

        <div className="grid gap-4 md:col-span-8">
          {FAQS.map((faq) => (
            <article
              key={faq.question}
              className="border border-midnight-border bg-midnight-card p-5 md:p-6"
            >
              <h3 className="text-base font-bold text-snow md:text-lg">
                {faq.question}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-snow-dim md:text-base">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
