import Link from "next/link";
import { LessonGuide } from "@/components/LessonGuide";
import { pageMetadata } from "@/lib/seo";

const title = "비발디파크 어린이·주니어 스키 강습";
const description = "MAD INTER SKI SCHOOL은 비발디파크에서 어린이·주니어의 수준에 맞춘 스키 강습을 진행합니다. 장비 적응과 안전한 넘어짐부터 기본 턴, 자세교정, 등급 준비까지 단계적으로 지도합니다.";
export const metadata = pageMetadata("/lessons/junior", title, description);

const sections = [
  { title: "처음 스키를 타는 어린이도 신청할 수 있나요?", text: "처음 배우는 어린이도 상담할 수 있습니다. 장비 착용, 넘어지고 일어서기, 장비 적응, 스노우플라우 턴부터 시작합니다. 아이의 나이와 운동 경험, 현재 수준을 알려주시면 적합한 반을 안내합니다." },
  { title: "강습은 어떤 순서로 진행하나요?", text: "장비 적응과 기초 동작을 익힌 뒤 기본 턴과 체중 이동을 연습합니다. 이후 수준에 맞춰 자세교정과 등급 준비를 진행합니다. 무전 피드백과 영상 분석을 통해 움직임을 설명합니다." },
  { title: "어떤 인원 구성으로 신청할 수 있나요?", text: "주니어 시즌반은 주 1회, 총 8회 기준으로 1:1·1:2·1:3 구성을 운영합니다. 1:1 단기 강습도 안내하고 있습니다. 가능한 일정과 그룹 구성은 예약 상담에서 확인해 주세요." },
  { title: "주니어 강습비는 얼마인가요?", text: "공개된 26/27 시즌 1인 요금은 1:1 8회 150만원, 1:2 8회 110만원, 1:3 8회 90만원이며, 1:1 단기 1회는 20만원입니다. 패찰비가 포함되고 검정료는 등급당 1만 5천원 별도입니다. 그룹 인원 미달 시 추가 요금이 발생합니다." },
  { title: "등급 준비는 어떻게 하나요?", text: "주니어 등급제 속성반을 운영하며 KSIA 등급 인증서와 뱃지 발급 과정을 안내합니다. 아이의 현재 수준과 수업 진행 상황에 맞춰 준비 과정과 목표를 상담해 주세요." },
  { title: "예약 전에 무엇을 확인해야 하나요?", text: "아이의 나이, 스키 경험, 희망 날짜와 인원을 준비해 주세요. 참여 가능 연령, 회당 시간, 리프트·장비 렌탈 비용, 집결 장소와 도착 시간, 보호자 대기, 취소·환불 조건을 예약 전에 상담 채널에서 확인해 주세요." },
];

export default function JuniorPage() {
  return <LessonGuide path="/lessons/junior" title={title} description={description}>
    <section aria-label="어린이 강습 상세 안내" className="mx-auto grid max-w-7xl gap-5 px-5 py-12 md:grid-cols-2 md:px-6 md:py-20">
      {sections.map((section) => <article key={section.title} className="border border-midnight-border bg-midnight-card p-6 md:p-8">
        <h2 className="text-xl font-bold text-snow">{section.title}</h2>
        <p className="mt-4 text-sm leading-7 text-snow-dim">{section.text}</p>
      </article>)}
      <Link href="/pricing" className="text-sm font-semibold text-neon-orange underline underline-offset-4">감독반·코치반 요금과 예약 안내 보기 →</Link>
    </section>
  </LessonGuide>;
}
