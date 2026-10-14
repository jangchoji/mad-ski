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

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-5 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="팝업 광고"
    >
      <div className="w-full max-w-[520px] overflow-hidden border border-midnight-border bg-midnight-card shadow-2xl">
        {popupAds.length > 1 ? (
          <div className="border-b border-midnight-border bg-midnight-card px-4 py-2 text-right text-xs font-semibold text-snow-muted">
            {currentIndex + 1} / {popupAds.length}
          </div>
        ) : null}
        <div className="relative max-h-[72vh] min-h-[260px] bg-midnight-elev">
          <Image
            src={currentPopupAd.imageUrl}
            alt="MAD INTER SKI SCHOOL 안내 팝업"
            width={1040}
            height={1300}
            priority
            className="h-auto max-h-[72vh] w-full object-contain"
          />
        </div>
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
