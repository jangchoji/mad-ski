export function Footer() {
  return (
    <footer className="border-t border-midnight-border bg-midnight-elev/40 pb-24 md:pb-0">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-6 md:py-10">
        <div>
          <div className="font-display text-base tracking-[0.2em] neon-orange md:text-lg">
            MAD INTER SKI SCHOOL
          </div>
          <div className="mt-1 text-[11px] text-snow-muted md:text-xs">
            MAD INTER SKI in 비발디파크 · 감독 장우진 · 010-2007-2883
          </div>
          <div className="mt-2 flex flex-col gap-1 text-[10px] text-snow-muted md:flex-row md:gap-3 md:text-[11px]">
            <span>사업자등록번호 834-62-00906</span>
            <span>통신판매업 신고번호 2026-강원춘천-0697</span>
          </div>
        </div>
        <div className="text-[11px] text-snow-muted md:text-xs">
          © {new Date().getFullYear()} MAD INTER SKI SCHOOL. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
