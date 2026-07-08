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

2026-07-08 기준으로 초기의 `App.jsx` 집중 구조는 상당 부분 해소되었습니다.

- `src/App.jsx`는 현재 13줄 수준의 얇은 연결 파일입니다.
- 앱의 주요 상태와 워크플로우는 `src/hooks`로 분리되어 있습니다.
- 화면은 `src/components`로 나뉘어 있습니다.
- 데이터/화면 props 계산은 `src/utils`로 많이 분리되어 있습니다.
- Cloud API 호출은 `src/services`에서 관리합니다.
- `src/hooks` 내부 사용자 안내/오류 문구는 `src/utils`와 `src/constants`로 분리되어, hook은 상태 흐름에 집중하는 구조입니다.
- `src/services`의 공통 Cloud/YouTube API fallback 문구는 이름 붙은 상수와 테스트로 보호합니다.

이미 들어있는 핵심 기능:

- 채널 등록
- 채널 미리보기
- 채널 일괄 추가
- 태그/카테고리/언어 관리
- 채널 등급/운영 상태 관리
- Azure Function API 연동
- 클라우드 채널 목록 로딩
- 선택 채널 새 영상 수집
- 저장 영상 목록 조회
- 쇼츠/롱폼 필터
- 조회수/성과배수/일조회수/좋아요 비율 정렬
- 6개월 이상 지난 영상 기반 또터또 발굴
- 댓글 Top 10 조회
- Cloud 기준 스크랩북 저장
- 영상별 사용자 판단 기록 저장
- 발견함 수동 링크 저장
- 발견 링크 제작 후보 연결
- 제작 후보함
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

현재는 레이아웃과 라우트를 연결하는 얇은 파일입니다. 큰 변경 대상이 아니라, 관련 hook/component를 작게 정리하는 방식으로 유지합니다.

```txt
src/config.js
```

앱 전체 설정값을 분리하기 위해 새로 추가한 파일입니다.

```txt
src/hooks
```

앱 상태, 채널 워크플로우, 영상 워크플로우, 발견함, 스크랩북, 제작 후보 흐름이 분리되어 있습니다.

```txt
src/services
```

Cloud Function API와 localStorage 보조 저장 접근을 담당합니다.

```txt
docs/CREATOR_OS_DOCUMENT_INDEX.md
```

현재 Creator OS 문서를 어떤 순서로 읽어야 하는지 정리한 문서입니다. 코드 작업 전 먼저 확인합니다.

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

1. 현재 구현과 오래된 문서 표현의 차이를 계속 줄입니다.
2. DB 조회, Cloud 저장, YouTube API 호출, 로컬 클립보드 동작을 화면 문구에서 명확히 구분합니다.
3. 이미 분리된 hook/component/utils 안에서 기능 보존형 작은 정리를 진행합니다.
4. 테스트 도구 추가처럼 `package.json` 변경이 필요한 작업은 선택지 보고 후 진행합니다.
5. `/videos` 페이지네이션, `scan_logs`, `api_quota_logs`, `local_assets`, `production_candidates`는 구현 전 선택지와 위험을 먼저 정리합니다.
6. 전체 UI 대개편보다 현재 작동하는 흐름을 안정화한 뒤 화면 단위로 개선합니다.

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

- 채널/영상 데이터: Azure Function + Cosmos DB
- 스크랩북: Cloud DB 기준. 백엔드에서는 `videos` container 안의 `docType: scrapbook` 문서로 저장
- 영상별 사용자 판단 기록: 기존 `status` 유지 + `statusIds` 복수 판단 보존
- 발견함 링크: 새 별도 container가 아니라 현재 MVP에서는 `docType: discovery_link` 방식
- localStorage: 기준 저장소가 아니라 Cloud 실패 시 임시 fallback과 기존 데이터 보호 용도
- 제작 후보: 현재 별도 `production_candidates` 저장소 없이 `videoUserRecords`와 발견 링크 `status: candidate`를 사용

장기 의사결정:

- 사용자 계정 기반 저장이 필요한지
- 스크랩북을 장기적으로 별도 container로 분리할지
- 발견 링크를 별도 container로 분리할지
- 제작 후보를 별도 production model로 분리할지
- local assets를 어떤 방식으로 저장/연결할지
- scan/api quota 로그를 어디에 저장할지

### 8.4 백엔드 저장소 역할

관련 저장소:

```txt
babooc7579-creator/yt-analyzer-functions
```

프론트엔드와 백엔드의 역할을 문서화할 필요가 있습니다.

---

## 9. 다음에 바로 할 작업

가장 안전한 다음 작업은 이미 작동하는 기능을 보존하면서 작은 단위로 정리하는 것입니다.

추천 순서:

1. 현재 문서와 실제 구현이 어긋나는 오래된 표현을 계속 정리합니다.
2. 공통 UI, 작은 hook, helper처럼 기능 동작을 바꾸지 않는 단위를 먼저 정리합니다.
3. 버튼 문구에서 DB 조회, Cloud 저장, YouTube API 호출, 로컬 클립보드 동작이 명확히 구분되는지 확인합니다.
4. 큰 구조 변경 전에는 `CREATOR_OS_DOCUMENT_INDEX.md`와 관련 기준 문서를 먼저 확인합니다.
5. 다음 큰 후보는 `/videos` 페이지네이션, scan/API 사용 기록, local assets, 테스트 러너 추가이며 모두 선택지 보고가 먼저 필요합니다.

주의:

DB schema, endpoint, localStorage key, YouTube API 호출량이 바뀔 수 있는 작업은 별도 선택지 보고 후 진행해야 합니다.

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

이 프로젝트는 이미 작동 가능한 1차 앱이며, 현재는 `App.jsx`가 얇아지고 주요 책임이 hooks, components, services, utils로 분리된 상태입니다. 앞으로의 핵심은 이 구조를 깨지 않고 데이터 기준, 상태 기준, 화면 문구, 작은 컴포넌트 정리를 쌓아 Creator OS형 앱으로 안정화하는 것입니다.
