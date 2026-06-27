# 타임머신 CRM - 구조 설계서

> 이 문서는 타임머신 CRM의 장기 구조를 잡기 위한 집 설계도입니다.
> 기존 코드는 핵심 기능만 보존하고, 새 구조는 수정과 확장이 쉬운 Creator OS형 구조를 목표로 합니다.

---

## 1. 핵심 방향

타임머신 CRM은 단순한 유튜브 조회 앱이 아니라, 크리에이터가 매일 사용하는 소재 발굴 OS입니다.

핵심 흐름은 다음과 같습니다.

```txt
채널 등록 → 데이터 수집 → 영상 발굴 → 또터또 판단 → 스크랩 → 리메이크 기획
```

앞으로의 개발은 기존 기능을 버리는 것이 아니라, 이 흐름에 맞게 역할을 나누고 화면을 재배치하는 방식으로 진행합니다.

---

## 2. 기존 코드에서 반드시 보존할 기능

- 채널 등록
- 채널 미리보기
- 채널 일괄 추가
- 태그/카테고리/언어 관리
- Azure Function API 연동
- 클라우드 채널 목록 불러오기
- 채널 스캔 요청
- 수집된 영상 조회
- 쇼츠/롱폼 구분
- 조회수/성과배수/일조회수/좋아요 비율 정렬
- 6개월 이상 지난 영상 기반 또터또 발굴
- 댓글 Top 10 조회
- 영상 스크랩
- AI 리메이크 프롬프트 복사

---

## 3. 최종 목표 폴더 구조

```txt
src/
├─ app/
│  ├─ App.jsx
│  ├─ AppLayout.jsx
│  ├─ routes.js
│  └─ navigation.js
│
├─ config/
│  └─ index.js
│
├─ features/
│  ├─ dashboard/
│  ├─ channels/
│  ├─ videos/
│  ├─ ttotto/
│  ├─ scrapbook/
│  └─ settings/
│
├─ services/
│  ├─ functionApi.js
│  ├─ youtubeApi.js
│  └─ storage.js
│
├─ components/
│  ├─ layout/
│  └─ common/
│
├─ constants/
│  ├─ categories.js
│  ├─ languages.js
│  └─ sortOptions.js
│
├─ hooks/
│  ├─ useChannels.js
│  ├─ useVideos.js
│  ├─ useScrapbook.js
│  └─ useLocalStorage.js
│
├─ utils/
│  ├─ formatters.js
│  ├─ dates.js
│  └─ prompts.js
│
├─ main.jsx
└─ index.css
```

---

## 4. App.jsx의 최종 역할

`App.jsx`는 전체 기능을 직접 처리하지 않습니다.

최종적으로 App.jsx는 다음 역할만 담당합니다.

- 앱 레이아웃 연결
- 현재 화면 선택
- 공통 알림/에러 표시
- 전역 상태 최소 연결

App.jsx에서 제거해야 할 책임은 다음과 같습니다.

- API 호출
- 영상 필터링/정렬
- 프롬프트 생성
- 채널 폼 전체 구현
- 영상 카드 반복 UI
- localStorage 직접 제어

---

## 5. 화면 구조

```txt
Topbar
└─ 앱 이름 / 현재 작업 / 연결 상태 / 빠른 실행

Sidebar
├─ 대시보드
├─ 채널 관리
├─ 영상 발굴
├─ 또터또 모드
├─ 스크랩북
└─ 설정

Main Content
└─ 선택된 기능 화면
```

---

## 6. 화면별 역할

### 대시보드

앱의 관제실입니다.

- 등록 채널 수
- 수집 영상 수
- 최근 스캔 상태
- 또터또 후보 수
- 최근 스크랩 수
- 오늘 볼 만한 후보

### 채널 관리

수집 대상 채널을 관리합니다.

- 단일 채널 추가
- 일괄 채널 추가
- 채널 미리보기
- 태그/언어 지정
- 채널 메모
- 태그별 채널 목록
- 스캔 실행

### 영상 발굴

수집된 영상에서 좋은 소재를 찾습니다.

- 키워드 검색
- 조회수 필터
- 쇼츠/롱폼 필터
- 정렬 옵션
- 영상 카드
- 댓글 분석
- 스크랩
- AI 프롬프트 복사

### 또터또 모드

오래됐지만 다시 쓸 수 있는 떡상 소재를 찾습니다.

- 180일 이상 지난 영상
- 채널 평균 대비 높은 성과
- 리메이크 가능성 높은 제목 구조
- 댓글 반응이 강한 영상
- 향후 점수화 예정

### 스크랩북

발굴한 소재를 저장하고 제작 후보로 관리합니다.

- 스크랩 영상 목록
- 메모
- 상태값: 미검토 / 분석중 / 대본화 / 제작완료
- 태그
- 원본 바로가기
- AI 프롬프트 복사

### 설정

기술 설정과 연결 상태를 모읍니다.

- YouTube API Key 안내
- Azure Function API Base URL
- CORS 오류 안내
- 로컬 실행 안내
- 배포 상태 안내

---

## 7. 데이터 흐름

### 채널 데이터

```txt
ChannelsPage → useChannels → services/functionApi.js → Azure Function → Cosmos DB
```

### 영상 데이터

```txt
VideosPage → useVideos → services/functionApi.js → Azure Function → Cosmos DB
```

### 댓글 데이터

```txt
VideoCard → services/youtubeApi.js → YouTube Data API → CommentModal
```

### 스크랩북 데이터

```txt
ScrapbookPage → useScrapbook → services/storage.js → localStorage
```

---

## 8. 리팩터링 순서

한 번에 갈아엎지 않고 아래 순서로 진행합니다.

1. 설정 분리
2. 상수 분리
3. 유틸 함수 분리
4. API 서비스 분리
5. 공통 UI 분리
6. 기능 화면 분리
7. App.jsx 얇게 정리

---

## 9. 피해야 할 구조

- 모든 기능을 App.jsx에 계속 추가
- 화면 컴포넌트에서 fetch 직접 호출
- 카드/버튼/모달을 여러 곳에 복붙
- API 주소를 여러 파일에 흩뿌림
- 프롬프트 문장을 UI 코드 안에 길게 작성
- 또터또 판단 기준을 화면 코드에 섞어둠
- localStorage를 여러 컴포넌트에서 직접 만짐

---

## 10. 최종 목표

타임머신 CRM은 다음 질문에 빠르게 답해야 합니다.

1. 오늘 어떤 채널에서 좋은 소재가 나왔는가?
2. 어떤 영상이 평소보다 훨씬 잘 터졌는가?
3. 오래됐지만 다시 쓸 수 있는 또터또 소재는 무엇인가?
4. 이 소재를 한국형 쇼츠/롱폼으로 바꾸면 어떤 제목과 대본이 나오는가?
5. 내가 저장한 소재 중 제작할 것은 무엇인가?

---

## 한 줄 결론

기존 핵심 기능은 보존하고, App.jsx 중심 구조에서 벗어나 기능별 폴더, 서비스 계층, 공통 UI, 명확한 화면 흐름을 갖춘 Creator OS형 구조로 재설계합니다.
