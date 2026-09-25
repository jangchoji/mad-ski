import Image from "next/image";

export function Hero() {
  return (
    <section id="hero" className="relative isolate pt-20 pb-16 md:pt-24 md:pb-24">
      <div className="mx-auto w-full max-w-7xl px-3 md:px-6">
        {/* Image — full width, natural aspect */}
        <figure className="relative aspect-4389/2926 w-full overflow-hidden">
          <Image
            src="/images/main.jpeg"
            alt="MAD INTER SKI in 비발디파크 전문 스키 강습"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </figure>

        {/* Title — left aligned */}
        <h1
          className="mt-10 text-left font-display leading-[0.98] tracking-tight text-snow md:mt-16"
          aria-label="MAD INTER SKI SCHOOL"
        >
          <span className="block text-[clamp(2.25rem,11vw,7rem)] text-neon-orange">
            MAD
          </span>
          <span className="block text-[clamp(2.25rem,11vw,7rem)]">INTER</span>
          <span className="block text-[clamp(2.25rem,11vw,7rem)]">
            SKI SCHOOL
          </span>
        </h1>

        {/* Hook */}
        <p className="mt-8 text-left text-base font-medium leading-snug text-snow md:mt-12 md:text-2xl">
          제대로 배우면, 스키가 달라집니다.
          <br />
          <span className="text-neon-orange">
            전문 스키 강습 MAD INTER SKI in 비발디파크
          </span>
        </p>
      </div>
    </section>
  );
}
