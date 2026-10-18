import type { Metadata } from "next";
import Link from "next/link";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin";
import {
  getGalleryStorageConfigurationIssues,
  getGalleryImages,
  isGalleryStorageConfigured,
} from "@/lib/gallery";
import { getPublishedNotices, type Notice } from "@/lib/notices";
import { getPopupAds, type PopupAd } from "@/lib/popup-ads";
import { getReviewCustomers, type ReviewCustomer } from "@/lib/reviews";
import {
  createNoticeAction,
  createPopupAdAction,
  createReviewCustomerAction,
  deleteNoticesAction,
  deletePhotosAction,
  deletePopupAdsAction,
  loginAction,
  logoutAction,
  updateNoticeAction,
  updatePopupAdLinkAction,
  uploadPhotosAction,
} from "./actions";

export const metadata: Metadata = {
  title: "관리자",
  robots: {
    index: false,
    follow: false,
  },
};

const ADMIN_TABS = [
  { id: "notice", label: "공지사항" },
  { id: "popup", label: "팝업 광고" },
  { id: "gallery", label: "사진" },
  { id: "reviews", label: "리뷰 회원" },
] as const;

type AdminTab = (typeof ADMIN_TABS)[number]["id"];

type AdminPageProps = {
  searchParams: Promise<{
    customer?: string;
    deleted?: string;
    error?: string;
    mode?: string;
    notice?: string;
    noticeDeleted?: string;
    noticeId?: string;
    popup?: string;
    popupDeleted?: string;
    tab?: string;
    uploaded?: string;
  }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  login: "아이디 또는 비밀번호를 확인해주세요.",
  customer:
    "회원 정보를 확인해주세요. 이름, 4자 이상 로그인 아이디, 4자 이상 비밀번호가 필요합니다.",
  session: "관리자 로그인이 필요합니다.",
  file: "업로드할 이미지 파일을 다시 확인해주세요. JPG, PNG, WEBP 파일만 가능합니다.",
  delete: "삭제할 사진을 선택해주세요.",
  notice: "공지 제목, 내용, 사진을 모두 입력해주세요.",
  noticeDelete: "삭제할 공지를 선택해주세요.",
  popup: "팝업 이미지를 선택해주세요.",
  popupDelete: "삭제할 팝업 이미지를 선택해주세요.",
  popupLink: "바로가기 링크 주소를 확인해주세요.",
  storage: "Supabase DB와 Cloudflare R2 환경 변수를 먼저 설정해주세요.",
  upload:
    "업로드 중 오류가 발생했습니다. R2 권한, Supabase 테이블, 환경변수를 확인해주세요.",
  r2: "R2 업로드에 실패했습니다. R2 토큰 권한(Object Read & Write), bucket 이름(jangchoji), R2 환경변수를 확인해주세요.",
  supabase:
    "Supabase 저장에 실패했습니다. SQL Editor에서 supabase-gallery.sql을 실행했는지, SUPABASE_URL과 SERVICE_ROLE_KEY가 맞는지 확인해주세요.",
  validation: "입력값을 다시 확인해주세요.",
};

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));

const getSelectedTab = (tab?: string): AdminTab =>
  ADMIN_TABS.some((item) => item.id === tab) ? (tab as AdminTab) : "notice";

function AdminTabs({ selectedTab }: { selectedTab: AdminTab }) {
  return (
    <nav className="mt-6 grid gap-2 sm:grid-cols-4">
      {ADMIN_TABS.map((tab) => {
        const selected = tab.id === selectedTab;

        return (
          <Link
            key={tab.id}
            href={`/admin?tab=${tab.id}`}
            className={
              selected
                ? "border border-neon-orange bg-neon-orange px-4 py-3 text-center text-sm font-black text-white"
                : "border border-midnight-border bg-midnight-card px-4 py-3 text-center text-sm font-black text-snow transition hover:border-neon-orange hover:text-neon-orange"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

function StatusMessages({
  params,
}: {
  params: Awaited<AdminPageProps["searchParams"]>;
}) {
  return (
    <div className="mt-6 grid gap-2">
      {params.uploaded ? (
        <p className="border border-neon-orange bg-neon-orange/5 px-3 py-2 text-sm font-semibold text-neon-orange">
          사진 {params.uploaded}장을 업로드했습니다.
        </p>
      ) : null}
      {params.deleted ? (
        <p className="border border-neon-orange bg-neon-orange/5 px-3 py-2 text-sm font-semibold text-neon-orange">
          사진 {params.deleted}장을 삭제했습니다.
        </p>
      ) : null}
      {params.customer ? (
        <p className="border border-neon-orange bg-neon-orange/5 px-3 py-2 text-sm font-semibold text-neon-orange">
          리뷰 회원을 등록했습니다.
        </p>
      ) : null}
      {params.notice ? (
        <p className="border border-neon-orange bg-neon-orange/5 px-3 py-2 text-sm font-semibold text-neon-orange">
          {params.notice === "updated"
            ? "공지사항을 수정했습니다."
            : "공지사항을 등록했습니다."}
        </p>
      ) : null}
      {params.noticeDeleted ? (
        <p className="border border-neon-orange bg-neon-orange/5 px-3 py-2 text-sm font-semibold text-neon-orange">
          공지사항 {params.noticeDeleted}개를 삭제했습니다.
        </p>
      ) : null}
      {params.popup ? (
        <p className="border border-neon-orange bg-neon-orange/5 px-3 py-2 text-sm font-semibold text-neon-orange">
          {params.popup === "updated"
            ? "팝업 바로가기 링크를 저장했습니다."
            : "팝업 이미지를 등록했습니다."}
        </p>
      ) : null}
      {params.popupDeleted ? (
        <p className="border border-neon-orange bg-neon-orange/5 px-3 py-2 text-sm font-semibold text-neon-orange">
          팝업 이미지 {params.popupDeleted}개를 삭제했습니다.
        </p>
      ) : null}
      {params.error ? (
        <p className="border border-midnight-border bg-midnight-elev px-3 py-2 text-sm text-snow-dim">
          {ERROR_MESSAGES[params.error] ?? ERROR_MESSAGES.file}
        </p>
      ) : null}
    </div>
  );
}

function NoticeCreatePanel() {
  return (
    <section className="border border-midnight-border bg-midnight-card p-5 md:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black">공지사항 작성</h2>
          <p className="mt-2 text-xs leading-relaxed text-snow-muted">
            홈페이지와 공지 상세 페이지에 표시될 공지를 등록합니다.
          </p>
        </div>
        <Link
          href="/admin?tab=notice"
          className="shrink-0 border border-midnight-border px-3 py-2 text-xs font-black transition hover:border-neon-orange hover:text-neon-orange"
        >
          목록
        </Link>
      </div>

      <form action={createNoticeAction} className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold">
          제목
          <input
            name="title"
            type="text"
            maxLength={80}
            required
            className="border border-midnight-border bg-white px-4 py-3 text-base outline-none focus:border-neon-orange"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          내용
          <textarea
            name="content"
            rows={8}
            maxLength={2000}
            required
            className="resize-y border border-midnight-border bg-white px-4 py-3 text-base outline-none focus:border-neon-orange"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          사진
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="w-full border border-midnight-border bg-white p-3 text-sm file:mr-4 file:border-0 file:bg-neon-orange file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
          />
        </label>
        <button
          type="submit"
          className="bg-snow px-5 py-3 text-sm font-black text-white transition hover:bg-neon-orange"
        >
          공지 등록하기
        </button>
      </form>
    </section>
  );
}

function NoticeDetailPanel({ notice }: { notice: Notice }) {
  return (
    <section className="border border-midnight-border bg-midnight-card p-5 md:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-neon-orange">
            {formatDate(notice.createdAt)}
          </p>
          <h2 className="mt-2 text-2xl font-black">{notice.title}</h2>
        </div>
        <Link
          href="/admin?tab=notice"
          className="shrink-0 border border-midnight-border px-3 py-2 text-xs font-black transition hover:border-neon-orange hover:text-neon-orange"
        >
          목록
        </Link>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-[240px_1fr]">
        {notice.imageUrl ? (
          <img
            src={notice.imageUrl}
            alt={`${notice.title} 공지 사진`}
            className="aspect-4/3 w-full border border-midnight-border bg-midnight-elev object-cover"
          />
        ) : (
          <div className="aspect-4/3 border border-midnight-border bg-midnight-elev" />
        )}

        <form action={updateNoticeAction} className="grid gap-4">
          <input type="hidden" name="noticeId" value={notice.id} />
          <label className="grid gap-2 text-sm font-semibold">
            제목
            <input
              name="title"
              type="text"
              maxLength={80}
              defaultValue={notice.title}
              required
              className="border border-midnight-border bg-white px-4 py-3 text-base outline-none focus:border-neon-orange"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            내용
            <textarea
              name="content"
              rows={8}
              maxLength={2000}
              defaultValue={notice.content}
              required
              className="resize-y border border-midnight-border bg-white px-4 py-3 text-base outline-none focus:border-neon-orange"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            사진 교체
            <input
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="w-full border border-midnight-border bg-white p-3 text-sm file:mr-4 file:border-0 file:bg-neon-orange file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
            />
          </label>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <button
              type="submit"
              className="bg-snow px-5 py-3 text-sm font-black text-white transition hover:bg-neon-orange"
            >
              수정 저장
            </button>
            <Link
              href={`/notice/${notice.id}`}
              className="border border-midnight-border px-5 py-3 text-center text-sm font-black transition hover:border-neon-orange hover:text-neon-orange"
            >
              상세 보기
            </Link>
          </div>
        </form>
      </div>

      <form
        action={deleteNoticesAction}
        className="mt-5 border-t border-midnight-border pt-5"
      >
        <input type="hidden" name="noticeIds" value={notice.id} />
        <button
          type="submit"
          className="border border-midnight-border px-5 py-3 text-sm font-black text-snow transition hover:border-neon-orange hover:bg-neon-orange hover:text-white"
        >
          이 공지 삭제
        </button>
      </form>
    </section>
  );
}

function NoticeListPanel({
  notices,
  selectedNotice,
  mode,
}: {
  notices: Notice[];
  selectedNotice: Notice | undefined;
  mode?: string;
}) {
  if (mode === "new") {
    return <NoticeCreatePanel />;
  }

  if (selectedNotice) {
    return <NoticeDetailPanel notice={selectedNotice} />;
  }

  return (
    <section className="border border-midnight-border bg-midnight-card p-5 md:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black">공지사항 목록</h2>
          <p className="mt-2 text-xs leading-relaxed text-snow-muted">
            공지를 선택하면 상세 수정 화면으로 이동합니다.
          </p>
        </div>
        <Link
          href="/admin?tab=notice&mode=new"
          className="shrink-0 bg-snow px-4 py-3 text-xs font-black text-white transition hover:bg-neon-orange"
        >
          새 공지
        </Link>
      </div>

      {notices.length ? (
        <div className="mt-6 border-t border-midnight-border">
          {notices.map((notice) => (
            <Link
              key={notice.id}
              href={`/admin?tab=notice&noticeId=${notice.id}`}
              className="grid gap-2 border-b border-midnight-border py-4 transition hover:border-neon-orange md:grid-cols-[1fr_auto] md:items-center md:gap-6"
            >
              <div>
                <p className="text-lg font-black text-snow">{notice.title}</p>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-snow-dim">
                  {notice.content}
                </p>
              </div>
              <time
                dateTime={new Date(notice.createdAt).toISOString()}
                className="text-xs font-semibold text-snow-muted"
              >
                {formatDate(notice.createdAt)}
              </time>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-6 border border-midnight-border bg-midnight-elev p-5 text-sm text-snow-muted">
          아직 등록된 공지사항이 없습니다.
        </p>
      )}
    </section>
  );
}

function PopupPanel({ popupAds }: { popupAds: PopupAd[] }) {
  return (
    <section className="border border-midnight-border bg-midnight-card p-5 md:p-7">
      <h2 className="text-lg font-black">팝업 광고</h2>
      <p className="mt-2 text-xs leading-relaxed text-snow-muted">
        등록된 이미지가 최신순으로 메인 페이지에 표시됩니다. 바로가기 링크를 입력하면 이미지 클릭 시 새 탭으로 이동합니다.
      </p>

      <form action={createPopupAdAction} className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold">
          팝업 이미지
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="w-full border border-midnight-border bg-white p-3 text-sm file:mr-4 file:border-0 file:bg-neon-orange file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          바로가기 링크 (선택)
          <input
            name="linkUrl"
            type="text"
            inputMode="url"
            placeholder="https://example.com/"
            className="w-full border border-midnight-border bg-white p-3 text-sm"
          />
          <span className="text-xs font-normal text-snow-muted">
            https:// 없이 입력해도 됩니다. 비워두면 이미지 클릭 시 이동하지 않습니다.
          </span>
        </label>
        <button
          type="submit"
          className="bg-snow px-5 py-3 text-sm font-black text-white transition hover:bg-neon-orange"
        >
          팝업 등록하기
        </button>
      </form>

      {popupAds.length ? (
        <div className="mt-7 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {popupAds.map((popupAd, index) => (
            <article
              key={popupAd.id}
              className="border border-midnight-border bg-midnight-elev p-3"
            >
              <img
                src={popupAd.imageUrl}
                alt="등록된 팝업 광고"
                loading="lazy"
                className="aspect-4/3 w-full bg-midnight-card object-contain"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-neon-orange">
                    {index === 0 ? "현재 노출" : "보관"}
                  </p>
                  <p className="mt-1 text-xs text-snow-muted">
                    {formatDate(popupAd.createdAt)}
                  </p>
                </div>
                <form action={deletePopupAdsAction}>
                  <input type="hidden" name="popupIds" value={popupAd.id} />
                  <button
                    type="submit"
                    className="border border-midnight-border px-3 py-2 text-xs font-black text-snow transition hover:border-neon-orange hover:bg-neon-orange hover:text-white"
                  >
                    삭제
                  </button>
                </form>
              </div>
              <form action={updatePopupAdLinkAction} className="mt-4 grid gap-2">
                <input type="hidden" name="popupId" value={popupAd.id} />
                <label className="grid gap-2 text-xs font-semibold">
                  바로가기 링크 (선택)
                  <input
                    name="linkUrl"
                    type="text"
                    inputMode="url"
                    defaultValue={popupAd.linkUrl ?? ""}
                    placeholder="https://example.com/"
                    className="min-w-0 w-full border border-midnight-border bg-white p-2 text-sm"
                  />
                </label>
                <p className="text-xs text-snow-muted">
                  주소를 비우고 저장하면 링크가 제거됩니다.
                </p>
                <button
                  type="submit"
                  className="border border-midnight-border px-3 py-2 text-xs font-black text-snow transition hover:border-neon-orange hover:bg-neon-orange hover:text-white"
                >
                  링크 저장
                </button>
              </form>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-6 border border-midnight-border bg-midnight-elev p-5 text-sm text-snow-muted">
          아직 등록된 팝업 이미지가 없습니다.
        </p>
      )}
    </section>
  );
}

function GalleryPanel({
  galleryImages,
}: {
  galleryImages: Awaited<ReturnType<typeof getGalleryImages>>;
}) {
  return (
    <section className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
      <div className="border border-midnight-border bg-midnight-card p-5 md:p-7">
        <h2 className="text-lg font-black">새 사진 올리기</h2>
        <form action={uploadPhotosAction} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold">
            사진 선택
            <input
              name="photos"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              required
              className="w-full border border-midnight-border bg-white p-3 text-sm file:mr-4 file:border-0 file:bg-neon-orange file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
            />
          </label>
          <p className="text-xs leading-relaxed text-snow-muted">
            한 번에 최대 20장, 파일당 최대 12MB, 총 80MB까지 업로드할 수 있습니다.
          </p>
          <button
            type="submit"
            className="bg-snow px-5 py-3 text-sm font-black text-white transition hover:bg-neon-orange"
          >
            업로드하기
          </button>
        </form>
      </div>

      <div className="border border-midnight-border bg-midnight-card p-5 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-black">업로드된 사진</h2>
          {galleryImages.length ? (
            <span className="text-xs font-semibold text-snow-muted">
              {galleryImages.length}장
            </span>
          ) : null}
        </div>
        {galleryImages.length ? (
          <form action={deletePhotosAction} className="mt-5">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {galleryImages.map((image) => (
                <label
                  key={image.id}
                  className="group relative aspect-4/3 cursor-pointer overflow-hidden bg-midnight-elev"
                >
                  <input
                    type="checkbox"
                    name="photoIds"
                    value={image.id}
                    className="peer absolute left-2 top-2 z-10 size-5 accent-neon-orange"
                    aria-label={`${image.fileName} 삭제 선택`}
                  />
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition group-hover:scale-105 peer-checked:opacity-45"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-black/70 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100 peer-checked:opacity-100">
                    삭제 선택
                  </span>
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="mt-4 w-full border border-midnight-border px-5 py-3 text-sm font-black text-snow transition hover:border-neon-orange hover:bg-neon-orange hover:text-white"
            >
              선택한 사진 삭제
            </button>
          </form>
        ) : (
          <p className="mt-5 text-sm text-snow-muted">
            아직 업로드된 사진이 없습니다.
          </p>
        )}
      </div>
    </section>
  );
}

function ReviewCustomerPanel({
  reviewCustomers,
}: {
  reviewCustomers: ReviewCustomer[];
}) {
  return (
    <section className="border border-midnight-border bg-midnight-card p-5 md:p-7">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-black">리뷰 회원 등록</h2>
          <p className="mt-2 text-xs leading-relaxed text-snow-muted">
            고객에게 리뷰 작성 링크와 발급한 아이디, 비밀번호를 전달하세요.
          </p>
        </div>
        <Link
          href="/review"
          className="text-xs font-semibold text-neon-orange underline underline-offset-4"
        >
          리뷰 작성 페이지
        </Link>
      </div>

      <form
        action={createReviewCustomerAction}
        className="mt-6 grid gap-3 md:grid-cols-2"
      >
        <label className="grid gap-2 text-sm font-semibold">
          이름
          <input
            name="name"
            type="text"
            required
            className="border border-midnight-border bg-white px-4 py-3 text-base outline-none focus:border-neon-orange"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          연락처
          <input
            name="phone"
            type="tel"
            className="border border-midnight-border bg-white px-4 py-3 text-base outline-none focus:border-neon-orange"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          로그인 아이디
          <input
            name="loginId"
            type="text"
            minLength={4}
            required
            className="border border-midnight-border bg-white px-4 py-3 text-base outline-none focus:border-neon-orange"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          비밀번호
          <input
            name="password"
            type="text"
            minLength={4}
            required
            className="border border-midnight-border bg-white px-4 py-3 text-base outline-none focus:border-neon-orange"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold md:col-span-2">
          메모
          <textarea
            name="memo"
            rows={3}
            className="resize-none border border-midnight-border bg-white px-4 py-3 text-base outline-none focus:border-neon-orange"
          />
        </label>
        <button
          type="submit"
          className="bg-snow px-5 py-3 text-sm font-black text-white transition hover:bg-neon-orange md:col-span-2"
        >
          회원 등록하기
        </button>
      </form>

      {reviewCustomers.length ? (
        <div className="mt-6 grid gap-2">
          {reviewCustomers.map((customer) => (
            <div
              key={customer.id}
              className="grid gap-2 border border-midnight-border bg-midnight-elev p-4 text-sm md:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="font-black">{customer.name}</p>
                <p className="mt-1 text-xs text-snow-muted">
                  ID: {customer.loginId}
                  {customer.password
                    ? ` · PW: ${customer.password}`
                    : " · PW: 확인 불가"}
                  {customer.phone ? ` · ${customer.phone}` : ""}
                </p>
                {customer.memo ? (
                  <p className="mt-2 text-xs leading-relaxed text-snow-dim">
                    {customer.memo}
                  </p>
                ) : null}
              </div>
              <Link
                href="/review"
                className="self-start border border-midnight-border px-3 py-2 text-xs font-semibold transition hover:border-neon-orange hover:text-neon-orange"
              >
                링크 열기
              </Link>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const selectedTab = getSelectedTab(params.tab);
  const configured = isAdminConfigured();
  const storageConfigured = isGalleryStorageConfigured();
  const storageConfigurationIssues = getGalleryStorageConfigurationIssues();
  const authenticated = await isAdminAuthenticated();
  const galleryImages = authenticated ? await getGalleryImages() : [];
  const notices = authenticated ? await getPublishedNotices(50) : [];
  const popupAds = authenticated ? await getPopupAds(20) : [];
  const reviewCustomers = authenticated ? await getReviewCustomers() : [];
  const selectedNotice = notices.find((notice) => notice.id === params.noticeId);

  return (
    <main className="min-h-screen bg-midnight px-5 py-10 text-snow md:px-6 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4 border-b border-midnight-border pb-5">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.35em] text-neon-orange">
              ADMIN
            </span>
            <h1 className="mt-2 text-3xl font-black md:text-5xl">
              관리자
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {authenticated ? (
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="border border-midnight-border px-4 py-2 text-xs font-semibold transition hover:border-neon-orange hover:text-neon-orange"
                >
                  로그아웃
                </button>
              </form>
            ) : null}
            <Link
              href="/"
              className="shrink-0 border border-midnight-border px-4 py-2 text-xs font-semibold transition hover:border-neon-orange hover:text-neon-orange"
            >
              홈페이지
            </Link>
          </div>
        </div>

        {!configured ? (
          <section className="mt-8 border border-midnight-border bg-midnight-card p-5 md:p-7">
            <h2 className="text-lg font-black">환경 변수가 필요합니다</h2>
            <p className="mt-3 text-sm leading-relaxed text-snow-dim">
              `.env.local`에 `ADMIN_ID`, `ADMIN_PASSWORD`,
              `ADMIN_SESSION_SECRET`를 설정한 뒤 다시 실행해주세요.
            </p>
          </section>
        ) : authenticated && !storageConfigured ? (
          <section className="mt-8 border border-midnight-border bg-midnight-card p-5 md:p-7">
            <h2 className="text-lg font-black">저장소 연결이 필요합니다</h2>
            <p className="mt-3 text-sm leading-relaxed text-snow-dim">
              Vercel 서버리스에서는 업로드 파일을 로컬에 보관할 수 없습니다.
              Supabase DB와 Cloudflare R2 환경 변수를 `.env.local`과 Vercel에
              설정해주세요.
            </p>
            {storageConfigurationIssues.length ? (
              <div className="mt-5 border border-midnight-border bg-midnight-elev p-4">
                <p className="text-xs font-semibold tracking-[0.2em] text-snow-muted">
                  저장소 설정 확인
                </p>
                <ul className="mt-3 grid gap-1 text-sm font-semibold text-snow-dim">
                  {storageConfigurationIssues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-5 border border-midnight-border bg-midnight-elev p-4 text-sm text-snow-dim">
                필요한 환경변수는 감지됐습니다. 서버를 재시작하거나 Vercel을
                재배포해주세요.
              </p>
            )}
          </section>
        ) : authenticated ? (
          <>
            <AdminTabs selectedTab={selectedTab} />
            <StatusMessages params={params} />
            <div className="mt-6">
              {selectedTab === "notice" ? (
                <NoticeListPanel
                  notices={notices}
                  selectedNotice={selectedNotice}
                  mode={params.mode}
                />
              ) : null}
              {selectedTab === "popup" ? <PopupPanel popupAds={popupAds} /> : null}
              {selectedTab === "gallery" ? (
                <GalleryPanel galleryImages={galleryImages} />
              ) : null}
              {selectedTab === "reviews" ? (
                <ReviewCustomerPanel reviewCustomers={reviewCustomers} />
              ) : null}
            </div>
          </>
        ) : (
          <section className="mt-8 max-w-md border border-midnight-border bg-midnight-card p-5 md:p-7">
            <h2 className="text-lg font-black">관리자 로그인</h2>
            {params.error ? (
              <p className="mt-4 border border-midnight-border bg-midnight-elev px-3 py-2 text-sm text-snow-dim">
                {ERROR_MESSAGES[params.error] ?? ERROR_MESSAGES.login}
              </p>
            ) : null}
            <form action={loginAction} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold">
                아이디
                <input
                  name="id"
                  type="text"
                  autoComplete="username"
                  required
                  className="border border-midnight-border bg-white px-4 py-3 text-base outline-none focus:border-neon-orange"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                비밀번호
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="border border-midnight-border bg-white px-4 py-3 text-base outline-none focus:border-neon-orange"
                />
              </label>
              <button
                type="submit"
                className="mt-2 bg-snow px-5 py-3 text-sm font-black text-white transition hover:bg-neon-orange"
              >
                로그인
              </button>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
