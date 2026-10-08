import type { Metadata } from "next";
import Link from "next/link";
import { getReviewSessionCustomer } from "@/lib/review-session";
import {
  reviewLoginAction,
  reviewLogoutAction,
  submitReviewAction,
} from "./actions";

export const metadata: Metadata = {
  title: "리뷰 작성",
  robots: {
    index: false,
    follow: false,
  },
};

type ReviewPageProps = {
  searchParams: Promise<{
    error?: string;
    submitted?: string;
  }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  login: "아이디 또는 비밀번호를 확인해주세요.",
  session: "다시 로그인한 뒤 리뷰를 작성해주세요.",
  content: "리뷰는 10자 이상 작성해주세요.",
  image: "사진은 JPG, PNG, WEBP 형식으로 8MB 이하만 업로드할 수 있습니다.",
  r2: "사진 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.",
  supabase: "리뷰 저장에 실패했습니다. 잠시 후 다시 시도해주세요.",
  validation: "입력 내용을 다시 확인해주세요.",
  review: "리뷰 등록 중 오류가 발생했습니다.",
};

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const params = await searchParams;
  const customer = await getReviewSessionCustomer();

  return (
    <main className="min-h-screen bg-midnight px-5 py-10 text-snow md:px-6 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-midnight-border pb-5">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.35em] text-neon-orange">
              REVIEW
            </span>
            <h1 className="mt-2 text-3xl font-black md:text-5xl">
              강습 후기 작성
            </h1>
          </div>
          <Link
            href="/"
            className="shrink-0 border border-midnight-border px-4 py-2 text-xs font-semibold transition hover:border-neon-orange hover:text-neon-orange"
          >
            홈페이지
          </Link>
        </div>

        <section className="mt-8 border border-midnight-border bg-midnight-card p-5 md:p-7">
          {customer ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black">{customer.name}님</h2>
                  <p className="mt-2 text-sm leading-relaxed text-snow-muted">
                    MAD INTER SKI 강습 후기를 남겨주세요. 작성한 후기는 홈페이지에
                    공개됩니다.
                  </p>
                </div>
                <form action={reviewLogoutAction}>
                  <button
                    type="submit"
                    className="text-xs font-semibold text-snow-muted underline underline-offset-4 transition hover:text-neon-orange"
                  >
                    로그아웃
                  </button>
                </form>
              </div>

              {params.submitted ? (
                <p className="mt-5 border border-neon-orange bg-neon-orange/5 px-3 py-2 text-sm font-semibold text-neon-orange">
                  리뷰가 등록됐습니다. 감사합니다.
                </p>
              ) : null}

              {params.error ? (
                <p className="mt-5 border border-midnight-border bg-midnight-elev px-3 py-2 text-sm text-snow-dim">
                  {ERROR_MESSAGES[params.error] ?? ERROR_MESSAGES.review}
                </p>
              ) : null}

              <form action={submitReviewAction} className="mt-6 grid gap-4">
                <label className="grid gap-2 text-sm font-semibold">
                  후기
                  <textarea
                    name="content"
                    rows={8}
                    minLength={10}
                    maxLength={1200}
                    required
                    className="resize-none border border-midnight-border bg-white px-4 py-3 text-base leading-relaxed outline-none focus:border-neon-orange"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  사진
                  <input
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="w-full border border-midnight-border bg-white p-3 text-sm file:mr-4 file:border-0 file:bg-neon-orange file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
                  />
                </label>
                <p className="text-xs leading-relaxed text-snow-muted">
                  사진은 선택 사항이며, JPG/PNG/WEBP 파일 1장, 최대 8MB까지 업로드할 수 있습니다.
                </p>
                <button
                  type="submit"
                  className="mt-2 bg-snow px-5 py-3 text-sm font-black text-white transition hover:bg-neon-orange"
                >
                  후기 등록하기
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-lg font-black">리뷰 회원 로그인</h2>
              <p className="mt-3 text-sm leading-relaxed text-snow-muted">
                관리자에게 전달받은 아이디와 비밀번호로 로그인해주세요.
              </p>

              {params.error ? (
                <p className="mt-5 border border-midnight-border bg-midnight-elev px-3 py-2 text-sm text-snow-dim">
                  {ERROR_MESSAGES[params.error] ?? ERROR_MESSAGES.login}
                </p>
              ) : null}

              <form action={reviewLoginAction} className="mt-6 grid gap-4">
                <label className="grid gap-2 text-sm font-semibold">
                  아이디
                  <input
                    name="loginId"
                    type="text"
                    autoComplete="username"
                    minLength={4}
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
                    minLength={4}
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
            </>
          )}
        </section>
      </div>
    </main>
  );
}
