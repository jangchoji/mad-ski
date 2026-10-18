# 검색 등록과 배포 확인

## 네이버 서치어드바이저: 홈페이지 검색 수집 관리

1. https://searchadvisor.naver.com/ 에서 로그인하고 웹마스터 도구를 엽니다.
2. 사이트 등록에 `https://www.madski.co.kr`을 입력합니다. 사이트맵 및 canonical과 같은 HTTPS/www 주소를 사용합니다.
3. 소유확인에서 HTML 태그 방식을 선택합니다.
4. 표시되는 `<meta name="naver-site-verification" content="...">`에서 content 값만 복사합니다.
5. 배포 서비스의 환경변수에 `NAVER_SITE_VERIFICATION`을 추가하고 해당 값을 저장합니다. 로컬 검증은 `.env.local`에 설정할 수 있습니다. 전체 HTML 태그를 값에 넣지 않습니다.
6. 재배포 후 홈의 HTML에 해당 메타 태그가 있는지 확인하고 네이버 화면에서 소유확인을 완료합니다.
7. 요청 → 사이트맵 제출에서 `https://www.madski.co.kr/sitemap.xml`을 제출합니다. 주소 앞부분이 고정된 입력창에서는 `sitemap.xml`만 입력합니다.
8. 웹페이지 수집 요청으로 홈, `/lessons/junior`, `/pricing` 등 주요 페이지를 요청합니다.
9. 사이트 진단과 수집·색인 현황을 확인합니다. 등록·수집 요청은 검색 노출이나 순위를 보장하지 않습니다.

공식 안내:
- 소유확인: https://help.naver.com/service/30010/bookmark/17591
- 사이트맵 제출: https://searchadvisor.naver.com/guide/request-feed

## 네이버 스마트플레이스: 지도·업체 정보

https://new.smartplace.naver.com/ 에서 기존 업체가 있는지 먼저 확인합니다. 등록되어 있다면 중복 신청 대신 주인 변경(관리 권한 확보)을 진행합니다. 신규 등록에는 사업자등록증이 필요하며 업종에 따라 추가 서류·등록 기준이 적용됩니다.

업체명, 실제 사업장 주소, 연락처, 홈페이지와 예약 정보를 일치시킵니다. 강습 장소인 비발디파크 주소를 확인 없이 사업장 주소로 등록하지 않습니다. 기존 네이버 예약 링크가 연결된 업체 정보가 있는지도 먼저 확인합니다.

공식 안내: https://help.naver.com/service/30026/contents/20366?lang=ko&osType=COMMONOS

## Google Search Console

https://search.google.com/search-console/ 에서 도메인 속성은 DNS로 소유확인합니다. URL 접두어 속성의 HTML 태그 방식을 사용한다면 `GOOGLE_SITE_VERIFICATION` 환경변수에 content 값만 저장하고 재배포합니다. 사이트맵은 `/sitemap.xml`입니다.

## 프로젝트 반영 범위와 검증

- 공개 페이지마다 자기 자신의 canonical 및 공유 메타데이터를 지정합니다.
- FAQ 화면과 JSON-LD는 `src/lib/faqs.ts`의 동일한 원본을 사용합니다.
- 강습 장소 주소는 장소 정보로만 사용합니다. 실제 사업장 주소가 확인되면 사업체 구조화 데이터에 별도로 추가할 수 있습니다.
- `/lessons/junior`, `/pricing`은 기존에 공개된 내용과 요금을 사용합니다. 가격 표시는 기존 `Programs` 컴포넌트를 재사용합니다.
- 사이트맵은 공개 공지 ID를 페이지 단위로 모두 가져오고 비공개 공지는 제외합니다. 실제 수정일이 저장되지 않은 상태에서 lastmod를 임의 생성하지 않습니다.
- 참여 연령, 리프트·렌탈 포함 여부, 회당 시간, 집결 장소, 보호자 안내, 취소·환불·기상 정책은 운영자 확인 후 구체적인 문구로 보완해야 합니다.
- 유입·예약 전환 측정에는 별도의 분석 서비스 설정과 측정 ID가 필요합니다. 현재 이 변경은 분석 스크립트를 추가하지 않습니다.
- 운영 사이트의 Search Console·서치어드바이저 계정 등록 및 실제 배포는 별도 작업입니다.
