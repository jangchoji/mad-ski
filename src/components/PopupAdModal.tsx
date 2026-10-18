"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { PopupAd } from "@/lib/popup-ads";

const STORAGE_KEY = "mad-ski-popup-hidden-date";

const getTodayKey = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${date}`;
};

export function PopupAdModal({ popupAds }: { popupAds: PopupAd[] }) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!popupAds.length) {
      return;
    }

    const hiddenDate = window.localStorage.getItem(STORAGE_KEY);

    if (hiddenDate !== getTodayKey()) {
      setCurrentIndex(0);
      setOpen(true);
    }
  }, [popupAds.length]);

  if (!popupAds.length || !open) {
    return null;
  }

  const currentPopupAd = popupAds[currentIndex];

  if (!currentPopupAd) {
    return null;
  }

  const closeCurrent = () => {
    if (currentIndex < popupAds.length - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    setOpen(false);
  };

  const closeForToday = () => {
    window.localStorage.setItem(STORAGE_KEY, getTodayKey());
    setOpen(false);
  };

  const popupImage = (
    <Image
      src={currentPopupAd.imageUrl}
      alt="MAD INTER SKI SCHOOL 안내 팝업"
      width={1040}
      height={1300}
      priority
      className="h-auto max-h-[72vh] w-full object-contain"
    />
  );

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-5 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="팝업 광고"
    >
      <div className="max-h-[calc(100dvh-4rem)] w-full max-w-[520px] overflow-y-auto border border-midnight-border bg-midnight-card shadow-2xl">
        {popupAds.length > 1 ? (
          <div className="border-b border-midnight-border bg-midnight-card px-4 py-2 text-right text-xs font-semibold text-snow-muted">
            {currentIndex + 1} / {popupAds.length}
          </div>
        ) : null}
        <div className="relative max-h-[72vh] min-h-[260px] bg-midnight-elev">
          {currentPopupAd.linkUrl ? (
            <a
              href={currentPopupAd.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="팝업 광고 바로가기 (새 탭)"
              className="block focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neon-orange"
            >
              {popupImage}
            </a>
          ) : popupImage}
        </div>
        {currentPopupAd.linkUrl ? (
          <a
            href={currentPopupAd.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border-t border-midnight-border bg-neon-orange/5 px-4 py-3 text-center text-xs font-semibold text-neon-orange transition hover:bg-neon-orange/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neon-orange"
          >
            이미지를 클릭하면 자세히 볼 수 있어요
            <span aria-hidden="true">↗</span>
            <span className="sr-only">(새 탭에서 열림)</span>
          </a>
        ) : null}
        <div className="grid grid-cols-2 border-t border-midnight-border">
          <button
            type="button"
            onClick={closeCurrent}
            className="min-h-12 border-r border-midnight-border px-4 py-3 text-sm font-black text-snow transition hover:bg-midnight-elev"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={closeForToday}
            className="min-h-12 px-4 py-3 text-sm font-black text-snow transition hover:bg-neon-orange hover:text-white"
          >
            오늘 하루 안보기
          </button>
        </div>
      </div>
    </div>
  );
}
