import Image from "next/image";

export function Hero() {
  return (
    <section id="hero" className="relative isolate pt-20 pb-16 md:pt-24 md:pb-24">
      <div className="mx-auto w-full max-w-7xl px-3 md:px-6">
        {/* Image — full width, natural aspect */}
        <figure className="relative aspect-4389/2926 w-full overflow-hidden">
          <Image
            src="/images/main.jpeg"
            alt="비발디파크 스키 강습 MAD_INTER SKI 자세교정 수업"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </figure>

        {/* Title — left aligned */}
        <h1
          className="mt-10 text-left font-display leading-[0.98] tracking-tight text-snow md:mt-16"
          aria-label="MAD _ INTER SKI"
        >
          <span className="block text-[clamp(2.25rem,11vw,7rem)] text-neon-orange">
            MAD
          </span>
          <span className="block text-[clamp(2.25rem,11vw,7rem)]">INTER</span>
          <span className="block text-[clamp(2.25rem,11vw,7rem)]">SKI</span>
        </h1>

        {/* Hook */}
        <p className="mt-8 text-left text-base font-medium leading-snug text-snow md:mt-12 md:text-2xl">
          비발디파크 스키 강습 · 자세교정 전문.
          <br />
          자세가 바뀌면,{" "}
          <span className="text-neon-orange">시즌이 바뀝니다.</span>
        </p>
      </div>
    </section>
  );
}
