import Link from "next/link";

export function MobileCta() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-midnight-border bg-white/90 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto max-w-md px-4 py-3">
        <Link
          href="#contact"
          className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-neon-amber py-4 text-base font-bold tracking-wide text-white shadow-[0_8px_22px_rgba(255,107,26,0.35)] active:scale-[0.98]"
        >
          강습 예약하기
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
