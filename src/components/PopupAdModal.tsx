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

export function PopupAdModal({ popupAd }: { popupAd: PopupAd | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!popupAd) {
      return;
    }

    const hiddenDate = window.localStorage.getItem(STORAGE_KEY);

    if (hiddenDate !== getTodayKey()) {
      setOpen(true);
    }
  }, [popupAd]);

  if (!popupAd || !open) {
    return null;
  }

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
        <div className="relative max-h-[72vh] min-h-[260px] bg-midnight-elev">
          <Image
            src={popupAd.imageUrl}
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
            onClick={() => setOpen(false)}
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
