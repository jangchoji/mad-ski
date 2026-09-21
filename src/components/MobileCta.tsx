import { SITE } from "@/lib/site";

export function MobileCta() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black bg-white/95 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto max-w-md px-4 py-3">
        <a
          href={SITE.reservationUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-13 w-full items-center justify-between gap-2 rounded-none bg-black px-6 py-4 text-base font-bold uppercase tracking-wider text-white active:scale-[0.99]"
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
