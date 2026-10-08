import type { Metadata } from "next";
import Link from "next/link";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin";
import {
  getGalleryStorageConfigurationIssues,
  getGalleryImages,
  isGalleryStorageConfigured,
} from "@/lib/gallery";
import { getReviewCustomers } from "@/lib/reviews";
import {
  createReviewCustomerAction,
  deletePhotosAction,
  loginAction,
  logoutAction,
  uploadPhotosAction,
} from "./actions";

export const metadata: Metadata = {
  title: "관리자",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminPageProps = {
  searchParams: Promise<{
    customer?: string;
    deleted?: string;
    error?: string;
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
  storage: "Supabase DB와 Cloudflare R2 환경 변수를 먼저 설정해주세요.",
  upload:
    "업로드 중 오류가 발생했습니다. R2 권한, Supabase 테이블, 환경변수를 확인해주세요.",
  r2: "R2 업로드에 실패했습니다. R2 토큰 권한(Object Read & Write), bucket 이름(jangchoji), R2 환경변수를 확인해주세요.",
  supabase:
    "Supabase 저장에 실패했습니다. SQL Editor에서 supabase-gallery.sql을 실행했는지, SUPABASE_URL과 SERVICE_ROLE_KEY가 맞는지 확인해주세요.",
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const configured = isAdminConfigured();
  const storageConfigured = isGalleryStorageConfigured();
  const storageConfigurationIssues = getGalleryStorageConfigurationIssues();
  const authenticated = await isAdminAuthenticated();
  const galleryImages = authenticated ? await getGalleryImages() : [];
  const reviewCustomers = authenticated ? await getReviewCustomers() : [];

  return (
    <main className="min-h-screen bg-midnight px-5 py-10 text-snow md:px-6 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4 border-b border-midnight-border pb-5">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.35em] text-neon-orange">
              ADMIN
            </span>
            <h1 className="mt-2 text-3xl font-black md:text-5xl">
              사진 업로드
            </h1>
          </div>
          <Link
            href="/"
            className="shrink-0 border border-midnight-border px-4 py-2 text-xs font-semibold transition hover:border-neon-orange hover:text-neon-orange"
          >
            홈페이지
          </Link>
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
            <form action={logoutAction} className="mt-6">
              <button
                type="submit"
                className="text-xs font-semibold text-snow-muted underline underline-offset-4 transition hover:text-neon-orange"
              >
                로그아웃
              </button>
            </form>
          </section>
        ) : authenticated ? (
          <section className="mt-8 grid gap-6 md:grid-cols-[1fr_1.4fr]">
            <div className="border border-midnight-border bg-midnight-card p-5 md:p-7">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-black">새 사진 올리기</h2>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="text-xs font-semibold text-snow-muted underline underline-offset-4 transition hover:text-neon-orange"
                  >
                    로그아웃
                  </button>
                </form>
              </div>

              {params.uploaded ? (
                <p className="mt-4 border border-neon-orange bg-neon-orange/5 px-3 py-2 text-sm font-semibold text-neon-orange">
                  사진 {params.uploaded}장을 업로드했습니다.
                </p>
              ) : null}

              {params.deleted ? (
                <p className="mt-4 border border-neon-orange bg-neon-orange/5 px-3 py-2 text-sm font-semibold text-neon-orange">
                  사진 {params.deleted}장을 삭제했습니다.
                </p>
              ) : null}

              {params.customer ? (
                <p className="mt-4 border border-neon-orange bg-neon-orange/5 px-3 py-2 text-sm font-semibold text-neon-orange">
                  리뷰 회원을 등록했습니다.
                </p>
              ) : null}

              {params.error ? (
                <p className="mt-4 border border-midnight-border bg-midnight-elev px-3 py-2 text-sm text-snow-dim">
                  {ERROR_MESSAGES[params.error] ?? ERROR_MESSAGES.file}
                </p>
              ) : null}

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
                  한 번에 최대 20장, 파일당 최대 12MB, 총 80MB까지 업로드할 수
                  있습니다. 여러 장은 동시에 R2로 업로드됩니다.
                </p>
                <button
                  type="submit"
                  className="mt-2 bg-snow px-5 py-3 text-sm font-black text-white transition hover:bg-neon-orange"
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

            <div className="border border-midnight-border bg-midnight-card p-5 md:col-span-2 md:p-7">
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
            </div>
          </section>
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
