import { FAQS } from "@/lib/faqs";


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
            스키 강습 안내
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
