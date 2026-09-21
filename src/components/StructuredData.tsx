import { PARTNERS, SITE, SITE_URL } from "@/lib/site";

const partnerOrganizations = PARTNERS.map((partner) => ({
  "@type": "Organization",
  "@id": `${SITE_URL}/#partner-${partner.name}`,
  name: partner.name,
  alternateName: partner.displayName,
  url: partner.sameAs ?? partner.url,
  sameAs: partner.sameAs ? [partner.url, partner.sameAs] : [partner.url],
}));

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE.name,
      inLanguage: "ko-KR",
      description: SITE.description,
      keywords: SITE.keywords.join(", "),
      publisher: {
        "@id": `${SITE_URL}/#localbusiness`,
      },
    },
    {
      "@type": ["LocalBusiness", "SportsActivityLocation"],
      "@id": `${SITE_URL}/#localbusiness`,
      name: SITE.name,
      legalName: SITE.legalName,
      alternateName: [
        "매드인터스키",
        "매드인터스키스쿨",
        "MAD INTER SKI",
        "MAD INTER SKI SCHOOL",
        "MAD SKI",
        "비발디파크 스키 강습 MAD INTER SKI SCHOOL",
      ],
      url: SITE_URL,
      image: SITE.image,
      logo: SITE.logo,
      telephone: SITE.telephone,
      priceRange: "₩₩",
      description: SITE.description,
      address: {
        "@type": "PostalAddress",
        ...SITE.address,
      },
      areaServed: [
        "비발디파크",
        "홍천",
        "강원특별자치도",
        "수도권",
        "서울",
        "경기",
      ],
      location: {
        "@type": "Place",
        name: SITE.locationName,
        address: {
          "@type": "PostalAddress",
          ...SITE.address,
        },
      },
      sameAs: [
        SITE.instagram,
        SITE.youtube,
        ...PARTNERS.flatMap((partner) =>
          partner.sameAs ? [partner.url, partner.sameAs] : [partner.url],
        ),
      ],
      knowsAbout: [
        "비발디파크 스키 강습",
        "비발디파크 어린이 스키 강습",
        "비발디파크 성인 스키 강습",
        "스키 자세교정",
        "스키 카빙 강습",
        "스키 숏턴 강습",
      ],
      subjectOf: partnerOrganizations.map((partner) => ({
        "@id": partner["@id"],
      })),
      potentialAction: {
        "@type": "ReserveAction",
        name: "비발디파크 스키 강습 예약하기",
        target: SITE.reservationUrl,
      },
      identifier: [
        {
          "@type": "PropertyValue",
          propertyID: "사업자등록번호",
          value: SITE.businessRegistrationNumber,
        },
        {
          "@type": "PropertyValue",
          propertyID: "통신판매업 신고번호",
          value: SITE.mailOrderSalesNumber,
        },
      ],
      makesOffer: {
        "@type": "OfferCatalog",
        name: "비발디파크 스키 강습 프로그램",
        itemListElement: [
          "비발디파크 장우진 감독반 1:1 스키 강습",
          "비발디파크 코치반 자세교정 스키 강습",
          "비발디파크 주니어 스키 강습",
          "비발디파크 초급 스키 입문 강습",
          "비발디파크 카빙·숏턴 상급 스키 강습",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name,
            serviceType: "비발디파크 스키 강습",
            url: SITE.reservationUrl,
            provider: {
              "@id": `${SITE_URL}/#localbusiness`,
            },
            areaServed: "대명 소노벨 비발디파크",
          },
        })),
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "비발디파크 스키 강습은 어디에서 진행하나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "MAD INTER SKI SCHOOL은 대명 소노벨 비발디파크에서 성인과 주니어 스키 강습을 진행합니다.",
          },
        },
        {
          "@type": "Question",
          name: "초보자도 신청할 수 있나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "비발디파크 초급 스키 강습부터 중급 자세교정, 상급 카빙과 숏턴까지 레벨별 커리큘럼으로 진행합니다.",
          },
        },
        {
          "@type": "Question",
          name: "비발디파크 자세교정 스키 강습은 어떻게 진행되나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "실시간 무전 피드백, 캠코더 촬영, 당일 영상 분석을 통해 자세와 체중 이동을 교정합니다.",
          },
        },
        {
          "@type": "Question",
          name: "비발디파크 어린이 스키 강습도 예약할 수 있나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "어린이와 주니어 회원을 위한 비발디파크 스키 강습을 운영하며, 초급 입문부터 자세교정과 등급 준비까지 레벨에 맞춰 진행합니다.",
          },
        },
        {
          "@type": "Question",
          name: "비발디파크 성인 스키 강습은 어떤 방식인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "성인 스키 강습은 개인의 신체 특성과 운동 성향에 맞춰 영상 분석, 무전 피드백, 자세교정 중심으로 진행합니다.",
          },
        },
      ],
    },
    ...partnerOrganizations,
  ],
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
