export function Footer() {
  return (
    <footer className="border-t border-midnight-border bg-midnight-elev/40 pb-24 md:pb-0">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-6 md:py-10">
        <div>
          <div className="font-display text-base tracking-[0.2em] neon-orange md:text-lg">
            MAD_INTER SKI
          </div>
          <div className="mt-1 text-[11px] text-snow-muted md:text-xs">
            대명 소노벨 비발디파크 · 감독 장우진 · 010-2007-2883
          </div>
        </div>
        <div className="text-[11px] text-snow-muted md:text-xs">
          © {new Date().getFullYear()} MAD_INTER SKI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
