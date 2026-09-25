import { SITE } from "@/lib/site";

const CHANNELS = [
  {
    label: "BOOKING",
    value: "예약하기",
    href: SITE.reservationUrl,
  },
  {
    label: "PHONE",
    value: "010-2007-2883",
    href: "tel:010-2007-2883",
  },
  {
    label: "KAKAOTALK",
    value: "mvp8917",
    href: "https://open.kakao.com/o/mvp8917",
  },
  {
    label: "INSTAGRAM",
    value: "@mad_skiii",
    href: "https://instagram.com/mad_skiii",
  },
  {
    label: "YOUTUBE",
    value: "장초지TV",
    href: "https://www.youtube.com/channel/UCZRwm9Z2AtsQqPTsI6_slwQ",
  },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="relative mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-40"
    >
      <div className="relative overflow-hidden rounded-3xl border border-midnight-border bg-linear-to-br from-midnight-card via-midnight to-midnight p-7 md:p-20">
        <div
          aria-hidden
          className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-neon-orange/30 blur-[120px]"
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-neon-amber/20 blur-[120px]"
        />

        <div className="relative">
          <span className="text-[10px] font-semibold tracking-[0.4em] text-neon-orange md:text-xs">
            BOOKING
          </span>
          <h2 className="mt-3 font-display text-4xl leading-none tracking-widest text-snow md:mt-4 md:text-7xl">
            <span className="neon-orange">READY?</span>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-snow-dim md:mt-6 md:text-base">
            26/27 시즌 회원 모집 중. 원하시는 반과 날짜를 알려주시면 맞춤
            스케줄로 답변드립니다.
            <br />
            <span className="text-snow-muted">
              MAD INTER SKI in 비발디파크
            </span>
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-12 md:grid-cols-5 md:gap-4">
            {CHANNELS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-midnight-border bg-midnight-card/70 p-5 backdrop-blur transition hover:border-neon-orange/50 md:flex-col md:items-start md:justify-between md:p-6"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold tracking-[0.35em] text-snow-muted">
                    {c.label}
                  </span>
                  <span
                    className={
                      /[가-힯]/.test(c.value)
                        ? "font-display-kr mt-1 text-xl text-snow group-hover:text-neon-orange md:mt-6 md:text-2xl"
                        : "font-display mt-1 text-lg tracking-wider text-snow group-hover:text-neon-orange md:mt-6 md:text-xl"
                    }
                  >
                    {c.value}
                  </span>
                </div>
                <span
                  aria-hidden
                  className="text-snow-muted transition group-hover:translate-x-1 group-hover:text-neon-orange md:self-end"
                >
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
