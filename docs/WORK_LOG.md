# 타임머신 CRM - 작업 히스토리

> 이 문서는 프로젝트 변경사항을 시간순으로 기록하기 위한 작업 로그입니다.
> 코드와 문서가 왜 바뀌었는지, 나중에 다시 이어서 작업할 때 맥락을 잃지 않도록 남깁니다.

---

## 2026-06-27

### 1. GitHub 연결 및 저장소 확인

- GitHub Connector 연결 확인
- GitHub 계정: `babooc7579-creator`
- 대상 저장소: `babooc7579-creator/yt-analyzer`
- 저장소 상태: Private
- 기본 브랜치: `main`
- 권한: admin / push / pull 가능

확인된 관련 저장소:

- `babooc7579-creator/my-chat-app`
- `babooc7579-creator/yt-analyzer`
- `babooc7579-creator/yt-analyzer-functions`
- `babooc7579-creator/creator-os`

---

### 2. 기존 프로젝트 구조 확인

확인된 주요 파일:

```txt
yt-analyzer/
├─ README.md
├─ package.json
├─ index.html
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   └─ index.css
```

확인된 기술 스택:

- React
- Vite
- TailwindCSS
- lucide-react
- Azure Function API
- YouTube Data API v3

---

### 3. 앱 설계 문서 추가

파일:

```txt
docs/APP_BLUEPRINT.md
```

커밋:

```txt
docs: add app blueprint
```

커밋 SHA:

```txt
3d86e6cf0695a1cbce9dbd7eba17c2dc87bd0aa1
```

내용:

- 앱의 핵심 목적 정리
- 사용자 기본 흐름 정리
- 대시보드 / 채널 관리 / 영상 발굴 / 또터또 / 스크랩북 / 설정 화면 설계
- UI 톤앤매너 정리
- 초기 개발 우선순위 정리

---

### 4. README 업데이트

파일:

```txt
README.md
```

커밋:

```txt
docs: update project README
```

커밋 SHA:

```txt
5a5528de0579e7dbc6ff80549d0c16a68faa8778
```

내용:

- 프로젝트 소개 보강
- 현재 기능 목록 정리
- 로컬 실행 방법 정리
- Azure Static Web Apps 배포 설정 정리
- 장기 개발 방향 정리

---

### 5. 설정 파일 추가

파일:

```txt
src/config.js
```

커밋:

```txt
refactor: add app config file
```

커밋 SHA:

```txt
969d1e8133b3a4489fae5e30d02105bfbd8f6967
```

내용:

- `FUNCTION_API_BASE` 분리
- `YOUTUBE_API_BASE` 분리
- API Key 같은 민감 정보는 저장하지 않도록 주석 추가

주의:

- 아직 `App.jsx`에서 `config.js`를 import하도록 연결하지는 않았음
- 다음 코드 작업에서 App.jsx 상단 정리 필요

---

### 6. 구조 설계서 추가

파일:

```txt
docs/ARCHITECTURE.md
```

커밋:

```txt
docs: add architecture plan
```

커밋 SHA:

```txt
b45b10b9055323cff64e1b2a0500ba5f885355d6
```

내용:

- 기존 핵심 기능 보존 기준 정리
- 최종 폴더 구조 설계
- App.jsx의 최종 역할 정의
- 화면별 역할 정의
- 데이터 흐름 설계
- 리팩터링 순서 정리
- 피해야 할 구조 정리

---

## 현재까지의 큰 방향

현재까지는 실제 기능 코드를 크게 바꾸지 않고, 먼저 프로젝트의 기준 문서를 만들었습니다.

완료된 것:

```txt
1. 앱 설계도 작성
2. README 정리
3. 설정 파일 추가
4. 구조 설계서 작성
5. 작업 히스토리 문서 추가
```

아직 진행 전:

```txt
1. 오래된 문서와 현재 구현 상태 차이 정리
2. 결정이 필요한 큰 작업의 선택지 보고
3. 기능 동작을 바꾸지 않는 작은 컴포넌트/helper 정리
4. 저장 영상 페이지네이션, scan/API 사용 기록, local assets 같은 큰 변경은 별도 판단 후 진행
```

---

## 작업 원칙

- 기존 기능을 한 번에 갈아엎지 않는다.
- 문서 → 작은 코드 변경 → 확인 → 다음 변경 순서로 진행한다.
- 핵심 기능은 보존한다.
- App.jsx를 점진적으로 얇게 만든다.
- API 호출, 프롬프트 생성, 포맷 함수, 화면 UI를 분리한다.
- 변경 이유와 다음 작업을 항상 기록한다.

---

## 2026-07-06

### 1. 현재 구현 상태 기준 갱신

현재 앱은 초기 `App.jsx` 집중 구조에서 많이 분리된 상태입니다.

확인된 현재 구조:

```txt
src/App.jsx
```

- 현재 13줄 수준의 얇은 연결 파일입니다.
- `CreatorAppLayout`, `CreatorAppRoutes`, `useCreatorAppController`만 연결합니다.
- 실제 화면/상태/데이터 흐름은 `src/components`, `src/hooks`, `src/utils`, `src/services`, `src/constants`로 나뉘어 있습니다.

최근 정리된 기준:

- Cloud DB와 localStorage 역할 구분
- `videoUserRecords`의 기존 `status` 유지 + `statusIds` 보존
- 발견함 `discovery_link` MVP
- 제작 후보함의 영상 후보/링크 후보 표시
- DB 조회와 YouTube API 호출 문구 구분
- 권리 상태는 사용자가 붙이는 표시이며, 사용 허가나 권리 확인 완료를 의미하지 않음

### 2. 2026-07-06 안전 개선 묶음

최근 작업은 기능 동작을 바꾸지 않고 사용자 혼동을 줄이는 방향으로 진행했습니다.

완료된 작업:

- 사용 금지 발견 링크를 제작 후보로 보낼 때 권리 확인 완료가 아님을 명확히 표시
- 발견 링크를 후보에서 되돌리거나 제외할 때 링크 기록은 삭제되지 않는다고 안내
- 발견함의 `권리 확인` 표현을 `권리 상태` 중심으로 정리
- 카테고리 도움말에서 이름 변경과 숨김의 실제 의미 구분
- 영상 필터와 채널 라벨의 기호/이모지 표현을 일반 텍스트로 정리
- `CREATOR_OS_NEXT_IMPLEMENTATION_ISSUES.md`에 2026-07-06 후속 상태 반영

주의:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- package.json 변경 없음
- YouTube API 호출량 증가 없음

### 3. 2026-07-08 안정화 묶음

2026-07-08에는 기능 흐름을 바꾸지 않고, 이미 분리된 hook/service 계층의 문구와 테스트 기준을 더 안정화했습니다.

완료한 작업:

- `src/hooks` 안에 직접 남아 있던 사용자 안내/오류 문구를 `src/utils`와 `src/constants` 쪽으로 정리했습니다.
- 영상 불러오기, 채널 작업, 채널 추가, Cloud 채널 로드, 발견 링크, 스크랩북, 태그 이름 변경, 영상 판단 기록 관련 hook 문구를 중앙화했습니다.
- `src/services/functionApiClient.js`의 Cloud API fallback 문구를 이름 붙은 상수로 정리했습니다.
- `src/services/youtubeApi.js`의 YouTube 댓글 API fallback 문구를 이름 붙은 상수로 정리했습니다.
- 각 변경에 대응하는 테스트를 추가해 문구가 의도치 않게 흩어지거나 바뀌는 위험을 줄였습니다.

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- status/statusIds 동작 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 전체 UI 대개편 없음

검증:

- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 취약점 0개
- GitHub Actions Build 통과
- Azure Static Web Apps 배포 통과

남은 주의점:

- Azure Static Web Apps workflow의 `github_id_token` 입력 경고는 여전히 비차단 경고로 남아 있습니다.
- 이 경고 수정은 배포 설정 변경에 가까우므로 별도 선택지 검토 후 진행합니다.

### 4. 다음 결정이 필요한 큰 작업

아래는 바로 구현하지 않고 선택지 보고가 먼저 필요합니다.

- `/videos` 페이지네이션 구현 방식
- `scan_logs` / `api_quota_logs` 저장 방식
- `local_assets` API 또는 로컬 파일 메타데이터 모델
- `production_candidates` 별도 저장소 도입
- 테스트 러너 추가를 위한 `package.json` 변경
- 배포 workflow 경고 정리

### 5. 2026-07-08 화면 흐름 연결 개선

안정화 묶음 이후에는 데이터 구조나 API를 바꾸지 않고, 사용자가 다음 행동으로 자연스럽게 이동하도록 작은 화면 연결을 보강했습니다.

완료한 작업:

- 홈 화면의 `다음 추천 행동`에서 저장 채널은 있지만 선택 채널이 없을 때 `저장 영상/채널 목록 열기` 버튼을 표시합니다.
- 이 버튼은 저장 영상/채널 목록 화면으로 이동만 하며, 이동 자체로 Cloud DB 조회나 YouTube API 호출을 실행하지 않는다고 안내합니다.
- 발견함 화면 상단에 `후보함 보기` 버튼을 추가해, 발견 링크를 `제작 후보`로 표시한 뒤 제작 후보함으로 바로 이동할 수 있게 했습니다.
- 발견함의 `후보함 보기` 버튼은 화면 이동만 하며 새 YouTube API 호출이나 외부 사이트 자동 수집을 실행하지 않는다고 안내합니다.
- 각 화면 이동 흐름을 순수 유틸 테스트로 보강했습니다.

검증:

- `npm.cmd test -- --reporter=dot` 통과: 테스트 파일 108개, 테스트 481개
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 취약점 0개
- GitHub Actions Build 통과
- Azure Static Web Apps 배포 통과
- 공개 앱 루트 200 OK 확인

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- status/statusIds 동작 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 외부 사이트 자동 수집/다운로드 추가 없음

### 6. 2026-07-10 화면 문구 안전화 묶음

2026-07-10에는 기능 동작을 바꾸지 않고, 사용자가 버튼을 누르기 전에 데이터 흐름을 더 쉽게 구분할 수 있도록 화면 문구를 보강했습니다.

완료한 작업:

- 홈 화면 빠른 실행 버튼에 데이터 흐름 라벨을 추가했습니다.
  - 새 채널 등록: Cloud 채널 저장, 영상 수집 없음
  - 선택 채널 새 영상 수집: YouTube API 가능, Cloud 영상 갱신 가능
  - 저장 영상 탐색: Cloud DB 조회, 새 API 호출 없음
  - 발견 링크 저장: Cloud 링크 저장, 자동 수집 없음
- 제작 후보함의 발견 링크 액션 문구를 정리했습니다.
  - 원본 열기는 브라우저 새 탭에서 URL만 여는 동작입니다.
  - 외부 사이트 수집, 다운로드, Cloud 저장 작업은 실행하지 않는다고 안내합니다.
  - 발견함에서 수정은 Cloud 발견함 기록만 바꾸는 흐름임을 안내합니다.
- 발견함 목록의 원본 링크 열기 문구도 같은 기준으로 맞췄습니다.
- 제작 후보함의 영상 상태 버튼 문구를 정리했습니다.
  - 제작 후보/제작 중/업로드 완료 이동은 Cloud 판단 기록 저장 작업입니다.
  - YouTube API를 새로 호출하지 않는다고 안내합니다.
- 제작 후보함의 제목/메모/업로드 예정일 저장 버튼 문구를 정리했습니다.
  - 저장됨, 저장 중, 변경 저장 상태를 구분했습니다.
  - Cloud 판단 기록 저장 작업이며 YouTube API를 새로 호출하지 않는다고 안내합니다.
- 제작 후보함의 제목/메모/업로드 예정일 입력칸 문구를 정리했습니다.
  - 입력만으로는 Cloud에 저장되지 않고, `Cloud에 변경 저장` 버튼을 눌러야 반영된다고 안내합니다.
- 채널 분석 기록 입력칸 문구를 정리했습니다.
  - 입력만으로는 Cloud에 저장되지 않고, `기록 추가` 버튼을 눌러야 Cloud 채널 메모에 저장된다고 안내합니다.
- 새 채널 등록 입력칸 문구를 정리했습니다.
  - 붙여넣기만으로는 Cloud 저장이나 영상 수집이 실행되지 않는다고 안내합니다.
  - `YouTube에서 확인` 버튼은 채널 정보 확인용이며 영상 수집과 다르다고 구분했습니다.
- 사이드바의 준비중 메뉴 문구를 정리했습니다.
  - 준비중 메뉴는 안내 화면만 열며 API 호출이나 DB 변경이 없다고 안내합니다.
- 분석 대시보드/영구 스크랩북 탭 문구를 정리했습니다.
  - 탭 이동만으로 YouTube API를 새로 호출하지 않는다고 안내합니다.
- 댓글 Top 10 버튼 문구를 정리했습니다.
  - 버튼을 누를 때만 YouTube API로 댓글을 조회한다고 안내합니다.
  - 저장 영상 불러오기와 다른 작업이며, 조회 결과를 Cloud에 저장하지 않는다고 안내합니다.
- 발견함 링크를 제작 후보로 저장한 뒤 완료 안내를 정리했습니다.
  - 검토 상태가 제작 후보로 저장되면 제작 후보함에서 이어서 확인할 수 있다고 안내합니다.
- 터또터 발굴 버튼 문구를 정리했습니다.
  - 현재 불러온 저장 영상을 필터링하는 화면 표시 조건이며, YouTube API를 새로 호출하지 않는다고 안내합니다.
- 저장 영상 검색/필터/정렬/보기 버튼 문구를 정리했습니다.
  - 현재 불러온 저장 영상의 화면 표시 조건만 바꾸며, YouTube API를 새로 호출하지 않는다고 안내합니다.

검증:

- `npm.cmd test -- src/utils/homeActionShortcuts.test.js --reporter=dot` 통과
- `npm.cmd test -- src/utils/productionDiscoveryLinkActionProps.test.js --reporter=dot` 통과
- `npm.cmd test -- src/utils/discoveryLinkActionProps.test.js --reporter=dot` 통과
- `npm.cmd test -- src/utils/productionVideoCard.test.js --reporter=dot` 통과
- `npm.cmd test -- src/utils/channelNotesModal.test.js --reporter=dot` 통과
- `npm.cmd test -- src/utils/channelAddCopy.test.js --reporter=dot` 통과
- `npm.cmd test -- src/utils/appLayoutProps.test.js --reporter=dot` 통과
- `npm.cmd test -- src/utils/commentApiButtonProps.test.js --reporter=dot` 통과
- `npm.cmd test -- src/utils/discoveryLinkCollection.test.js --reporter=dot` 통과
- `npm.cmd test -- src/utils/videoToolbarProps.test.js --reporter=dot` 통과
- `npm.cmd test -- src/utils/videoToolbarProps.test.js src/utils/videoToolbarFiltersProps.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과: 테스트 파일 109개, 테스트 513개
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 취약점 0개
- GitHub Actions Build 통과
- Azure Static Web Apps 배포 통과
- 공개 앱 루트 200 OK 확인

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- status/statusIds 동작 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 외부 사이트 자동 수집/다운로드 추가 없음
- 전체 UI 대개편 없음

남은 주의점:

- Azure Static Web Apps workflow의 `github_id_token` 입력 경고는 여전히 비차단 경고로 남아 있습니다.
- 이 경고 수정은 배포 설정 변경에 가까우므로 별도 선택지 검토 후 진행합니다.

### 7. 2026-07-11 제작 후보함 상태 문구 세분화

제작 후보함에서 발견 링크를 되돌리거나 제외할 때, 사용자가 링크 자체가 삭제되는 것으로 오해하지 않도록 완료 문구를 더 정확하게 정리했습니다.

완료한 작업:

- 제작 후보함 발견 링크 상태 저장 완료 문구를 정리했습니다.
  - Cloud 발견함 상태 저장 완료 후 `제작 후보 표시만 갱신`된다고 안내합니다.
  - 링크 기록은 유지된다고 함께 안내합니다.
- Creator OS 제품 지도에서 `제작/스크랩북` 설명을 정리했습니다.
  - 별표 보관 영상과 제작 후보를 구분해 본다는 의미로 바꿨습니다.

검증:

- `npm.cmd test -- src/utils/productionDiscoveryLinkActionProps.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과: 테스트 파일 109개, 테스트 513개
- `npm.cmd run build` 통과

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- status/statusIds 동작 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 외부 사이트 자동 수집/다운로드 추가 없음

### 8. 2026-07-11 제작 칸반 빈 상태 문구 보강

제작 칸반의 각 컬럼이 비어 있을 때, 사용자가 스크랩북 전체가 자동으로 제작 후보가 되는 것으로 오해하지 않도록 빈 상태 안내를 정리했습니다.

완료한 작업:

- 제작 후보 컬럼 빈 상태 문구에 `스크랩북 전체가 자동으로 들어오지는 않는다`는 기준을 추가했습니다.
- 제작 중/업로드 완료 컬럼 문구도 제작 후보에서 이동한 항목만 관리한다는 흐름으로 다듬었습니다.
- 제작 칸반 props 테스트에서 후보 컬럼 빈 상태 문구가 유지되는지 확인하도록 보강했습니다.

검증:

- `npm.cmd test -- src/utils/productionKanbanProps.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과: 테스트 파일 109개, 테스트 513개
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 취약점 0개

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- status/statusIds 동작 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 전체 UI 대개편 없음

남은 주의점:

- Azure Static Web Apps workflow의 `github_id_token` 입력 경고는 여전히 비차단 경고로 남아 있습니다.
- 이 경고 수정은 배포 설정 변경에 가까우므로 별도 선택지 검토 후 진행합니다.

### 9. 2026-07-11 Creator OS 제품 지도 테스트 보강

Creator OS 메뉴와 제품 지도 문구가 다시 모호해지지 않도록 상수 테스트를 추가했습니다.

완료한 작업:

- Creator OS 제품 지도가 section title과 함께 평탄화되는지 테스트했습니다.
- `제작/스크랩북`이 별표 보관 영상과 제작 후보를 구분해 설명하는지 테스트했습니다.
- `저장한 영상`과 `선택 채널 새 영상 수집`의 설명이 DB 조회와 YouTube API 수집을 혼동하지 않는지 테스트했습니다.
- live view 그룹이 채널/스크랩북 작업 흐름과 맞는지 테스트했습니다.

검증:

- `npm.cmd test -- src/constants/creatorOs.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과: 테스트 파일 110개, 테스트 518개
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 취약점 0개

보존한 것:

- 화면 동작 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 10. 2026-07-11 제작 후보/발견 링크 기준 문서 갱신

제작 후보 MVP 문서가 과거 기준으로 discovery links를 미구현으로 설명하고 있어, 현재 구현 상태에 맞게 문서만 갱신했습니다.

완료한 작업:

- discovery links가 Cloud 발견함(`docType: discovery_link`)으로 구현되어 있다는 현재 사실을 반영했습니다.
- `status: candidate` 발견 링크가 제작 후보함에서 링크 후보/참고 목록으로 보인다는 기준을 추가했습니다.
- 발견 링크 후보는 별도 `production_candidates` DB나 제작 프로젝트가 아니라는 경계를 명확히 했습니다.
- local assets는 아직 미구현이며 제작 후보와 자동 연결하지 않는다는 기준을 유지했습니다.

검증:

- `git diff --check` 통과

보존한 것:

- 앱 코드 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 30. 2026-07-11 Cloud fallback 경고 배너 표시 로직 분리

Cloud 연결 실패나 저장 실패 때 보이는 경고 배너의 메시지 선택 로직을 작은 view props helper로 분리하고 테스트를 추가했습니다.

완료한 작업:

- 단일 경고 메시지와 여러 경고 메시지 중 무엇을 표시할지 결정하는 로직을 `syncWarningBannerProps`로 분리했습니다.
- 경고 메시지가 없으면 배너가 보이지 않는지 확인했습니다.
- 여러 경고 메시지가 있으면 단일 메시지보다 우선 표시되는지 확인했습니다.
- 배너 도움말이 `Cloud 응답만 기준`, `자동 병합 없음`, `자동 업로드 없음` 원칙을 유지하는지 확인했습니다.

검증:

- `npm.cmd test -- src/utils/syncWarningBannerProps.test.js src/constants/syncWarnings.test.js src/utils/appSyncWarnings.test.js src/hooks/useAppSyncWarnings.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과
- `git diff --check` 통과

보존한 것:

- 화면 문구/디자인 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- Cloud/localStorage 병합 동작 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 11. 2026-07-11 Creator OS 제작 지도 문구 정리

Creator OS 제품 지도에서 제작 스튜디오 설명이 "저장한 소재 전체를 제작 후보로 전환"처럼 읽히지 않도록 문구를 정리했습니다.

완료한 작업:

- 제작 스튜디오 설명을 `후보로 표시한 소재` 중심으로 바꿨습니다.
- 제작 후보함 설명을 `제작 후보로 표시한 영상과 발견함 링크`로 바꿨습니다.
- 스크랩북 전체나 스크랩 영상 전체가 자동으로 제작 후보가 되는 표현을 피하도록 테스트를 보강했습니다.

검증:

- `npm.cmd test -- src/constants/creatorOs.test.js --reporter=dot` 통과

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 전체 UI 구조 변경 없음

### 12. 2026-07-11 홈 후보 흐름 문구 정리

홈의 후보 처리 흐름에서 발견 링크가 별도 제작 DB로 모이는 것처럼 보이지 않도록 표현을 정리했습니다.

완료한 작업:

- `제작 후보로 모으고`를 `제작 후보로 표시하고`로 바꿨습니다.
- 영상과 외부 발견 링크가 상태값으로 후보 표시된다는 의미를 유지했습니다.
- 같은 문구가 다시 돌아오지 않도록 테스트를 보강했습니다.

검증:

- `npm.cmd test -- src/utils/homeCandidateWorkflowActions.test.js --reporter=dot` 통과

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 화면 구조 변경 없음

### 13. 2026-07-11 홈 다음 행동 후보 문구 정리

홈의 다음 행동 카드에서 제작 후보를 "남긴" 데이터가 아니라 "표시한" 데이터로 설명하도록 문구를 맞췄습니다.

완료한 작업:

- `이미 후보로 남긴 영상과 발견 링크`를 `후보로 표시한 영상과 발견 링크`로 바꿨습니다.
- 후보함 열기는 저장된 후보 조회이며 YouTube API를 새로 호출하지 않는다는 기존 안내를 유지했습니다.
- 같은 표현이 다시 섞이지 않도록 테스트를 보강했습니다.

검증:

- `npm.cmd test -- src/utils/homeNextAction.test.js --reporter=dot` 통과

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 화면 구조 변경 없음

### 14. 2026-07-11 홈 지표 후보 문구 정리

홈 지표와 UI 문구 감사 문서에서 제작 후보 표현을 `표시한` 기준으로 맞췄습니다.

완료한 작업:

- 홈 지표의 스크랩 소재 설명을 `제작 후보로 표시한 영상`으로 바꿨습니다.
- `제작 후보로 남긴 영상` 표현이 다시 들어오지 않도록 테스트를 보강했습니다.
- UI wording audit 문서의 제작 후보함 설명을 현재 제품 지도 문구 기준으로 갱신했습니다.

검증:

- `npm.cmd test -- src/utils/creatorHomeViewProps.test.js --reporter=dot` 통과

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 화면 구조 변경 없음

### 15. 2026-07-11 홈 스크랩 지표 문구 정정

홈의 `스크랩 소재` 지표는 제작 후보 수가 아니라 Cloud 스크랩북 보관 영상 수이므로 설명을 데이터 기준에 맞게 정정했습니다.

완료한 작업:

- `스크랩 소재` 설명을 `Cloud 스크랩북에 보관한 영상`으로 바꿨습니다.
- 스크랩북 지표가 제작 후보로 오해되지 않도록 테스트를 보강했습니다.
- 제작 후보 수와 스크랩북 보관 수를 다시 분리했습니다.

검증:

- `npm.cmd test -- src/utils/creatorHomeViewProps.test.js --reporter=dot` 통과

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 화면 구조 변경 없음

### 16. 2026-07-11 레퍼런스 금고 제작 후보 문구 정리

레퍼런스 금고 안내에서 제작 후보를 다른 저장소로 "보내는" 듯한 표현을 줄이고, 현재 구조처럼 Cloud 판단 기록에 제작 후보로 표시하는 흐름으로 정리했습니다.

완료한 작업:

- 레퍼런스 금고 헤더 설명을 `제작 후보로 표시할 소재` 기준으로 바꿨습니다.
- 가이드 카드의 `제작 후보로 보내기`를 `제작 후보로 표시`로 바꿨습니다.
- 제작 후보 표시가 Cloud 판단 기록 저장이며 새 YouTube API 호출이 없다는 안내를 추가했습니다.
- 같은 표현이 다시 섞이지 않도록 테스트를 보강했습니다.

검증:

- `npm.cmd test -- src/constants/referenceVault.test.js --reporter=dot` 통과

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 화면 구조 변경 없음

### 17. 2026-07-11 제작 후보 빈 화면 문구 정리

제작 후보 빈 화면과 제작 칸반 컬럼에서 후보를 별도 저장소로 "보내면 쌓이는" 듯한 표현을 줄이고, 현재 구조처럼 제작 후보로 표시된 항목이 보이는 흐름으로 정리했습니다.

완료한 작업:

- 제작 후보 빈 화면 설명을 `제작 후보로 표시하면 이곳에 보입니다` 기준으로 바꿨습니다.
- 오늘 레이더와 발견 링크 단계 설명을 `표시` 기준으로 맞췄습니다.
- 제작 칸반 후보 컬럼 빈 안내를 `표시하면 여기에 보입니다`로 정리했습니다.
- 사용 금지 발견 링크를 제작 후보로 바꾸는 확인창도 `표시` 기준으로 정리했습니다.
- 같은 표현이 다시 섞이지 않도록 테스트를 보강했습니다.

검증:

- `npm.cmd test -- src/constants/emptyStates.test.js src/utils/productionKanbanProps.test.js src/utils/discoveryLinkForm.test.js --reporter=dot` 통과

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 화면 구조 변경 없음

### 18. 2026-07-11 제작 후보 표시 문구 정리

영상 카드, 리스트 행, 오늘 레이더, 발견함 액션에서 제작 후보를 별도 저장소에 "등록/저장"한 것처럼 보일 수 있는 표현을 `표시` 기준으로 정리했습니다.

완료한 작업:

- 영상 카드의 후보 완료 버튼을 `후보 표시됨`으로 바꿨습니다.
- 발견함 링크의 후보 완료 버튼을 `후보 표시됨`으로 바꿨습니다.
- 레이더와 영상 리스트의 제작 후보 안내를 `Cloud 판단 기록에 제작 후보로 표시` 기준으로 맞췄습니다.
- 사용 금지 발견 링크 안내 제목도 `제작 후보로 표시` 기준으로 맞췄습니다.
- 같은 표현이 다시 섞이지 않도록 테스트를 보강했습니다.

검증:

- `npm.cmd test -- src/utils/videoActionButtonProps.test.js src/utils/videoListRowCandidateActionProps.test.js src/utils/radarCandidateStateProps.test.js src/utils/discoveryLinkActionProps.test.js src/utils/discoveryLinksCopy.test.js --reporter=dot` 통과

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 화면 구조 변경 없음

### 19. 2026-07-11 제작 후보 후속 표시 문구 정리

이전 정리 뒤에도 영상 카드 뱃지와 발견함 상태 변경 완료 안내에 후보를 별도 저장소에 등록하는 것처럼 보일 수 있는 표현이 남아 있어 `표시` 기준으로 맞췄습니다.

완료한 작업:

- 영상 카드의 제작 후보 상태 뱃지를 `후보 표시됨`으로 바꿨습니다.
- 발견함 링크를 제작 후보 상태로 바꾼 뒤 완료 안내를 `표시했습니다` 기준으로 바꿨습니다.
- 같은 표현이 다시 섞이지 않도록 테스트를 보강했습니다.

검증:

- `npm.cmd test -- src/utils/videoCard.test.js src/utils/discoveryLinkCollection.test.js --reporter=dot` 통과

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 화면 구조 변경 없음

### 20. 2026-07-11 제작 후보 지정 문구 정리

제작 후보함과 제작 칸반 안내에서 후보를 별도 저장소에 지정하는 것처럼 보일 수 있는 표현을 `표시` 기준으로 맞췄습니다.

완료한 작업:

- 제작 칸반 요약 설명을 `제작 후보로 표시한 항목` 기준으로 바꿨습니다.
- 제작 후보함 헤더 설명을 `제작 후보로 표시한 영상과 발견함 링크` 기준으로 바꿨습니다.
- 같은 표현이 다시 섞이지 않도록 테스트를 보강했습니다.

검증:

- `npm.cmd test -- src/utils/productionKanbanSummary.test.js src/utils/scrapbookHeaderProps.test.js --reporter=dot` 통과

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 화면 구조 변경 없음

### 21. 2026-07-11 제작 후보 문서 표현 정리

현재 기준 문서에서도 제작 후보를 별도 저장소에 등록/저장하는 것처럼 보일 수 있는 표현을 `표시` 기준으로 맞췄습니다.

완료한 작업:

- 상태값 사전의 `production_candidate` 현재 의미를 `후보로 표시됨`으로 바꿨습니다.
- UI 문구 감사 문서의 제작 후보 관련 설명을 `저장/등록`보다 `표시` 기준으로 바꿨습니다.

검증:

- `git diff --check` 통과

보존한 것:

- 앱 코드 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 22. 2026-07-11 제작 후보 보내기 문구 정리

홈 작업 흐름과 제작 칸반 안내에서 제작 후보를 다른 저장소로 보내거나 넘기는 것처럼 보일 수 있는 표현을 `표시` 기준으로 맞췄습니다.

완료한 작업:

- 홈 빠른 작업의 발견 링크 설명을 `제작 후보로 표시` 기준으로 바꿨습니다.
- 홈 후보 워크플로우 제목을 `제작 후보로 표시하기`로 바꿨습니다.
- 홈 다음 행동과 오늘 작업 흐름 설명을 `제작 후보로 표시` 기준으로 바꿨습니다.
- 제작 칸반 제목을 `다음 행동으로 정리` 기준으로 바꿨습니다.
- 같은 표현이 다시 섞이지 않도록 테스트를 보강했습니다.

검증:

- `npm.cmd test -- src/utils/homeActionShortcuts.test.js src/utils/homeCandidateWorkflowActions.test.js src/utils/homeNextAction.test.js src/utils/homeRadarWorkflowSection.test.js src/utils/productionKanbanSummary.test.js --reporter=dot` 통과

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 화면 구조 변경 없음

### 23. 2026-07-11 제작 후보 문서 보내기 표현 정리

현재 기준 문서에 남아 있던 `제작 후보로 보내기/넘기기` 표현을 `제작 후보로 표시` 기준으로 맞췄습니다.

완료한 작업:

- 발견 링크/로컬 자산 모델 문서의 후보 전환 전 안내를 `표시하기` 기준으로 바꿨습니다.
- 발견 링크 MVP 범위 문서의 버튼 설명을 `제작 후보로 표시` 기준으로 바꿨습니다.
- 제작 후보 MVP 범위 문서의 제목과 작업 범위를 `제작 후보로 표시하기` 기준으로 바꿨습니다.
- UI 문구 감사 문서의 홈 작업 흐름 카드명을 현재 UI 기준으로 맞췄습니다.

검증:

- `git diff --check` 통과

보존한 것:

- 앱 코드 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 24. 2026-07-11 제작 칸반 상태 변경 문구 정리

제작 칸반의 상태 버튼이 다른 저장소로 카드를 옮기는 것처럼 보이지 않도록 `이동` 표현을 `상태 변경` 기준으로 정리했습니다.

완료한 작업:

- 제작 후보/제작 중/업로드 완료 버튼의 접근성 문구를 `상태로 변경` 기준으로 바꿨습니다.
- 상태 변경 중 버튼 문구를 `이동 중...`에서 `변경 중...`으로 바꿨습니다.
- 제작 후보 MVP 문서의 제작 진행 설명도 `상태로 변경` 기준으로 맞췄습니다.
- 같은 표현이 다시 섞이지 않도록 테스트 기대값을 갱신했습니다.

검증:

- `npm.cmd test -- src/utils/productionVideoStatusProps.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과
- `git diff --check` 통과

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 상태 저장 로직 변경 없음

### 25. 2026-07-11 발견 링크 후보 문서 표현 정리

발견 링크 관련 문서에 남아 있던 `제작 후보로 보내는` 표현과 이전 UI 표현인 `후보 등록됨`을 현재 기준인 `표시` 중심으로 맞췄습니다.

완료한 작업:

- 발견 링크/로컬 자산 모델 문서의 후보 전환 제목을 `표시하는 경우`로 바꿨습니다.
- UI 문구 감사 문서의 발견함 빠른 버튼 설명을 `제작 후보로 표시` 기준으로 바꿨습니다.
- 이미 후보인 링크 안내를 현재 UI 기준인 `후보 표시됨`으로 맞췄습니다.

검증:

- `git diff --check` 통과

보존한 것:

- 앱 코드 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 26. 2026-07-11 제작 후보 액션 hook 테스트 보강

제작 후보 표시 흐름에서 스크랩북 보관과 Cloud 판단 기록 저장 순서가 깨지지 않도록 hook 테스트를 추가했습니다.

완료한 작업:

- 이미 스크랩북에 있는 영상은 바로 제작 후보 상태로 표시되는지 확인했습니다.
- 아직 스크랩북에 없는 영상은 먼저 보관한 뒤 제작 후보 상태로 표시되는지 확인했습니다.
- 스크랩북 보관이 실패하면 제작 후보 상태 저장을 실행하지 않는지 확인했습니다.
- Cloud 판단 기록의 `statusIds` 기준으로 제작 후보 여부를 판단하는지 확인했습니다.

검증:

- `npm.cmd test -- src/hooks/useVideoProductionActions.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 27. 2026-07-11 채널 추가 액션 hook 테스트 보강

채널 추가/미리보기/일괄 추가 흐름이 비용성 YouTube 조회와 Cloud 저장 경계를 지키는지 확인하는 hook 테스트를 추가했습니다.

완료한 작업:

- 빈 채널 입력에서는 채널 미리보기 API를 호출하지 않는지 확인했습니다.
- 새 채널 미리보기 성공 시 이전 미리보기를 비우고 새 미리보기를 표시하는지 확인했습니다.
- 이미 등록된 채널은 저장 전 중복 안내로 막히는지 확인했습니다.
- 채널 저장 payload가 입력값을 trim하고 첫 태그 탭을 선택하는지 확인했습니다.
- 빈 일괄 입력은 Cloud 저장을 실행하지 않고 안내만 표시하는지 확인했습니다.
- 일괄 추가 성공 후 Cloud 채널 목록을 다시 불러오는지 확인했습니다.

검증:

- `npm.cmd test -- src/hooks/useChannelAddActions.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 28. 2026-07-11 영상 필터/정렬 edge case 테스트 보강

저장 영상 조회 후 화면에서 필터/정렬할 때, Cloud DB에서 숫자 필드가 문자열 또는 잘못된 값으로 들어와도 안전하게 처리되는지 확인하는 테스트를 보강했습니다.

완료한 작업:

- Cloud 영상 숫자 필드가 잘못된 값이어도 0 기준으로 안전하게 정규화되는지 확인했습니다.
- 업로드 후 경과일이 0이어도 조회수/일 계산이 깨지지 않는지 확인했습니다.
- 조회수 필터값과 영상 숫자 필드가 문자열이어도 필터가 동작하는지 확인했습니다.
- 정렬 결과가 원본 영상 목록 순서를 직접 바꾸지 않는지 확인했습니다.

검증:

- `npm.cmd test -- src/utils/video.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 29. 2026-07-11 제작 후보 문서 표현 기준 재정렬

기준 문서에 일부 남아 있던 `제작 후보로 보냄/보낼` 표현을 현재 앱 기준인 `제작 후보로 표시`로 맞췄습니다.

완료한 작업:

- 발견 링크/로컬 자산 모델 문서의 후보 전환 표현을 `표시` 기준으로 정리했습니다.
- 발견 링크와 제작 후보 연결 흐름을 `보내기`가 아니라 `상태 표시/연결` 기준으로 정리했습니다.
- 상태값 사전의 `production_candidate` 현재 의미를 `제작 후보로 표시됨`으로 맞췄습니다.
- 작업 로그의 #27, #28 순서가 뒤섞여 보이던 부분을 번호 순서대로 정리했습니다.

검증:

- `git diff --check` 통과

보존한 것:

- 앱 코드 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 30. 2026-07-11 Cloud API 공통 클라이언트 edge case 테스트 보강

Cloud Function 공통 호출부가 비정상 HTTP 응답과 사용자 지정 헤더를 안전하게 처리하는지 테스트를 보강했습니다.

완료한 작업:

- Cloud API가 실패 상태와 비JSON 응답을 함께 반환해도 상태 코드가 포함된 안전 오류 메시지로 정리되는지 확인했습니다.
- `sendJson`이 JSON Content-Type을 유지하면서 사용자 지정 헤더도 보존하는지 확인했습니다.
- 공통 API 호출 helper의 기존 GET/POST/PATCH/DELETE 동작은 바꾸지 않았습니다.

검증:

- `npm.cmd test -- src/services/functionApiClient.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- Cloud API 호출 방식 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 31. 2026-07-11 스캔 API 빈 태그 경계 테스트 보강

비용성 YouTube 스캔 요청에서 빈 태그 값이 들어와도 불필요한 `tag=` 쿼리를 붙이지 않고 기본 스캔 endpoint를 사용하는지 테스트를 보강했습니다.

완료한 작업:

- 태그가 없는 전체 스캔은 `/scan` endpoint를 사용하는 기존 기준을 유지했습니다.
- 빈 태그 값이 들어와도 `/scan?tag=`가 아니라 `/scan`으로 요청되는지 확인했습니다.
- 실제 스캔 로직이나 API 호출 조건은 바꾸지 않았습니다.

검증:

- `npm.cmd test -- src/services/scanApi.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 32. 2026-07-11 화면 데이터 조합 hook 테스트 보강

홈 지표, 레이더 후보, 제작 칸반 화면이 각각 올바른 데이터 모델 계산기에 입력값을 넘기는지 테스트를 보강했습니다.

완료한 작업:

- Creator OS 홈 지표 hook이 발견 링크 기본값을 빈 배열로 유지하는지 확인했습니다.
- 레이더 후보 hook이 영상과 사용자 판단 기록을 레이더 계산 모델에 그대로 넘기는지 확인했습니다.
- 제작 칸반 hook이 발견 링크, 초안 기록, 영상 판단 기록, 영상 목록을 칸반 계산 모델에 넘기는지 확인했습니다.
- 실제 계산 로직이나 화면 구조는 바꾸지 않았습니다.

검증:

- `npm.cmd test -- src/hooks/useDataModelHooks.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 33. 2026-07-11 채널 선택 상태 hook 테스트 보강

채널 관리 화면에서 선택한 카테고리와 선택 채널 목록이 안전하게 초기화되고 토글되는지 테스트를 보강했습니다.

완료한 작업:

- 채널 선택 hook이 최초 카테고리 탭과 빈 선택 목록으로 시작하는지 확인했습니다.
- 채널 선택 토글이 선택 목록 state updater를 통해 추가/해제되는지 확인했습니다.
- 채널 선택/스캔 대상 상태의 실제 동작 로직은 바꾸지 않았습니다.

검증:

- `npm.cmd test -- src/hooks/useChannelSelection.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 34. 2026-07-11 채널 추가 폼 상태 hook 테스트 보강

채널 추가/미리보기/일괄 추가/카테고리 이름 변경 화면 상태가 로컬에서 안전하게 초기화되고 정리되는지 테스트를 보강했습니다.

완료한 작업:

- 채널 추가 폼이 빈 입력, 기본 언어, 단일 추가 모드, 빈 결과 상태로 시작하는지 확인했습니다.
- 채널 미리보기 취소가 입력값, 태그, 메모, 미리보기를 로컬에서 정리하는지 확인했습니다.
- 일괄 추가 초기화가 단일 추가 흐름으로 돌아가고 임시 입력/결과를 비우는지 확인했습니다.
- 새 채널 태그 토글과 카테고리 이름 변경 시작/취소 상태를 확인했습니다.
- Cloud 저장, YouTube 조회, 실제 채널 데이터 변경 로직은 바꾸지 않았습니다.

검증:

- `npm.cmd test -- src/hooks/useChannelFormState.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 35. 2026-07-11 영상 찾기 상태 hook 테스트 보강

저장 영상 조회 후 검색/조회수/길이/터또터/정렬/보기 모드가 안전한 기본값으로 시작하는지 테스트를 보강했습니다.

완료한 작업:

- 영상 찾기 화면 필터가 빈 검색어, 조회수 0, 전체 길이, 터또터 해제, 대박지수 정렬, 카드 보기로 시작하는지 확인했습니다.
- 기본 필터 상태가 영상 필터/정렬 계산 모델에 그대로 전달되는지 확인했습니다.
- 화면 제어용 setter가 모두 외부로 노출되는지 확인했습니다.
- 실제 필터 계산 로직이나 화면 UI는 바꾸지 않았습니다.

검증:

- `npm.cmd test -- src/hooks/useVideoExplorerState.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 36. 2026-07-11 영상 선택/AI 프롬프트 복사 hook 테스트 보강

영상 찾기 화면에서 선택한 영상 목록과 AI 리메이크 프롬프트 복사 피드백이 안전하게 동작하는지 테스트를 보강했습니다.

완료한 작업:

- 영상 선택 상태가 빈 목록과 복사 피드백 해제 상태로 시작하는지 확인했습니다.
- 선택 영상 초기화와 영상 체크 토글이 선택 목록 state updater를 통해 동작하는지 확인했습니다.
- 선택 영상이 없을 때는 프롬프트 생성/클립보드 복사를 실행하지 않는지 확인했습니다.
- 프롬프트 복사 성공 시 성공 피드백을 표시하고 3초 뒤 피드백을 초기화하는지 확인했습니다.
- 클립보드 복사 실패 시 오류 피드백을 표시하는지 확인했습니다.
- 기존 피드백 타이머가 있을 때 새 타이머 전 정리되고, hook cleanup에서도 정리되는지 확인했습니다.

검증:

- `npm.cmd test -- src/hooks/useVideoSelection.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 37. 2026-07-11 발견 링크 저장 폼 hook 테스트 보강

발견함에 링크를 수동 저장할 때 URL/중복/권리 상태/저장 payload 흐름이 안전하게 유지되는지 테스트를 보강했습니다.

완료한 작업:

- 빈 URL 상태에서는 저장 버튼 흐름이 비활성화되는지 확인했습니다.
- URL 입력 변경 helper가 기존 폼 값을 보존하면서 특정 필드만 바꾸는지 확인했습니다.
- 중복 URL과 잘못된 URL 형식에서는 Cloud 저장을 막는지 확인했습니다.
- 정상 저장 시 URL, 제목, 메모를 trim하고 플랫폼/status/rightsStatus를 Cloud 저장 함수로 넘기는지 확인했습니다.
- `candidate + do_not_use` 조합에서는 사용자 확인 없이는 저장하지 않는지 확인했습니다.
- 실제 discovery link API, DB schema, localStorage, UI 구조는 바꾸지 않았습니다.

검증:

- `npm.cmd test -- src/hooks/useDiscoveryLinkForm.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 38. 2026-07-11 발견 링크 행 상태 hook 테스트 보강

발견함 목록의 각 링크 행에서 삭제 확인, 상태 변경, 권리 상태 변경, 제목/메모 수정 흐름이 안전하게 유지되는지 테스트를 보강했습니다.

완료한 작업:

- 발견 링크 행이 현재 링크의 제목/메모/플랫폼/상태/권리 상태를 안전한 기본값으로 읽는지 확인했습니다.
- 삭제 버튼은 확인창 승인 후에만 Cloud 발견함 기록 삭제 함수를 호출하는지 확인했습니다.
- 상태와 권리 상태 변경은 Cloud 발견함 업데이트 payload로만 전달되는지 확인했습니다.
- `사용 금지 + 제작 후보` 조합은 사용자 확인 없이는 상태가 바뀌지 않고 선택값도 원래 값으로 되돌리는지 확인했습니다.
- 이미 제작 후보인 링크는 다시 후보 표시 요청을 보내지 않는지 확인했습니다.
- 제목/메모 수정은 변경된 경우에만 trim된 값으로 저장하고, 저장 실패 시 편집 상태를 닫지 않는지 확인했습니다.
- 실제 discovery link API, DB schema, localStorage, UI 구조는 바꾸지 않았습니다.

검증:

- `npm.cmd test -- src/hooks/useDiscoveryLinkRow.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 39. 2026-07-11 발견 링크 필터 hook 테스트 보강

발견함 검색/상태/권리 필터가 화면 표시 조건만 바꾸고, 원본 Cloud 데이터나 외부 API 호출 흐름을 건드리지 않도록 hook 테스트를 보강했습니다.

완료한 작업:

- 발견 링크 필터가 전체 상태/전체 권리/빈 검색어 기본값으로 시작하는지 확인했습니다.
- 현재 필터 상태가 발견 링크 필터 계산 모델에 그대로 전달되는지 확인했습니다.
- 상태/권리/검색어 setter가 화면 제어용으로 외부에 그대로 노출되는지 확인했습니다.
- 필터 초기화가 전체 상태, 전체 권리, 빈 검색어로 되돌리는지 확인했습니다.
- 실제 discovery link API, DB schema, localStorage, UI 구조는 바꾸지 않았습니다.

검증:

- `npm.cmd test -- src/hooks/useDiscoveryLinkFilters.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 40. 2026-07-11 로컬 화면 상태 hook 테스트 보강

앱의 기본 실행 상태, 카테고리 캐시, Creator OS 화면 이동 상태가 안전한 기본값을 유지하는지 테스트를 보강했습니다.

완료한 작업:

- 앱 실행 상태 hook이 API Key, 스캔 상태, 로딩 상태, 영상 목록, 오류 문구를 안전한 기본값으로 시작하는지 확인했습니다.
- 앱 실행 상태 setter가 외부로 그대로 노출되어 기존 화면 제어 흐름을 유지하는지 확인했습니다.
- 카테고리 hook이 기존 브라우저 캐시를 읽고, 유효한 값이 없으면 기본 카테고리로 fallback하는지 확인했습니다.
- 카테고리 변경 저장은 기존 localStorage key를 유지하는지 확인했습니다.
- Creator OS 화면 이동 hook이 홈/채널 작업/제작 후보 작업/수동 화면 이동의 탭과 작업 패널 상태를 안전하게 계산하는지 확인했습니다.
- 실제 API, DB schema, localStorage key, UI 구조는 바꾸지 않았습니다.

검증:

- `npm.cmd test -- src/hooks/useAppRuntimeState.test.js src/hooks/useCategories.test.js src/hooks/useCreatorWorkspaceNavigation.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 41. 2026-07-11 댓글 Top 10 hook 테스트 보강

댓글 Top 10 기능이 YouTube API Key 없이 API를 호출하지 않고, 버튼 실행 시 댓글 모달 상태를 안전하게 갱신하는지 테스트를 보강했습니다.

완료한 작업:

- 댓글 모달이 닫힌 빈 상태로 시작하고, 닫기 동작이 같은 빈 상태로 되돌리는지 확인했습니다.
- YouTube API Key가 없으면 오류 안내만 표시하고 댓글 API 호출을 실행하지 않는지 확인했습니다.
- API Key가 있을 때만 YouTube 댓글 API helper를 호출하고, 로딩 상태와 댓글 결과 상태를 순서대로 표시하는지 확인했습니다.
- YouTube API 오류 payload와 네트워크 오류를 모달 오류 상태로 표시하는지 확인했습니다.
- 실제 YouTube API 호출 조건, API endpoint, DB schema, localStorage, UI 구조는 바꾸지 않았습니다.

검증:

- `npm.cmd test -- src/hooks/useTopComments.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 42. 2026-07-11 영상 판단 기록 Cloud/localStorage 기준 테스트 보강

영상별 사용자 판단 기록이 Cloud DB를 기준으로 사용하고, Cloud 연결 실패 때만 localStorage를 임시 fallback으로 쓰는 현재 원칙을 hook 테스트로 보강했습니다.

완료한 작업:

- Cloud 영상 판단 기록 조회가 성공하면 Cloud 응답을 기준으로 사용하고 localStorage로 대체하지 않는지 확인했습니다.
- Cloud 조회가 성공했지만 결과가 비어 있으면, 그 빈 결과를 기준으로 보고 localStorage 기록을 자동 병합하지 않는지 확인했습니다.
- Cloud 조회 실패 때만 localStorage 기록을 `임시 기록` fallback 대상으로 읽는지 확인했습니다.
- `statusIds`가 Cloud 저장 payload와 응답 캐시에 보존되는지 확인했습니다.
- Cloud 저장 실패 때는 낙관 업데이트를 되돌리고 localStorage를 조용히 갱신하지 않는지 확인했습니다.
- 기록 초기화 실패 때 기존 화면 상태를 복구하고 localStorage를 갱신하지 않는지 확인했습니다.
- hook cleanup 뒤 늦게 도착한 Cloud 조회 결과를 화면 상태에 반영하지 않는지 확인했습니다.

검증:

- `npm.cmd test -- src/hooks/useVideoUserRecords.test.js --reporter=dot` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- status/statusIds 의미 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 43. 2026-07-11 저장 영상 조회와 새 영상 수집 액션 경계 테스트 보강

저장 영상 불러오기와 새 영상 수집이 서로 다른 작업이라는 기준이 훅 레벨에서도 유지되도록 `useVideoCollectionActions` 테스트를 추가했습니다.

완료한 작업:

- 선택 채널이 없으면 저장 영상 DB 조회를 실행하지 않고 안내만 표시하는지 확인했습니다.
- 저장 영상 불러오기는 `/videos?channelIds=...` DB 조회 흐름만 사용하고 스캔 API를 호출하지 않는지 확인했습니다.
- 저장 영상 조회 실패 문구가 새 YouTube API 호출이나 새 영상 수집을 실행하지 않았다고 안내하는지 확인했습니다.
- 선택 채널 수동 스캔은 운영중 채널만 골라 selected scan API를 호출하는지 확인했습니다.
- 보류 채널만 선택된 경우에는 새 영상 수집을 막고 스캔/DB 조회를 실행하지 않는지 확인했습니다.
- 태그 스캔은 채널 선택 여부와 관계없이 태그 스캔 API를 사용하는지 확인했습니다.
- 스캔 실패 때 저장 영상 DB 조회 실패와 다른 안내로 처리되는지 확인했습니다.

검증:

- `npm.cmd test -- src/hooks/useVideoCollectionActions.test.js --reporter=dot` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 저장 영상 DB 조회/YouTube 스캔 호출 조건 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 44. 2026-07-11 스크랩북 Cloud 기준 테스트 보강

스크랩북이 Cloud DB를 기준으로 동작하고, Cloud 연결 실패 때만 브라우저 임시 기록을 fallback으로 표시하는 현재 원칙을 hook 테스트로 보강했습니다.

완료한 작업:

- Cloud 스크랩북 조회가 성공하면 Cloud 응답만 기준으로 사용하고 localStorage로 대체하지 않는지 확인했습니다.
- Cloud 조회 성공 결과가 비어 있으면 빈 Cloud 결과를 기준으로 보고 localStorage와 자동 병합하지 않는지 확인했습니다.
- Cloud 조회 실패 때만 localStorage 스크랩북 임시 기록을 읽는지 확인했습니다.
- Cloud 준비 전에는 스크랩북 변경을 localStorage에만 조용히 저장하지 않는지 확인했습니다.
- 스크랩북 추가/삭제가 Cloud 요청 성공 후에만 화면 상태와 localStorage 캐시를 갱신하는지 확인했습니다.
- Cloud 저장 실패 때 Cloud 준비 상태를 해제하고 localStorage 캐시를 갱신하지 않는지 확인했습니다.
- hook cleanup 뒤 늦게 도착한 Cloud 조회 결과를 화면 상태에 반영하지 않는지 확인했습니다.

검증:

- `npm.cmd test -- src/hooks/useScrapbook.test.js --reporter=dot` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 스크랩북 저장/삭제 호출 조건 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
