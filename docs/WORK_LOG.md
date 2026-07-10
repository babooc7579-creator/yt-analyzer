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
