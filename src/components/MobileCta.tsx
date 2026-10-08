import { SITE } from "@/lib/site";

export function MobileCta() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black bg-white/95 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto grid max-w-md grid-cols-[0.78fr_1fr] gap-2 px-4 py-3 md:max-w-xl md:grid-cols-2">
        <a
          href="tel:010-2007-2883"
          className="flex h-13 items-center justify-center border border-black px-4 py-4 text-sm font-bold uppercase tracking-wider text-black active:scale-[0.99] md:text-base"
        >
          전화 문의
        </a>
        <a
          href={SITE.reservationUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-13 items-center justify-between gap-2 bg-black px-5 py-4 text-sm font-bold uppercase tracking-wider text-white active:scale-[0.99] md:px-6 md:text-base"
        >
          <span>강습 예약하기</span>
          <span className="text-neon-orange" aria-hidden>
            →
          </span>
        </a>
      </div>
    </div>
  );
}
