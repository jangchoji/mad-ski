import Image from "next/image";
import Link from "next/link";
import { getGalleryImages } from "@/lib/gallery";

export async function GallerySummary() {
  const images = await getGalleryImages();

  if (!images.length) {
    return null;
  }

  const marqueeImages = [...images, ...images];

  return (
    <section
      id="gallery"
      className="relative overflow-hidden border-y border-midnight-border bg-midnight-elev/40 py-16 md:py-24"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 md:flex-row md:items-end md:justify-between md:gap-6 md:px-6">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.4em] text-neon-orange md:text-xs">
            GALLERY
          </span>
          <h2 className="mt-3 text-3xl font-black leading-[1.15] text-snow md:mt-4 md:text-5xl">
            현장 사진
          </h2>
        </div>
        <div className="max-w-sm">
          <p className="text-sm leading-relaxed text-snow-muted">
            비발디파크에서 진행한 강습과 라이딩 현장을 짧게 보여드립니다.
          </p>
          <Link
            href="/gallery"
            className="mt-5 inline-flex items-center border border-midnight-border px-5 py-3 text-sm font-black text-snow transition hover:border-neon-orange hover:bg-neon-orange hover:text-white"
          >
            현장 사진 더보기
          </Link>
        </div>
      </div>

      <div className="gallery-marquee mt-10 h-[220px] overflow-hidden md:mt-14 md:h-[320px]">
        <div className="gallery-marquee-track flex h-full w-max gap-3 px-5 md:gap-4 md:px-6">
          {marqueeImages.map((image, index) => (
            <figure
              key={`${image.src}-${index}`}
              aria-hidden={index >= images.length}
              className="relative h-full w-[72vw] shrink-0 overflow-hidden border border-midnight-border bg-midnight-card sm:w-[360px] md:w-[520px]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 520px, 72vw"
                className="object-cover"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function Gallery() {
  const images = await getGalleryImages();

  if (!images.length) {
    return null;
  }

  const [featured, ...rest] = images;

  return (
    <section
      id="gallery"
      className="relative border-y border-midnight-border bg-midnight-elev/40"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-32">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.4em] text-neon-orange md:text-xs">
              GALLERY
            </span>
            <h2 className="mt-3 text-3xl font-black leading-[1.15] text-snow md:mt-4 md:text-5xl">
              현장 사진
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-snow-muted">
            비발디파크에서 진행한 강습과 라이딩 현장을 담았습니다.
          </p>
        </div>

        <div className="mt-10 grid gap-3 md:mt-14 md:grid-cols-12 md:gap-4">
          <figure className="relative aspect-4/3 overflow-hidden bg-midnight-card md:col-span-7 md:row-span-2 md:aspect-auto md:min-h-[520px]">
            <Image
              src={featured.src}
              alt={featured.alt}
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover"
            />
          </figure>

          <div className="grid gap-3 md:col-span-5 md:grid-cols-2 md:gap-4">
            {rest.slice(0, 6).map((image, index) => (
              <figure
                key={image.src}
                className={
                  index === 0
                    ? "relative aspect-4/3 overflow-hidden bg-midnight-card md:col-span-2"
                    : "relative aspect-4/3 overflow-hidden bg-midnight-card"
                }
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 24vw, 50vw"
                  className="object-cover"
                />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
