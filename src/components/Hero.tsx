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

      {/* Content — image grows, title / hook auto */}
      <div className="mx-auto flex w-full min-h-0 max-w-7xl flex-1 flex-col gap-5 px-3 pb-5 md:gap-8 md:px-6 md:pb-8">
        {/* Image row — grows to fill remaining */}
        <div className="flex min-h-0 flex-1 items-start justify-start">
          <Image
            src="/images/main.jpeg"
            alt="장우진 감독 라이딩 컷"
            width={1359}
            height={1711}
            priority
            className="h-full w-auto max-w-full object-contain"
          />
        </div>

        {/* Title */}
        <h1
          className="ml-auto w-3/5 shrink-0 text-right font-display leading-[0.98] tracking-tight text-snow sm:w-1/2 md:w-3/4 lg:w-4/5"
          aria-label="MAD _ INTER SKI"
        >
          <span className="block text-[clamp(1.75rem,9vw,5rem)] text-neon-orange">
            MAD
          </span>
          <span className="block text-[clamp(1.75rem,9vw,5rem)]">INTER</span>
          <span className="block text-[clamp(1.75rem,9vw,5rem)]">SKI</span>
        </h1>

        {/* Hook */}
        <p className="ml-auto w-3/5 shrink-0 text-right text-sm font-medium leading-snug text-snow sm:w-1/2 md:w-3/4 md:text-lg lg:w-4/5">
          자세가 바뀌면,{" "}
          <span className="text-neon-orange">시즌이 바뀝니다.</span>
        </p>
      </div>

      {/* Partners — pinned bottom of fold */}
      <Marquee />
    </section>
  );
}
