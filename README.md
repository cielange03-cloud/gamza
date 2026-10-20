# 🥔 감자 (Gamza) - 포슬포슬 따뜻한 우리 동네 중고거래

이웃과 가깝고 따뜻하게 직거래하는 중고거래 웹 서비스 **감자(Gamza)** 입니다.  
따뜻한 감자 브라운 & 크림 톤 디자인 시스템과 **Supabase(Database · Auth · Storage)** 실시간 백엔드가 연동되어 있습니다.

---

## ✨ 주요 기능

1. **실시간 매물 목록 및 필터링 (`js/list.js`)**
   - 카테고리별 필터 (`전체`, `디지털기기`, `가구/인테리어`, `의류`, `생활가전`, `도서/티켓`, `기타`)
   - 실시간 검색 (상품명, 동네 이름, 카테고리, 작성자 닉네임, 상세 설명)
   - **거래 가능만 보기** 스위치 (`판매중` 상태 매물만 모아보기 및 `거래 완료` 매물 흐림 처리)
2. **회원가입 · 로그인 (`js/auth.js`)**
   - Supabase Auth 기반 이메일/비밀번호 회원가입 및 로그인
   - 개인 식별 정보(실명·전화번호 등)를 공개 테이블에 저장하지 않고, 익명 `UUID`와 **닉네임(`public.profiles`)**으로만 작성자 식별
3. **내 물건 팔기 및 사진 업로드 (`js/write.js`)**
   - 비로그인 상태에서 **[+ 글쓰기]** 클릭 시 로그인 모달 자동 연결 후 글쓰기 화면 전환
   - 기기 이미지 파일 선택 시 **Supabase Storage (`product-images` 버킷)** 업로드 (미첨부 시 카테고리별 감자 테마 일러스트 자동 생성)
4. **상품 상세 모달 및 내 게시글 관리 (`js/detail.js`)**
   - 본인이 작성한 게시글 클릭 시 **판매 상태 즉시 변경 (`판매중` / `예약중` / `거래 완료`)**
   - 본인 게시글 **수정 / 삭제** 기능 및 Supabase DB 즉시 반영

---

## 📂 프로젝트 폴더 구조

```text
gamza/
├── index.html              # 메인 엔트리 HTML
├── css/
│   ├── common.css          # 공통 디자인 토큰 및 버튼/배지 스타일
│   ├── list.css            # 상품 목록 및 헤더 스타일
│   ├── detail.css          # 상세 팝업 및 내 게시글 관리 영역 스타일
│   ├── write.css           # 글쓰기/수정 모달 스타일
│   └── auth.css            # 로그인/회원가입 모달 스타일
├── js/
│   ├── supabase-config.js  # Supabase 공개 URL 및 Anon Key 클라이언트 설정
│   ├── data.js             # GamzaStore 상태 관리 및 Supabase Auth/DB/Storage 연동
│   ├── list.js             # 상품 목록 화면 렌더링 및 필터/헤더 제어
│   ├── detail.js           # 상품 상세 팝업 및 작성자 상태 변경·수정·삭제
│   ├── write.js            # 내 물건 팔기 / 게시글 수정 모달
│   ├── auth.js             # 이메일 로그인 / 회원가입 모달
│   └── app.js              # 전체 모듈 초기화 컨트롤러
├── .gitignore              # .env 등 민감 파일 제외 설정
└── .env.example            # 환경 변수 예시 파일
```

---

## 🚀 실행 및 배포 방법

별도의 빌드 과정 없는 순수 정적 웹(HTML/CSS/Vanilla JS) 구조로, 아래 플랫폼에 바로 배포할 수 있습니다.

- **GitHub Pages**: 저장소 `Settings` → `Pages` → `Branch: main / (root)` 선택 후 저장
- **Vercel / Netlify**: GitHub `gamza` 저장소 연결 후 Build Command 없이 루트(`.`) 배포
