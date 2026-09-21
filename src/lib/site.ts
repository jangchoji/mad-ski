export const SITE_URL = "https://www.mad-ski.co.kr";

export const SITE = {
  name: "MAD INTER SKI SCHOOL",
  legalName: "MAD INTER SKI SCHOOL",
  title: "비발디파크 스키 강습 MAD INTER SKI SCHOOL",
  description:
    "대명 소노벨 비발디파크 MAD INTER SKI SCHOOL. 스키어마다 다른 신체 조건과 운동 경험, 현재 수준을 살펴 초급부터 상급까지 체계적인 커리큘럼으로 지도합니다.",
  phone: "010-2007-2883",
  telephone: "+82-10-2007-2883",
  kakao: "mvp8917",
  instagram: "https://instagram.com/mad_skiii",
  youtube: "https://www.youtube.com/channel/UCZRwm9Z2AtsQqPTsI6_slwQ",
  reservationUrl: "https://naver.me/Gy3QiTX4",
  logo: `${SITE_URL}/images/logo.jpeg`,
  image: `${SITE_URL}/images/main.jpeg`,
  address: {
    streetAddress: "서면 한치골길 262",
    addressLocality: "홍천군",
    addressRegion: "강원특별자치도",
    postalCode: "25102",
    addressCountry: "KR",
  },
  locationName: "대명 소노벨 비발디파크",
  businessRegistrationNumber: "834-62-00906",
  mailOrderSalesNumber: "2026-강원춘천-0697",
  keywords: [
    "MAD_INTER SKI",
    "MAD INTER SKI",
    "MAD INTER SKI SCHOOL",
    "MAD SKI",
    "매드인터스키",
    "매드인터스키스쿨",
    "비발디파크 스키 강습",
    "비발디파크. 스키 강습",
    "비발디파크 스키강습",
    "비발디파크 어린이 스키 강습",
    "비발디파크 어린이 스키강습",
    "비발디파크 주니어 스키 강습",
    "비발디파크 성인 스키 강습",
    "비발디파크 성인 스키강습",
    "비발디파크 스키 레슨",
    "비발디파크 스키스쿨",
    "대명 비발디파크 스키 강습",
    "대명 비발디파크 스키강습",
    "소노벨 비발디파크 스키 강습",
    "소노벨 비발디파크 스키",
    "홍천 스키 강습",
    "홍천 스키강습",
    "강원도 스키 강습",
    "강원도 스키강습",
    "어린이 스키 강습",
    "어린이 스키강습",
    "주니어 스키 강습",
    "주니어 스키강습",
    "성인 스키 강습",
    "성인 스키강습",
    "스키 자세교정",
    "스키 카빙 강습",
    "스키 숏턴 강습",
    "장우진 스키",
    "봄내스포츠 스키",
    "로시뇰코리아 스키",
    "스미스코리아 스키",
    "소담송하",
  ],
};

type Partner = {
  name: string;
  displayName: string;
  url: string;
  sameAs?: string;
};

export const PARTNERS: Partner[] = [
  {
    name: "봄내스포츠",
    displayName: "BOMNAE SPORTS",
    url: "https://inflow.pay.naver.com/rd?no=200078383&pType=m&retUrl=https%3A%2F%2Fbomnaesports.com%2F&tr=ds&vcode=5nr37hTMbR0M2dOdVUu0tRJjRhKWPACANio%2BbXn%2BAp3vndYWlU3AMfcR717I4lAPSqV0nNGNk%2FkG5A61oFZ9MF36zUIF8bGWWTKQcp5OpLY%3D",
    sameAs: "https://bomnaesports.com/",
  },
  {
    name: "로시뇰코리아",
    displayName: "ROSSIGNOL KOREA",
    url: "https://danwoosfg.co.kr/",
  },
  {
    name: "스미스코리아",
    displayName: "SMITH KOREA",
    url: "https://www.smithkorea.co.kr/",
  },
  {
    name: "소담송하",
    displayName: "소담송하",
    url: "https://naver.me/GuDQNArz",
  },
];
