import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt =
  "MAD INTER SKI SCHOOL 비발디파크 스키 강습 대표 썸네일";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const mainImage = await readFile(join(process.cwd(), "public/images/main.jpeg"));
const mainImageSrc = `data:image/jpeg;base64,${Buffer.from(mainImage).toString(
  "base64",
)}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          color: "#ffffff",
          fontFamily: "Arial, Helvetica, sans-serif",
          overflow: "hidden",
        }}
      >
        <img
          src={mainImageSrc}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.44) 48%, rgba(0,0,0,0.08) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "58px 68px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              maxWidth: 720,
            }}
          >
            <div
              style={{
                color: "#ff3b00",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 6,
              }}
            >
              VIVALDI PARK SKI LESSON
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 78,
                fontWeight: 900,
                lineHeight: 0.96,
                letterSpacing: -2,
              }}
            >
              <span>MAD INTER</span>
              <span>SKI SCHOOL</span>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 34,
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              제대로 배우면, 스키가 달라집니다.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            <span>{SITE_URL_TEXT}</span>
            <span style={{ color: "#ff3b00" }}>대명 소노벨 비발디파크</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

const SITE_URL_TEXT = "mad-ski.co.kr";
