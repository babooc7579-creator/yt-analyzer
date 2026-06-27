# 타임머신 CRM - 인수인계서

> 이 문서는 다른 개발자, Codex, 또는 이후 대화에서 프로젝트를 이어받을 때 가장 먼저 읽어야 하는 인수인계 문서입니다.

---

## 1. 프로젝트 개요

프로젝트명:

```txt
타임머신 CRM - 유튜브 소재 발굴 도구
```

저장소:

```txt
babooc7579-creator/yt-analyzer
```

목표:

```txt
유튜브 채널과 영상 데이터를 수집하고, 과거에 터졌던 영상 소재를 발굴해 한국형 콘텐츠 아이디어로 전환하는 크리에이터용 소재 발굴 OS를 만든다.
```

핵심 철학:

```txt
또터또 = 터진 건 또 터진다
```

---

## 2. 현재 상태

현재 앱은 React + Vite 기반 프론트엔드입니다.

이미 들어있는 핵심 기능:

- 채널 등록
- 채널 미리보기
- 채널 일괄 추가
- 태그/카테고리/언어 관리
- Azure Function API 연동
- 클라우드 채널 목록 로딩
- 채널 스캔 요청
- 영상 목록 조회
- 쇼츠/롱폼 필터
- 조회수/성과배수/일조회수/좋아요 비율 정렬
- 6개월 이상 지난 영상 기반 또터또 발굴
- 댓글 Top 10 조회
- 스크랩북 저장
- AI 리메이크 프롬프트 복사

---

## 3. 주요 파일

```txt
README.md
```

프로젝트 소개, 실행 방법, 배포 안내가 정리되어 있습니다.

```txt
docs/APP_BLUEPRINT.md
```

앱의 큰 목적, 사용자 흐름, 화면 구성, UI/UX 방향이 정리되어 있습니다.

```txt
docs/ARCHITECTURE.md
```

앞으로 가져갈 전체 폴더 구조와 리팩터링 방향이 정리되어 있습니다.

```txt
docs/WORK_LOG.md
```

작업 히스토리와 커밋 기록을 남기는 문서입니다.

```txt
src/App.jsx
```

현재 앱의 대부분 기능이 들어있는 메인 파일입니다. 앞으로 가장 중요한 리팩터링 대상입니다.

```txt
src/config.js
```

앱 전체 설정값을 분리하기 위해 새로 추가한 파일입니다.

---

## 4. 현재 기술 스택

- React
- Vite
- TailwindCSS
- lucide-react
- Azure Static Web Apps
- Azure Functions
- YouTube Data API v3

---

## 5. 실행 방법

```bash
npm install
npm run dev
```

기본 로컬 주소:

```txt
http://localhost:5173
```

배포 빌드:

```bash
npm run build
```

---

## 6. 앞으로의 리팩터링 순서

반드시 작은 단위로 진행합니다.

1. `App.jsx`에서 `src/config.js` import 적용
2. `constants` 분리
   - 기본 카테고리
   - 언어 목록
   - 정렬 옵션
3. `utils` 분리
   - 날짜 계산
   - 숫자 포맷
   - 영상 길이 파싱
   - AI 프롬프트 생성
4. `services` 분리
   - Azure Function API 호출
   - YouTube API 호출
   - localStorage 접근
5. 공통 UI 컴포넌트 분리
   - 버튼
   - 카드
   - 모달
   - 로딩
   - 에러 배너
6. 기능별 화면 분리
   - DashboardPage
   - ChannelsPage
   - VideosPage
   - TtoTtoPage
   - ScrapbookPage
   - SettingsPage
7. 최종적으로 App.jsx를 레이아웃과 화면 연결만 담당하게 정리

---

## 7. 개발 시 절대 주의할 점

- 기존 핵심 기능을 한 번에 삭제하거나 갈아엎지 않는다.
- API Key를 저장소에 커밋하지 않는다.
- Azure Function API 주소는 설정 파일로 관리한다.
- YouTube API 호출과 Azure API 호출을 섞지 않는다.
- 화면 코드 안에 긴 프롬프트 텍스트를 계속 추가하지 않는다.
- localStorage 접근은 나중에 `services/storage.js` 또는 hook으로 분리한다.
- 큰 변경 전에는 문서와 작업 로그를 먼저 갱신한다.
- 에러가 발생하면 어떤 커밋부터 문제가 생겼는지 추적 가능해야 한다.

---

## 8. 의사결정이 필요한 부분

아래 항목은 사용자 확인이 필요할 수 있습니다.

### 8.1 앱 이름 확정

현재 이름:

```txt
타임머신 CRM
```

장기적으로는 다음 중 선택 가능:

- 타임머신 CRM
- Creator OS
- 유튜브 소재 발굴 OS
- 또터또 CRM

### 8.2 UI 메뉴 이름

현재 제안:

- 대시보드
- 채널 관리
- 영상 발굴
- 또터또 모드
- 스크랩북
- 설정

### 8.3 데이터 저장 범위

현재:

- 채널/영상 데이터: Azure Function + Cosmos DB 추정
- 스크랩북: 브라우저 localStorage

장기 의사결정:

- 스크랩북도 클라우드에 저장할지
- 사용자 계정 기반 저장이 필요한지

### 8.4 백엔드 저장소 역할

관련 저장소:

```txt
babooc7579-creator/yt-analyzer-functions
```

프론트엔드와 백엔드의 역할을 문서화할 필요가 있습니다.

---

## 9. 다음에 바로 할 작업

가장 안전한 다음 작업:

```txt
App.jsx에서 config.js import 적용
```

예상 변경:

```js
import { FUNCTION_API_BASE, YOUTUBE_API_BASE } from './config';
```

그리고 기존 하드코딩 제거:

```js
const FUNCTION_API_BASE = '...';
const API_BASE = 'https://www.googleapis.com/youtube/v3';
```

주의:

`App.jsx`가 크기 때문에 수정 전 전체 내용을 정확히 확보하고, 작은 변경만 반영해야 합니다.

---

## 10. 현재 개발 원칙

```txt
문서화 먼저
작은 변경
기능 보존
커밋 단위 명확화
문제가 생기면 이전 커밋으로 추적 가능하게 만들기
```

---

## 한 줄 인수인계

이 프로젝트는 이미 작동 가능한 1차 앱이 있으며, 앞으로의 핵심은 기존 기능을 보존하면서 App.jsx에 몰린 책임을 기능별 폴더, services, utils, hooks, 공통 UI로 안전하게 분리해 Creator OS형 앱 구조로 발전시키는 것입니다.
