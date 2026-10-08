import Image from "next/image";
import { getPublishedReviews } from "@/lib/reviews";

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));

const formatReviewAuthor = (name: string) => {
  const trimmedName = name.trim();
  const visibleName = trimmedName.slice(0, 2);
  const mask = trimmedName.length > 2 ? "*" : "";

  return `${visibleName || "수강"}${mask} 수강생님`;
};

export async function Reviews() {
  const reviews = await getPublishedReviews();

  if (!reviews.length) {
    return null;
  }

  const marqueeReviews = [...reviews, ...reviews];

  return (
    <section
      id="reviews"
      className="relative overflow-hidden py-20 md:py-32"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 md:flex-row md:items-end md:justify-between md:gap-6 md:px-6">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.4em] text-neon-orange md:text-xs">
            REVIEWS
          </span>
          <h2 className="mt-3 text-3xl font-black leading-[1.15] text-snow md:mt-4 md:text-5xl">
            직접 배운 분들의 후기
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-snow-muted">
          비발디파크 현장에서 남겨주신 실제 강습 후기입니다.
        </p>
      </div>

      <div className="review-marquee mt-10 h-[440px] overflow-hidden md:mt-14 md:h-[500px]">
        <div className="review-marquee-track flex h-full w-max gap-4 px-5 md:gap-5 md:px-6">
          {marqueeReviews.map((review, index) => (
            <article
              key={`${review.id}-${index}`}
              aria-hidden={index >= reviews.length}
              className="flex h-full w-[min(82vw,360px)] shrink-0 flex-col border border-midnight-border bg-midnight-card md:w-[390px]"
            >
              {review.imageUrl ? (
                <figure className="relative h-48 shrink-0 overflow-hidden bg-midnight-elev md:h-56">
                  <Image
                    src={review.imageUrl}
                    alt={`${formatReviewAuthor(review.authorName)} 강습 후기 사진`}
                    fill
                    sizes="(min-width: 768px) 390px, 82vw"
                    className="object-cover"
                  />
                </figure>
              ) : (
                <div className="h-12 shrink-0 border-b border-midnight-border bg-midnight-elev md:h-16" />
              )}
              <div className="flex min-h-0 flex-1 flex-col p-5 md:p-6">
                <p className="review-card-text text-base leading-relaxed text-snow-dim">
                  “{review.content}”
                </p>
                <div className="mt-auto flex items-center justify-between gap-4 border-t border-midnight-border pt-4">
                  <p className="text-sm font-black text-snow">
                    {formatReviewAuthor(review.authorName)}
                  </p>
                  <time
                    dateTime={new Date(review.createdAt).toISOString()}
                    className="text-xs font-semibold text-snow-muted"
                  >
                    {formatDate(review.createdAt)}
                  </time>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
