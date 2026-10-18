import Link from "next/link";
import { LessonGuide } from "@/components/LessonGuide";
import { Programs } from "@/components/Programs";
import { pageMetadata } from "@/lib/seo";

const title = "비발디파크 스키 강습 가격·예약 안내";
const description = "MAD INTER SKI SCHOOL의 26/27 시즌 감독반·코치반·주니어반 요금을 비교하세요. 1인 기준 강습비, 포함 비용과 별도 검정료, 예약 전 확인할 사항을 안내합니다.";
export const metadata = pageMetadata("/pricing", title, description);

export default function PricingPage() {
  return <LessonGuide path="/pricing" title={title} description={description}>
    <Programs showLinks={false} />
    <section className="mx-auto max-w-7xl px-5 md:px-6">
      <h2 className="text-2xl font-black text-snow md:text-3xl">강습비와 예약 조건 확인</h2>
      <dl className="mt-8 divide-y divide-midnight-border border-y border-midnight-border">
        {[
          ["요금 기준", "26/27 시즌 1인 기준 요금입니다. 시즌 강습은 총 8회, 감독반 주말 과정은 7회 기준이며 단기 강습은 별도로 표시했습니다."],
          ["포함 비용과 추가 비용", "강습 허가권이 포함됩니다. 주니어반은 패찰비 포함, 검정료는 등급당 1만 5천원 별도입니다. 그룹 인원 미달 시 추가 요금이 발생합니다."],
          ["리프트·렌탈·수업 시간", "리프트권, 스키·의류 렌탈의 포함 여부와 비용, 신청할 반의 회당 강습 시간은 예약 전에 확인해 주세요."],
          ["감독반과 코치반", "감독반은 장우진 감독 직강입니다. 코치반은 코치가 강습을 진행하고 감독이 영상을 확인한 뒤 코치에게 피드백합니다."],
          ["예약 방법", "네이버 예약, 전화 또는 카카오톡으로 희망 프로그램과 날짜를 알려주세요. 주니어 강습은 아이의 나이와 스키 경험도 함께 알려주시면 상담에 도움이 됩니다."],
          ["취소·변경·환불", "예약을 확정하기 전에 취소·일정 변경·환불 조건과 기상 상황에 따른 운영 기준을 상담 채널에서 확인해 주세요."],
        ].map(([label, text]) => <div key={label} className="grid gap-3 py-6 md:grid-cols-[220px_1fr]">
          <dt className="font-bold text-snow">{label}</dt><dd className="text-sm leading-7 text-snow-dim">{text}</dd>
        </div>)}
      </dl>
      <Link href="/lessons/junior" className="mt-8 inline-block text-sm font-semibold text-neon-orange underline underline-offset-4">어린이·주니어 강습 과정 자세히 보기 →</Link>
    </section>
  </LessonGuide>;
}
