import type { Metadata } from "next";
import Link from "next/link";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin";
import {
  getGalleryImages,
  getMissingGalleryEnvironmentVariables,
  isGalleryStorageConfigured,
} from "@/lib/gallery";
import { loginAction, logoutAction, uploadPhotosAction } from "./actions";

export const metadata: Metadata = {
  title: "관리자",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminPageProps = {
  searchParams: Promise<{
    error?: string;
    uploaded?: string;
  }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  login: "아이디 또는 비밀번호를 확인해주세요.",
  session: "관리자 로그인이 필요합니다.",
  file: "업로드할 이미지 파일을 다시 확인해주세요. JPG, PNG, WEBP 파일만 가능합니다.",
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
  const missingStorageVariables = getMissingGalleryEnvironmentVariables();
  const authenticated = await isAdminAuthenticated();
  const galleryImages = authenticated ? await getGalleryImages() : [];

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
            {missingStorageVariables.length ? (
              <div className="mt-5 border border-midnight-border bg-midnight-elev p-4">
                <p className="text-xs font-semibold tracking-[0.2em] text-snow-muted">
                  누락된 환경변수
                </p>
                <ul className="mt-3 grid gap-1 text-sm font-semibold text-snow-dim">
                  {missingStorageVariables.map((key) => (
                    <li key={key}>{key}</li>
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
                  한 번에 최대 10장, 파일당 최대 12MB까지 업로드할 수
                  있습니다. 업로드한 사진은 홈페이지 갤러리에 바로 표시됩니다.
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
              <h2 className="text-lg font-black">업로드된 사진</h2>
              {galleryImages.length ? (
                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {galleryImages.slice(0, 12).map((image) => (
                    <figure
                      key={image.src}
                      className="relative aspect-4/3 overflow-hidden bg-midnight-elev"
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="h-full w-full object-cover"
                      />
                    </figure>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-snow-muted">
                  아직 업로드된 사진이 없습니다.
                </p>
              )}
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
