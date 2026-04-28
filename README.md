# 🛒 G-Origin Mall  (수정중)

> 김포 지역 특산물 온라인 쇼핑몰
> 
> 지역 소상공인의 디지털 전환과 지역 경제 활성화를 위한 판매자 친화적 상생형 플랫폼
> 지역 브랜드(금빛나루)를 소비자에게 홍보 및 제공

🔗 배포 URL: http://g-origin-mall.s3-website.ap-northeast-2.amazonaws.com/

---

## 🛠 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React (Vite), TailwindCSS, Chart.js |
| Backend | Spring Boot, Java, Lombok |
| DB | MariaDB |
| Infra | AWS (EC2, S3, RDS) |
| 외부 API | 토스페이먼츠, 카카오 주소 |
| 협업 | GitHub, Google Spreadsheet |

---

## ✅ 주요 기능

- 회원 가입·로그인 / 소셜 로그인 (카카오·네이버) / JWT 인증
- 상품 목록·상세 조회 / 카테고리 필터 / 금빛나루 전용관
- 장바구니 / 배송지 관리 (카카오 주소 API)
- 주문 생성 / 토스페이먼츠 실결제 / 주문 취소
- 주문 상태 관리 (결제전→준비중→배송중→완료·취소) 뱃지 표시
- 판매자 상품 등록·수정 / 주문 관리 / 판매자 대시보드
- 관리자 회원·상품·주문·게시판 관리 / 관리자 대시보드 (Chart.js)
- 공지사항 / 고객 문의·답변 게시판


---

## 👥 팀 구성

| 이름 | 역할 |
|------|------|
| 김슬기 | 팀장 / DB설계 / 배송지·장바구니·주문·결제 / 판매자·관리자 대시보드 / AWS / Git |
| 이효진 | 상품 / 배너관리 / 메인 화면 |
| 유재영 | 회원 / 인증 |
| 신시온 | 고객센터 / 어드민 회원·게시판 관리 |

---

## 📁 프로젝트 구조

\```
G-OriginMall/
├── back/   # Spring Boot
└── front/  # React (Vite)
\```
