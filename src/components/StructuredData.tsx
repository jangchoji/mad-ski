import { SITE, SITE_URL } from "@/lib/site";

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
      publisher: {
        "@id": `${SITE_URL}/#localbusiness`,
      },
    },
    {
      "@type": ["LocalBusiness", "SportsActivityLocation"],
      "@id": `${SITE_URL}/#localbusiness`,
      name: SITE.name,
      legalName: SITE.legalName,
      alternateName: ["매드인터스키", "MAD INTER SKI", "MAD SKI"],
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
      sameAs: [SITE.instagram, SITE.youtube],
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
            text: "MAD_INTER SKI는 대명 소노벨 비발디파크에서 성인과 주니어 스키 강습을 진행합니다.",
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
      ],
    },
  ],
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
