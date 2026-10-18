import Link from "next/link";
import {
  getPublishedNoticeById,
  getPublishedNotices,
  type Notice,
} from "@/lib/notices";

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));

function NoticeListItem({ notice }: { notice: Notice }) {
  return (
    <Link
      href={`/notice/${notice.id}`}
      className="group grid gap-3 border-b border-midnight-border py-5 transition hover:border-neon-orange md:grid-cols-[1fr_auto] md:items-center md:gap-6 md:py-7"
    >
      <div>
        <h3 className="text-xl font-black leading-tight text-snow transition group-hover:text-neon-orange md:text-3xl">
          {notice.title}
        </h3>
        <time
          dateTime={new Date(notice.createdAt).toISOString()}
          className="mt-2 block text-xs font-semibold tracking-[0.18em] text-snow-muted"
        >
          {formatDate(notice.createdAt)}
        </time>
      </div>
      <span
        aria-hidden
        className="text-sm font-black text-snow-muted transition group-hover:translate-x-1 group-hover:text-neon-orange"
      >
        자세히 보기 →
      </span>
    </Link>
  );
}

export async function NoticesSummary() {
  const notices = await getPublishedNotices(3);

  if (!notices.length) {
    return null;
  }

  return (
    <section id="notice" className="border-y border-midnight-border bg-midnight-elev/40">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-32">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.4em] text-neon-orange md:text-xs">
              NOTICE
            </span>
            <h2 className="mt-3 text-3xl font-black leading-[1.15] text-snow md:mt-4 md:text-5xl">
              공지사항
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-sm leading-relaxed text-snow-muted">
              시즌 운영 안내와 강습 관련 소식을 확인하세요.
            </p>
            <Link
              href="/notice"
              className="mt-5 inline-flex items-center border border-midnight-border px-5 py-3 text-sm font-black text-snow transition hover:border-neon-orange hover:bg-neon-orange hover:text-white"
            >
              공지사항 더보기
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-midnight-border md:mt-14">
          {notices.map((notice) => (
            <NoticeListItem key={notice.id} notice={notice} />
          ))}
        </div>
      </div>
    </section>
  );
}

export async function Notices() {
  const notices = await getPublishedNotices(50);

  return (
    <section id="notice" className="relative">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-32">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.4em] text-neon-orange md:text-xs">
              NOTICE
            </span>
            <h1 className="mt-3 text-4xl font-black leading-[1.1] text-snow md:mt-4 md:text-6xl">
              공지사항
            </h1>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-snow-muted">
            MAD INTER SKI SCHOOL의 시즌 운영 안내와 주요 소식을 모아두었습니다.
          </p>
        </div>

        {notices.length ? (
          <div className="mt-10 border-t border-midnight-border md:mt-14">
            {notices.map((notice) => (
              <NoticeListItem key={notice.id} notice={notice} />
            ))}
          </div>
        ) : (
          <p className="mt-10 border border-midnight-border bg-midnight-elev p-6 text-sm text-snow-muted">
            아직 등록된 공지사항이 없습니다.
          </p>
        )}
      </div>
    </section>
  );
}

export async function NoticeDetail({ id }: { id: string }) {
  const notice = await getPublishedNoticeById(id);

  if (!notice) {
    return null;
  }

  return (
    <article className="mx-auto max-w-5xl px-5 py-16 md:px-6 md:py-24">
      <Link
        href="/notice"
        className="text-xs font-semibold text-neon-orange underline underline-offset-4"
      >
        공지사항 목록
      </Link>
      <header className="mt-8 border-b border-midnight-border pb-8 md:pb-10">
        <time
          dateTime={new Date(notice.createdAt).toISOString()}
          className="text-xs font-semibold tracking-[0.22em] text-neon-orange"
        >
          {formatDate(notice.createdAt)}
        </time>
        <h1 className="mt-4 text-4xl font-black leading-tight text-snow md:text-6xl">
          {notice.title}
        </h1>
      </header>

      {notice.imageUrl ? (
        <figure className="mt-8 border border-midnight-border bg-midnight-elev md:mt-10">
          <img
            src={notice.imageUrl}
            alt={`${notice.title} 공지 사진`}
            className="block h-auto w-full"
            fetchPriority="high"
          />
        </figure>
      ) : null}

      <div className="mt-8 whitespace-pre-line text-base leading-8 text-snow-dim md:mt-10 md:text-lg md:leading-9">
        {notice.content}
      </div>
    </article>
  );
}
