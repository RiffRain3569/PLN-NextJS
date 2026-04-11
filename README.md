# PLN-NextJS

로또 번호 예측·통계 분석·자동 구매를 위한 개인용 웹앱.

## 접속 URL

http://121.138.176.164/

## 기술 스택

- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript
- **Styling**: Emotion CSS-in-JS
- **State**: Recoil (sessionStorage persist)
- **Server State**: TanStack Query (React Query)
- **Theme**: 다크 글래스모피즘, 동행복권 공식 볼 색상 기준

## 시스템 구성

```
브라우저
  └── PLN-NextJS (Next.js, :3000)
        ├── /pages/api/dhl/   → https://www.dhlottery.co.kr (동행복권 프록시)
        └── /pages/api/lotto/ → PLN-predict (:8000, LOTTO_API_HOST 환경변수)
                                      ↓
                                PLN-predict (FastAPI)
                                      ↓
                                lotto.db (SQLite)
```

## 주요 기능

### 당첨 결과 (`/rounds`)
- 역대 회차 당첨번호를 최신순으로 무한 스크롤 표시
- 카드 구성: 회차 번호, 추첨일, 당첨번호 6개 + 보너스볼
- 최신 회차 카드 강조 표시
- 번호 볼: 동행복권 공식 색상 + radial-gradient + glow 효과

### 예측 (`/predict`)
URL 쿼리(`?tab=`)로 탭 상태 유지.

**번호 생성 탭**
- 1~45번 번호별 제외수 토글 + 가중치(0~100) 개별 설정
- 추천 제외수 / 추천 가중치 자동 불러오기 (PLN-predict 연동 예정)
- 생성 수량 입력 후 가중치 기반 랜덤 조합 생성, ban 패턴 자동 필터
- 결과 필터: 홀짝·고저·AC값 체크박스 / 번호합 범위 / 고정수
- 결과 카드별 통계(합·홀짝·고저·AC) 표시 + 서재에 담기
- CSV 다운로드

**추천 제외수 이력 탭**
- 회차별 추천 제외수 목록, 실제 당첨번호 볼은 구간 색상 복원

**추천 가중치 이력 탭**
- 회차별 가중치 내림차순 볼 목록, 볼 아래 가중치 수치 표시

### 통계 (`/stats`)
전역 필터(회차 범위, 보너스 포함 여부)를 공유하는 8개 탭.

| 탭 | 내용 |
|----|------|
| 출현빈도 | 번호별 누적 출현 횟수 바 차트 |
| 핫&콜드 | 최근 자주 나온 번호 / 오래 안 나온 번호 |
| 번호합 | 6개 합계 구간 분포 |
| 홀짝/고저 | 홀짝·고저·색상 구간별 분포 |
| 끝수 | 일의 자리(0~9) 출현 빈도 |
| 번호쌍 | 동시 출현 TOP 20 조합 |
| AC값 | 번호 다양성 지표(0~9) 분포 |
| 마킹패턴 | 로또 용지 형태 히트맵 |

### 서재 (`/saved`)
- `/predict`에서 담은 번호 조합 목록 (로컬스토리지, 최대 1000게임)
- 개별·전체 삭제

### 자동 구매 (홈)
- 동행복권 계정 로그인 (쿠키 기반 UID 인증)
- 잔여 금액 확인
- 제외수·ban 패턴 적용 랜덤 조합 자동 구매 (1회 / 5회)

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 (localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build
npm run start
```

### 환경 변수

`.env.local` 파일 생성:

```env
LOTTO_API_HOST=http://localhost:8000
```

PLN-predict 서버(`~/github/my/PLN-predict`)를 함께 실행해야 예측·통계 API가 동작합니다.

## 프로젝트 구조

```
src/
├── apis/
│   ├── client/          # 클라이언트 fetch 함수 (TanStack Query용)
│   └── server/          # 서버사이드 fetch 함수 (API 라우트용)
├── components/
│   ├── _layout/
│   │   ├── client/      # Header, View, GlobalTheme, 테마 색상
│   │   └── admin/       # 어드민 레이아웃
│   ├── _ui/             # 재사용 UI 컴포넌트 (NumberButton 등)
│   └── client/
│       ├── home/        # 홈(자동구매) 전용 패널
│       └── predict/     # 예측 탭별 컴포넌트 (GenerateTab, ExcludeTab, WeightTab)
├── pages/
│   ├── api/
│   │   ├── dhl/         # 동행복권 프록시 (로그인, 세션, 구매)
│   │   └── lotto/       # PLN-predict 중계 (회차, 통계)
│   ├── rounds.tsx        # 당첨 결과
│   ├── predict.tsx       # 번호 예측
│   ├── stats.tsx         # 통계 분석
│   └── saved.tsx         # 서재
├── store/               # Recoil 상태 (sessionStorage persist)
├── hooks/               # 커스텀 훅
├── constants/
└── utils/               # lotto 유틸 (ban 패턴 등)
```

## 경로 별칭

```
@apis/*       → src/apis/*
@components/* → src/components/*
@constants/*  → src/constants/*
@store/*      → src/store/*
@hooks/*      → src/hooks/*
```
