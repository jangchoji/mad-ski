import Image from "next/image";
import { Marquee } from "./Marquee";

export function Hero() {
  return (
    <section
      id="hero"
      className="flex h-[calc(100svh-4.5rem)] flex-col overflow-hidden md:h-svh"
    >
      {/* Nav space */}
      <div className="pt-14 md:pt-16" aria-hidden />

      {/* Content — top/bottom padding gives whitespace */}
      <div className="mx-auto flex w-full min-h-0 max-w-7xl flex-1 flex-col gap-5 px-3 pt-6 pb-5 md:gap-8 md:px-6 md:pt-10 md:pb-8">
        {/* Image — natural aspect, scales to fit remaining space */}
        <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden">
          <Image
            src="/images/main.jpeg"
            alt="MAD_INTER SKI"
            width={4389}
            height={2926}
            priority
            className="h-auto max-h-full w-auto max-w-full object-contain"
            sizes="100vw"
          />
        </div>

        {/* Title — left aligned */}
        <h1
          className="shrink-0 text-left font-display leading-[0.98] tracking-tight text-snow"
          aria-label="MAD _ INTER SKI"
        >
          <span className="block text-[clamp(1.75rem,9vw,5rem)] text-neon-orange">
            MAD
          </span>
          <span className="block text-[clamp(1.75rem,9vw,5rem)]">INTER</span>
          <span className="block text-[clamp(1.75rem,9vw,5rem)]">SKI</span>
        </h1>

        {/* Hook */}
        <p className="shrink-0 text-left text-sm font-medium leading-snug text-snow md:text-lg">
          자세가 바뀌면,{" "}
          <span className="text-neon-orange">시즌이 바뀝니다.</span>
        </p>
      </div>

      {/* Partners — pinned to bottom of fold */}
      <Marquee />
    </section>
  );
}
