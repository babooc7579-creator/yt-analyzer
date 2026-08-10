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

### 7. 현재 구현 상태 기준 갱신

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

### 8. 2026-07-06 안전 개선 묶음

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

### 9. 2026-07-08 안정화 묶음

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

### 10. 다음 결정이 필요한 큰 작업

아래는 바로 구현하지 않고 선택지 보고가 먼저 필요합니다.

- `/videos` 페이지네이션 구현 방식
- `scan_logs` / `api_quota_logs` 저장 방식
- `local_assets` API 또는 로컬 파일 메타데이터 모델
- `production_candidates` 별도 저장소 도입
- 테스트 러너 추가를 위한 `package.json` 변경
- 배포 workflow 경고 정리

### 11. 2026-07-08 화면 흐름 연결 개선

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

### 12. 2026-07-10 화면 문구 안전화 묶음

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

### 13. 2026-07-11 제작 후보함 상태 문구 세분화

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

### 14. 2026-07-11 제작 칸반 빈 상태 문구 보강

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

### 15. 2026-07-11 Creator OS 제품 지도 테스트 보강

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

### 16. 2026-07-11 제작 후보/발견 링크 기준 문서 갱신

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

### 17. 2026-07-11 Cloud fallback 경고 배너 표시 로직 분리

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

### 18. 2026-07-11 Creator OS 제작 지도 문구 정리

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

### 19. 2026-07-11 홈 후보 흐름 문구 정리

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

### 20. 2026-07-11 홈 다음 행동 후보 문구 정리

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

### 21. 2026-07-11 홈 지표 후보 문구 정리

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

### 22. 2026-07-11 홈 스크랩 지표 문구 정정

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

### 23. 2026-07-11 레퍼런스 금고 제작 후보 문구 정리

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

### 24. 2026-07-11 제작 후보 빈 화면 문구 정리

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

### 25. 2026-07-11 제작 후보 표시 문구 정리

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

### 26. 2026-07-11 제작 후보 후속 표시 문구 정리

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

### 27. 2026-07-11 제작 후보 지정 문구 정리

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

### 28. 2026-07-11 제작 후보 문서 표현 정리

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

### 29. 2026-07-11 제작 후보 보내기 문구 정리

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

### 30. 2026-07-11 제작 후보 문서 보내기 표현 정리

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

### 31. 2026-07-11 제작 칸반 상태 변경 문구 정리

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

### 32. 2026-07-11 발견 링크 후보 문서 표현 정리

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

### 33. 2026-07-11 제작 후보 액션 hook 테스트 보강

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

### 34. 2026-07-11 채널 추가 액션 hook 테스트 보강

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

### 35. 2026-07-11 영상 필터/정렬 edge case 테스트 보강

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

### 36. 2026-07-11 제작 후보 문서 표현 기준 재정렬

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

### 37. 2026-07-11 Cloud API 공통 클라이언트 edge case 테스트 보강

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

### 38. 2026-07-11 스캔 API 빈 태그 경계 테스트 보강

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

### 39. 2026-07-11 화면 데이터 조합 hook 테스트 보강

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

### 40. 2026-07-11 채널 선택 상태 hook 테스트 보강

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

### 41. 2026-07-11 채널 추가 폼 상태 hook 테스트 보강

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

### 42. 2026-07-11 영상 찾기 상태 hook 테스트 보강

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

### 43. 2026-07-11 영상 선택/AI 프롬프트 복사 hook 테스트 보강

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

### 44. 2026-07-11 발견 링크 저장 폼 hook 테스트 보강

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

### 45. 2026-07-11 발견 링크 행 상태 hook 테스트 보강

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

### 46. 2026-07-11 발견 링크 필터 hook 테스트 보강

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

### 47. 2026-07-11 로컬 화면 상태 hook 테스트 보강

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

### 48. 2026-07-11 댓글 Top 10 hook 테스트 보강

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

### 49. 2026-07-11 영상 판단 기록 Cloud/localStorage 기준 테스트 보강

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

### 50. 2026-07-11 저장 영상 조회와 새 영상 수집 액션 경계 테스트 보강

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

### 51. 2026-07-11 스크랩북 Cloud 기준 테스트 보강

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

### 52. 2026-07-11 발견함 Cloud 액션 hook 테스트 보강

발견함 링크의 Cloud 조회/추가/수정/삭제 흐름이 화면 상태와 안내 문구를 안전하게 갱신하는지 `useDiscoveryLinks` 테스트를 추가했습니다.

완료한 작업:

- Cloud 발견함 조회가 mount 시 실행되고 현재 링크 목록은 최신 업데이트 순으로 정렬되는지 확인했습니다.
- Cloud 발견함 조회 실패 때 목록을 임의로 대체하지 않고 오류 안내만 표시하는지 확인했습니다.
- 새 발견 링크 저장은 Cloud 성공 후에만 목록에 upsert하고 완료 안내를 표시하는지 확인했습니다.
- Cloud 저장이 성공했지만 응답 링크가 없으면 Cloud 목록을 다시 조회하는지 확인했습니다.
- Cloud 저장 실패 때 발견함 목록을 갱신하지 않고 저장 실패 안내를 표시하는지 확인했습니다.
- 발견 링크 상태/권리/텍스트 변경 액션이 Cloud 업데이트 성공 후에만 목록을 교체하고 완료 안내를 표시하는지 확인했습니다.
- Cloud 삭제 성공 후에만 화면 목록에서 링크를 제거하는지 확인했습니다.
- Cloud 삭제 실패 때 목록을 유지하고 삭제 실패 안내를 표시하는지 확인했습니다.

검증:

- `npm.cmd test -- src/hooks/useDiscoveryLinks.test.js --reporter=dot` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 발견 링크 Cloud 조회/저장/삭제 호출 조건 변경 없음
- 외부 사이트 자동 수집/다운로드 추가 없음

### 53. 2026-07-11 채널 Cloud 로드 hook 테스트 보강

채널 목록이 Cloud 기준 데이터로 로드되고, 조회 실패 때 화면의 채널 목록을 기준 데이터로 보지 않는다는 원칙을 `useCloudChannels` 테스트로 보강했습니다.

완료한 작업:

- mount 시 Cloud 채널 목록 조회가 실행되고 성공 응답을 채널 상태에 반영하는지 확인했습니다.
- Cloud 응답에 channels가 없으면 빈 목록으로 안전하게 처리하는지 확인했습니다.
- Cloud 조회 실패 때 기존 채널 상태를 임의로 대체하지 않고 오류 안내만 전달하는지 확인했습니다.
- 실패 메시지가 `Cloud 채널 목록 조회를 완료하지 못했다`는 기준을 유지하는지 확인했습니다.
- 반환된 `loadChannelsFromCloud` 함수로 수동 재조회가 가능한지 확인했습니다.

검증:

- `npm.cmd test -- src/hooks/useCloudChannels.test.js --reporter=dot` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 채널 Cloud 조회 호출 조건 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 54. 2026-07-11 채널 Cloud 액션 hook 테스트 보강

채널 추가, 일괄 추가, 삭제, 정보 수정, 메모 저장이 Cloud API 성공/실패에 맞춰 화면 상태를 안전하게 갱신하는지 `useChannelActions` 테스트를 추가했습니다.

완료한 작업:

- 새 채널 저장 성공 때 Cloud 응답 채널만 화면 목록에 추가하는지 확인했습니다.
- 새 채널 저장 실패 때 화면 목록을 조용히 갱신하지 않고 실패로 처리하는지 확인했습니다.
- 채널 일괄 추가가 Cloud API 결과를 그대로 반환하는지 확인했습니다.
- 삭제 확인을 취소하면 Cloud 삭제 요청과 화면 상태 변경이 발생하지 않는지 확인했습니다.
- Cloud 삭제 성공 후에만 저장 채널 목록과 선택 채널 목록에서 제거하는지 확인했습니다.
- Cloud 삭제 실패 때 목록을 유지하고 삭제 실패 안내를 표시하는지 확인했습니다.
- 채널 상태가 활성 외 값으로 바뀌면 선택 채널 목록에서 제외되는지 확인했습니다.
- 채널 정보 저장 실패 때 업데이트 중 표시를 해제하고 목록을 유지하는지 확인했습니다.
- 채널 메모 저장 성공 때 Cloud 응답 채널로 목록을 교체하는지 확인했습니다.

검증:

- `npm.cmd test -- src/hooks/useChannelActions.test.js --reporter=dot` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 채널 Cloud 저장/삭제 호출 조건 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 55. 2026-07-11 태그 이름 변경 Cloud 액션 hook 테스트 보강

태그 이름 변경이 Cloud DB 일괄 반영 작업이라는 점을 유지하면서, 중복 방지/확인창/성공 후 재조회/실패 시 미변경 흐름을 `useTagRenameActions` 테스트로 보강했습니다.

완료한 작업:

- 변경 대상이 비어 있거나 기존 이름과 같으면 편집 모드만 닫고 Cloud API를 호출하지 않는지 확인했습니다.
- 이미 존재하는 카테고리 이름이면 Cloud 변경 확인창을 띄우기 전에 중단하는지 확인했습니다.
- 사용자가 확인창을 취소하면 Cloud rename API와 화면 상태 변경이 발생하지 않는지 확인했습니다.
- Cloud 태그 이름 변경 성공 때 카테고리 목록, 선택 카테고리, 완료 안내, Cloud 채널 재조회, 편집 모드 닫기가 순서대로 실행되는지 확인했습니다.
- 선택 중인 카테고리가 아닌 다른 태그를 변경할 때 선택 카테고리를 불필요하게 바꾸지 않는지 확인했습니다.
- Cloud 태그 이름 변경 실패 때 카테고리 목록을 바꾸지 않고 실패 안내만 표시하는지 확인했습니다.

검증:

- `npm.cmd test -- src/hooks/useTagRenameActions.test.js --reporter=dot` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 태그 이름 변경 Cloud API 호출 조건 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 56. 2026-07-11 채널 메모 모달 hook 테스트 보강

채널 메모 모달이 빈 메모를 저장하지 않고, Cloud 메모 저장 성공/실패에 맞춰 모달 상태를 안전하게 갱신하는지 `useChannelNotesModal` 테스트를 추가했습니다.

완료한 작업:

- 메모 모달의 초기 상태가 닫힘/빈 입력/저장 중 아님으로 시작하는지 확인했습니다.
- 채널 메모 모달을 열고 닫을 때 입력값과 저장 상태가 초기화되는지 확인했습니다.
- 메모 입력 변경이 기존 모달 상태를 유지하면서 입력값만 갱신하는지 확인했습니다.
- 빈 메모 또는 선택 채널 없음 상태에서는 Cloud 메모 저장을 호출하지 않는지 확인했습니다.
- Cloud 메모 저장 성공 때 저장 중 상태를 켠 뒤, 응답 채널로 모달을 유지하고 입력값을 비우는지 확인했습니다.
- Cloud 메모 저장 실패 때 오류 안내를 전달하고 저장 중 상태만 해제하는지 확인했습니다.

검증:

- `npm.cmd test -- src/hooks/useChannelNotesModal.test.js --reporter=dot` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 채널 메모 Cloud 저장 호출 조건 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 57. 2026-07-11 제작 칸반 액션 hook 테스트 보강

제작 칸반에서 영상 제작 기록 저장, 영상 상태 이동, 발견 링크 상태 이동이 Cloud 액션 결과에 맞춰 임시 저장 상태를 표시하고 해제하는지 `useProductionKanbanActions` 테스트를 추가했습니다.

완료한 작업:

- Cloud 영상 사용자 기록이 draft 상태로 동기화되는지 확인했습니다.
- 제작 draft 수정이 현재 draft 또는 저장된 Cloud 기록을 기준으로 병합되는지 확인했습니다.
- 저장된 기록과 draft 기록의 차이를 감지하는지 확인했습니다.
- 제작 draft 저장 성공 때 Cloud 저장 payload를 정규화하고 임시 saved 상태를 일정 시간 뒤 해제하는지 확인했습니다.
- 제작 draft 저장 실패 때 임시 error 상태를 유지하는지 확인했습니다.
- 영상 제작 상태 이동 성공 때 임시 saved 상태를 일정 시간 뒤 해제하는지 확인했습니다.
- 발견 링크 이동 handler가 없으면 Cloud 업데이트를 시도하지 않는지 확인했습니다.
- 발견 링크 상태 이동 실패 때 임시 error 상태를 유지하는지 확인했습니다.

검증:

- `npm.cmd test -- src/hooks/useProductionKanbanActions.test.js --reporter=dot` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 제작 칸반 Cloud 저장/이동 호출 조건 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 58. 2026-07-11 Creator App workflow 조립 hook 테스트 보강

App 구조가 여러 hook으로 나뉜 뒤에도 채널, 수집, 발견함, 영상 검토 workflow가 올바른 하위 hook과 상태를 연결하는지 `useCreatorAppWorkflowComposition` 테스트를 추가했습니다.

완료한 작업:

- 채널 workflow가 카테고리, 선택 채널, Cloud 채널 목록, 채널 액션, 채널 추가, 메모 모달, 태그 변경 workflow를 올바르게 연결하는지 확인했습니다.
- 수집 workflow가 저장 영상 조회/스캔 액션에 필요한 채널/런타임/영상/작업공간 의존성을 전달하는지 확인했습니다.
- 발견함 workflow가 Cloud 발견 링크 hook 결과를 그대로 사용하는지 확인했습니다.
- 영상 검토 workflow가 스크랩북, 영상별 사용자 기록, 제작 후보 액션을 올바르게 연결하는지 확인했습니다.

검증:

- `npm.cmd test -- src/hooks/useCreatorAppWorkflowComposition.test.js --reporter=dot` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- workflow 연결 구조 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 59. 2026-07-11 인수인계서 안정화 상태 갱신

최근 hook/service/utils 테스트 보강이 이어진 뒤, 다음 작업자가 현재 안정화 수준을 빠르게 이해할 수 있도록 `docs/HANDOFF.md`의 현재 상태와 다음 작업 순서를 갱신했습니다.

완료한 작업:

- `App.jsx` 분리 이후 상태를 2026-07-11 기준으로 갱신했습니다.
- Cloud/localStorage, 영상별 사용자 기록, 스크랩북, 발견함, 제작 후보함, 채널 액션, workflow 조립 흐름에 테스트 안전망이 추가된 상태를 명시했습니다.
- 다음 리팩터링 순서에 "테스트가 약한 새 조합 흐름은 테스트부터 추가" 원칙을 반영했습니다.
- 다음 작업 후보에 홈, 발견함, 제작 후보함, 스크랩북 사이의 작은 화면 이동 흐름 개선을 명시했습니다.

검증:

- 문서 변경만 진행했으며 앱 로직 테스트는 실행하지 않았습니다.
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 60. 2026-07-11 Creator App 파생 상태/화면 props hook 테스트 보강

앱 전체 상태가 화면 props와 지표/동기화 경고로 조립되는 과정이 흔들리지 않도록 `useCreatorAppDerivedState`와 `useCreatorAppViewProps` 테스트를 추가했습니다.

완료한 작업:

- Creator OS 지표 계산 hook에 전달되는 입력값을 확인했습니다.
- Cloud sync warning hook에 스크랩북/영상 판단 기록 경고가 분리되어 전달되는지 확인했습니다.
- 지표 결과와 동기화 경고가 하나의 derived state로 합쳐지는지 확인했습니다.
- 화면 layout, home, 발견함, legacy workspace route props builder가 App 상태를 그대로 받는지 확인했습니다.
- 홈 이동 callback이 `openCreatorView({ id: 'home' })`로 연결되는지 확인했습니다.

검증:

- `npm.cmd test -- src/hooks/useCreatorAppDerivedState.test.js src/hooks/useCreatorAppViewProps.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 화면 이동 동작 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 61. 2026-07-11 Creator App controller 조립 테스트 보강

앱 최상위 controller가 runtime, 채널 workflow, 영상 workflow, 작업공간 workflow, 수집 workflow, 파생 상태, 화면 props를 올바르게 연결하는지 `useCreatorAppController` 테스트를 추가했습니다.

완료한 작업:

- runtime 상태 hook이 한 번 호출되는지 확인했습니다.
- 채널 workflow에 오류/로딩/진행 메시지/채널 업데이트 setter가 전달되는지 확인했습니다.
- 영상 workflow에 현재 영상 목록이 전달되는지 확인했습니다.
- 작업공간 workflow에 API key와 오류 setter가 전달되는지 확인했습니다.
- 수집 workflow가 채널/runtime/영상/작업공간 workflow를 함께 받는지 확인했습니다.
- 파생 상태 계산에 카테고리, 발견 링크, 저장 채널/영상, sync warning, 사용자 판단 기록이 연결되는지 확인했습니다.
- 화면 props hook에 모든 workflow 결과와 파생 상태가 합쳐져 전달되는지 확인했습니다.

검증:

- `npm.cmd test -- src/hooks/useCreatorAppController.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 화면 동작 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 62. 2026-07-11 Workspace/Video workflow 조립 테스트 보강

작업공간 workflow와 영상 workflow가 각각 하위 hook 결과를 올바르게 합쳐 반환하는지 단독 테스트를 추가했습니다.

완료한 작업:

- 작업공간 workflow가 YouTube 댓글 도구에 API key와 오류 setter를 전달하는지 확인했습니다.
- 작업공간 workflow가 네비게이션 상태, 발견 링크 Cloud 상태, 댓글 모달 도구를 하나의 반환값으로 합치는지 확인했습니다.
- 영상 workflow가 현재 영상 목록을 영상 탐색 상태 hook에 전달하는지 확인했습니다.
- 영상 workflow가 영상 검토, 필터/정렬 상태, 체크/프롬프트 복사 도구를 하나의 반환값으로 합치는지 확인했습니다.

검증:

- `npm.cmd test -- src/hooks/useCreatorAppWorkspaceWorkflow.test.js src/hooks/useCreatorAppVideoWorkflow.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개
- `git diff --check` 통과

보존한 것:

- 앱 로직 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 화면 동작 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 63. 2026-07-11 스크랩북 빈 화면 이동 흐름 개선

스크랩북이 비어 있을 때 사용자가 다음 행동을 바로 선택할 수 있도록 `오늘 레이더로`, `저장 영상 탐색` 이동 버튼을 추가했습니다.

완료한 작업:

- 스크랩북 빈 화면에 안전한 이동 버튼 props를 추가했습니다.
- 버튼은 화면 이동만 실행하며 Cloud 저장, DB 조회 실행, YouTube API 호출을 직접 실행하지 않도록 문구를 명확히 했습니다.
- 스크랩북 workspace에서 `onOpenHome`, `onOpenReferenceVault`를 빈 화면에 전달하도록 연결했습니다.
- 빈 화면 액션 유틸 테스트를 추가해 handler가 없는 버튼은 표시하지 않도록 보호했습니다.

검증:

- `npm.cmd test -- src/utils/scrapbook.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개
- `git diff --check` 통과

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 스크랩북 저장/삭제 로직 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 64. 2026-07-11 참고 보관함 빈 화면 이동 흐름 개선

참고 보관함에 저장 영상이 아직 없을 때 사용자가 다음 행동으로 바로 이동할 수 있도록 `오늘 레이더로`, `새 채널 등록` 이동 버튼을 추가했습니다.

완료한 작업:

- 참고 보관함 빈 화면 버튼 문구를 상수로 고정했습니다.
- 버튼은 화면 이동만 실행하며 영상 수집, Cloud 저장, YouTube API 호출을 직접 실행하지 않도록 문구를 명확히 했습니다.
- 영상 결과 패널 빈 화면 props에 이동 액션을 연결했습니다.
- legacy dashboard와 workspace main panel에서 `openCreatorView`가 빈 화면까지 전달되도록 연결했습니다.
- 빈 화면 액션 유틸 테스트를 추가해 handler가 없는 버튼은 표시하지 않도록 보호했습니다.

검증:

- `npm.cmd test -- src/constants/emptyStates.test.js src/utils/videoResultsPanelProps.test.js src/utils/legacyDashboardTabViewProps.test.js src/utils/legacyWorkspaceMainPanelViewProps.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개
- `git diff --check` 통과

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 저장 영상 조회/필터/정렬 로직 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 65. 2026-07-11 필터 빈 화면 초기화 흐름 개선

저장 영상은 있지만 현재 검색어/필터 조건 때문에 결과가 0개인 경우, 사용자가 조건을 바로 기본값으로 되돌릴 수 있도록 `필터 초기화` 버튼을 추가했습니다.

완료한 작업:

- 필터 빈 화면에 초기화 버튼 문구를 상수로 고정했습니다.
- 버튼은 검색어/조회수 조건/영상 길이/터또터 모드만 기본값으로 되돌리며 저장, 수집, YouTube API 호출을 실행하지 않도록 문구를 명확히 했습니다.
- 영상 결과 패널 빈 화면 props에 필터 초기화 action을 연결했습니다.
- legacy dashboard에서 초기화 동작을 안전하게 구성하고, 필요한 setter가 없으면 버튼을 표시하지 않도록 보호했습니다.
- 필터 초기화 action 유틸과 reset 값 테스트를 추가했습니다.

검증:

- `npm.cmd test -- src/constants/emptyStates.test.js src/utils/videoResultsPanelProps.test.js src/utils/legacyDashboardTabViewProps.test.js --reporter=dot` 통과
- `npm.cmd test -- --reporter=dot` 통과
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개
- `git diff --check` 통과

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 저장 영상 데이터 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 66. 2026-07-11 인수인계서 빈 화면 흐름 상태 갱신

스크랩북, 참고 보관함, 필터 결과 없음 화면의 1차 안전 연결이 완료된 상태를 다음 작업자가 바로 이해할 수 있도록 `docs/HANDOFF.md`를 갱신했습니다.

완료한 작업:

- 최근 안정화 기준에 빈 화면 다음 행동 버튼과 필터 초기화 흐름을 추가했습니다.
- 최근 전체 테스트 기준을 `140개 파일 / 675개 테스트`로 갱신했습니다.
- 구현된 핵심 기능 목록에 검색어/필터 조건 초기화와 스크랩북/참고 보관함 빈 화면 이동 흐름을 추가했습니다.
- 다음 작업 안내에 스크랩북/참고 보관함/필터 빈 화면 1차 연결 완료 상태를 반영했습니다.

검증:

- `git diff --check` 통과

보존한 것:

- 코드 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 67. 2026-07-11 Azure 구독 이전 후 프론트 배포 확인 문서 갱신

Azure 리소스가 Microsoft Azure Sponsorship 구독으로 이동된 뒤, 프론트엔드 main 브랜치 배포가 실제로 여러 차례 성공한 상태를 `docs/CREATOR_OS_AZURE_SUBSCRIPTION_MIGRATION_CHECK.md`에 반영했습니다.

완료한 작업:

- 기존의 "다음 GitHub Actions 배포 확인 필요" 문구를 현재 확인 결과로 갱신했습니다.
- PR #845, #846, #847, #848 병합 후 Build와 Azure Static Web Apps CI/CD가 성공했고 공개 앱 루트가 `200 OK`였다는 사실을 기록했습니다.
- 이동 제외 관리 ID는 별도 영향 검토 없이 삭제하지 않는 기준으로 정리했습니다.
- 남은 확인 항목을 backend Function App 배포 확인과 Sponsorship 비용 반영 확인으로 좁혔습니다.

검증:

- `git diff --check` 통과

보존한 것:

- 코드 변경 없음
- Azure 리소스 변경 없음
- GitHub Actions workflow 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음

### 68. 2026-07-11 다음 구현 이슈 계획 최신화

최근 완료된 빈 화면 흐름 개선, 테스트 기준, Azure Sponsorship 이전 후 프론트 배포 확인 상태를 `docs/CREATOR_OS_NEXT_IMPLEMENTATION_ISSUES.md`에 반영했습니다.

완료한 작업:

- 현재 기준에 스크랩북/참고 보관함 빈 화면 이동과 필터 결과 없음 초기화 흐름을 추가했습니다.
- 현재 테스트 기준을 `140개 파일 / 675개 테스트` 통과 상태로 갱신했습니다.
- Azure Sponsorship 이전 후 frontend Build와 Azure Static Web Apps CI/CD가 정상 확인됐고, backend 배포와 비용 반영은 남은 운영 확인 항목으로 분리했습니다.
- Issue 2와 Issue 11의 완료 상태에 빈 화면 다음 행동과 관련 테스트 보강을 반영했습니다.
- Codex 추천 진행 순서를 작은 hook/utility 안정화와 되돌리기 쉬운 화면 흐름 개선 중심으로 갱신했습니다.

검증:

- `git diff --check` 통과

보존한 것:

- 코드 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 69. 2026-07-11 빈 화면 액션 버튼 렌더링 공통화

스크랩북, 제작 칸반, 참고 보관함, 필터 결과 없음 화면에서 반복되던 액션 버튼 렌더링을 `EmptyStateActions` 공통 컴포넌트로 분리했습니다.

완료한 작업:

- 빈 화면 액션 버튼의 label, title, aria-label, icon, variant class 렌더링을 공통 컴포넌트로 정리했습니다.
- 기존 화면별 버튼 색상, 간격, hover 스타일은 유지했습니다.
- 스크랩북/제작 칸반/참고 보관함/필터 결과 없음 화면이 같은 공통 컴포넌트를 사용하도록 연결했습니다.
- 공통 컴포넌트의 빈 액션 처리와 버튼 렌더링 테스트를 추가했습니다.

검증:

- `npm.cmd test -- src/components/EmptyStateActions.test.jsx src/utils/scrapbook.test.js src/utils/productionKanbanProps.test.js src/utils/videoResultsPanelProps.test.js --reporter=dot` 통과, 4개 파일 / 30개 테스트
- `npm.cmd test -- --reporter=dot` 통과, 141개 파일 / 677개 테스트
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개
- `git diff --check` 통과

보존한 것:

- 버튼 동작 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 저장/수집/YouTube API 호출 조건 변경 없음

### 70. 2026-07-11 빈 화면 단계 안내 카드 렌더링 공통화

스크랩북, 제작 칸반, 참고 보관함, 발견함 빈 화면에서 반복되던 3단계 안내 카드 렌더링을 `EmptyStateSteps` 공통 컴포넌트로 분리했습니다.

완료한 작업:

- 빈 화면 안내 단계의 title/description/card class 렌더링을 공통 컴포넌트로 정리했습니다.
- 화면별 카드 색상, 간격, 글자 크기, 설명 문구는 유지했습니다.
- 스크랩북/제작 칸반/참고 보관함/발견함 빈 화면이 같은 공통 단계 렌더러를 사용하도록 연결했습니다.
- 공통 컴포넌트의 빈 단계 처리와 단계별 class fallback 테스트를 추가했습니다.

검증:

- `npm.cmd test -- src/components/EmptyStateSteps.test.jsx src/components/EmptyStateActions.test.jsx src/constants/emptyStates.test.js src/utils/scrapbook.test.js src/utils/productionKanbanProps.test.js src/utils/videoResultsPanelProps.test.js --reporter=dot` 통과, 6개 파일 / 37개 테스트
- `npm.cmd test -- --reporter=dot` 통과, 142개 파일 / 679개 테스트
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개
- `git diff --check` 통과

보존한 것:

- 안내 문구 변경 없음
- 버튼 동작 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 저장/수집/YouTube API 호출 조건 변경 없음

### 71. 2026-07-11 다음 구현 이슈 계획의 안정화 기준 갱신

빈 화면 액션 버튼과 단계 안내 카드 공통화가 완료된 상태를 다음 구현 계획 문서에 반영했습니다.

완료한 작업:

- 현재 기준에 `EmptyStateActions`, `EmptyStateSteps` 공통화 완료 사실을 추가했습니다.
- 전체 테스트 기준을 `142개 파일 / 679개 테스트` 통과 상태로 갱신했습니다.
- Issue 2와 Issue 11에 빈 화면 공통 렌더링 정리와 관련 테스트 보강 완료 상태를 반영했습니다.
- Codex 추천 진행 순서에 빈 화면 공통 렌더링 정리 완료 상태를 추가했습니다.

검증:

- `git diff --check` 통과

보존한 것:

- 코드 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 72. 2026-07-11 홈 다음 행동과 흐름 안내 문구 보강

홈 화면과 제작 후보함에서 사용자가 버튼이나 지표를 눌렀을 때 어떤 일이 일어나는지 더 쉽게 구분할 수 있도록 안내 문구를 보강했습니다.

완료한 작업:

- 홈의 다음 추천 행동에 `impactText`를 추가해 화면 이동, Cloud DB 조회, Cloud 판단 기록 저장, YouTube API 호출 가능성을 분리해서 안내했습니다.
- 홈 지표 카드의 설명을 Cloud 저장 데이터, 현재 화면에 불러온 저장 영상, 스크랩북, 마지막 수집 기록, 또터또 판단 보조 신호 기준으로 정리했습니다.
- 홈 지표 카드와 제작 후보함 요약 카드에 hover/title 설명을 추가해 숫자의 의미를 확인할 수 있게 했습니다.
- 제작 후보함의 후보/제작 중/업로드 완료/발견 링크 후보 숫자가 Cloud 판단 기록 또는 Cloud 발견함 기준이라는 점을 명확히 했습니다.
- 준비중 화면과 URL 복사 버튼의 기본 안내 문구를 보강해 아직 연결되지 않은 설계 자리, 브라우저 로컬 클립보드 복사, API/DB/localStorage 변경 없음이 드러나게 했습니다.
- 발견함 필터 결과 없음 화면은 이미 `필터 초기화` 동작이 연결되어 있음을 확인했고, 추가 동작 변경은 하지 않았습니다.

검증:

- `npm.cmd test -- src/utils/homeNextAction.test.js src/utils/creatorHomeViewProps.test.js src/utils/productionKanbanSummary.test.js src/utils/routesProps.test.js src/utils/copyUrlButtonProps.test.js --reporter=dot` 통과, 5개 파일 / 24개 테스트
- `npm.cmd test -- --reporter=dot` 통과, 142개 파일 / 679개 테스트
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개
- `git diff --check` 통과

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 저장/수집/YouTube API 호출 조건 변경 없음
- Cloud/localStorage 저장 기준 변경 없음

### 73. 2026-07-11 홈/제작 후보 안내 렌더링 테스트 보강

홈 다음 행동, 홈 지표 카드, 제작 후보함 요약 카드에 추가된 안내 문구가 실제 컴포넌트 HTML까지 렌더링되는지 테스트를 보강했습니다.

완료한 작업:

- `HomeNextActionPanel`이 다음 행동의 영향 안내와 안전한 버튼 title/aria-label을 렌더링하는지 확인했습니다.
- 오늘 후보 검토 단계에서는 추가 이동 버튼 없이 후보 카드 판단 안내만 보여주는지 확인했습니다.
- `HomeSummaryCard`가 화면에 보이는 설명을 hover title로도 제공하는지 확인했습니다.
- `ProductionKanbanSummaryCard`와 `ProductionKanbanSummaryMetrics`가 Cloud 판단 기록/Cloud 발견함 기준 설명을 카드 title로 전달하는지 확인했습니다.

검증:

- `npm.cmd test -- src/components/HomeNextActionPanel.test.jsx src/components/HomeSummaryCard.test.jsx src/components/ProductionKanbanSummaryCard.test.jsx src/components/ProductionKanbanSummaryMetrics.test.jsx --reporter=dot` 통과, 4개 파일 / 5개 테스트
- `npm.cmd test -- --reporter=dot` 통과, 146개 파일 / 684개 테스트
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개
- `git diff --check` 통과

보존한 것:

- 코드 동작 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 저장/수집/YouTube API 호출 조건 변경 없음

### 74. 2026-07-11 레이더/스크랩북/제작 후보함 다음 행동 연결

오늘 레이더에서 판단을 마친 뒤 제작 후보함으로 이어지고, 스크랩북 영상 카드에서 제작 후보 표시를 할 수 있으며, 제작 후보함 안에서도 저장 영상 탐색과 발견함 정리로 이어질 수 있도록 다음 행동 흐름을 보강했습니다.

완료한 작업:

- 오늘 레이더 완료 상태에 `제작 후보함 열기` 버튼을 추가했습니다. 저장된 후보 조회 화면 이동이며 YouTube API를 새로 호출하지 않습니다.
- 스크랩북 영상 카드에 `제작 후보로` 버튼을 추가했습니다. 기존 Cloud 판단 기록에 제작 후보로 표시하는 흐름을 사용하고, 이미 후보인 영상은 `후보 표시됨`으로 비활성 표시합니다.
- 제작 후보함 상단에 `다음 행동` 영역을 추가했습니다. `저장 영상 더 보기`와 `발견함 링크 정리`는 화면 이동만 수행하며 외부 자동 수집이나 다운로드를 실행하지 않습니다.
- 홈 지표와 영상 리스트 배지 문구를 `현재 화면 영상`, `스크랩북 보관`, `마지막 수집 기록`, `또터또 후보`처럼 더 명확한 표현으로 맞췄습니다.
- 관련 유틸/컴포넌트 테스트를 보강해 Cloud 기록, DB 조회, YouTube API 호출 없음 안내가 렌더링되는지 확인했습니다.

검증:

- `npm.cmd test -- src\utils\radarCandidateStateProps.test.js src\utils\radarCandidates.test.js src\utils\creatorHomeViewProps.test.js src\utils\scrapbookVideoFooterActions.test.js src\utils\scrapbook.test.js src\components\ScrapbookReferenceFlow.test.jsx src\utils\videoListRowBadgesProps.test.js src\components\VideoListRowBadges.test.jsx src\utils\productionKanbanProps.test.js src\components\ProductionKanbanNextActions.test.jsx src\components\ProductionKanbanFlowStates.test.jsx --reporter=dot` 통과, 11개 파일 / 54개 테스트
- `npm.cmd test -- --reporter=dot` 통과, 164개 파일 / 728개 테스트
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개
- `git diff --check` 통과. Windows 줄끝 변환 경고만 표시됐고 diff 오류는 없습니다.

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음

### 92. 2026-07-12 제작 후보함 발견 링크 권리 확인 우선순위 보강

제작 후보함 안에서 권리 확인이 필요한 발견 링크 후보를 더 빨리 찾을 수 있도록 링크 후보 목록 표시 순서를 보강했습니다.

완료한 작업:

- 발견 링크 후보 목록에서 `do_not_use` 링크를 가장 위에 표시합니다.
- 그 다음 `needs_check`, `unknown`, `cleared` 순서로 표시합니다.
- 같은 권리 상태 안에서는 최신 수정/생성 순서가 먼저 보입니다.
- 섹션 헤더에 "먼저 처리할 권리 확인 링크 N개가 위에 표시됩니다" 안내를 추가했습니다.
- 이 변경은 화면 표시 순서만 바꾸며 저장, 삭제, YouTube API 호출은 실행하지 않습니다.
- 관련 유틸/컴포넌트 렌더링 테스트를 보강했습니다.

검증:

- `npm.cmd test -- src\utils\productionDiscoveryLinksSection.test.js src\components\ProductionKanbanFlowStates.test.jsx --reporter=dot`
  - 2개 테스트 파일, 12개 테스트 통과
- `npm.cmd test -- --reporter=dot`
  - 168개 테스트 파일, 741개 테스트 통과
- `npm.cmd run build`
  - Vite production build 통과
- `npm.cmd audit --omit=dev`
  - 취약점 0개

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음

### 91. 2026-07-12 홈 제작 후보 카드 권리 확인 버튼 문구 보강

홈의 제작 후보 작업 카드에서 권리 확인이 필요한 발견 링크 후보가 있을 때 일반 "후보함" 버튼 대신 "권리 확인" 버튼 문구를 표시하도록 보강했습니다.

완료한 작업:

- `hasRightsWarning` 값을 홈 제작 후보 액션 버튼까지 전달했습니다.
- 권리 확인 후보가 있으면 버튼 label을 "권리 확인"으로 바꿨습니다.
- 버튼 title/aria-label도 저장된 후보 조회이며 YouTube API를 새로 호출하지 않는다는 설명을 유지했습니다.
- 관련 유틸/컴포넌트 렌더링 테스트를 보강했습니다.

검증:

- `npm.cmd test -- src\utils\homeCandidateWorkflowActions.test.js src\components\HomeRadarWorkflowSection.test.jsx --reporter=dot`
  - 2개 테스트 파일, 7개 테스트 통과
- `npm.cmd test -- --reporter=dot`
  - 168개 테스트 파일, 740개 테스트 통과
- `npm.cmd run build`
  - Vite production build 통과
- `npm.cmd audit --omit=dev`
  - 취약점 0개

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음

### 75. 2026-07-11 제작 후보함/발견함/홈 흐름 2차 보강

제작 후보함, 발견함, 홈 화면에서 사용자가 다음에 볼 항목을 더 쉽게 판단할 수 있도록 표시 전용 안내를 추가했습니다.

완료한 작업:

- 제작 후보함 상단에 우선 확인 안내를 추가했습니다. 권리 확인 필요 링크, 지난 일정, 일정 없는 제작 중 후보, 제작 중 후보, 영상 후보, 링크 후보 순으로 표시합니다.
- 발견함 링크 후보 카드에 원본 확인, 권리 상태, 후보 처리 순서를 추가했습니다. 외부 자동 수집이나 다운로드 없이 사용자가 직접 확인하는 흐름을 강조합니다.
- 홈 지표에 제작 후보와 발견 링크 후보 숫자를 추가했습니다. 숫자 확인만으로 저장이나 API 호출은 실행되지 않습니다.
- 발견함 Cloud 오류 안내에 localStorage 자동 병합과 링크 자동 업로드를 하지 않는다는 복구 기준을 추가했습니다.
- 관련 유틸/컴포넌트 테스트를 보강했습니다.

검증:

- `npm.cmd test -- src\utils\productionKanbanSummary.test.js src\components\ProductionKanbanPriorityGuide.test.jsx src\components\ProductionKanbanFlowStates.test.jsx src\utils\creatorHomeViewProps.test.js src\utils\discoveryLinksCopy.test.js src\components\DiscoveryLinksFlowStates.test.jsx --reporter=dot` 통과, 6개 파일 / 27개 테스트
- `npm.cmd test -- --reporter=dot` 통과, 166개 파일 / 734개 테스트
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개
- `git diff --check` 통과. Windows 줄끝 변환 경고만 표시됐고 diff 오류는 없습니다.

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음

### 76. 2026-07-11 화면 상태 배지와 후보 흐름 문구 정리

오늘 레이더, 저장 영상 카드, 채널 목록, 발견함, 제작 후보함에서 사용자가 다음 행동을 더 쉽게 구분할 수 있도록 상태 배지와 후보 흐름 안내 문구를 정리했습니다.

완료한 작업:

- 오늘 레이더 처리 완료 문구에 저장 영상 탐색과 제작 후보함으로 이어지는 다음 행동을 명시했습니다.
- 오늘 레이더 판단 안내에 제작 후보, 소재 보관, 나중에 보기, 제외의 사용 기준을 더 쉽게 표시했습니다.
- 저장 영상 카드의 상태 배지를 `스크랩북 보관`, `제작 후보`, `AI 요청문 선택`으로 정리하고 hover 안내를 추가했습니다.
- 채널 등급/상태 배지에 "이 배지만으로 YouTube API를 호출하지 않는다"는 안내를 추가했습니다.
- 발견함의 제작 후보 버튼이 후보함에서 확인되는 흐름과 권리 확인 별도 원칙을 더 분명히 표시했습니다.
- 스크랩북과 제작 후보함 빈 화면 문구에서 "보관"과 "제작 후보"가 별도 개념임을 보강했습니다.
- 상태 배지 렌더링 테스트 2개 파일을 추가했습니다.

검증:

- `npm.cmd test -- src\utils\radarCandidateStateProps.test.js src\utils\productionKanbanSummary.test.js src\utils\videoCard.test.js src\utils\channelListItemMetaProps.test.js src\utils\discoveryLinkActionProps.test.js src\constants\emptyStates.test.js src\components\VideoCardStatusBadges.test.jsx src\components\ChannelListItemMeta.test.jsx --reporter=dot` 통과, 8개 파일 / 36개 테스트
- `npm.cmd test -- --reporter=dot` 통과, 162개 파일 / 723개 테스트
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음

### 77. 2026-07-11 주요 화면 흐름 렌더링 테스트 묶음 보강

홈 화면에서 오늘 레이더와 제작 후보함으로 이어지는 흐름, 발견함 빈 상태와 필터 상태, 스크랩북/참고 보관함, 제작 후보함, 채널 안전 버튼, 영상 카드/리스트 액션, 댓글 Top 10 모달 상태 문구를 한 묶음으로 테스트 보강했습니다.

완료한 작업:

- `HomeRadarWorkflowSection`이 저장 영상 조회, 오늘 후보 판단, 제작 후보함/발견함 이동을 Cloud DB/Cloud 판단 기록/YouTube API 경계와 함께 렌더링하는지 확인했습니다.
- `DiscoveryLinksEmptyState`, `DiscoveryLinksFilteredEmptyState`, `DiscoveryLinksHeaderActions`가 수동 링크 저장, 필터 초기화, 후보함 이동, Cloud 재조회, URL 복사를 구분하는지 확인했습니다.
- `ScrapbookEmptyState`, `ReferenceVaultEmptyState`, `ScrapbookVideoFooterActions`가 안전한 화면 이동, Cloud DB 조회, URL 복사, 댓글 API 호출, Cloud 스크랩북 해제를 구분하는지 확인했습니다.
- `ProductionKanbanEmptyState`, `ProductionVideoMoveStatus`, `ProductionVideoSaveStatus`가 빈 후보함 다음 행동과 Cloud 저장 성공/실패 문구를 렌더링하는지 확인했습니다.
- `ChannelListItemActions`, `ChannelTagSelector`가 채널 URL 복사, Cloud 채널 삭제, 태그 선택의 API/저장 경계를 유지하는지 확인했습니다.
- `VideoCardPrimaryActions`, `VideoCardMetaActions`, `VideoListRowCandidateAction`이 스크랩/제작 후보/댓글 조회/URL 복사 경계를 유지하는지 확인했습니다.
- `TopCommentsModal`이 로딩/오류/빈 상태를 명확히 렌더링하는지 확인했습니다.

검증:

- `npm.cmd test -- src/components/HomeRadarWorkflowSection.test.jsx src/components/DiscoveryLinksFlowStates.test.jsx src/components/ScrapbookReferenceFlow.test.jsx src/components/ProductionKanbanFlowStates.test.jsx src/components/ChannelSafetyControls.test.jsx src/components/VideoActionSafetyControls.test.jsx src/components/TopCommentsModalStates.test.jsx --reporter=dot` 통과, 7개 파일 / 16개 테스트
- `npm.cmd test -- --reporter=dot` 통과, 160개 파일 / 720개 테스트
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개
- `git diff --check` 통과

보존한 것:

- 코드 동작 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 저장/수집/YouTube API 호출 조건 변경 없음

### 78. 2026-07-11 발견함 저장/제작 후보 이동 버튼 렌더링 테스트 보강

발견함 수동 링크 저장 버튼과 제작 후보함의 영상/발견 링크 상태 이동 버튼이 Cloud 저장과 외부 수집 없음 기준을 실제 화면 HTML에 렌더링하는지 테스트를 보강했습니다.

완료한 작업:

- `DiscoveryLinkSubmitButton`이 수동 링크 저장을 Cloud 발견함 저장으로 안내하고 외부 사이트 크롤링을 하지 않는다고 표시하는지 확인했습니다.
- 중복 링크/저장 중 상태에서 링크 저장 버튼이 비활성화되고 상태 문구를 유지하는지 확인했습니다.
- `ProductionVideoMoveActions`가 제작 후보/제작 중/업로드 완료 이동을 Cloud 판단 기록 저장으로 안내하고 YouTube API를 새로 호출하지 않는다고 표시하는지 확인했습니다.
- `ProductionDiscoveryLinkMoveActions`가 발견 링크 후보 해제/후보 제외를 Cloud 발견함 상태 저장으로 안내하고 링크 기록을 삭제하지 않는다고 표시하는지 확인했습니다.

검증:

- `npm.cmd test -- src/components/DiscoveryLinkSubmitButton.test.jsx src/components/ProductionDiscoveryLinkMoveActions.test.jsx src/components/ProductionVideoMoveActions.test.jsx --reporter=dot` 통과, 3개 파일 / 9개 테스트
- `npm.cmd test -- --reporter=dot` 통과, 153개 파일 / 704개 테스트
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개
- `git diff --check` 통과

보존한 것:

- 코드 동작 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 저장/수집/YouTube API 호출 조건 변경 없음

### 79. 2026-07-11 다음 구현 이슈 계획의 흐름 안내 기준 갱신

홈 다음 행동과 홈/제작 후보 지표 안내 문구, 컴포넌트 렌더링 테스트 보강이 완료된 상태를 다음 구현 계획 문서에 반영했습니다.

완료한 작업:

- 현재 기준에 홈 다음 행동과 홈/제작 후보 지표 안내 문구 보강 완료 사실을 추가했습니다.
- 전체 테스트 기준을 `146개 파일 / 684개 테스트` 통과 상태로 갱신했습니다.
- Issue 11에 홈 다음 행동 영향 안내, 홈 지표 hover 설명, 제작 후보함 요약 카드 hover 설명의 컴포넌트 렌더링 테스트 보강 완료 상태를 반영했습니다.
- Codex 추천 진행 순서의 완료된 안정화 항목에 홈/제작 후보 흐름 안내 문구와 렌더링 테스트를 추가했습니다.

검증:

- `git diff --check` 통과

보존한 것:

- 코드 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 80. 2026-07-11 URL 복사 버튼 렌더링 테스트 보강

공통 `CopyUrlButton`이 기본 안내 문구와 비활성 상태, 접근성 문구를 안전하게 렌더링하는지 테스트를 보강했습니다.

완료한 작업:

- 기본 URL 복사 버튼이 브라우저 로컬 클립보드 복사, API 호출 없음, 저장 작업 없음 안내를 title로 제공하는지 확인했습니다.
- 복사할 URL이 없을 때 버튼이 비활성화되는지 확인했습니다.
- 사용자 지정 aria-label을 쓸 때도 화면 표시용 복사 상태 문구가 숨김 텍스트로 유지되는지 확인했습니다.

검증:

- `npm.cmd test -- src/components/CopyUrlButton.test.jsx --reporter=dot` 통과, 1개 파일 / 3개 테스트
- `npm.cmd test -- --reporter=dot` 통과, 147개 파일 / 687개 테스트
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개
- `git diff --check` 통과

보존한 것:

- 코드 동작 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 저장/수집/YouTube API 호출 조건 변경 없음

### 81. 2026-07-11 준비중 화면 렌더링 테스트 보강

준비중 화면이 아직 연결되지 않은 설계 자리이며 API/DB/localStorage 변경이 없다는 안내를 실제 HTML에 렌더링하는지 테스트를 보강했습니다.

완료한 작업:

- 준비중 화면이 메뉴 제목, 섹션 제목, 요약 문구, 안전 안내 문구를 렌더링하는지 확인했습니다.
- 홈으로 돌아가기 버튼의 title과 aria-label이 데이터 조회나 저장 작업이 없다는 안내를 유지하는지 확인했습니다.
- 홈 이동 handler가 없을 때 버튼을 렌더링하지 않는지 확인했습니다.

검증:

- `npm.cmd test -- src/components/ComingSoonView.test.jsx --reporter=dot` 통과, 1개 파일 / 2개 테스트
- `npm.cmd test -- --reporter=dot` 통과, 148개 파일 / 689개 테스트
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개
- `git diff --check` 통과

보존한 것:

- 코드 동작 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 저장/수집/YouTube API 호출 조건 변경 없음

### 82. 2026-07-11 저장 영상 조회/새 영상 수집 버튼 렌더링 테스트 보강

저장 영상 불러오기 버튼과 새 영상 수집 버튼이 DB 조회와 YouTube API 호출 가능 작업을 실제 화면 HTML에서 명확히 구분하는지 테스트를 보강했습니다.

완료한 작업:

- `LoadStoredVideosButton`이 선택 채널 저장 영상 불러오기를 Cloud DB 조회로 안내하고 YouTube API를 새로 호출하지 않는다고 표시하는지 확인했습니다.
- 채널 미선택/로딩 상태에서 저장 영상 불러오기 버튼이 비활성화되고 안전 안내를 유지하는지 확인했습니다.
- `VideoToolbarScanAction`이 새 영상 수집을 YouTube API 사용 작업으로 표시하는지 확인했습니다.
- 수집 대상 없음/수집 중 상태에서 새 영상 수집 버튼이 비활성화되는지 확인했습니다.

검증:

- `npm.cmd test -- src/components/LoadStoredVideosButton.test.jsx src/components/VideoToolbarScanAction.test.jsx --reporter=dot` 통과, 2개 파일 / 6개 테스트
- `npm.cmd test -- --reporter=dot` 통과, 150개 파일 / 695개 테스트
- `npm.cmd run build` 통과
- `npm.cmd audit --omit=dev` 통과, 취약점 0개
- `git diff --check` 통과

보존한 것:

- 코드 동작 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- 저장/수집/YouTube API 호출 조건 변경 없음

### 83. 2026-07-11 제작 후보 카드 작업 준비 체크 추가

제작 후보함에서 영상 후보를 볼 때 바로 작업 준비 상태를 판단할 수 있도록 표시 전용 체크리스트를 추가했습니다.

완료한 작업:

- 제작 후보 영상 카드에 원본 링크, 제목 초안, 제작 메모, 업로드 예정일 준비 여부를 표시했습니다.
- 작업 준비 체크는 화면 표시만 담당하며 저장, DB 쓰기, YouTube API 호출을 실행하지 않도록 안내 문구와 테스트를 보강했습니다.
- 발견함 링크 후보 섹션에는 외부 링크 후보 개수 배지를 추가해 저장 영상 후보와 발견 링크 후보를 분리해서 볼 수 있게 했습니다.
- 제작 후보 카드 준비 체크와 발견함 링크 후보 개수 표시의 렌더링/계산 테스트를 추가했습니다.

검증:

- `npm.cmd test -- src\utils\productionVideoCard.test.js src\components\ProductionVideoReadinessChecklist.test.jsx src\utils\productionDiscoveryLinksSection.test.js src\components\ProductionKanbanFlowStates.test.jsx --reporter=dot` 통과, 4개 파일 / 17개 테스트
- `npm.cmd test -- --reporter=dot` 통과, 165개 파일 / 731개 테스트

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음

### 84. 2026-07-11 앱 설계도와 구조 설계서 현재 상태 반영

초기 설계 시절 표현이 남아 있던 `APP_BLUEPRINT`와 `ARCHITECTURE`를 현재 Creator OS 구현 상태에 맞게 문서만 갱신했습니다.

완료한 작업:

- 앱 기본 흐름을 홈/오늘 레이더, 저장 영상 DB 조회, 수동 발견함, 제작 후보함 중심으로 갱신했습니다.
- 현재 화면 구조에 발견함/링크 수집, 스크랩북/참고 보관함, 제작 후보함, 준비중 메뉴를 반영했습니다.
- `App.jsx`가 이미 얇은 연결 파일이고, hooks/components/services/utils 구조로 분리된 현재 상태를 구조 문서에 반영했습니다.
- discovery links는 `docType: discovery_link`, 제작 후보는 별도 `production_candidates` 저장소 없이 `videoUserRecords`와 발견함 상태값을 사용한다는 현재 기준을 명시했습니다.
- Phase 문구를 초기 구현 계획이 아니라 현재 구조 안정화 완료와 화면 흐름 안정화 진행 기준으로 정리했습니다.
- 문서 인덱스에서 `APP_BLUEPRINT`와 `ARCHITECTURE`의 설명을 현재 제품/구조 기준 문서에 맞게 갱신했습니다.

검증:

- 문서 변경만 수행했습니다.

보존한 것:

- 코드 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 85. 2026-07-11 README 현재 흐름 반영

처음 보는 사람이 현재 앱 상태를 오해하지 않도록 README의 기능 목록, 장기 방향, 주요 파일 설명을 현재 Creator OS 구조에 맞게 문서만 갱신했습니다.

완료한 작업:

- 현재 기능 목록에 채널 등급/운영 상태, 발견 링크 제작 후보 연결, 제작 후보함의 영상/링크 후보, 작업 준비 체크와 우선 확인 안내, 테스트 보호 상태를 반영했습니다.
- 장기 방향에서 이미 완료된 "대시보드 신설" 같은 표현을 제거하고, 홈/오늘 레이더, 저장 영상 필터, 발견함/제작 후보함 흐름, local assets, 별도 제작 프로젝트 검토로 정리했습니다.
- 주요 파일 설명에서 `App.jsx`가 현재 얇은 연결 파일이라는 점과 `hooks/services/utils`의 역할을 명시했습니다.
- 다음 개발 후보에서 `App.jsx`를 계속 얇게 만드는 표현을 현재 구조 유지와 작은 정리 방향으로 바꿨습니다.

검증:

- 문서 변경만 수행했습니다.

보존한 것:

- 코드 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 86. 2026-07-11 인수인계서 메뉴와 localStorage 기준 최신화

`HANDOFF.md`에 남아 있던 초기 메뉴명과 localStorage 분리 예정 문구를 현재 구현 기준에 맞게 문서만 갱신했습니다.

완료한 작업:

- UI 메뉴 이름 섹션을 대시보드/영상 발굴/또터또 모드 중심의 초기 제안에서 오늘 레이더, 저장 영상, 발견함, 스크랩북/참고 보관함, 제작 후보함 중심의 현재 화면 흐름으로 바꿨습니다.
- localStorage는 기준 저장소가 아니라 Cloud 실패 시 임시 fallback이며, `services/storage.js`와 hook 흐름 안에서 관리한다는 현재 원칙으로 정리했습니다.

검증:

- 문서 변경만 수행했습니다.

보존한 것:

- 코드 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음

### 87. 2026-07-11 안정화 1~7번 묶음 정리

사용자가 승인한 추천 순서 1~7번에 맞춰 문서 잔여 정리, `WORK_LOG` 번호 정리, 화면 로딩 문구 보강, 테스트 보강, 공개 앱 smoke check 절차 문서화, 다음 기능 개선 후보 정리를 진행했습니다.

완료한 작업:

- `WORK_LOG`의 중복/역전 번호를 문서 순서 기준으로 1~86까지 다시 정리했습니다.
- 채널 목록 로딩 문구가 Cloud 채널 조회이며 영상 수집/YouTube API 호출이 아님을 표시하도록 보강했습니다.
- 발견함 로딩 문구가 Cloud 발견함 조회이며 외부 사이트 수집/자동 업로드가 아님을 표시하도록 보강했습니다.
- 채널 목록 로딩 상태에 `role="status"`와 `aria-live="polite"`를 추가했습니다.
- 채널 목록/발견함 로딩 상태 컴포넌트 렌더링 테스트를 추가했습니다.
- `CREATOR_OS_PUBLIC_APP_SMOKE_CHECK.md`를 추가해 main 병합 후 Build, Azure Static Web Apps 배포, 공개 앱 루트 `200 OK` 확인 절차를 문서화했습니다.
- 문서 인덱스와 다음 구현 이슈 계획에 공개 앱 smoke check와 다음 기능 개선 후보를 반영했습니다.

검증:

- `npm.cmd test -- --reporter=dot`
  - 168개 테스트 파일, 736개 테스트 통과
- `npm.cmd run build`
  - Vite production build 통과
- `npm.cmd audit --omit=dev`
  - 취약점 0개
- `git diff --check`
  - 패치 오류 없음

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음

### 88. 2026-07-11 후속 추천 1~3번 안정화

사용자가 승인한 다음 추천 작업 1~3번에 맞춰 GitHub Actions 경고 최소 정리, 제작 후보함의 오늘 처리 순서 안내, 발견 링크 권리 상태 안내를 보강했습니다.

완료한 작업:

- Azure Static Web Apps workflow에서 `Azure/static-web-apps-deploy@v1`이 지원하지 않는 `github_id_token` 입력 제거를 검증했습니다.
- main Azure 배포에서 `No matching Static Web App was found or the api key was invalid.` 오류가 발생해, 해당 입력은 별도 복구 작업에서 되돌리기로 했습니다.
- 이전에 실패했던 token 방식 전체 단순화와 다르게, OIDC 단계 전체 삭제나 Azure 인증 방식 변경은 하지 않았습니다.
- 제작 후보함 우선 확인 안내에 "오늘 순서" 문구를 추가했습니다.
- 발견 링크 권리 경고에 "다음 행동" 문구를 추가해 권리 확인 필요/사용 금지 링크를 어떻게 처리할지 더 명확히 했습니다.
- 발견함 안전 안내에 권리 상태가 사용 허가나 자동 권리 확인을 의미하지 않는다는 설명을 보강했습니다.
- 관련 유틸/컴포넌트 렌더링 테스트를 보강했습니다.

검증:

- `npm.cmd test -- src\utils\productionKanbanSummary.test.js src\components\ProductionKanbanPriorityGuide.test.jsx src\utils\discoveryLinksCopy.test.js src\components\ProductionKanbanFlowStates.test.jsx --reporter=dot`
  - 4개 테스트 파일, 18개 테스트 통과
- `npm.cmd test -- --reporter=dot`
  - 168개 테스트 파일, 736개 테스트 통과
- `npm.cmd run build`
  - Vite production build 통과
- `npm.cmd audit --omit=dev`
  - 취약점 0개
- `git diff --check`
  - 패치 오류 없음

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음

### 89. 2026-07-11 Azure Static Web Apps workflow 입력 복구

PR #870 병합 후 main의 Azure Static Web Apps CI/CD가 실패해, 배포 성공을 우선하기 위해 `github_id_token` 입력을 복구했습니다.

확인한 사실:

- Build workflow는 성공했습니다.
- Azure Static Web Apps CI/CD는 `Build And Deploy` 단계에서 실패했습니다.
- 실패 메시지는 `No matching Static Web App was found or the api key was invalid.`였습니다.
- 같은 실패는 2026-07-03 token 방식 단순화 검증 때도 확인된 적이 있습니다.
- 따라서 현재 Azure 설정에서는 `github_id_token` warning이 남더라도 기존 입력을 유지해야 합니다.

완료한 작업:

- `.github/workflows/azure-static-web-apps-lively-dune-0af1d2a00.yml`에 `github_id_token: ${{ steps.idtoken.outputs.result }}` 입력을 복구했습니다.
- 배포 warning 선택지 문서와 다음 구현 이슈 문서에 "경고보다 배포 성공 우선" 기준을 반영했습니다.

검증:

- `npm.cmd test -- --reporter=dot`
  - 168개 테스트 파일, 736개 테스트 통과
- `npm.cmd run build`
  - Vite production build 통과
- `git diff --check`
  - 패치 오류 없음
- PR #871 병합 후 main Build 통과
- PR #871 병합 후 main Azure Static Web Apps CI/CD 통과
- 공개 앱 루트 `200 OK` 확인
- 배포 번들에 "오늘 순서", "다음 행동: 원본 링크 열기", "사용 허가나 자동 권리 확인을 의미하지 않습니다" 문구 포함 확인
- `github_id_token` warning은 남아 있지만 배포는 정상 통과

보존한 것:

- 앱 코드 변경 없음
- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음

### 90. 2026-07-12 홈 다음 행동 권리 확인 우선순위 보강

홈의 "다음 추천 행동"이 오늘 레이더 후보 검토가 끝난 뒤 권리 확인이 필요한 발견 링크 후보를 일반 제작 후보보다 먼저 안내하도록 보강했습니다.

완료한 작업:

- 홈 다음 행동 계산에 `discoveryRightsWarningCount`를 반영했습니다.
- 레이더 후보가 남아 있으면 기존처럼 오늘 후보 판단을 먼저 안내합니다.
- 레이더 후보가 없고 권리 확인이 필요한 발견 링크 후보가 있으면 "권리 확인 필요한 후보를 먼저 정리하세요"를 표시합니다.
- 해당 버튼은 제작 후보함으로 이동만 하며, 이동만으로 YouTube API 호출이나 저장 작업을 실행하지 않습니다.
- 관련 유틸/컴포넌트 렌더링 테스트를 보강했습니다.

검증:

- `npm.cmd test -- src\utils\homeNextAction.test.js src\components\HomeNextActionPanel.test.jsx src\components\HomeRadarWorkflowSection.test.jsx --reporter=dot`
  - 3개 테스트 파일, 13개 테스트 통과
- `npm.cmd test -- --reporter=dot`
  - 168개 테스트 파일, 739개 테스트 통과
- `npm.cmd run build`
  - Vite production build 통과
- `npm.cmd audit --omit=dev`
  - 취약점 0개

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음

### 91. 2026-07-13 Creator OS 흐름 안정화 1~14번 묶음

홈, 오늘 레이더, 저장 영상, 발견함, 스크랩북, 제작 후보함을 잇는 현재 흐름을 감사하고, 데이터 구조를 바꾸지 않는 범위에서 중복 실행 방지, 모바일 배치, 접근성, 테스트와 문서를 한 묶음으로 보강했습니다.

완료한 작업:

- 레이더 카드의 상태 판단, 제작 후보 표시, 스크랩북 저장과 판단 초기화/되돌리기에 Cloud 처리 잠금을 추가했습니다.
- Cloud 작업 중에는 관련 버튼을 비활성화하고 `저장 중`, `초기화 중`, `되돌리는 중` 상태를 화면과 보조 기술에 알립니다.
- 스크랩북 영상 카드의 제작 후보 표시도 중복 클릭을 막고, 좁은 화면에서 하단 버튼이 안전하게 줄바꿈되도록 보강했습니다.
- 발견함 상태/권리 필터에 선택 상태 `aria-pressed`, 그룹 이름, 현재 필터 요약, `필터 초기화` 버튼을 추가했습니다. 초기화는 화면 필터만 바꾸며 Cloud 데이터를 수정하지 않습니다.
- 모바일 좌측 메뉴 높이를 제한하고 내부 스크롤을 사용해 첫 화면에서 작업 영역이 바로 보이도록 했습니다.
- 홈, 발견함, 스크랩북의 모바일 여백과 제작 후보 일정의 긴 제목 표시를 보강했습니다.
- 홈 빠른 작업 버튼에서 React `key` prop 경고가 발생하던 전달 방식을 수정했습니다.
- 레이더 우선순위, Cloud 저장 잠금, 발견함 필터 초기화/접근성, 스크랩북 모바일 동작 관련 테스트를 보강했습니다.
- 390x844 모바일과 1280px 데스크톱에서 홈, 발견함, 제작 후보함을 읽기 전용으로 확인했고 가로 넘침이나 새 React 경고가 없음을 확인했습니다.
- 현재 구현 상태, Azure Sponsorship 이전 완료, 다음 기능 후보를 `HANDOFF`와 다음 구현 이슈 문서에 반영했습니다.

검증:

- `npm.cmd test -- --reporter=dot`
  - 171개 테스트 파일, 751개 테스트 통과
- `npm.cmd run build`
  - Vite production build 통과
- `npm.cmd audit --omit=dev`
  - 취약점 0개
- `git diff --check`
  - 패치 오류 없음
- 브라우저 확인
  - 모바일/데스크톱 가로 넘침 없음
  - 발견함/제작 후보함 진입 정상
  - React `key` prop 경고 재발 없음

보존한 것:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음
- Cloud/localStorage 자동 병합 또는 자동 업로드 없음

### 93. 2026-07-13 오늘 집중 홈 연결과 제작 후보 저장 안정화

제작 후보함 안에서만 보이던 수동 `오늘 집중`을 홈의 지표와 다음 추천 행동에 연결하고, 제작 후보 Cloud 저장의 중복 요청과 예외 처리를 보강했습니다.

완료한 작업:

- Cloud `videoUserRecords.focusPinnedAt`을 기준으로 홈의 `오늘 집중` 수를 계산합니다.
- 홈 요약에 `오늘 집중` 카드를 추가하고, 권리 확인 경고가 없을 때 `오늘 집중 보기`로 제작 후보함에 바로 이동하도록 연결했습니다.
- 권리 확인 필요 링크가 있으면 기존처럼 권리 경고를 오늘 집중보다 먼저 안내합니다.
- 홈 지표 배치를 모바일 1열, 작은 화면 2열, 넓은 화면 4열로 안정화했습니다.
- 제작 후보의 집중/상태 Cloud 요청이 진행 중일 때 같은 영상의 두 번째 요청을 보내지 않도록 막았습니다.
- Cloud 요청이 예외로 거절돼도 `저장 중`에 남지 않고 기존 실패 안내 상태로 돌아오게 했습니다.
- 오늘 집중 빈 상태, 복수 후보, 긴 제목, 저장 중 버튼 비활성화를 렌더링 테스트로 보강했습니다.
- 백엔드 PR #12와 프론트엔드 PR #885의 병합 및 Azure 배포 성공 사실과, 인증된 Cloud 왕복 실사용 확인이 남아 있음을 문서에 반영했습니다.

검증:

- 관련 테스트 8개 파일, 47개 테스트 통과
- `npm.cmd test -- --reporter=dot`
  - 172개 테스트 파일, 765개 테스트 통과
- `npm.cmd run build`
  - Vite production build 통과
  - 약 500 kB 단일 번들 경고는 남아 있으나 빌드 실패는 아님
- `npm.cmd audit --omit=dev`
  - 취약점 0개
- `git diff --check`
  - 패치 오류 없음

보존한 것:

- API endpoint 변경 없음
- DB schema 또는 container 변경 없음
- 기존 `status/statusIds` 의미 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음
- Cloud/localStorage 자동 병합 또는 자동 업로드 없음

### 94. 2026-07-13 실사용 중심 사이드바 정리

전체 제품 지도를 삭제하지 않으면서 실제 사용하는 메뉴와 장기 로드맵을 구분해, 앱이 준비중 메뉴로 가득 차 보이던 문제를 정리했습니다.

완료한 작업:

- 전체 31개 메뉴를 현재 사용 가능한 10개와 준비중 21개로 코드에서 자동 분리합니다.
- 현재 사용 가능한 메뉴는 기존처럼 사이드바에 바로 표시합니다.
- 준비중 메뉴는 기본적으로 접힌 `향후 기능` 영역에 보존하고, 필요할 때만 펼쳐 기존 준비중 안내 화면을 열 수 있게 했습니다.
- 접기/펼치기 버튼에 상태, 항목 수, API 호출이나 데이터 변경이 없다는 접근성 안내를 추가했습니다.
- 기본 상태 10개, 펼친 상태 31개, 준비중 항목 보존을 렌더링 테스트로 확인했습니다.
- 390px 모바일과 기본 데스크톱 화면에서 접기/펼치기, 가로 넘침, 브라우저 경고를 확인했습니다.

검증:

- 관련 테스트 4개 파일, 18개 테스트 통과
- `npm.cmd test -- --reporter=dot`
  - 173개 테스트 파일, 769개 테스트 통과
- `npm.cmd run build`
  - Vite production build 통과
  - 약 503 kB 단일 번들 경고는 남아 있으나 빌드 실패는 아님
- `npm.cmd audit --omit=dev`
  - 취약점 0개
- 브라우저 확인
  - 기본 메뉴 10개, 향후 기능 펼침 시 전체 31개 표시
  - 모바일/데스크톱 가로 넘침과 콘솔 경고 없음

보존한 것:

- 준비중 기능과 안내 화면 삭제 없음
- API endpoint 변경 없음
- DB schema 또는 container 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음

### 95. 2026-07-13 터또터·오늘 볼 채널·제작 후보 실사용 확장

준비중 메뉴에 남아 있던 소재 탐색 기능을 실제 저장 데이터 기반 화면으로 연결하고, 제작 후보를 실제 작업으로 넘기는 흐름을 보강했습니다.

완료한 작업:

- `터또터 탐색`을 정식 화면으로 연결했습니다. 저장 영상 중 6개월 이상이고 채널 평균 대비 1.5배 이상 반응한 후보를 검색, 길이, 조회수, 정렬 조건으로 좁힙니다.
- 터또터 후보에서 봤음, 나중에 보기, 제외, 제작 후보, 스크랩북 저장과 처리 기록 되돌리기를 기존 Cloud 사용자 기록 흐름으로 실행합니다.
- `오늘 볼 채널`을 정식 화면으로 연결했습니다. 운영중 채널을 미수집, S/A/B/C 등급, 마지막 수집일 기준으로 정렬하고 오늘 볼 채널을 고릅니다.
- 채널 선택, 저장 영상 불러오기, 새 영상 수집 화면을 분리했습니다. 채널 선택만으로 YouTube API를 호출하지 않습니다.
- 제작 후보함에 영상 제목, 채널, 제목 초안, 메모와 발견 링크 검색을 추가했습니다.
- 제작 후보함에 전체, 오늘 집중, 제작 후보, 제작 중, 업로드 완료, 발견 링크 보기 필터를 추가했습니다. 필터는 화면 표시만 바꾸고 Cloud 데이터를 수정하지 않습니다.
- 제작 후보 카드에 `작업 묶음 복사`를 추가했습니다. 현재 카드의 원본/초안 제목, 메모, 일정, 원본 URL, 준비 상태를 로컬 클립보드에 복사합니다.
- 사이드바는 실사용 메뉴 12개, 향후 기능 19개로 최신화했습니다.
- 홈의 다음 행동에서 채널이 없으면 `오늘 볼 채널` 흐름으로 이어지고, 터또터 전용 화면 바로가기를 제공합니다.

검증:

- `npm.cmd test`
  - 181개 테스트 파일, 792개 테스트 통과
- `npm.cmd run build`
  - Vite production build 통과
  - 약 535 kB 단일 번들 경고는 남아 있으나 빌드 실패는 아님
- `git diff --check`
  - 패치 오류 없음
- 브라우저 확인
  - 홈, 터또터 탐색, 오늘 볼 채널, 제작 후보함 진입 정상
  - 390px 모바일 가로 넘침 없음
  - 콘솔 warning/error 없음

보존한 것:

- API endpoint 변경 없음
- DB schema 또는 container 변경 없음
- 기존 `status/statusIds` 의미 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음

### 96. 2026-07-14 키워드·태그·업로드 일정 실사용 화면 전환

준비중으로 남아 있던 세 메뉴를 기존 Cloud 데이터와 현재 저장 구조만 사용하는 실사용 화면으로 연결했습니다.

완료한 작업:

- `키워드 탐색`에서 현재 불러온 저장 영상의 제목과 채널명을 검색하고, 자주 등장한 제목 단어 추천, 영상 길이·게시 기간·조회수 필터와 정렬을 사용할 수 있게 했습니다.
- `태그별 금고`에서 기존 채널의 `tags`와 `category`를 묶어 보고, 선택한 태그의 채널을 고른 뒤 기존 Cloud 저장 영상 조회 흐름으로 결과를 확인할 수 있게 했습니다.
- `업로드 캘린더`에서 기존 Cloud `videoUserRecords.targetPublishDate`를 월별로 확인하고, 제작 후보·제작 중·업로드 완료 상태와 일정 없음·기한 경과 항목을 구분할 수 있게 했습니다.
- 세 화면의 라우트, 상태 hook, 순수 계산 유틸, 화면 props 조립을 분리하고 각각 단위·렌더링 테스트를 추가했습니다.
- 사이드바 실사용 메뉴를 15개, 향후 기능을 16개로 최신화했습니다.

검증:

- `npm.cmd test -- --reporter=dot`
  - 190개 테스트 파일, 814개 테스트 통과
- `npm.cmd run build`
  - Vite production build 통과
  - 약 574 kB 단일 번들 경고는 남아 있으나 빌드 실패는 아님
- 브라우저 확인
  - 세 화면 진입과 빈 상태 정상
  - 데스크톱과 390px 모바일 가로 넘침 없음
  - 콘솔 warning/error 없음

보존한 것:

- API endpoint 변경 없음
- DB schema 또는 container 변경 없음
- 기존 `status/statusIds` 의미 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음

### 97. 2026-07-14 홈 실사용 도구 바로가기 연결

정식 화면으로 전환된 키워드 탐색, 태그별 금고, 업로드 캘린더를 홈에서 바로 열 수 있도록 연결했습니다.

완료한 작업:

- 기존 4단계 데이터 흐름 바로가기는 그대로 유지했습니다.
- 별도 `실사용 도구` 영역에서 키워드 탐색, 태그별 금고, 업로드 캘린더를 바로 열 수 있게 했습니다.
- 세 버튼이 화면 이동만 하며 자동 수집, Cloud 저장, 상태 변경을 실행하지 않는다는 안내를 추가했습니다.
- 바로가기 상수, 이벤트 연결 유틸, 홈 화면 props와 렌더링 컴포넌트를 분리했습니다.
- 세 이동 경로와 안전 문구를 유틸 및 렌더링 테스트로 보강했습니다.

검증:

- `npm.cmd test -- --reporter=dot`
  - 191개 테스트 파일, 817개 테스트 통과
- `npm.cmd run build`
  - Vite production build 통과
  - 약 576 kB 단일 번들 경고는 남아 있으나 빌드 실패는 아님
- 브라우저 확인
  - 키워드 탐색, 태그별 금고, 업로드 캘린더 이동 정상
  - 390px 모바일에서 카드 1열 표시, 가로 넘침과 글자 겹침 없음

보존한 것:

- API endpoint 변경 없음
- DB schema 또는 container 변경 없음
- 기존 `status/statusIds` 의미 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음

### 98. 2026-07-14 실사용 흐름 안정화 묶음

키워드·태그 탐색에서 제작 후보와 업로드 일정까지 이어지는 다음 행동을 기존 저장 구조 안에서 보강했습니다.

완료한 작업:

- 키워드 탐색에 저장 영상과 선택 채널이 모두 없을 때 `오늘 볼 채널`로 이동하는 안내를 추가했습니다. 채널 선택과 저장 영상 불러오기를 분리해 화면 이동만으로 YouTube API를 호출하지 않습니다.
- 태그별 금고의 빈 상태 문구를 `태그 채널 선택 → 저장 영상 불러오기` 2단계로 명확히 했습니다.
- 업로드 캘린더 상태 필터 결과가 비었을 때 `전체 제작 상태 보기`로 화면 필터만 초기화할 수 있게 했습니다.
- 업로드 캘린더 일정 카드에 `후보함에서 찾기`를 추가했습니다. 제작 후보함을 열고 해당 제목으로 검색하지만 Cloud 데이터는 바꾸지 않습니다.
- 제작 후보함 다음 행동에 업로드 캘린더 이동을 추가했습니다.
- 홈 제작 후보 숫자를 제작 후보함의 제작 전 단계 묶음 기준과 맞췄습니다. 오늘 집중 후보는 포함하고 제작 중·업로드 완료는 별도 단계로 구분합니다.
- 키워드 탐색 필터가 1280px 데스크톱에서 가로로 넘치던 문제를 3열 반응형 배치로 수정했습니다.
- 달력 상세 컴포넌트가 이동 콜백 없이 재사용돼도 오류가 나지 않도록 버튼 표시를 방어적으로 처리했습니다.

검증:

- `npm test -- --reporter=dot`
  - 191개 테스트 파일, 822개 테스트 통과
- `npm run build`
  - Vite production build 통과
  - 약 579 kB 단일 번들 경고는 남아 있으나 빌드 실패는 아님
- `git diff --check`
  - 패치 오류 없음
- 브라우저 확인
  - 데스크톱에서 실사용 메뉴 15개 진입 정상
  - 홈, 키워드 탐색, 태그별 금고, 제작 후보함, 업로드 캘린더를 390px 모바일에서 확인
  - 데스크톱·모바일 가로 넘침 없음
  - console error 없음
  - 저장·삭제·새 영상 수집 버튼은 누르지 않음

보존한 것:

- API endpoint 변경 없음
- DB schema 또는 container 변경 없음
- 기존 `status/statusIds` 의미 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음

### 99. 2026-07-14 캘린더·후보함·레이더 왕복 흐름 보강

업로드 일정에서 특정 제작 후보를 찾고 다시 캘린더로 돌아오는 흐름과, 홈 레이더가 비었을 때의 다음 행동을 보강했습니다.

완료한 작업:

- 업로드 캘린더의 `후보함에서 찾기`가 제목만 전달하지 않고 영상 ID도 함께 전달해, 제목이 같은 후보가 여러 개여도 선택한 한 건만 표시합니다.
- 제작 후보함에 `캘린더에서 가져온 검색` 안내를 추가하고 `전체 작업 보기`, `캘린더로 돌아가기`를 제공합니다.
- 사용자가 검색어를 직접 바꾸거나 초기화하면 캘린더의 한 건 제한을 해제하고 일반 제작 작업 검색으로 전환합니다.
- 홈 레이더에 선택 채널이 없으면 `오늘 볼 채널 고르기`를 먼저 안내하고, 채널이 선택돼 있으면 Cloud 저장 영상 불러오기를 안내합니다.
- 채널 선택과 화면 이동은 YouTube API를 호출하지 않고, 저장 영상 불러오기는 기존 Cloud DB 조회 동작을 그대로 사용합니다.
- 캘린더 검색 상태는 화면 안에서만 유지하며 Cloud DB, localStorage, 제작 상태를 변경하지 않습니다.

검증:

- `npm.cmd test -- --reporter=dot`
  - 195개 테스트 파일, 836개 테스트 통과
- `npm.cmd run build`
  - Vite production build 통과
  - 약 582 kB 단일 번들 경고는 남아 있으나 빌드 실패는 아님
- 관련 hook, utility, component 렌더링 테스트에서 정확한 영상 ID 필터, 검색 해제, 캘린더 복귀 문구, 레이더 상태별 안내를 확인했습니다.

보존한 것:

- API endpoint 변경 없음
- DB schema 또는 container 변경 없음
- 기존 `status/statusIds` 의미 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건/횟수 변경 없음
- 새 라이브러리 추가 없음

### 100. 2026-07-14 프로덕션 번들 캐시 단위 분리

앱 기능을 지연 로딩하거나 새 라이브러리를 추가하지 않고, Vite 기본 설정으로 React와 아이콘 모듈을 별도 캐시 파일로 분리했습니다.

완료한 작업:

- React/React DOM을 `react-vendor` 묶음으로 분리했습니다.
- Lucide 아이콘을 `ui-icons` 묶음으로 분리했습니다.
- 앱 기능 코드는 별도 `index` 묶음으로 유지했습니다.
- 빌드 설정이 빠지지 않도록 설정 테스트를 추가했습니다.

빌드 결과:

- 기존 단일 JS 약 582 kB에서 다음 세 파일로 분리됐습니다.
  - 앱 코드 약 418 kB
  - React 묶음 약 134 kB
  - 아이콘 묶음 약 30 kB
- 모든 JS 묶음이 500 kB 아래로 내려가 기존 대형 chunk 경고가 사라졌습니다.
- 화면 기능, API endpoint, Cloud 저장 구조, localStorage, YouTube API 호출 조건은 바뀌지 않았습니다.

### 101. 2026-07-14 실사용 흐름 안정화 배포 확인

캘린더·제작 후보함·레이더 흐름 보강과 번들 분리를 `main`에 반영하고 배포 상태를 확인했습니다.

완료한 확인:

- GitHub PR `#892`를 squash merge했습니다.
- GitHub Actions `Build`가 성공했습니다.
- Azure Static Web Apps `Build and Deploy`가 성공했습니다.
- 배포 주소의 익명 접근이 Microsoft 로그인 화면으로 이동해 개인용 접근 보호가 유지되는 것을 확인했습니다.
- 이번 자동 확인에서는 owner 로그인 뒤 Cloud 데이터 저장·삭제·새 영상 수집 동작을 실행하지 않았습니다.

최종 검증:

- `npm.cmd test -- --reporter=dot`
  - 195개 테스트 파일, 836개 테스트 통과
- `npm.cmd run build`
  - Vite production build 통과
  - 앱 약 418 kB, React 약 134 kB, 아이콘 약 30 kB로 분리
- `npm.cmd audit --omit=dev`
  - 취약점 0건
- `git diff --check`
  - 패치 오류 없음

남은 경계:

- Azure 배포는 성공하지만 workflow의 `github_id_token` unsupported input 경고가 남습니다.
- 이전에 해당 입력을 제거했을 때 main 배포가 실패해 복구한 이력이 있으므로, 인증 방식 변경은 자동 수정하지 않습니다.
- `/videos` 페이지네이션, scan/API 사용 기록 저장, local assets, 별도 제작 프로젝트 모델, 브라우저 테스트 도구 추가는 별도 선택 후 진행합니다.

### 102. 2026-07-14 영상 카드 판단 순서와 게시일 표시 개선

저장 영상을 빠르게 비교할 때 썸네일보다 판단 정보와 다음 행동이 먼저 읽히도록 카드 구성을 다듬었습니다.

완료한 작업:

- `경과일 150일`만 표시하던 항목을 `26년 4월 1일 (150일 경과)` 형식으로 변경했습니다.
- 카드와 리스트 보기 모두 같은 게시일·경과일 표현을 사용합니다.
- 후보가 아닌 영상에도 `비교 참고` 영역을 유지해 같은 행의 카드 높이가 크게 어긋나지 않게 했습니다.
- 조회수, 대박 지수, 참여율, 게시일을 먼저 보고 아래에서 행동을 결정하도록 통계와 버튼 순서를 정리했습니다.
- `제작 후보`를 기본 행동으로 먼저 배치하고 `소재 보관`은 보조 행동으로 구분했습니다.
- 썸네일 위의 중복 `소재 보관` 버튼을 제거하고, 제목과 썸네일 높이를 일정하게 맞춰 한 화면에서 더 많은 영상을 비교할 수 있게 했습니다.

검증:

- `npm.cmd test -- --reporter=dot`
  - 196개 테스트 파일, 841개 테스트 통과
- `npm.cmd run build`
  - Vite production build 통과
- 인앱 브라우저에서 기본 데스크톱 폭과 390px 모바일 폭을 확인했고, 두 화면 모두 가로 넘침이 없었습니다.

보존한 것:

- API endpoint, DB schema, localStorage key 변경 없음
- 저장·스크랩북·제작 후보 상태 의미 변경 없음
- YouTube API 호출 조건과 횟수 변경 없음
- 새 라이브러리 추가 없음

### 103. 2026-07-14 영상 썸네일 화질 개선

저장된 낮은 해상도 주소를 큰 카드에서 확대해 보이던 흐림을 줄이기 위해, 영상 ID로 제공되는 YouTube 고화질 썸네일을 우선 표시하도록 개선했습니다.

완료한 작업:

- 큰 영상 카드, 오늘 레이더, 스크랩북, 제작 후보함은 `maxresdefault`를 먼저 사용합니다.
- 최대 해상도가 없는 영상은 `sddefault`, `hqdefault`, 기존 저장 URL 순서로 자동 대체됩니다.
- 작은 리스트와 업로드 달력은 화면 크기에 맞는 `sddefault`부터 사용해 불필요하게 큰 이미지 다운로드를 줄였습니다.
- 새 영상 수집이나 YouTube Data API 호출 없이 기존 `videoId`만 사용합니다.

검증:

- `npm.cmd test -- --reporter=dot`
  - 198개 테스트 파일, 846개 테스트 통과
- `npm.cmd run build`
  - Vite production build 통과
- `git diff --check`
  - 패치 오류 없음

보존한 것:

- API endpoint, DB schema, Cloud 저장 데이터 변경 없음
- localStorage key 변경 없음
- YouTube API 호출 조건과 횟수 변경 없음
- 새 라이브러리 추가 없음

### 104. 2026-07-15 설정 복구 동선과 레이더 복귀 흐름 안정화

설정 화면에서 Cloud 연결 오류를 확인한 뒤 같은 화면에서 채널 목록을 다시 조회하고, 숨긴 분야를 복원할 수 있도록 보강했습니다. 오늘의 레이더는 다른 화면을 보고 돌아온 경우에도 현재 선택 채널에 해당하는 불러온 영상만 이어서 사용합니다.

완료한 작업:

- 기존 `GET /channels` 조회 함수를 설정 화면의 `Cloud 채널 다시 불러오기` 버튼에 연결했습니다.
- 재조회 성공 시 이전 화면 오류를 지우고, 성공/실패 결과를 설정 화면에 표시합니다.
- 로그인·권한, 네트워크/CORS 가능성, 서버 오류를 단정하지 않고 다음 확인 행동으로 안내합니다.
- 숨긴 기본 분야와 Cloud에만 남은 태그를 기존 브라우저 화면 목록에 다시 표시할 수 있습니다.
- 레이더 복귀 시 현재 선택 채널과 일치하는 영상만 계산해 후보 판정 버튼을 복원합니다.
- 모바일에서는 설정 진단 버튼을 한 줄 전체 너비로 표시해 긴 문구가 잘리지 않도록 했습니다.

보존한 것:

- API endpoint와 DB schema 변경 없음
- localStorage key와 자동 마이그레이션 변경 없음
- YouTube API 호출 조건과 횟수 변경 없음
- Azure 인증과 배포 workflow 변경 없음

검증:

- `npm test -- --run --reporter=dot`
  - 208개 테스트 파일, 884개 테스트 통과
- `npm run build`
  - Vite production build 통과
- `git diff --check`
  - 패치 오류 없음

### 105. 2026-07-16 최신 검증·인수인계 문서 동기화

설정 복구와 레이더 복귀 흐름 배포 후, 다음 작업 문서·테스트 전략·인수인계 문서에 남아 있던 이전 검증 수치를 최신 기준으로 맞췄습니다.

완료한 작업:

- 최신 전체 테스트 결과를 `208개 파일 / 884개 테스트`로 통일했습니다.
- 설정 화면의 Cloud 채널 재조회·숨긴 분야 복원과 레이더 복귀 흐름이 PR #906으로 배포됐음을 기록했습니다.
- 기능, API, DB, localStorage, Azure 설정은 변경하지 않았습니다.

검증:

- `git diff --check`
  - 패치 오류 없음

### 106. 2026-07-16 오늘의 레이더 후보 단계 안내 수정

저장 영상을 불러온 뒤 실제 후보 판단 영역은 `STAGE 3`인데 안내 문구가 `STAGE 2`를 가리키던 불일치를 바로잡았습니다.

완료한 작업:

- 저장 영상 불러오기 성공 후 안내를 `아래 STAGE 3에서 오늘의 후보를 바로 판단할 수 있습니다.`로 수정했습니다.
- 잘못된 `STAGE 2` 안내가 다시 들어오지 않도록 컴포넌트 테스트를 보강했습니다.
- 기능 로직, API, DB, localStorage, YouTube API 호출 조건은 변경하지 않았습니다.

검증:

- `npm test -- --run --reporter=dot`
  - 208개 테스트 파일, 884개 테스트 통과
- `npm run build`
  - Vite production build 통과

### 107. 2026-07-16 레이더 판단 버튼 접근성 문구 보정

후보 판단 카드의 `봤음` 버튼이 보조기기에서 `봤음로 저장`으로 읽히던 조사 오류를 수정했습니다.

완료한 작업:

- `봤음` 판단 버튼의 접근성 안내를 `Cloud 판단 기록에 봤음으로 저장`으로 수정했습니다.
- 봤음, 나중에 보기, 후보 제외 세 버튼의 전체 안내 문구를 테스트로 고정했습니다.
- 판단 상태값, Cloud 저장 로직, 버튼 동작은 변경하지 않았습니다.

검증:

- `npm test -- --run --reporter=dot`
  - 208개 테스트 파일, 884개 테스트 통과
- `npm run build`
  - Vite production build 통과

### 108. 2026-07-16 레이더 Cloud 저장 실패 안내 보강

후보 카드에서 Cloud 저장이 실패했을 때 버튼 잠금만 풀리고 결과 안내가 없던 흐름을 보강했습니다.

완료한 작업:

- 제작 후보 표시, 소재 보관, 영상 판단 작업별 실패 메시지를 카드 안에 표시합니다.
- 저장 함수가 명시적으로 실패를 반환하거나 예외가 발생한 경우에만 실패 안내를 표시합니다.
- 실패한 작업은 성공한 것처럼 처리하지 않고 기존 Cloud 동기화 경고와 함께 재시도를 안내합니다.
- DB schema, endpoint, 상태값, localStorage key, YouTube API 호출 조건은 변경하지 않았습니다.

검증:

- `npm test -- --run --reporter=dot`
  - 208개 테스트 파일, 885개 테스트 통과
- `npm run build`
  - Vite production build 통과

### 109. 2026-07-16 채널 운영실 통합과 모바일 흐름 정리

오퍼레이션 관제의 `채널 목록`, `새 채널 등록`, `선택 채널 새 영상 수집` 메뉴가 실제로는 같은 화면을 열던 중복을 정리했습니다.

완료한 작업:

- 사이드바의 세 중복 메뉴를 `채널 운영실` 하나로 통합했습니다.
- 채널 운영실 안에서 `1. 채널 관리 → 2. 새 채널 등록 → 3. 새 영상 수집` 순서로 바로 이동할 수 있게 했습니다.
- 기존 `새 채널 등록`, `선택 채널 새 영상 수집` 바로가기 ID는 호환 경로로 유지해 새 통합 화면의 해당 단계로 연결합니다.
- 채널 목록을 등록 입력보다 먼저 배치해 기존 채널 관리가 우선 보이도록 정리했습니다.
- 모바일에서는 새 영상 수집 버튼과 설명을 세로로 배치해 가로 스크롤이 생기지 않도록 했습니다.
- 단계 버튼은 화면 이동만 수행하며, 채널 선택만으로 YouTube API나 Cloud 저장을 실행하지 않습니다.
- API endpoint, DB schema, 상태값, localStorage key, 실제 수집 조건은 변경하지 않았습니다.

검증:

- 모바일 390px viewport에서 문서 너비와 화면 너비가 일치하고 가로 넘침이 없음을 확인했습니다.
- `npm test -- --run --reporter=dot`
  - 210개 테스트 파일, 889개 테스트 통과
- `npm run build`
  - Vite production build 통과

### 110. 2026-07-16 채널 운영실 상태 기반 다음 행동 연결

채널 운영실을 단순한 단계 바로가기에서 실제 작업 진행 상태를 알려주는 운영 화면으로 보강했습니다.

완료한 작업:

- 채널 관리, 새 채널 등록, 새 영상 수집 단계에 등록 채널 수, 선택 채널 수, 수집 기록 상태를 표시합니다.
- 채널이 없으면 새 채널 등록, 선택 채널이 없으면 채널 선택, 선택이 끝나면 저장 영상 조회를 다음 행동으로 안내합니다.
- 저장 영상이 준비되면 `저장 영상 보기`와 `오늘의 레이더로` 이동을 바로 제공합니다.
- 저장 영상 불러오기는 Cloud DB 조회이고, 새 영상 수집 단계 이동만으로 YouTube API를 호출하지 않는다는 설명을 버튼 안내에 고정했습니다.
- 작업 흐름 설명을 `채널 등록·선택 → 저장된 영상 확인 → 필요할 때만 새 영상 수집` 순서로 맞췄습니다.
- 레퍼런스 금고 빈 화면과 홈 실사용 도구도 같은 순서로 맞춰, 화면마다 수집과 조회의 순서가 다르게 보이던 충돌을 제거했습니다.
- 기존 채널의 `lastScanSummary.scannedAt`과 호환용 `lastScannedAt`만 읽어 수집 기록 여부를 표시합니다.

보존한 것:

- API endpoint, DB schema, 저장 필드, 상태값 변경 없음
- localStorage key와 자동 마이그레이션 변경 없음
- YouTube API 호출 조건과 횟수 변경 없음
- 기존 채널 등록, 선택, 저장 영상 조회, 새 영상 수집 로직 변경 없음

검증:

- 채널 없음, 선택 없음, 수집 중, 저장 영상 준비 등 주요 상태를 자동 테스트로 확인했습니다.
- 데스크톱과 390px 모바일에서 단계 카드와 다음 행동 영역을 확인했고, 모바일 가로 넘침이 없었습니다.
- `npm test -- --run --reporter=dot`
  - 210개 테스트 파일, 894개 테스트 통과
- `npm run build`
  - Vite production build 통과

### 111. 2026-07-18 로그인 만료 복구 동선 보강

Cloud 조회나 저장 작업 중 Microsoft 로그인 세션이 만료되면 사용자가 오류 원인을 확인하고 같은 화면에서 로그인 절차를 다시 시작할 수 있도록 전역 오류 안내를 보강했습니다.

완료한 작업:

- 전역 오류 안내에 `Microsoft 로그인 다시 열기` 버튼을 추가했습니다.
- 401·403·로그인·권한·네트워크·CORS 계열 오류에서만 로그인 복구 버튼을 표시하고, 중복 채널이나 입력 누락 같은 사용자 입력 안내에는 표시하지 않습니다.
- 버튼은 기존 Azure Static Web Apps Microsoft 로그인 경로만 열며, Cloud 데이터 변경이나 YouTube API 호출을 실행하지 않습니다.
- 로그인과 로그아웃 경로 상수를 같은 접근 제어 컴포넌트에 모아 인증 주소가 화면마다 어긋나지 않도록 했습니다.
- 오류 닫기와 기존 진행 상태 안내는 그대로 유지했습니다.

보존한 것:

- Azure Static Web Apps 역할과 접근 권한 설정 변경 없음
- API endpoint, DB schema, 저장 필드, 상태값 변경 없음
- localStorage key와 자동 마이그레이션 변경 없음
- YouTube API 호출 조건과 횟수 변경 없음

검증:

- `npm test -- --run --reporter=dot`
  - 212개 테스트 파일, 912개 테스트 통과
- `npm run build`
  - Vite production build 통과
- `git diff --check`
  - 패치 오류 없음

### 112. 2026-07-18 저장 영상 조회 진행·실패 안내 보강

오늘의 레이더와 채널 운영실에서 Cloud 저장 영상 조회가 잠시 걸릴 때 사용자가 버튼이 눌렸는지 알기 어렵고, 실패 후에는 같은 자리에서 다시 시도하기 어려운 문제를 정리했습니다.

완료한 작업:

- 저장 영상을 불러오는 동안 버튼을 비활성화하고 진행 아이콘과 `저장 영상 불러오는 중...` 문구를 표시합니다.
- 진행 중 같은 조회를 다시 요청하지 않도록 중복 클릭을 막았습니다.
- 조회 실패 시 오늘의 레이더와 채널 운영실 안에서 실패 이유와 `다시 불러오기` 버튼을 표시합니다.
- 실패 안내에 저장 영상 조회가 Cloud DB 작업이며 YouTube API를 호출하지 않았다는 설명을 고정했습니다.
- 성공 후 기존 영상 표시, 빈 결과 안내, 레이더 이동 흐름은 그대로 유지했습니다.
- 채널 운영실의 외부 화면 제목과 내부 단계 안내 제목이 중복되지 않도록 내부 제목을 `오늘의 채널 운영 순서`로 정리했습니다.

보존한 것:

- API endpoint, DB schema, 저장 필드, 상태값 변경 없음
- localStorage key와 자동 마이그레이션 변경 없음
- YouTube API 호출 조건과 횟수 변경 없음
- 기존 채널 선택, Cloud 저장 영상 조회, 레이더 후보 계산 로직 변경 없음

검증:

- 조회 전, 조회 중, 조회 성공, 빈 결과, 조회 실패 상태를 자동 테스트로 확인했습니다.
- 로그인된 운영 앱에서 10개 채널 중 한 채널을 선택해 Cloud DB 저장 영상 262개가 조회되는 것을 확인했습니다.
- 레이더는 전체 262개를 후보 풀로 사용하되 오늘 화면에는 상위 6개만 표시하는 것을 확인했습니다.
- 390px 모바일 화면에서 채널 운영실과 설정 화면의 가로 넘침이 없음을 확인했습니다.
- 운영 확인 중 새 영상 수집, 저장, 삭제 버튼은 누르지 않았습니다.
- `npm test -- --run --reporter=dot`
  - 213개 테스트 파일, 916개 테스트 통과
- `npm run build`
  - Vite production build 통과
- `git diff --check`
  - 패치 오류 없음

### 113. 2026-07-18 저장 영상 조회 피드백 일관화와 레이더 큐 안내

저장 영상 조회 진입점이 늘어나면서 일부 탐색 화면과 레이더 빈 화면에서는 조회 중에도 버튼이 평상시처럼 보여 중복 클릭할 수 있던 부분을 정리했습니다.

완료한 작업:

- 오늘의 레이더, 터또터 탐색, 키워드 탐색, 태그별 금고의 저장 영상 조회 버튼이 같은 조회 진행 상태를 사용합니다.
- 조회 중에는 진행 아이콘과 `저장 영상 불러오는 중...` 문구를 표시하고, 같은 Cloud DB 조회를 중복 요청하지 않도록 버튼을 비활성화합니다.
- 레이더 빈 화면의 조회 버튼도 공통 속성을 사용해 채널 미선택, 조회 가능, 조회 중 상태가 다른 진입점과 일치합니다.
- 레이더 후보 영역에 `한 건을 판단하면 다음 미판단 후보가 자동으로 들어온다`는 큐 동작을 표시했습니다.
- 레이더 요약 용어를 `남은 후보`, `화면 후보`, `우선 검토`, `판단 기록`으로 정리해 숫자의 의미를 쉽게 구분합니다.

보존한 것:

- API endpoint, DB schema, 저장 필드, 상태값 변경 없음
- localStorage key와 자동 마이그레이션 변경 없음
- YouTube API 호출 조건과 횟수 변경 없음
- 레이더 후보 점수, 정렬, 6개 표시, 판단 후 자동 보충 로직 변경 없음

검증:

- 조회 진입점별 조회 전·조회 중 상태와 레이더 자동 보충 안내를 자동 테스트로 확인했습니다.
- 로컬 데스크톱 화면에서 레이더 기본·Cloud 연결 실패 상태의 문구와 배치가 겹치지 않는 것을 확인했습니다.
- `npm test -- --run --reporter=dot`
  - 213개 테스트 파일, 921개 테스트 통과
- `npm run build`
  - Vite production build 통과
- `git diff --check`
  - 패치 오류 없음

### 114. 2026-07-18 저장 영상 0개·Cloud 실패 복구 흐름 연결

키워드 탐색, 태그별 금고, 터또터 탐색에서 저장 영상 조회 결과가 0개이거나 Cloud 조회가 실패했을 때 다음 행동이 불분명했던 부분을 공통 흐름으로 정리했습니다.

완료한 작업:

- 세 탐색 화면이 Cloud 조회 결과를 화면별로 기억해 성공 0개와 조회 실패를 구분합니다.
- 정상 조회 결과가 0개이면 `다른 채널 고르기`와 `새 영상 수집 준비`를 바로 제공합니다.
- 새 영상 수집 준비는 채널 운영실의 수집 단계만 열며, 화면 이동만으로 YouTube API를 호출하지 않습니다.
- Cloud 조회가 실패하면 기존에 불러온 영상은 유지하면서 같은 자리에서 `다시 불러오기`를 제공합니다.
- 채널 선택이 바뀌면 이전 조회 결과 안내를 초기화해 새 선택과 혼동하지 않도록 했습니다.
- 공통 안내 컴포넌트에 접근성 이름과 모바일 줄바꿈을 적용했습니다.

보존한 것:

- API endpoint, DB schema, 저장 필드, 상태값 변경 없음
- localStorage key와 자동 마이그레이션 변경 없음
- YouTube API 호출 조건과 횟수 변경 없음
- 기존 저장 영상, 필터, 정렬, 제작 후보 판정 로직 변경 없음

검증:

- Cloud 조회 실패, 정상 0개, 정상 영상 존재, 중복 조회 방지 상태를 관련 자동 테스트로 확인했습니다.
- `npm test -- --run --reporter=dot`
  - 214개 테스트 파일, 927개 테스트 통과
- `npm run build`
  - Vite production build 통과
- `git diff --check`
  - 패치 오류 없음

### 115. 2026-07-19 저장 영상 조회 상태 공통화

오늘의 레이더, 오늘 볼 채널, 기존 채널 운영 화면에 각각 남아 있던 저장 영상 조회 진행·성공·0개·실패 상태 처리를 하나의 공통 hook과 안내 컴포넌트로 정리했습니다.

완료한 작업:

- 오늘의 레이더, 오늘 볼 채널, 기존 채널 운영 화면이 같은 저장 영상 조회 상태 관리 hook을 사용합니다.
- 빠른 연속 클릭으로 동일한 Cloud DB 조회가 중복 실행되지 않도록 동기식 잠금 처리를 보강했습니다.
- 채널 선택이 바뀌는 중 이전 조회가 늦게 끝나도 새 선택 화면에 과거 결과가 표시되지 않도록 요청 식별자를 적용했습니다.
- 조회 실패와 정상 0개 결과는 공통 안내를 사용하되, 화면에서 실제로 제공할 수 있는 다음 행동 버튼만 표시합니다.
- 오늘 볼 채널에서 영상이 조회된 경우에는 기존의 `다음: 오늘의 레이더 보기` 흐름을 그대로 유지합니다.

보존한 것:

- API endpoint, DB schema, 저장 필드, 상태값 변경 없음
- localStorage key와 자동 마이그레이션 변경 없음
- YouTube API 호출 조건과 횟수 변경 없음
- 저장 영상 조회는 기존과 동일한 Cloud DB 조회이며, 조회·재시도만으로 새 영상 수집을 실행하지 않음
- 레이더 후보 계산, 필터, 정렬, 판단 기록 로직 변경 없음

검증:

- 조회 전·진행·성공·정상 0개·실패·중복 클릭 방지 상태를 자동 테스트로 확인했습니다.
- `npm test -- --run --reporter=dot`
  - 214개 테스트 파일, 929개 테스트 통과
- `npm run build`
  - Vite production build 통과
- `git diff --check`
  - 패치 오류 없음

### 116. 2026-07-20 Creator OS 핵심 연결 흐름 회귀 계약

레이더와 보관함에서 찾은 소재가 제작 판단과 일정으로 이어지는 핵심 흐름을 하나의 회귀 테스트로 고정했습니다.

완료한 작업:

- 스크랩북 영상의 제작 후보 전환 요청이 기존 제작 상태값을 사용하는지 확인합니다.
- 제작 후보가 `오늘 집중`으로 고정되어도 후보 전체 수에서 빠지거나 중복 계산되지 않는지 확인합니다.
- 후보의 목표 업로드 날짜가 기존 Cloud 기록을 통해 업로드 캘린더에 이어지는지 확인합니다.
- 발견 링크 후보와 영상 후보가 제작 후보함에 함께 보이되 서로 다른 저장 모델을 유지하는지 확인합니다.
- `statusIds`가 없는 기존 `status` 단일 기록도 제작 후보와 스크랩북 흐름에서 계속 보이는지 확인합니다.
- 공개 앱 smoke 문서에 로그인 만료, Cloud 조회 실패, 정상 0개 결과의 구분과 로그인 복구 기준을 추가했습니다.

보존한 것:

- 앱 기능 코드, API endpoint, DB schema, 저장 필드 변경 없음
- localStorage key, 자동 병합, 자동 마이그레이션 변경 없음
- YouTube API 호출 조건과 횟수 변경 없음
- 제작 후보 상태, 오늘 집중, 일정 저장의 기존 Cloud 동작 변경 없음

검증:

- `npm test -- --reporter=dot`
  - 215개 테스트 파일, 932개 테스트 통과
- `npm run build`
  - Vite production build 통과
## 117. 오늘의 레이더 화면 흐름 완성도 1차 개선

- 목적: 사용자가 첫 화면에서 다음 행동을 바로 이해하고, 많은 저장 영상을 한꺼번에 펼치지 않고 오늘 볼 후보를 차례로 판단하도록 레이더 화면을 정리했습니다.
- 변경:
  - 화면에서 빠져 있던 `다음 추천 행동` 패널을 레이더 상단에 연결했습니다.
  - 다음 행동 계산은 전체 불러온 영상이 아니라 현재 선택 채널에 해당하는 저장 영상 수를 기준으로 사용합니다.
  - 레이더 상단에 `오늘의 완료 기준`을 추가해 후보 검토와 한 가지 제작 결정이 오늘의 목표임을 표시합니다.
  - 4단계 진행 카드에 각 단계의 의미를 짧게 보강했습니다.
  - 후보 판정대는 최대 6개만 보여주고, 판단하면 다음 후보가 자동으로 들어오는 구조를 명시했습니다.
  - 현재 불러온 목록의 판단 진행률을 표시합니다.
  - 제작 후보가 있고 오늘 집중 후보가 있으면 업로드 캘린더로 바로 이어지는 버튼을 표시합니다.
  - 후보 카드의 높이와 반응형 열 수를 안정화했습니다.
- 유지:
  - YouTube API 호출 조건, Cloud DB 조회 방식, 상태값, endpoint, localStorage key는 변경하지 않았습니다.
- 검증:
  - 관련 컴포넌트·유틸 테스트 통과
  - `npm run build` 통과
  - 390×844 모바일과 1440×900 데스크톱에서 가로 넘침 없음 확인

## 118. 오늘의 레이더 단계 이동과 진행률 표시 보강

- 목적: 4단계 진행 카드를 단순 상태 표시가 아니라 화면 안의 실제 작업 위치로 이동하는 내비게이션으로 만들고, 후보 판단 진행률이 실제 처리 수를 표시하도록 바로잡았습니다.
- 변경:
  - `오늘 볼 채널`, `저장 영상 불러오기`, `오늘 후보 판단`, `제작 후보 결정` 카드를 각 작업 영역에 연결했습니다.
  - 채널이나 저장 영상이 없는 초기 상태에서도 모든 단계 이동 대상이 항상 존재하도록 구성했습니다.
  - 후보 판단 헤더가 이미 처리한 영상 수를 받지 못해 진행률이 0으로 보이던 표시 오류를 수정했습니다.
  - 진행률 렌더링 회귀 테스트를 추가했습니다.
- 유지:
  - 화면 안의 위치 이동만 추가했으며 Cloud 조회, YouTube API 호출, 판단 저장은 자동 실행하지 않습니다.
  - API endpoint, DB schema, 상태값, localStorage key는 변경하지 않았습니다.
- 검증:
  - `npm test`: 216개 테스트 파일, 933개 테스트 통과
  - `npm run build` 통과
  - 데스크톱과 390×844 모바일에서 4개 단계 링크와 대상 영역 존재, 가로 넘침 없음 확인

## 119. 레이더 판단 복구와 제작 후보함 인계 보강

- 목적: 레이더에서 판단한 직후 사용자가 결과를 잃지 않고, 실수는 되돌리며, 제작 후보는 다음 작업 화면에서 바로 이어서 다루도록 흐름을 완성했습니다.
- 변경:
  - 판단 저장 성공 안내가 키보드와 화면 읽기 흐름에서도 바로 인식되도록 초점을 이동합니다.
  - `봤음`, `나중에 보기`, `제외` 처리 후 `처리 기록 보기`로 이동해 방금 판단한 영상을 레이더로 되돌릴 수 있습니다.
  - `제작 후보로` 처리한 영상은 제목과 영상 ID를 일회성 화면 이동 의도로 전달해 제작 후보함에서 바로 검색합니다.
  - 제작 후보함에서 `오늘의 레이더로 돌아가기`와 `전체 작업 보기`를 제공하며, 레이더와 캘린더에서 넘어온 검색 안내를 각각 구분합니다.
  - 처리 기록 이동 대상과 레이더/후보함 연결을 자동 테스트로 고정했습니다.
- 유지:
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key 변경 없음
  - Cloud 저장과 저장 영상 조회 방식 변경 없음
  - YouTube API 호출 조건과 횟수 변경 없음
  - 자동 수집, 자동 저장, 자동 병합 추가 없음
- 검증:
  - `npm test -- --reporter=dot`: 220개 테스트 파일, 948개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 통과
  - 데스크톱과 390×844 모바일에서 가로 넘침과 잘린 조작 요소 없음 확인

## 120. 스크랩북 제작 후보 저장과 후보함 왕복 연결

- 목적: 스크랩북에서 제작 후보로 표시한 뒤 저장 결과와 다음 행동을 잃지 않고, 해당 영상만 후보함에서 바로 이어서 다루도록 연결했습니다.
- 변경:
  - 스크랩북 카드의 `제작 후보로` 저장 성공과 실패를 카드 안에서 구분해 표시합니다.
  - 성공 후 `후보함에서 이어서`를 누르면 방금 저장한 영상 제목과 ID를 일회성 화면 이동 의도로 전달합니다.
  - 제작 후보함은 `스크랩북에서 이어온 후보` 안내와 해당 영상 검색 결과를 표시합니다.
  - 제작 후보함에서 `스크랩북으로 돌아가기`와 `전체 작업 보기`를 제공합니다.
  - 실패 시에는 제작 후보 저장을 완료 처리하지 않았음을 명시하고 다시 시도하도록 안내합니다.
- 유지:
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key 변경 없음
  - 기존 `status/statusIds` 저장 의미와 Cloud 우선 원칙 변경 없음
  - YouTube API 호출 조건과 횟수 변경 없음
  - 자동 화면 이동, 자동 저장, 자동 병합 추가 없음
- 검증:
  - `npm test -- --reporter=dot`: 220개 테스트 파일, 951개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 통과
  - 데스크톱과 390×844 모바일에서 가로 넘침과 잘린 조작 요소 없음 확인

## 121. 발견 링크 제작 후보 저장과 후보함 왕복 연결

- 목적: 발견함에서 외부 링크를 제작 후보로 저장한 뒤, 방금 저장한 링크 한 건만 후보함에서 이어서 확인하고 원래 발견함으로 돌아오도록 연결했습니다.
- 변경:
  - 발견 링크 카드의 `제작 후보` Cloud 저장 진행, 성공, 실패를 카드 안에서 구분해 표시합니다.
  - 저장 성공 후 `후보함에서 이어서`를 누르면 링크 ID와 제목 또는 URL을 일회성 화면 이동 의도로 전달합니다.
  - 제작 후보함은 전달받은 발견 링크 한 건만 표시하고 영상 후보는 함께 섞지 않습니다.
  - 제작 후보함에서 `발견 링크 저장으로 돌아가기`와 `전체 작업 보기`를 제공합니다.
  - 권리 상태는 제작 후보 상태와 분리된 기존 `rightsStatus`를 유지하며, 제작 후보 저장 성공이 사용 허가를 뜻하지 않음을 표시합니다.
- 유지:
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key 변경 없음
  - 기존 `status: candidate`와 `rightsStatus` 의미 및 Cloud 우선 원칙 변경 없음
  - YouTube API 호출 조건과 횟수 변경 없음
  - 자동 수집, 자동 다운로드, 자동 병합 추가 없음
- 검증:
  - `npm test -- --reporter=dot`: 220개 테스트 파일, 957개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 통과
  - 데스크톱과 390×844 모바일에서 가로 넘침과 잘린 조작 요소 없음 확인

## 122. 제작 후보 발견 링크의 정확한 수정 왕복 연결

- 목적: 제작 후보함에서 발견 링크를 수정하려고 이동했을 때 전체 발견함에서 다시 찾지 않고, 선택한 링크 한 건을 바로 수정한 뒤 같은 후보로 돌아오도록 연결했습니다.
- 변경:
  - 제작 후보함 발견 링크 카드의 `발견함에서 수정`이 링크 ID, 제목 또는 URL을 일회성 화면 이동 의도로 전달합니다.
  - 발견함은 전달받은 링크 ID를 우선해 정확한 한 건만 표시합니다.
  - 발견함 상단에 `제작 후보함에서 이어온 링크` 안내, `제작 후보함으로 돌아가기`, `발견함 전체 보기`를 제공합니다.
  - 사용자가 검색어나 상태·권리 필터를 직접 바꾸면 정확한 링크 전용 조건은 해제되어 일반 발견함 탐색으로 전환됩니다.
- 유지:
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key 변경 없음
  - Cloud 저장, 자동 병합, 자동 업로드, 외부 수집, YouTube API 호출 추가 없음
  - 화면 이동과 필터 조건만 변경하며 기존 발견 링크 데이터는 수정하지 않음
- 검증:
  - 관련 테스트 7개 파일, 36개 테스트 통과
  - `npm test -- --run`: 220개 테스트 파일, 961개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 123. 정확한 발견 링크 왕복 경계 상황 보강

- 목적: 링크 제목이나 상태가 바뀌어도 제작 후보함에서 선택한 링크를 놓치지 않고, 사용자가 일반 탐색을 시작한 뒤에는 이전 화면의 안내가 남지 않도록 보강했습니다.
- 변경:
  - 제작 후보함에서 전달한 링크 ID가 있으면 검색어, 발견함 상태, 권리 상태보다 ID를 우선해 정확한 한 건을 표시합니다.
  - 제작 후보함에서 이어온 안내는 유효한 대상 링크 ID가 있을 때만 표시합니다.
  - 사용자가 검색어나 상태·권리 필터를 직접 변경해 대상 ID가 해제되면 일반 발견함 탐색으로 전환됩니다.
- 유지:
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key 변경 없음
  - Cloud 저장, 자동 병합, 외부 수집, YouTube API 호출 추가 없음
- 검증:
  - 관련 테스트 5개 파일, 29개 테스트 통과

## 124. 제작 후보함 정확한 대상 진입 경계 상황 보강

- 목적: 레이더, 스크랩북, 캘린더, 발견함에서 제작 후보함으로 이동한 뒤 제목이 바뀌어도 선택한 항목 한 건을 놓치지 않도록 보강했습니다.
- 변경:
  - 정확한 영상 ID가 있으면 제목·채널·메모 검색보다 영상 ID를 우선합니다.
  - 정확한 발견 링크 ID가 있으면 제목·메모·URL 검색보다 링크 ID를 우선합니다.
  - 제목 검색어가 없어도 정확한 대상 ID가 있으면 이전 화면에서 이어온 맥락을 표시합니다.
  - 사용자가 검색어나 제작 단계 필터를 직접 변경하면 일회성 대상 ID를 해제하고 일반 제작 작업 탐색으로 전환합니다.
  - 정확한 대상 ID만 적용된 경우에도 필터 요약이 실제 표시 수를 안내합니다.
- 유지:
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key 변경 없음
  - Cloud 저장, 자동 병합, YouTube API 호출 추가 없음
- 검증:
  - 관련 테스트 2개 파일, 15개 테스트 통과
  - 전체 테스트 220개 파일, 963개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 125. 발견함 빈 화면 상태명 일치

- 목적: 실제 상태 필터와 빈 화면 안내가 서로 다른 용어를 사용해 생길 수 있는 혼동을 없앴습니다.
- 변경:
  - 빈 화면의 `검토중`을 실제 필터명인 `확인 중`으로 맞췄습니다.
  - 빈 화면의 `저장`을 실제 필터명인 `보관`으로 맞췄습니다.
  - 받은 링크, 확인 중, 보관, 제작 후보, 제외의 다섯 상태를 실제 UI와 같은 순서로 안내합니다.
- 유지:
  - 상태값, Cloud 저장 데이터, API, DB schema, localStorage key 변경 없음
  - 화면 안내 문구만 변경하며 저장이나 외부 수집을 실행하지 않음

## 126. 레이더 제작 후보와 업로드 일정 연결 보강

- 목적: 제작 후보를 만든 직후 `오늘 집중`을 먼저 지정하지 않아도 업로드 일정 화면으로 자연스럽게 이어지도록 보강했습니다.
- 변경:
  - 제작 후보가 1개 이상이면 레이더 완료 단계에서 `업로드 일정 정하기`를 항상 표시합니다.
  - 캘린더가 오늘 집중 후보만 다루는 것처럼 보이던 설명을 모든 제작 후보의 목표 날짜를 정하거나 확인하는 화면으로 바로잡았습니다.
  - 오늘 집중 0개인 경계 상황에서도 캘린더 바로가기가 유지되는 회귀 테스트를 추가했습니다.
- 유지:
  - 화면 이동만 추가하며 Cloud 저장, YouTube API 호출, 외부 수집을 자동 실행하지 않습니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key 변경 없음
- 검증:
  - 관련 테스트 3개 파일, 7개 테스트 통과
  - 전체 테스트 220개 파일, 964개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 127. 업로드 캘린더 빈 날짜의 다음 행동 연결

- 목적: 업로드 캘린더에서 일정이 없는 날짜를 선택해도 사용자가 멈추지 않고 제작 후보의 목표 날짜를 정하러 갈 수 있도록 연결했습니다.
- 변경:
  - 선택한 날짜에 일정이 없으면 `제작 후보에서 날짜 정하기` 버튼을 표시합니다.
  - 버튼 위에 제작 후보함에서 후보를 고르고 목표 업로드 날짜를 지정하라는 짧은 안내를 추가했습니다.
  - 빈 날짜의 다음 행동이 유지되는 회귀 테스트를 추가했습니다.
- 유지:
  - 화면 이동만 추가하며 Cloud 저장, YouTube API 호출, 외부 수집을 자동 실행하지 않습니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key 변경 없음
- 검증:
  - 관련 테스트 2개 파일, 4개 테스트 통과
  - 전체 테스트 220개 파일, 965개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 128. 레이더 상단 추천 행동과 후보 판정대 연결

- 목적: 상단의 `다음 추천 행동`이 오늘 후보를 판단하라고 안내하면서도 사용자가 직접 후보 영역을 찾아 내려가야 하던 흐름을 연결했습니다.
- 변경:
  - 판단할 레이더 후보가 남아 있으면 `후보 판정 시작` 바로가기를 표시합니다.
  - 바로가기는 같은 화면의 STAGE 3 후보 판정 영역으로 이동합니다.
  - 화면 내 이동만으로 Cloud 저장이나 YouTube API 호출이 실행되지 않는다는 안내를 표시합니다.
- 유지:
  - 후보 판단 버튼, Cloud 저장 로직, 상태값 의미, API 호출 조건은 변경하지 않습니다.
  - API endpoint, DB schema, 저장 필드, localStorage key 변경 없음
- 검증:
  - 관련 테스트 3개 파일, 20개 테스트 통과
  - 전체 테스트 220개 파일, 965개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 129. 오늘 집중 빈 상태와 제작 후보 카드 연결

- 목적: 제작 후보는 있지만 오늘 집중으로 고정한 영상이 없을 때, 사용자가 직접 아래 후보 카드를 찾아 내려가야 하던 흐름을 연결했습니다.
- 변경:
  - 오늘 집중 빈 상태에 `제작 후보에서 고르기` 바로가기를 표시합니다.
  - 바로가기는 같은 화면의 제작 후보 칸반으로 이동합니다.
  - 바로가기와 실제 칸반 대상이 함께 유지되는 통합 회귀 테스트를 추가했습니다.
- 유지:
  - 화면 내 이동만 추가하며 오늘 집중 상태나 Cloud 데이터를 자동 변경하지 않습니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 3개 파일, 17개 테스트 통과
  - 전체 테스트 220개 파일, 965개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 130. 제작 현황 숫자와 단계 필터 연결

- 목적: 제작 후보함 상단의 현황 숫자를 확인한 뒤 사용자가 아래 단계 선택기를 다시 찾아야 하던 동선을 줄였습니다.
- 변경:
  - `제작 후보`, `제작 중`, `업로드 완료`, `링크 후보` 현황 카드를 버튼으로 전환했습니다.
  - 각 카드를 누르면 해당 제작 단계만 바로 표시합니다.
  - 버튼 클릭과 단계 필터값 연결을 회귀 테스트로 보호했습니다.
- 유지:
  - 화면 필터만 변경하며 제작 상태나 Cloud 데이터를 자동 변경하지 않습니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 5개 파일, 24개 테스트 통과
  - 전체 테스트 220개 파일, 968개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 131. 제작 우선순위 안내와 실행 화면 연결

- 목적: 제작 후보함의 `오늘 순서` 안내를 읽은 뒤 사용자가 다시 단계 필터나 캘린더 메뉴를 찾아야 하던 흐름을 연결했습니다.
- 변경:
  - 권리 확인, 일정 미정, 제작 진행, 오늘 집중, 후보 선택, 링크 검토 안내에 맞는 작업 보기 버튼을 추가했습니다.
  - 지난 일정 안내는 업로드 캘린더로 바로 이동합니다.
  - 단계별 버튼 연결과 캘린더 이동 동작을 회귀 테스트로 보호했습니다.
- 유지:
  - 화면 필터와 화면 이동만 실행하며 제작 상태나 Cloud 데이터를 자동 변경하지 않습니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 4개 파일, 25개 테스트 통과
  - 전체 테스트 220개 파일, 971개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 132. 제작 현황의 현재 보기 표시와 모바일 밀도 개선

- 목적: 제작 현황 숫자로 단계를 필터링한 뒤 현재 어떤 목록을 보고 있는지 바로 알 수 있게 하고, 모바일에서 요약 영역이 지나치게 길어지지 않도록 정리했습니다.
- 변경:
  - 선택된 제작 현황 카드에 `현재 보기`와 선택 테두리를 표시합니다.
  - 선택 상태를 `aria-pressed`로 함께 제공해 버튼 의미를 명확히 했습니다.
  - 모바일에서는 4개 현황 카드를 2열로 배치하고 일정 요약은 다음 줄 전체 폭으로 표시합니다.
  - 선택 상태 전달과 모바일 배치를 회귀 테스트로 보호했습니다.
- 유지:
  - 화면 표시와 필터 피드백만 변경하며 제작 상태나 Cloud 데이터를 자동 변경하지 않습니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 4개 파일, 21개 테스트 통과
  - 전체 테스트 220개 파일, 973개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 133. 제작 후보 카드의 실제 작업 순서 정리

- 목적: 제작 후보 카드에서 원본 영상을 확인하는 행동이 맨 아래에 숨어 있던 구조를 실제 제작 순서에 맞게 정리했습니다.
- 변경:
  - 카드 내부 흐름을 `1. 원본 확인 → 2. 제작안 작성·Cloud 저장 → 3. 다음 제작 단계 선택` 순서로 배치했습니다.
  - 썸네일과 제목을 모두 YouTube 원본 영상 링크로 연결했습니다.
  - 원본 보기, 작업 묶음 복사, URL 복사를 첫 단계에 모았습니다.
  - 모바일에서는 원본 도구와 상태 이동 버튼을 한 줄씩 표시하고 넓은 화면에서만 나란히 배치합니다.
  - 제작안 Cloud 저장 버튼은 모바일 전체 폭을 사용합니다.
  - 단계 순서와 원본 링크 연결을 회귀 테스트로 보호했습니다.
- 유지:
  - 기존 Cloud 저장 함수와 제작 상태 변경 함수를 그대로 사용합니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 5개 파일, 22개 테스트 통과
  - 전체 테스트 221개 파일, 975개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 134. 제작 후보 카드의 남은 준비와 예정일 표시

- 목적: 제작 후보 카드를 훑을 때 이미 끝난 준비 항목을 다시 읽지 않고, 아직 필요한 작업과 업로드 예정일을 먼저 확인할 수 있게 했습니다.
- 변경:
  - 준비 체크는 미완료 항목만 `남은 준비`로 압축해 표시합니다.
  - 모든 준비가 끝난 카드는 개별 항목 대신 `작업 준비 완료` 한 줄로 접어 표시합니다.
  - 저장된 업로드 예정일을 카드 상단 메타 정보에 `업로드 26.07.30` 형식으로 표시합니다.
  - 예정일이 없거나 일정 신호가 전달되지 않은 카드도 오류 없이 표시되도록 보호했습니다.
  - 미완료·완료 준비 상태와 예정일 표시를 렌더링 테스트로 보호했습니다.
- 유지:
  - 기존 Cloud 저장 필드와 제작 상태 변경 함수를 그대로 사용합니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 4개 파일, 12개 테스트 통과
  - 전체 테스트 222개 파일, 978개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 135. 제작 상태 안내의 카드 높이 압축

- 목적: 제작 후보 카드마다 반복되던 긴 상태 안내가 실제 작업 버튼을 아래로 밀지 않도록 카드 높이를 줄였습니다.
- 변경:
  - `다음 제작 단계 선택`의 긴 설명문을 `Cloud 저장 · API 호출 없음` 배지로 압축했습니다.
  - 기존 전체 설명은 배지의 도움말로 유지해 저장 위치와 API 호출 여부를 계속 확인할 수 있습니다.
  - 제작 카드의 단계 순서와 안전 안내 표시를 렌더링 테스트로 보호했습니다.
- 유지:
  - 기존 Cloud 상태 저장 함수와 제작 상태 변경 버튼을 그대로 사용합니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 2개 파일, 11개 테스트 통과
  - 전체 테스트 222개 파일, 978개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 136. 제작안 Cloud 저장 상태 표시

- 목적: 제작 제목·메모·업로드 예정일을 수정한 뒤 Cloud 저장이 필요한지 카드 상단에서 바로 확인할 수 있게 했습니다.
- 변경:
  - 제작안 제목 옆에 `저장 전`, `저장 중`, `저장 완료`, `저장 실패` 상태를 표시합니다.
  - 저장 중에는 현재 실행 상태가 먼저 보이고, 실패한 저장은 완료로 표시하지 않습니다.
  - 각 상태의 의미를 도움말로 제공하고 기존 저장 성공·실패 상세 안내는 그대로 유지합니다.
  - 저장 상태 우선순위와 카드 표시를 회귀 테스트로 보호했습니다.
- 유지:
  - 기존 Cloud 저장 버튼, 저장 함수, 제작 상태 변경 동작을 그대로 사용합니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 2개 파일, 12개 테스트 통과
  - 전체 테스트 222개 파일, 979개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 137. Cloud 저장 전 제작안 필터

- 목적: 제작 후보가 많아져도 입력 후 아직 Cloud에 저장하지 않은 제작안을 한 번에 찾을 수 있게 했습니다.
- 변경:
  - 제작 작업 찾기의 진행 단계 목록에 `Cloud 저장 전` 보기를 추가했습니다.
  - 현재 브라우저 화면에서 수정한 제목·메모·업로드 예정일이 Cloud 기록과 다른 영상만 표시합니다.
  - 오늘 집중, 제작 후보, 제작 중, 업로드 완료에 흩어진 미저장 제작안을 한 보기에서 확인할 수 있습니다.
  - 실제 편집이 없는 영상과 아직 화면 초안이 만들어지지 않은 영상은 미저장으로 오인하지 않습니다.
- 유지:
  - 필터는 화면 표시만 바꾸며 자동 저장이나 Cloud 데이터 변경을 실행하지 않습니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 3개 파일, 23개 테스트 통과
  - 전체 테스트 222개 파일, 981개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 138. 미저장 제작안 상단 바로가기

- 목적: `Cloud 저장 전` 보기가 필터 목록 안에만 숨어 있어 저장하지 않은 입력을 놓치는 일을 줄였습니다.
- 변경:
  - 저장하지 않은 제작안이 있으면 제작 작업 찾기 상단에 `Cloud 저장 전 N개` 버튼을 표시합니다.
  - 버튼을 누르면 오늘 집중과 각 제작 단계에 흩어진 미저장 카드만 바로 보여줍니다.
  - 같은 영상이 여러 화면 그룹에 들어오더라도 한 건으로 계산하고, 저장 전 항목이 없으면 버튼을 숨깁니다.
  - 현재 보기가 `Cloud 저장 전`이면 선택 상태를 시각 표시와 `aria-pressed`로 함께 제공합니다.
- 유지:
  - 바로가기는 화면 필터만 바꾸며 Cloud 저장을 자동 실행하지 않습니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 3개 파일, 25개 테스트 통과
  - 전체 테스트 222개 파일, 983개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 139. 제작 후보함 내부 이동의 미저장 제작안 보호

- 목적: 제작 제목·메모·업로드 예정일을 수정하고 Cloud에 저장하기 전에 제작 후보함의 다른 화면 이동 버튼을 눌러 입력을 놓치는 일을 줄였습니다.
- 변경:
  - 미저장 제작안이 있으면 `저장 영상 더 보기`, `업로드 일정 보기`, `발견함 링크 정리`, 검색 원래 화면 복귀 전에 확인합니다.
  - 사용자가 이동을 취소하면 제작 후보함에 그대로 머물고, 이동을 확인하면 기존 화면 이동만 실행합니다.
  - 확인 과정은 초안을 삭제하거나 Cloud에 자동 저장하지 않습니다.
  - 미저장 제작안이 없으면 확인 없이 기존처럼 바로 이동합니다.
- 범위:
  - 이번 보호는 제작 후보함 안의 이동 버튼에만 적용합니다.
  - 앱 전체 사이드바 이동이나 브라우저 닫기까지 막는 전역 보호는 포함하지 않습니다.
- 유지:
  - 기존 제작안 Cloud 저장 함수와 제작 단계 변경 동작을 그대로 사용합니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 3개 파일, 17개 테스트 통과
  - 전체 테스트 223개 파일, 988개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 140. 미저장 제작안의 새로고침·탭 닫기 보호

- 목적: 제작안을 Cloud에 저장하기 전에 브라우저를 새로고침하거나 탭을 닫아 현재 입력을 놓치는 일을 줄였습니다.
- 변경:
  - 미저장 제작안이 있을 때만 브라우저의 기본 페이지 이탈 경고를 등록합니다.
  - 모든 제작안을 저장하면 경고를 즉시 해제합니다.
  - 확인창 문구는 브라우저 보안 정책에 따라 브라우저 기본 문구로 표시됩니다.
- 유지:
  - 경고는 자동 저장, 자동 복구, 초안 삭제를 실행하지 않습니다.
  - 기존 Cloud 저장 함수, API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 2개 파일, 12개 테스트 통과
  - 전체 테스트 223개 파일, 990개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 141. 미저장 제작안 보호 안내 표시

- 목적: 제작 후보함에서 이동·새로고침 경고가 나타나는 이유와 해제 방법을 사용자가 미리 알 수 있게 했습니다.
- 변경:
  - 미저장 제작안이 있을 때 제작 작업 찾기 상단에 개수와 보호 범위를 안내합니다.
  - 각 카드에서 Cloud 저장을 완료하면 안내와 경고가 사라진다는 다음 행동을 함께 표시합니다.
  - 모든 제작안이 저장된 상태에서는 안내를 숨깁니다.
- 유지:
  - 안내는 화면 표시만 하며 자동 저장, 자동 복구, 초안 삭제를 실행하지 않습니다.
  - 기존 Cloud 저장 함수, API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 2개 파일, 15개 테스트 통과
  - 전체 테스트 223개 파일, 991개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 142. 미저장 제작안의 앱 사이드바 이동 보호

- 목적: 제작안 제목·메모·업로드 예정일을 Cloud에 저장하기 전에 앱의 다른 사이드바 메뉴로 이동해 입력을 놓치는 일을 줄였습니다.
- 변경:
  - 제작 후보함의 미저장 여부만 상위 앱 화면에 전달하고, 초안 내용과 저장 로직은 기존 제작 후보함 안에 그대로 유지합니다.
  - 미저장 제작안이 있으면 다른 사이드바 메뉴로 이동하기 전에 확인합니다.
  - 이동을 취소하면 제작 후보함에 그대로 머물고, 확인하면 기존 사이드바 이동만 실행합니다.
  - 현재 열어 둔 `제작 후보함` 메뉴를 다시 누를 때는 불필요한 확인창을 띄우지 않습니다.
  - 모든 제작안을 Cloud에 저장하거나 제작 후보함을 닫으면 전역 미저장 신호를 해제합니다.
- 유지:
  - 확인 과정은 자동 저장, 자동 복구, 초안 삭제를 실행하지 않습니다.
  - 기존 제작 후보함 내부 이동 보호와 브라우저 새로고침·탭 닫기 보호를 그대로 유지합니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 9개 파일, 50개 테스트 통과
  - 전체 테스트 223개 파일, 994개 테스트 통과
  - `npm run build` 통과
  - 로컬 앱 정상 렌더링 확인
  - `git diff --check` 오류 없음

## 143. 미저장 제작안의 작업공간 탭 이동 보호

- 목적: 제작 후보함의 `분석 대시보드 / 영구 스크랩북` 탭을 통해 사이드바 보호를 우회해 미저장 입력을 놓치는 일을 막았습니다.
- 변경:
  - 미저장 제작안이 있으면 다른 작업공간 탭으로 이동하기 전에 기존 제작안 이탈 확인창을 표시합니다.
  - 이동을 취소하면 현재 제작 후보함에 머물고, 확인하면 선택한 탭으로만 이동합니다.
  - 현재 열어 둔 탭을 다시 누르거나 모든 제작안을 Cloud에 저장한 상태에서는 확인하지 않습니다.
- 유지:
  - 기존 사이드바·제작 후보함 내부·브라우저 이탈 보호를 그대로 유지합니다.
  - 자동 저장, 자동 복구, 초안 삭제, API 호출을 실행하지 않습니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 4개 파일, 20개 테스트 통과
  - 전체 테스트 223개 파일, 996개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 144. 미저장 제작안의 데이터 작업 시작 보호

- 목적: 제작 후보를 편집하는 동안 작업 패널에서 저장 영상을 다시 불러오거나 새 영상 수집을 시작해 현재 화면의 미저장 입력을 놓치는 일을 막았습니다.
- 변경:
  - 미저장 제작안이 있으면 `저장된 영상 불러오기`, `선택 채널 새 영상 수집`, 태그별 새 영상 수집 실행 전에 기존 제작안 이탈 확인창을 표시합니다.
  - 취소하면 영상 목록 초기화, Cloud DB 조회, YouTube API 호출을 모두 시작하지 않습니다.
  - 확인하면 기존 데이터 작업의 실행 순서와 반환값을 그대로 유지합니다.
- 유지:
  - 저장 영상 조회와 YouTube 새 영상 수집의 구분을 유지합니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 2개 파일, 17개 테스트 통과
  - 전체 테스트 223개 파일, 999개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 145. 미저장 제작안 경고 문구 구분

- 목적: 화면 이동과 데이터 작업 시작이 같은 경고 문구로 표시되던 혼동을 줄였습니다.
- 변경:
  - 사이드바·탭 이동은 기존 `다른 화면으로 이동할까요?` 문구를 유지합니다.
  - 저장 영상 조회나 새 영상 수집은 `영상 조회 또는 수집 작업을 시작할까요?`와 현재 편집 내용이 사라질 수 있다는 안내를 표시합니다.
- 유지:
  - 확인·취소 동작과 기존 보호 범위는 바뀌지 않습니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 2개 파일, 17개 테스트 통과
  - 전체 테스트 223개 파일, 999개 테스트 통과
  - `npm run build` 통과
  - `git diff --check` 오류 없음

## 146. 오늘의 레이더 주요 이동 버튼 문구 정리

- 목적: 오늘의 레이더에서 버튼을 누르기 전에 화면 이동인지, Cloud DB 조회인지, YouTube API 수집인지 구분하기 쉽게 했습니다.
- 변경:
  - `첫 채널 등록하기`는 채널 등록 화면 이동이며, 이동만으로 저장이나 수집을 실행하지 않는다고 명시했습니다.
  - `전체 채널 선택 화면`은 화면 이동이며, 이동만으로 Cloud DB 조회나 YouTube API 호출을 실행하지 않는다고 명시했습니다.
  - `후보 판정 시작`은 같은 화면의 판정 영역 이동이며, 이동만으로 Cloud 저장이나 YouTube API 호출을 실행하지 않는다고 명시했습니다.
  - 저장 영상이 없을 때의 `새 영상 수집 준비`를 `새 영상 수집 단계로`로 바꾸고, 실제 수집 버튼을 누르기 전에는 YouTube API를 호출하지 않는다고 명시했습니다.
- 유지:
  - 버튼의 기존 이동 대상과 클릭 동작은 바뀌지 않았습니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 5개 파일, 18개 테스트 통과
  - 전체 테스트 223개 파일, 1,000개 테스트 통과
  - `npm run build` 통과

## 147. 주요 작업 화면의 이동·필터 버튼 설명 보강

- 목적: 오늘의 레이더 이후 화면에서도 버튼을 누르기 전에 화면 이동인지, 화면 필터 변경인지, Cloud DB 조회인지 알 수 있게 했습니다.
- 변경:
  - 레이더 완료 단계의 제작 후보함·후보 판정대 이동 버튼에 자동 상태 변경, Cloud 저장, YouTube API 호출이 없음을 명시했습니다.
  - 태그별 금고의 채널 목록 이동과 저장 영상 조회를 구분하고 접근성 설명을 보강했습니다.
  - 업로드 캘린더의 제작 후보함 이동, 일정 수정, 오늘 보기, 필터 초기화 버튼에 실제 영향 범위를 명시했습니다.
  - 오늘 볼 채널의 빈 결과 복구 버튼에 화면 표시 변경과 전체 채널 목록 이동의 차이를 명시했습니다.
- 유지:
  - 기존 화면 이동 대상, 필터 조건, 조회·저장·수집 동작은 바뀌지 않았습니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 4개 파일, 9개 테스트 통과
  - 전체 테스트 223개 파일, 1,001개 테스트 통과
  - `npm run build` 통과

## 148. 탐색 화면 빈 상태 복구 버튼 설명 보강

- 목적: 키워드 탐색, 태그별 금고, 터또터 탐색에서 결과가 없을 때 나타나는 버튼이 Cloud DB 조회인지, 화면 이동인지, 필터 초기화인지 누르기 전에 알 수 있게 했습니다.
- 변경:
  - 저장 영상 불러오기는 Cloud DB 조회이며 새 YouTube API 호출이 없음을 도움말과 접근성 문구에 명시했습니다.
  - 채널·저장 영상 화면 열기는 화면 이동만 실행하며 조회나 수집을 자동 실행하지 않는다고 명시했습니다.
  - 필터 초기화는 현재 화면 표시만 바꾸고 Cloud 데이터와 사용자 기록을 변경하지 않는다고 명시했습니다.
  - 태그 채널 선택은 선택만 실행하며 Cloud DB 조회나 YouTube API 호출을 자동 실행하지 않는다고 명시했습니다.
- 유지:
  - 기존 버튼의 실행 함수, 화면 이동 대상, 필터 조건, 조회·저장·수집 동작은 바뀌지 않았습니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 관련 테스트 6개 파일, 24개 테스트 통과
  - 전체 테스트 223개 파일, 1,001개 테스트 통과
  - `npm run build` 통과

## 149. 오늘의 레이더 진행률과 제작 인계 일치 보강

- 목적: 채널 선택부터 저장 영상 조회, 후보 판단, 제작 후보 인계까지 현재 위치와 다음 행동을 한눈에 확인하도록 보강했습니다.
- 변경:
  - 레이더 상단 4단계 안내에 연속 완료 단계 수와 현재 할 일을 표시합니다.
  - 제작 후보가 있으면 4단계를 준비 상태로 열고, 오늘 집중 후보가 있으면 완료 상태와 집중 수를 표시합니다.
  - 모든 단계가 끝난 경우 `오늘 흐름 완료`로 표시합니다.
  - 제작 후보함 이동 버튼을 현재 상태에 따라 `오늘 집중 정하기` 또는 `오늘 집중 계속하기`로 구분합니다.
  - 오늘 채널 선택은 화면 이동 중 유지되지만 브라우저 새로고침 시 초기화되며, 영상 판단과 제작 후보 기록은 Cloud에 보존된다는 경계를 화면에 명시합니다.
- 유지:
  - 기존 채널 선택, Cloud 저장 영상 조회, 영상 판단 저장, 제작 후보 저장 동작은 바뀌지 않았습니다.
  - API endpoint, DB schema, 저장 필드, 상태값, localStorage key, YouTube API 호출 조건 변경 없음
- 검증:
  - 레이더·제작 흐름 관련 테스트 5개 파일, 22개 테스트 통과
  - 전체 테스트 223개 파일, 1,014개 테스트 통과
  - `npm run build` 통과
  - 레이더, 홈 지표, 제작 칸반의 제작 후보 수 연결 계약 테스트 통과

## 150. 대본 보드 MVP

- 목적: 제작 후보함의 카드 안에서 흩어져 작성하던 제목, 제작 메모, 목표 날짜를 글쓰기 중심 화면에서 이어서 정리합니다.
- 변경:
  - 준비중이던 `대본 보드`를 실사용 메뉴와 전용 라우트로 전환했습니다.
  - 제작 후보, 오늘 집중, 제작 중, 업로드 완료 작업을 검색하고 단계별로 필터링합니다.
  - 원본 영상 확인, 작업 묶음 복사, 제목 초안, 인트로·구성·대본 초안, 업로드 예정일을 한 화면에 배치했습니다.
  - 제작 후보함, 대본 보드, 업로드 캘린더를 왕복 연결했습니다.
  - 저장 성공/실패와 미저장 작업 수를 표시하고 기존 사이드바·브라우저 이탈 보호를 재사용합니다.
- 데이터 경계:
  - 기존 Cloud `videoUserRecords.draftTitle`, `note`, `targetPublishDate`만 사용합니다.
  - 별도 대본 DB, 새 endpoint, localStorage key, 자동 저장, AI API, YouTube API 호출을 추가하지 않았습니다.
- 검증:
  - 전체 테스트 226개 파일, 1,021개 테스트 통과
  - `npm run build` 통과

## 151. 업로드 캘린더에서 대본 보드로 직접 복귀

- 목적: 대본 작성 후 확인한 업로드 일정에서 같은 영상의 대본 작업으로 다시 돌아갈 때 제작 후보함을 거치지 않도록 제작 화면의 왕복 동선을 완성합니다.
- 변경:
  - 일정이 있는 날짜의 각 영상 카드에 `대본 보드 열기`를 추가했습니다.
  - 선택한 일정의 영상 ID를 대본 보드에 전달해 해당 작업을 바로 선택합니다.
  - 기존 `후보함에서 찾기`, `원본 열기`, 전체 일정 수정 동선은 그대로 유지합니다.
- 데이터 경계:
  - 화면 이동 정보만 전달하며 Cloud 데이터를 자동 저장하거나 YouTube API를 호출하지 않습니다.
  - DB schema, endpoint, 저장 필드, localStorage key를 변경하지 않았습니다.
- 검증:
  - 캘린더 라우트, 일정 카드, 작업 공간, 대본 보드 관련 테스트 5개 파일, 11개 테스트 통과
  - 전체 테스트 226개 파일, 1,021개 테스트 통과
  - `npm run build` 통과

## 152. 날짜 미정 제작 후보를 업로드 캘린더 작업 목록으로 연결

- 목적: 업로드 날짜가 없는 제작 후보가 숫자로만 보이지 않고 다음 작업으로 바로 이어지게 합니다.
- 변경:
  - 업로드 캘린더 상단에 `날짜 미정 제작 후보` 목록을 추가했습니다.
  - 제목, 상태, 썸네일을 확인하고 각 후보의 대본 보드를 바로 열 수 있습니다.
  - 후보함에서 전체 날짜 미정 후보를 확인하거나 특정 후보를 검색해 목표 날짜를 정할 수 있습니다.
- 데이터 경계:
  - 기존 `videoUserRecords`에서 제작 상태가 있고 유효한 `targetPublishDate`가 없는 기록만 읽습니다.
  - 날짜 자동 저장, 상태 변경, 새 endpoint, DB schema, localStorage key, YouTube API 호출은 추가하지 않았습니다.
- 검증:
  - 캘린더 유틸, 날짜 미정 목록, 캘린더 작업 공간 테스트 3개 파일, 10개 테스트 통과
  - 전체 테스트 227개 파일, 1,024개 테스트 통과
  - `npm run build` 통과

## 153. 수집 채널 반응도 1단계

- 목적: 키워드 탐색에서 단순히 많이 나온 단어뿐 아니라 레퍼런스 채널 안에서 넓고 강하게 반응한 제목 단어를 먼저 찾습니다.
- 용어:
  - `수집 채널`은 사용자가 소유·운영하는 채널이 아니라 관찰 대상으로 등록한 레퍼런스 채널입니다.
  - `수집 채널 반응도`는 현재 불러온 Cloud 저장 영상 안에서만 비교하는 상대 점수입니다.
- 계산:
  - 제목 반복 30점
  - 서로 다른 채널 확산 20점
  - 최근 30일 영상 등장 25점
  - 대박 지수와 일평균 조회 반응 25점
- 화면:
  - 상위 키워드에 반응도, 영상 수, 채널 수를 함께 표시합니다.
  - 키워드를 누르면 기존 저장 영상 검색으로 이어집니다.
  - 외부 검색량, 완전한 실시간 지표, 성공 예측이 아니라는 설명을 화면에 표시합니다.
- 데이터 경계:
  - 현재 메모리에 불러온 Cloud 저장 영상만 계산하며 새 저장이나 외부 API 호출은 없습니다.
  - DB schema, endpoint, localStorage key, YouTube API 호출 조건을 변경하지 않았습니다.
  - 외부 검색 관심도는 자동 연동하지 않고 공식 조사 도구 바로가기로 분리합니다.

## 154. 외부 키워드 조사 바로가기와 업무 도구함

- 목적: 외부 API 신청과 인증정보 관리 없이 필요한 순간에 공식 키워드 조사 도구를 빠르게 엽니다.
- 키워드 탐색:
  - 현재 키워드 복사 버튼을 제공합니다.
  - Google Trends는 현재 키워드를 포함한 검색 화면을 새 창으로 엽니다.
  - 네이버 DataLab과 네이버 검색광고는 공식 도구 화면을 새 창으로 엽니다.
  - 외부 검색량 자동 수집이나 성공 예측처럼 보이지 않도록 데이터 경계를 설명합니다.
- 업무 도구함:
  - 사이드바에 `업무 도구함` 실사용 메뉴를 추가했습니다.
  - Google Trends, 네이버 DataLab, 네이버 검색광고, YouTube 검색, YouTube Studio를 업무 목적별로 모았습니다.
  - 개인 링크 추가·삭제와 순서 저장은 아직 제공하지 않으며 저장 기준 결정 후 확장합니다.
- 데이터/API 경계:
  - 새 endpoint, 외부 API Key, DB schema, localStorage key를 추가하지 않았습니다.
  - 외부 데이터를 자동 수집하거나 Creator OS에 저장·병합하지 않습니다.
  - 링크 이동과 키워드 복사만 수행하며 기존 Cloud 데이터와 YouTube API 수집 조건에 영향이 없습니다.
- 검증:
  - 전체 테스트 230개 파일, 1,031개 테스트 통과
  - `npm run build` 통과

## 155. 업무 도구 즐겨찾기 Cloud 관리

- 목적: 업무 도구함의 개인 링크와 표시 순서를 설정 화면에서 관리하고 여러 브라우저에서 같은 목록을 사용합니다.
- 설정 화면:
  - 개인 도구 이름, 주소, 설명, 분류를 추가·수정할 수 있습니다.
  - 개인 도구 삭제, 기본 도구 숨김·복원, 위·아래 순서 변경을 제공합니다.
  - 변경사항은 사용자가 `변경사항 Cloud 저장`을 눌렀을 때만 저장합니다.
  - 저장 실패, 불러오기 실패, 저장 전 상태를 서로 다르게 표시합니다.
- 업무 도구함:
  - Cloud 설정에 따라 숨긴 기본 도구를 제외하고 개인 도구와 저장 순서를 반영합니다.
  - Cloud 연결 실패 시 기본 도구를 유지하고 다시 불러오기 동선을 제공합니다.
- 백엔드:
  - `GET/PUT /work-tool-preferences`를 추가했습니다.
  - 기존 `videos` container에 `docType: work_tool_preferences` 사용자 문서 1개를 저장합니다.
  - 개인 URL은 `http`와 `https`만 허용하고 목록과 ID를 정규화합니다.
- 데이터/API 경계:
  - 새 container, localStorage key, 자동 병합, 자동 마이그레이션을 추가하지 않았습니다.
  - 외부 검색 데이터, 외부 로그인 정보, YouTube API 호출은 포함하지 않습니다.
- 검증:
  - 프론트 전체 테스트 233개 파일, 1,036개 테스트를 통과했습니다.
  - 프론트 production build와 백엔드 전체 테스트를 통과했습니다.

## 156. 업무 도구 검색과 설정 왕복 연결

- 목적: 개인 즐겨찾기가 늘어나도 필요한 도구를 바로 찾고, 업무 도구함과 설정 사이를 사이드바를 다시 찾지 않고 오갈 수 있게 합니다.
- 업무 도구함:
  - 도구 이름, 설명, 분류, 배지, 주소를 대상으로 현재 Cloud 목록 안에서 검색합니다.
  - 검색 결과 수와 전체 도구 수를 함께 표시하고, 결과가 없으면 전체 목록으로 돌아가는 버튼을 제공합니다.
  - `설정에서 관리` 버튼으로 업무 도구 관리 영역을 바로 엽니다.
- 설정:
  - 저장된 목록은 `업무 도구함에서 확인` 버튼으로 바로 확인합니다.
  - 저장하지 않은 변경사항이 있거나 Cloud 저장 중이면 확인 버튼을 비활성화해 현재 편집값 유실을 줄입니다.
- 데이터/API 경계:
  - 검색과 화면 왕복은 현재 화면 데이터와 기존 내비게이션만 사용합니다.
  - Cloud 저장, 외부 도구 열기, YouTube API 호출, localStorage 변경을 자동 실행하지 않습니다.
- 검증:
  - 프론트 전체 테스트 234개 파일, 1,039개 테스트를 통과했습니다.
  - 프론트 production build를 통과했습니다.

## 157. 업무 도구 설정 미저장 보호와 모바일 저장 흐름 보강 (2026-07-26)

- 업무 도구 설정에서 개인 도구 이름과 주소를 편집한 경우에도 Cloud 저장 직전에 전체 목록을 다시 검증합니다.
- `http://`와 `https://` 주소만 허용하며, 비어 있는 이름이나 잘못된 주소는 어떤 도구인지 알려주고 저장을 중단합니다.
- 저장하지 않은 변경사항이 있으면 새로고침·탭 닫기 전에 브라우저 기본 경고가 표시됩니다.
- 개인 도구 추가 폼은 Enter 키로도 목록에 추가할 수 있습니다.
- 모바일에서는 상단 관리 버튼을 한 줄씩 배치하고, 긴 목록을 편집하는 동안 화면 아래에서 Cloud 저장 버튼을 바로 사용할 수 있습니다.
- 이 변경은 프론트 입력 검증과 화면 보호만 다룹니다. endpoint, DB schema, 저장 필드, localStorage key, YouTube API 호출 조건은 변경하지 않았습니다.
- 검증:
  - 테스트 파일 235개, 테스트 1,043개 통과
  - `npm run build` 통과
  - 390×844 모바일 화면에서 버튼 배치, 미저장 안내, 하단 저장 동선 확인

## 158. 업무 도구 설정 사이드바 이동 보호 (2026-07-26)

- 업무 도구 설정을 수정한 뒤 다른 사이드바 메뉴를 누르면 저장하지 않고 이동할지 확인합니다.
- `취소`하면 설정 화면과 입력값을 그대로 유지하고, `확인`한 경우에만 선택한 화면으로 이동합니다.
- 현재 설정 메뉴를 다시 누르거나 변경사항이 없는 경우에는 확인창을 표시하지 않습니다.
- Cloud 저장이 성공해 미저장 상태가 해제되면 기존처럼 바로 이동합니다.
- 제작안 초안 보호와 업무 도구 설정 보호가 동시에 활성화된 경우 두 미저장 영역을 함께 안내합니다.
- 새 endpoint, DB schema, 저장 필드, localStorage key, YouTube API 호출 조건은 변경하지 않았습니다.
- 검증:
  - 테스트 파일 236개, 테스트 1,048개 통과
  - `npm run build` 통과
  - 로컬 실제 화면에서 미저장 설정 후 사이드바 클릭 시 브라우저 확인창 표시 확인
## 159. 2026-07-27 최근 수집 상태 관제 화면

### 목적

- 채널 운영자가 실패하거나 아직 수집하지 않은 채널을 한곳에서 찾게 합니다.
- 과거 수집 이력이 없는 현재 구조를 실제 로그처럼 오해하지 않게 합니다.

### 구현

- 오퍼레이션 관제의 `수집 로그` 준비중 메뉴를 `최근 수집 상태` 실사용 화면으로 전환했습니다.
- 기존 `channels.lastScanSummary`와 `channels.lastScannedAt`을 기준으로 성공, 부분 성공, 실패, 미수집을 분류합니다.
- 채널 이름, 태그, 등급, 오류 검색과 상태 필터를 추가했습니다.
- 채널 관리와 선택 채널 새 영상 수집 단계로 이어지는 안전한 화면 이동을 연결했습니다.
- 과거 이력과 정확한 API 쿼터는 아직 없다는 범위를 화면에 명시했습니다.

### 변경하지 않은 것

- 새 API endpoint 없음
- DB schema와 container 변경 없음
- `scan_logs`, `api_quota_logs` 추가 없음
- localStorage key 변경 없음
- YouTube API 호출 조건과 기존 수집 로직 변경 없음

### 검증

- 테스트 파일 239개, 테스트 1,057개 통과
- `npm run build` 통과
- 로컬 데스크톱 화면에서 사이드바 메뉴 전환, 작업 화면, 빈 상태 표시 확인
- 390×844 모바일 화면에서 요약 카드, 작업 버튼, 검색·필터 빈 상태 확인
- 메뉴는 활성화되지만 작업 화면이 열리지 않던 라우트 플래그 전달 누락을 실제 화면 점검 중 발견해 수정하고 회귀 테스트를 추가

## 2026-07-27 채널별 과거 수집 이력 1차 구현

### 목적

- 마지막 결과 한 건뿐 아니라 이전 수집 성공·부분 성공·실패를 운영 화면에서 확인합니다.
- 새 Cosmos 고정비를 만들지 않고 현재 무료 처리량 범위에서 시작합니다.

### 구현

- 백엔드가 각 채널 수집 완료 또는 실패 시 기존 `videos` container에 `docType: scan_log` 문서를 추가 저장합니다.
- 기존 `lastScanSummary`는 마지막 상태 표시로 그대로 유지합니다.
- `GET /scan-logs`에서 상태·채널 필터와 continuation token 기반 페이지 조회를 지원합니다.
- 최근 수집 상태 화면이 Cloud 과거 이력 최대 100건을 읽고, 로딩·빈 결과·오류·재조회 상태를 구분합니다.
- 과거 이력 조회는 Cloud DB 조회이며 YouTube API를 호출하지 않습니다.

### 안전 기준

- 새 Cosmos container와 추가 고정 RU를 만들지 않습니다.
- `/videos`는 `docType: video`만 조회하므로 `scan_log` 문서가 저장 영상 목록에 섞이지 않습니다.
- 로그 저장 실패가 기존 수집 성공을 실패로 바꾸지 않습니다.
- `api_quota_logs`, 자동 재시도, 보관 기간/자동 삭제, localStorage 변경은 포함하지 않습니다.

### 검증

- 백엔드 전체 테스트 통과
- `GET /scan-logs` handler 모의 페이지 조회 통과
- 프론트 테스트 파일 239개, 테스트 1,059개 통과
- production build 통과

## 160. 2026-07-27 최근 수집 상태 실행 단위 가독성 보강

### 목적

- Cloud 채널 조회 중 잠깐 나타나는 잘못된 0개 안내를 없앱니다.
- 채널별로 길게 나열되는 수집 이력을 사용자가 누른 한 번의 수집 작업 기준으로 읽게 합니다.
- 원시 등급값을 비개발자가 이해할 수 있는 화면 문구로 표시합니다.

### 구현

- 채널 조회가 끝나기 전에는 요약 숫자 대신 조회 중 상태를 표시합니다.
- 저장된 채널이 정말 0개일 때만 채널 운영실로 이동하는 빈 상태를 표시합니다.
- `unclassified` 등급을 `미분류`로 표시하고 S/A/B/C 등급은 대문자로 통일합니다.
- 최근 Cloud 채널 기록 최대 100건을 `scanRunId`로 묶어 실행 요약을 만들고, 펼치면 채널별 결과를 확인할 수 있게 했습니다.
- 과거 `scanRunId`가 없는 단일 기록은 서로 잘못 합쳐지지 않도록 개별 실행으로 표시합니다.

### 안전 범위

- DB schema, container, API endpoint, 로그 저장 필드는 변경하지 않았습니다.
- YouTube API 호출 조건과 실제 수집 로직은 변경하지 않았습니다.
- localStorage key와 기존 채널·영상 데이터는 변경하지 않았습니다.
- 검증 과정에서 실제 새 영상 수집을 실행하지 않았습니다.

### 검증

- 관련 테스트 3개 파일, 12개 테스트 통과
- 전체 테스트 239개 파일, 1,063개 테스트 통과
- `npm.cmd run build` 통과

## 161. 2026-07-27 최근 수집 상태에서 채널 운영 이어가기

### 목적

- 실패하거나 부분 성공한 채널을 찾은 뒤 채널 운영실에서 같은 채널을 다시 검색·선택하는 반복을 없앱니다.
- 상태 확인에서 실제 점검 단계까지 물 흐르듯 이어지되, 비용성 수집은 사용자가 마지막 버튼을 눌렀을 때만 실행되게 합니다.

### 구현

- 모든 채널 행에 `이 채널 관리`를 추가해 해당 채널 하나를 선택한 상태로 채널 관리 단계에 이동합니다.
- 실패·부분 성공·미수집 채널에는 `수집 단계 열기`를 추가해 같은 채널을 선택한 상태로 새 영상 수집 단계에 이동합니다.
- 성공 채널에는 불필요한 수집 유도 버튼을 표시하지 않습니다.
- 화면 상단의 일반 이동 버튼은 기존 채널 선택을 임의로 바꾸지 않습니다.

### 안전 범위

- 버튼은 현재 브라우저의 채널 선택과 화면 위치만 변경합니다.
- Cloud 저장, YouTube API 호출, 실제 새 영상 수집은 자동 실행하지 않습니다.
- DB schema, API endpoint, localStorage key, 기존 수집 조건은 변경하지 않았습니다.

### 검증

- 관련 테스트 2개 파일, 7개 테스트 통과
- 전체 테스트 239개 파일, 1,064개 테스트 통과
- `npm.cmd run build` 통과

## 162. 2026-07-27 과거 수집 이력 후속 동선 연결

### 목적

- 과거 수집 결과에서 해당 채널을 다시 찾는 단계를 줄입니다.
- 아직 이력이 없을 때 다음에 어디로 가야 하는지 화면 안에서 안내합니다.

### 구현

- 과거 수집 이력의 채널별 결과에 `채널 관리` 버튼을 추가했습니다.
- 버튼은 해당 채널 하나를 현재 선택에 넣고 채널 관리 단계로 이동합니다.
- 이력이 비어 있는 화면에는 `수집할 채널 고르기`를 추가해 채널 관리 단계에서 범위를 먼저 정하게 했습니다.

### 안전 범위

- 버튼은 선택과 화면 이동만 수행합니다.
- Cloud 저장과 YouTube API 수집은 자동 실행하지 않습니다.
- 실제 수집은 채널 운영실의 별도 실행 버튼을 눌러야 시작됩니다.
- 운영 배포 검증에서 채널 미선택 상태로 수집 단계에 바로 들어가면 전체 운영중 채널 수집 버튼이 보이는 위험을 발견해, 빈 이력의 다음 행동을 채널 선택 단계로 조정했습니다.

### 검증

- 관련 테스트 2개 파일, 9개 테스트 통과
- 전체 테스트 239개 파일, 1,066개 테스트 통과
- `npm.cmd run build` 통과

## 163. 2026-07-27 수집 결과 원인과 다음 행동 안내

### 목적

- `부분 성공`과 기술 오류 원문만 보고 사용자가 무엇을 해야 하는지 다시 추측하는 문제를 줄입니다.
- 최신 영상 수집과 과거 영상 전체 보강 수집을 같은 기능처럼 오해하지 않게 합니다.

### 구현

- `부분 성공`에는 Cloud 저장 영상 수, 채널 전체 영상 수, 저장 범위, 추정 누락 수를 표시합니다.
- 최신 영상 수집을 다시 실행해도 과거 누락분 전체가 자동으로 채워지는 것은 아니라고 안내합니다.
- 실패 원인을 API 한도, 네트워크, 채널 정보, 권한, 기타 오류로 나눠 쉬운 설명과 다음 행동을 제공합니다.
- 기술 오류 원문은 검색 가능성을 유지하되 화면에서는 `기술 오류 원문 보기` 안에 넣었습니다.
- 부분 성공 버튼은 `최신 영상 수집 준비`, 실패 버튼은 `다시 수집 준비`로 구분했습니다.

### 안전 범위

- 기존 `lastScanSummary`와 `scan_log` 필드만 읽습니다.
- DB schema, API endpoint, 저장 데이터, YouTube API 호출 조건은 변경하지 않았습니다.
- 화면 이동만으로 실제 수집은 시작되지 않습니다.

## 164. 2026-07-28 Creator OS 개선 기록과 대본 작업실 기준

### 목적

- 기능 고도화 과정에서 현재 상태, 목표, 다음 작업과 중요한 결정을 잃지 않게 합니다.
- 대본 보드를 실제 지원 범위보다 완성된 대본 도구처럼 보이지 않게 하고 장기 역할을 명확히 합니다.

### 구현

- `인사이트 / 학습 → 개선 기록`을 읽기 전용 실사용 화면으로 연결했습니다.
- 대본 작업실, 메뉴·용어, 탐색 통합, 데이터·API 안전의 체크포인트를 구조화된 코드로 관리합니다.
- `대본 보드`를 `대본 작업실`로 변경했습니다.
- 현재는 제목, 통합 작업 메모, 업로드 예정일만 저장하며 분석·구성·대본·수정은 아직 분리되지 않았다고 화면에 표시했습니다.
- 제작 후보함과 업로드 캘린더의 관련 이동 버튼도 대본 작업실로 통일했습니다.

### 확인한 저장 계약

- 프론트는 기존 `/video-records`를 사용합니다.
- 백엔드는 현재 `draftTitle`, `note`, `targetPublishDate`를 대본 관련 값으로 보존합니다.
- 새 분석·구성·대본 필드는 백엔드 계약 승인 전에는 추가하지 않습니다.

### 안전 범위

- 새 Azure 자원, Cosmos container, endpoint, localStorage key를 추가하지 않았습니다.
- 개선 기록 화면은 정적 코드와 Git 이력만 사용합니다.
- API 호출, 온라인 저장소(Azure DB) 조회·저장, YouTube 신규 수집을 실행하지 않습니다.

### 검증

- 전체 자동 테스트 통과: 246개 파일, 1,117개 테스트
- 운영용 빌드 통과: `npm run build`

## 165. 2026-07-28 수집 영상·링크 용어와 이동 버튼 정리

### 목적

- 영상 파일을 보관하는 금고처럼 보이는 이전 용어를 실제 기능에 맞게 정리합니다.
- 사용자가 버튼을 누르기 전에 이동인지, 온라인 저장소(Azure DB) 조회인지, YouTube 신규 수집인지 구분할 수 있게 합니다.

### 구현

- 사이드바의 `레퍼런스 금고` 구역을 `수집 영상·링크`로 변경했습니다.
- 수집 영상 조회 화면 제목과 오늘의 레이더 이동 버튼을 `수집 영상 목록`으로 통일했습니다.
- 태그별 금고 화면의 상위 구역명도 `수집 영상·링크`로 맞췄습니다.
- 제작 후보 빈 화면에서 출발 위치를 `오늘의 레이더`, `수집 영상 목록`, `발견 링크 저장`으로 명확히 표시했습니다.

### 안전 범위

- 내부 view id와 기존 호환 경로는 유지합니다.
- API endpoint, 온라인 저장소(Azure DB) 필드, localStorage key, YouTube API 호출 조건은 변경하지 않습니다.

### 검증

- 전체 자동 테스트 통과: 246개 파일, 1,117개 테스트
- 운영용 빌드 통과: `npm run build`

## 166. 2026-07-28 대본 작업실 구조화 입력과 저장 계약 확장

### 목적

- 제목과 하나의 통합 메모에 섞여 있던 대본 작업을 분석, 구성안, 본문, 진행 단계로 나눕니다.
- 기존 자료를 잃지 않고 제작 후보함, 대본 작업실, 업로드 캘린더가 같은 제작 기록을 계속 사용합니다.

### 구현

- 대본 작업실에 `영상 분석`, `대본 구성안`, `대본 본문`, `대본 진행 단계` 입력을 추가했습니다.
- 기존 `note`는 자동 변환하거나 삭제하지 않고 `기존 통합 작업 메모`로 유지했습니다.
- 검색, 작업 준비 체크, 작업 묶음 복사에 새 구조화 필드를 연결했습니다.
- 백엔드는 기존 `/video-records`에서 `scriptAnalysis`, `scriptOutline`, `scriptBody`, `scriptStatus`를 보존합니다.
- 이전 프론트가 새 필드를 보내지 않아도 백엔드가 이미 저장된 새 필드를 유지하도록 호환성을 보강했습니다.

### 안전 범위

- 기존 Azure Functions, Cosmos DB `videos` container, `video_user_record` 문서를 재사용합니다.
- 새 Azure 자원, container, endpoint, localStorage key, 자동 저장, AI 호출은 추가하지 않았습니다.
- 실제 Azure DB 저장 왕복 검수는 테스트 기록을 정한 뒤 별도 승인으로 실행합니다.

### 검증

- 관련 테스트 6개 파일, 32개 테스트 통과
- 전체 테스트 247개 파일, 1,119개 테스트 통과
- 운영용 빌드 통과: `npm run build`

## 167. 2026-07-28 채널 운영실 조회·수집 단계 이름 구분

### 확인한 혼동

- 채널 운영실의 3단계 제목 `영상 확인·수집`은 온라인 저장소(Azure DB)의 기존 수집 영상 조회와 YouTube API 신규 수집이 한 동작처럼 보일 수 있었습니다.
- 단계 안의 `수집 영상 목록 불러오기`와 실제 새 영상 수집 버튼은 이미 별도 동작으로 구현돼 있습니다.

### 변경

- 단계 이름을 `수집 영상 확인·새 영상 수집`으로 변경해 두 작업이 함께 있는 단계라는 점을 명확히 했습니다.
- 버튼 동작, API 호출 조건, 저장 계약은 변경하지 않았습니다.

### 안전 범위

- 화면 문구만 변경합니다.
- 온라인 저장소(Azure DB) 조회, YouTube API 호출, 데이터 저장을 자동 실행하지 않습니다.

### 검증

- 관련 테스트 4개 파일, 16개 테스트 통과
- 전체 테스트 247개 파일, 1,119개 테스트 통과
- 운영용 빌드 통과: `npm run build`

## 168. 2026-07-28 핵심 화면 이동 실제 검수와 연결 보완

### 실제 화면에서 확인한 흐름

- 제작 후보함 → 대본 작업실 → 업로드 캘린더 → 같은 후보의 대본 이어쓰기를 실제 운영 화면에서 확인했습니다.
- 대본 작업실을 390×844 모바일 크기로 확인했으며 가로 넘침 없이 구조화 입력 항목이 한 번씩 표시됐습니다.
- 대본 입력을 수정한 뒤 다른 메뉴로 이동할 때 미저장 경고가 실제로 표시되는 것을 확인했습니다. 저장 버튼은 누르지 않았습니다.
- 최근 수집 상태에서 `이 채널 관리`와 `이 채널 수집 화면 열기`가 해당 채널을 선택하고 채널 운영실의 각 단계로 이동하는 것을 확인했습니다.

### 확인 후 보완한 문제

- 제작 후보함의 `대본 작업실 열기` 동작은 상위에서 준비돼 있었지만 중간 컴포넌트가 이동 함수를 전달하지 않아 버튼이 표시되지 않았습니다. 전달 누락을 보완하고 렌더링 회귀 테스트를 추가했습니다.
- 최근 수집 상태에서 특정 채널을 열어도 기존 분류 탭이 유지돼 선택한 채널이 화면에 보이지 않을 수 있었습니다. 해당 채널의 첫 태그 분류로 함께 이동하도록 보완했습니다.
- 현재 기준 문서의 단독 `Cloud`, `저장 영상` 표현을 `온라인 저장소(Azure DB)`, `수집 영상 목록` 중심으로 정리했습니다.

### 안전 범위

- 화면 이동과 현재 브라우저의 채널 선택·분류 탭만 변경합니다.
- Azure DB 조회·저장, YouTube API 신규 수집, endpoint, DB schema, localStorage key는 변경하지 않았습니다.
- 실제 Azure DB 저장 → 새로고침 → 재조회 왕복 검수는 별도 결정 사항으로 유지합니다.

### 검증

- 전체 자동 테스트 통과: 248개 파일, 1,121개 테스트
- 운영용 빌드 통과: `npm run build`
- `git diff --check` 통과

## 169. 2026-07-28 제작 후보함의 대본 작업실 연결 최종 보완

### 운영 재검수에서 확인한 문제

- 첫 속성 전달 누락을 보완한 뒤 운영 화면을 다시 열었지만 `대본 작업실 열기` 버튼이 아직 표시되지 않았습니다.
- 상위 라우트에는 이동 함수가 있었으나 `ScrapbookWorkspace → getScrapbookWorkspaceViewProps → ProductionKanban` 구간에서도 같은 함수가 전달되지 않고 있었습니다.

### 변경

- 빠져 있던 두 전달 구간을 연결해 제작 후보함의 다음 행동에 `대본 작업실 열기`가 표시되도록 했습니다.
- 제작 후보 칸반 전체를 렌더링하는 테스트와 작업 공간 속성 테스트에서 대본 작업실 연결을 함께 확인하도록 보강했습니다.

### 안전 범위

- 기존 대본 작업실 화면으로 이동하는 함수만 전달합니다.
- 화면 이동만으로 Azure DB 조회·저장이나 YouTube API 신규 수집을 실행하지 않습니다.
- endpoint, DB schema, localStorage key와 기존 저장 계약은 변경하지 않았습니다.

## 170. 2026-07-28 레이더·수집 영상·소재 보관함·발견함 실제 검수

### 실제 화면에서 확인한 흐름

- 오늘 볼 채널에서 `EverythingRanked` 1개를 선택하고 온라인 저장소(Azure DB)의 수집 영상 목록 290개를 조회했습니다. YouTube 신규 수집은 실행하지 않았습니다.
- 조회 후 `다음: 오늘의 레이더 보기`로 돌아왔을 때 선택 채널 1개와 불러온 영상 290개가 유지되고 후보 판단 단계가 열리는 것을 확인했습니다.
- 수집 영상 목록의 검색 결과 없음 → 필터 초기화, 발견함의 상태 필터 결과 없음 → 필터 초기화가 각각 원래 목록으로 복구되는 것을 확인했습니다.
- 발견함의 링크 저장·상태 변경·권리 상태 변경·삭제 버튼이 각각 온라인 발견함(Azure DB) 변경 여부를 설명하는지 대조했습니다. 저장과 변경 버튼은 누르지 않았습니다.
- 발견함과 수집 영상 목록을 390×844 모바일 화면에서 확인했고 가로 넘침이 없었습니다.

### 확인 후 보완한 문제

- 수집 영상 목록 안의 `소재 보관함` 탭을 누르면 내용은 소재 보관함으로 바뀌지만 상단 큰 제목은 `수집 영상 목록`으로 남았습니다.
- 작업 탭이 내부 탭 상태만 바꾸지 않고 대응하는 Creator OS 화면을 열도록 연결해, 상단 제목·사이드바 현재 위치·탭 내용이 함께 일치하도록 했습니다.

### 안전 범위

- 화면 이동 상태만 보완합니다.
- 온라인 저장소(Azure DB) 저장, YouTube API 호출, endpoint, DB schema, localStorage key는 변경하지 않습니다.

### 검증

- 빈 화면·조회 실패 상태 관련 테스트 5개 파일, 23개 테스트 통과
- 전체 자동 테스트 248개 파일, 1,122개 테스트 통과
- 운영용 빌드와 `git diff --check` 통과

## 171. 2026-07-28 설정·업무 도구·채널 등록 업무 시스템 검수

### 실제 확인

- 설정 → 업무 도구함 → 설정의 양방향 이동과 각 화면 제목을 확인했습니다.
- 업무 도구 설정을 화면에서 변경한 뒤 다른 메뉴로 이동할 때 확인창이 표시되고, 취소하면 설정 화면과 초안이 유지되는 것을 확인했습니다.
- 설정과 업무 도구함을 390×844 화면에서 확인했으며 페이지 전체 가로 넘침이 없었습니다.
- 채널 운영실의 `새 채널 등록` 단계가 입력 → YouTube 정보 확인 → Azure DB 저장을 구분해 안내하는지 확인했습니다.
- 운영의 오래 열린 탭에서 새 배포 전 지연 로딩 파일을 찾지 못해 설정 화면이 비는 오류를 확인했습니다.

### 보완

- 단일 채널 입력이 비어 있으면 `YouTube에서 확인`을 비활성화하고 입력이 필요한 이유를 표시합니다.
- 업무 도구의 `기본값으로 되돌리기`, `목록에 추가`, `변경사항 저장`에 화면 초안과 Azure DB 저장의 차이를 표시합니다.
- 오래 열린 탭의 화면 파일 로딩이 실패하면 빈 화면 대신 `최신 화면 다시 불러오기` 안내를 표시합니다.
- 개선 기록에 16개 현재 메뉴의 존재 이유, 데이터 경계, 실제 확인 수준을 표시하는 메뉴 역할표를 추가했습니다.
- `docs/CREATOR_OS_REGRESSION_CHECKLIST.md`에 배포마다 확인할 핵심 흐름과 별도 승인 쓰기 검수를 분리했습니다.

### 안전 범위

- 실제 Azure DB 저장, 채널 등록, YouTube 신규 수집은 실행하지 않았습니다.
- endpoint, DB schema, localStorage key와 기존 저장 계약은 변경하지 않았습니다.
- 중복 채널은 기존처럼 YouTube 미리보기 결과의 채널 ID로 저장 전에 차단합니다.

### 검증

- 관련 화면을 390×844에서 실제 클릭 검수했고 페이지 전체 가로 넘침이 없었습니다.
- 개선 기록에 관리 영역 5개와 메뉴 역할 16개가 표시되는 것을 확인했습니다.
- 전체 자동 테스트 249개 파일, 1,126개 테스트 통과
- 운영용 빌드와 `git diff --check` 통과

## 172. 2026-07-28 발견 링크 대본 연결과 채널 태그 역할 정리

### 목적

- 발견 링크를 제작 후보로 고른 뒤 대본 작업실에서 다시 원본을 찾는 단절을 없앱니다.
- 태그별 금고가 별도 저장 장소처럼 보이는 혼동을 없앱니다.
- 오늘의 레이더에서 소재 결정 후 제작 작업으로 바로 이어지게 합니다.

### 구현

- 제작 후보함의 발견 링크 카드에 `대본 작업 시작`을 추가했습니다.
- 발견 링크 후보를 대본 작업실과 업로드 캘린더의 원본으로 연결했습니다.
- 링크 대본은 기존 `videoUserRecords`와 `/video-records`를 재사용하며, 기존 발견 링크 ID를 안정적인 내부 작업 ID로 매핑합니다.
- `태그별 금고` 메뉴와 화면을 `채널 태그별 보기`로 변경하고 전체 수집 영상 목록으로 돌아가는 버튼을 추가했습니다.
- 오늘의 레이더 완료 단계에 `대본 작업 시작`을 추가했습니다.

### 안전 범위

- 새 Azure 자원, Cosmos container, endpoint, localStorage key를 추가하지 않았습니다.
- 발견 링크 자체는 기존 온라인 발견함(Azure DB)에 남고 별도 제작 DB로 복사하지 않습니다.
- 화면 이동만으로 저장, 외부 사이트 수집, YouTube API 호출을 실행하지 않습니다.
- 실제 Azure DB 쓰기 왕복은 운영 배포 후 테스트 기록 1건으로 검수하고 원상복구합니다.

### 현재 검증

- 관련 테스트 13개 파일, 73개 테스트 통과
- production build 통과
- 로컬에서 채널 태그별 보기 → 전체 수집 영상 목록 이동 확인
- 390×844에서 채널 태그별 보기의 페이지 전체 가로 넘침 없음
- 로컬 API는 운영 인증 경계 때문에 조회 실패 안내를 표시했으며, 운영 데이터 검수는 배포 후 로그인 세션에서 진행 예정

## 173. 2026-07-28 1~5번 운영 검수와 대본 입력 손실 수정

### 운영에서 확인한 결과

- 발견 링크 후보 1건이 제작 후보함 → 대본 작업실 → 업로드 캘린더에서 같은 원본 제목과 URL을 유지했습니다.
- 오늘의 레이더의 `대본 작업 시작`이 대본 작업실로 정상 이동했습니다.
- `채널 태그별 보기`가 별도 보관 장소가 아닌 수집 영상의 태그 필터로 안내되고, `전체 수집 영상`으로 정상 복귀했습니다.
- 기존 영상 후보의 빈 통합 메모에 검수 문구를 저장한 뒤 새로고침·재조회해 Azure DB 저장 유지를 확인했습니다.
- 검수 문구를 원래 빈 값으로 복원·저장하고 다시 새로고침·재조회해 흔적이 남지 않은 것을 확인했습니다.

### 발견하고 보완한 오류

- 대본 작업실에서 문자를 입력하면 같은 내용의 제작 기록 맵이 새 객체로 다시 전달되며 입력 중 초안을 즉시 초기화했습니다.
- 실제 Azure DB 내용이 달라졌을 때만 초안을 다시 동기화하도록 조건을 보강했습니다.
- 같은 내용의 새 객체에서는 입력 중 초안을 유지하는 회귀 테스트를 추가했습니다.

### 데이터·비용 안전 범위

- 기존 `videoUserRecords`와 `/video-records` 저장 계약을 그대로 사용했습니다.
- 새 Azure 자원, Cosmos DB container, endpoint, localStorage key를 추가하지 않았습니다.
- YouTube API 신규 수집은 실행하지 않았습니다.

### 검증

- 전체 자동 테스트 250개 파일, 1,134개 테스트 통과
- production build와 `git diff --check` 통과
- 프론트 PR #1013 병합 및 Azure Static Web Apps 배포 성공
- 운영 브라우저 오류·경고 로그 0건

## 174. 2026-07-28 일일 소재 결정 흐름과 업로드 일정 왕복 검수

### 일일 업무 흐름

- Jinxy 채널 1개를 오늘 볼 채널로 선택했습니다.
- 온라인 저장소(Azure DB)의 수집 영상 정보 102개를 불러오고 레이더 상위 후보 6개가 표시되는 것을 확인했습니다.
- 레이더 → 제작 후보함 → 대본 작업실로 같은 제작 후보가 이어졌습니다.
- 채널 선택과 수집 영상 정보 조회 과정에서 YouTube API 신규 수집은 실행하지 않았습니다.

### 상태 변경 안내

- 소재 보관함 해제는 원본 영상과 수집 영상 정보를 삭제하지 않는다고 안내합니다.
- `오늘 집중`, `제작 중으로`, `업로드 완료`는 Azure DB 판단 기록 변경이며 YouTube API를 호출하지 않는다고 안내합니다.
- 발견 링크의 `발견함으로 되돌리기`와 `후보 제외`는 링크 기록을 삭제하지 않고 상태만 변경한다고 안내합니다.

### 업로드 일정 저장 왕복

- 기존 제작 후보의 원래 업로드 예정일이 빈 값임을 확인했습니다.
- 검수 날짜 `2026-08-04`를 Azure DB에 저장하고 캘린더의 해당 날짜에 후보 1건이 표시되는 것을 확인했습니다.
- 새로고침 후에도 같은 날짜와 후보가 유지됐습니다.
- 업로드 예정일을 원래 빈 값으로 복원·저장·재조회했습니다.
- 최종 캘린더는 전체 일정 0건, 날짜 미정 2건으로 복원됐습니다.

### 안전 범위

- YouTube API 신규 수집 없음
- 새 Azure 자원, endpoint, Cosmos DB container, localStorage key 변경 없음
- 기존 `/video-records`와 `videoUserRecords` 저장 계약 유지

## 175. 2026-07-28 탐색 도구·최근 수집 연결·모바일 운영 검수

### 탐색 도구

- Jinxy 채널의 Azure DB 수집 영상 정보 102개를 사용했습니다.
- 또터또 탐색은 기준 충족 0개, 현재 표시 0개였으며 빈 결과의 `수집 영상 목록 화면 열기`로 102개 목록에 정상 복귀했습니다.
- 키워드 탐색의 추천어 `moments`를 누르자 검색 결과 50개, 일치 채널 1개, 평균 조회수 264.1만, 최고 대박 지수 6.1x가 표시됐습니다.
- `제작 후보로`와 `소재 보관`은 Azure DB 사용자 기록 변경, `댓글 Top 10(API)`는 YouTube API 호출임을 버튼 안내에서 구분했습니다.

### 최근 수집 후속 연결

- 최근 수집 상태에는 12개 채널이 모두 성공으로 표시됐습니다.
- Jinxy 카드의 `이 채널 관리`를 눌러 채널 운영실 1단계로 이동했습니다.
- Jinxy가 선택된 상태, 랭킹형 분류, 최근 수집 성공 정보가 도착 화면에서 유지됐습니다.
- 이 이동은 화면 선택과 위치만 바꾸며 Azure DB 저장이나 YouTube API 수집을 실행하지 않았습니다.

### 모바일

- 390×844 기준으로 채널 운영실, 최근 수집 상태, 키워드 탐색의 `moments` 50개 결과, 또터또 빈 결과를 확인했습니다.
- 네 화면 모두 문서 너비가 화면 너비를 넘지 않았고 모바일 전체 메뉴 이동이 정상 작동했습니다.

### 안전 범위

- Azure DB 저장·삭제 없음
- YouTube API 신규 수집·댓글 조회 없음
- 새 Azure 자원, endpoint, Cosmos DB container, localStorage key 변경 없음
- 기능 코드는 변경하지 않고 개선 기록과 인수인계 문서만 갱신

## 176. 2026-07-29 운영 후속 1~5번 검수와 새 영상 수집 안전 보완

### 운영 검수

- 최근 수집 상태에서 Jinxy 검색, 성공 + 과거 확인 완료 조합 필터, 채널 이름 정렬과 과거 예약 수집 12개 채널 상세를 확인했습니다.
- 채널 운영실의 `채널 관리`, `새 채널 등록`, `수집 영상 확인·새 영상 수집` 세 단계를 실제로 전환했습니다.
- Jinxy 수집 영상 정보 102개에서 제목 검색과 최신순 정렬, 제작 후보 버튼의 Azure DB 저장·YouTube API 미호출 안내를 확인했습니다.
- 제작 후보 1건이 대본 작업실과 업로드 캘린더를 왕복하며 같은 원본을 유지했습니다.
- 설정과 업무 도구함의 양방향 이동, Google 도구 검색, 390×844 가로 넘침 없음을 확인했습니다.

### 발견한 위험과 보완

- 채널을 선택하지 않은 상태에서도 `전체 운영중 채널 새 영상 수집 (12개)` 버튼이 활성화됐습니다.
- 실수로 전체 채널에 YouTube API 수집을 실행하지 않도록 `채널 선택 후 새 영상 수집` 비활성 버튼으로 바꿨습니다.
- 화면 우회 호출을 막기 위해 실제 수집 실행 함수도 선택 채널이 없으면 중단합니다.
- 명시적으로 고른 채널 중 운영중 채널만 기존 `/scan/selected` 흐름으로 수집합니다.
- 태그별 수집 버튼과 과거 수집 기능은 기존 동작을 유지합니다.

### 안전 범위

- 운영 검수 중 YouTube API 신규 수집·댓글 조회 없음
- Azure DB 저장·삭제 없음
- API endpoint, Cosmos DB container, localStorage key 변경 없음

## 179. 2026-07-29 일일 검수·필터·오류 복구·모바일 목록 후속

### 구현

- `npm run test:daily`로 경고 범위, 조회 복구, 필터·선택, 복사·선택 해제, 모바일 리스트의 핵심 계약을 한 번에 확인하도록 했습니다.
- 수집 영상 도구막대에 `화면 선택 N개`, `필터 N개 적용 중`, `필터 초기화`를 추가했습니다.
- 필터 초기화는 검색어·조회수·길이·또터또 조건만 기본값으로 되돌리고 영상 선택은 유지합니다.
- 일부 온라인 저장 기능 경고에 `영상 판단 기록 다시 확인`, `소재 보관함 다시 확인`을 분리했습니다.
- 두 다시 확인 버튼은 해당 Azure DB 조회만 재실행하며 저장·삭제 또는 YouTube API 호출을 실행하지 않습니다.
- 모바일 리스트는 넓은 표 대신 제목·조회수·대박 지수·게시일·소재 보관·제작 후보 핵심 작업을 간결하게 표시합니다.

### 배포 경고 결정

- `github_id_token` unsupported input은 과거 입력 제거 후 실제 main Azure 배포가 실패해 복구한 기록을 재확인했습니다.
- 이번 변경에서는 배포 성공을 우선해 입력을 유지하며, Azure 인증 방식 변경은 별도 결정으로 남깁니다.

### 안전 범위

- Azure DB 저장·삭제 없음
- YouTube API 신규 수집·댓글 조회 없음
- API endpoint, Cosmos DB container, localStorage key 변경 없음

## 180. 2026-07-29 추천 편의 작업 1~5번 일괄 보완

### 구현

- 영상 판단 기록과 소재 보관함의 Azure DB 읽기 재확인에 처리 중 표시와 중복 클릭 방지를 추가했습니다.
- 재확인 성공·실패를 기능별 버튼 가까이에 표시하고, 성공으로 경고가 사라진 뒤에도 완료 결과가 보이게 했습니다.
- 수집 영상 검색창에 검색어만 지우는 버튼을 추가했습니다. 영상 선택은 유지합니다.
- 모바일 간결 목록은 긴 제목을 3줄까지 표시하고 소재 보관·제작 후보 작업을 한 열 또는 두 열로 안정적으로 배치합니다.
- GitHub Build 워크플로에 `Daily read-only regression check` 작업을 추가해 `npm run test:daily`를 전체 테스트·빌드와 별도로 표시합니다.
- 최초 PR에서 브랜치 push와 pull_request가 같은 Build를 두 번 실행하는 것을 확인해, push 대상은 main으로 제한했습니다. 이후 PR 검사 1회와 병합 후 main 최종 검사 1회만 실행합니다.

### 로컬 실제 확인

- 온라인 저장소 연결이 실패한 로컬 화면에서 `영상 판단 기록 다시 확인`을 실제로 눌러 기능별 실패 결과가 버튼 가까이에 표시되는 것을 확인했습니다.
- 수집 영상 검색창에 `heatwave`를 입력한 뒤 검색어 지우기 버튼을 눌러 입력값이 빈 값으로 돌아오는 것을 확인했습니다.
- 390×844에서 문서 너비 375px, 스크롤 너비 375px로 페이지 전체 가로 넘침이 없었습니다.

### 자원·비용

- 기존 GitHub Free Actions 포함량을 사용합니다.
- 새 저장소, 유료 서비스, 비밀키, 배포 자원을 추가하지 않았습니다.

### 안전 범위

- Azure DB 저장·삭제 없음
- YouTube API 신규 수집·댓글 조회 없음
- API endpoint, Cosmos DB container, localStorage key 변경 없음

## 177. 2026-07-29 수집 영상 선택·모바일·레이더 후속 검수

### 운영 검수

- Jinxy 수집 영상 정보 103개에서 카드 보기와 리스트 보기를 전환했습니다.
- 리스트에서 영상 2개를 AI 요청문 대상으로 선택했고 선택 표시가 유지되는 것을 확인했습니다.
- 390×844 카드 보기에서 긴 제목과 제작 후보 버튼이 화면 안에 표시됐습니다.
- 리스트 보기는 넓은 표를 표 영역 안에서 가로 스크롤하며 페이지 전체 너비는 넘지 않았습니다.
- 최근 수집 상태의 실패 0건 필터에는 `검색·필터 초기화`가 표시됐습니다.
- 과거 예약 수집의 부분 성공 2건을 펼쳐 현재 영향과 과거 영상 수집 다음 행동을 확인하고, 쪼꼬미필름이 선택된 채널 운영실로 이동했습니다.
- 오늘의 레이더의 기존 제작 후보 `Ranking The Funniest Same Energy Moments`가 제작 후보함의 같은 영상으로 이어졌습니다.

### 발견한 오류와 보완

- 영상 2개의 선택 버튼은 바뀌지만 `AI 요청문 복사` 작업 막대가 나타나지 않았습니다.
- 실제 상태는 영상 ID 문자열 배열인데 선택 개수 계산에서 영상 객체만 인정해 0개로 처리한 것이 원인이었습니다.
- 선택 영상 ID 문자열 수를 계산하도록 수정하고 실제 사용 형태를 고정하는 단위 테스트를 추가했습니다.

### 남은 항목과 안전 범위

- 개선 기록 44개 중 42개는 확인 완료입니다.
- 남은 2개는 개인용 MVP 이후의 `대본 수정 이력·이전 버전 비교`, `후킹·구조 분석과 대본 초안 AI 보조`입니다.
- Azure DB 저장·삭제 없음
- YouTube API 신규 수집·댓글 조회 없음
- API endpoint, Cosmos DB container, localStorage key 변경 없음

## 178. 2026-07-29 후속 1~5번 편의·효율 보완

### 확인 결과

- 현재 운영 화면에서는 온라인 저장 경고가 사라진 정상 상태를 확인했습니다.
- 이전 검수처럼 소재 보관함만 임시 기록인 경우에도 전체 Azure DB가 실패한 것처럼 보이지 않도록 경고 제목과 설명 범위를 좁혔습니다.
- 영상 2개의 `AI 요청문 복사`를 실제 실행했고 복사 완료 안내와 505자 클립보드 내용을 확인했습니다.
- 검색어 `heatwave`로 선택 영상이 화면에서 숨겨져도 2개 선택은 유지됐고, 오늘의 레이더 왕복 후에도 검색·선택 상태가 유지됐습니다.
- 새 채널 범위의 수집 영상 목록 조회 전에는 기존 선택을 초기화하는 코드·자동 테스트를 확인했습니다.
- 390×844 카드 보기와 선택 작업 막대는 화면 안에 표시됐습니다.
- 모바일 리스트 표는 1,364px 너비를 307px 표 영역 안에서 좌우 스크롤하며 문서 전체 너비는 375px로 유지됐습니다.

### 보완

- 공통 경고를 `일부 온라인 저장 기능 확인 필요`로 바꾸고, 경고에 표시된 기능만 영향을 받는다고 안내했습니다.
- 선택 작업 막대에 `선택 해제`를 추가하고 검색·정렬·화면 이동 시 유지, 새 수집 영상 목록 조회 시 초기화 기준을 표시했습니다.
- 선택 작업 막대를 모바일에서 세로로 배치해 버튼이 눌리기 쉽게 했습니다.
- 모바일 리스트 상단에 카드 보기 권장과 표 내부 좌우 스크롤 안내를 추가했습니다.
- 저장·삭제와 YouTube 신규 수집 없이 실행하는 `매일 3분 확인 순서`를 회귀 검수표에 추가했습니다.

### 안전 범위

- Azure DB 저장·삭제 없음
- YouTube API 신규 수집·댓글 조회 없음
- API endpoint, Cosmos DB container, localStorage key 변경 없음

## 181. 2026-07-29 Azure DB 저장 왕복·Jinxy 신규 수집 1회 실제 검수

### Azure DB 제작 기록 왕복

- 기존 제작 후보 `Ranking The Funniest Same Energy Moments`의 원래 통합 작업 메모가 빈 값임을 먼저 확인했습니다.
- `Azure DB 왕복 검수 2026-07-29`를 입력해 저장 완료 안내를 확인했습니다.
- 앱 전체를 새로고침하고 대본 작업실에 다시 들어가 같은 문구가 재조회되는 것을 확인했습니다.
- 메모를 다시 빈 값으로 복원·저장하고 전체 새로고침 뒤 검수 문구가 남지 않은 것을 확인했습니다.

### YouTube 신규 수집 1회

- 오늘 볼 채널에서 Jinxy 1개만 명시적으로 선택했습니다.
- 수집 전 Azure DB의 Jinxy 수집 영상 정보는 103개였습니다.
- `선택 채널 새 영상 수집 (1/1개)`를 한 번만 실행했습니다.
- 최근 수집 상태의 Jinxy 결과는 성공, 새 영상 0개, 통계 갱신 89개, 2026-07-29 오전 6:00이었습니다.
- 과거 수집 이력에도 선택 채널 수집 1개 채널, 성공 1·부분 0·실패 0, 새 영상 0개·통계 갱신 89개로 기록됐습니다.
- 전체 새로고침 뒤 최근 수집 상태에서 같은 결과를 다시 확인해 Azure DB 반영을 검증했습니다.
- 새 영상이 없어 수집 영상 정보 수는 103개로 유지됐고 기존 영상의 조회 통계는 갱신됐습니다.

### 발견한 후속 UX

- 수집 실행 화면에서는 완료 직후 채널명·신규 수·통계 갱신 수가 버튼 가까이에 충분히 강조되지 않았습니다.
- 다음 작은 작업은 완료 안내에 이번 실행 결과와 `최근 수집 상태에서 자세히 보기`를 명확히 연결하는 것입니다.

### 안전 범위

- YouTube 신규 수집은 Jinxy 1개 채널, 1회만 실행
- 반복 수집·댓글 API 호출 없음
- 새 Azure 자원, endpoint, Cosmos DB container, localStorage key 변경 없음
- 검수용 제작 메모와 화면 채널 선택은 원래 상태로 복구

## 182. 2026-07-29 새 영상 수집 완료 결과·다음 행동 보강

### 원인

- 수집 완료 문구를 설정한 직후 채널 정보와 Azure DB 수집 영상 목록을 다시 불러옵니다.
- 이 재조회 진행·완료 문구가 앞선 수집 완료 문구를 덮어 사용자가 신규 영상 수와 결과 위치를 놓칠 수 있었습니다.

### 구현

- 수집 실행 함수가 성공 여부, 원시 채널 결과와 사용자용 완료 요약을 호출 화면에 반환합니다.
- 완료 요약은 대상 채널명, 신규 영상 수, 기존 영상 통계 갱신 수와 또터또 후보 수를 표시합니다.
- 결과 카드는 새 영상 수집 버튼 바로 아래에 유지됩니다.
- `최근 수집 상태에서 자세히 보기`는 오퍼레이션 관제의 최근 수집 상태로 이동하며 YouTube API를 다시 호출하지 않습니다.
- 모바일에서는 결과 이동 버튼을 전체 너비로 표시하고 `sm` 이상에서는 내용 너비로 표시합니다.
- 화면 상태 갱신 전의 빠른 연속 클릭도 별도 요청 잠금 값으로 차단합니다.

### 자동 검수

- 수집 결과의 신규 영상·통계 갱신·또터또 후보 합계
- Jinxy 단일 채널 수집 성공 결과 반환
- 완료 카드의 채널명·수치·Azure DB 반영 문구·최근 수집 상태 이동 안내
- `npm run test:daily`에 위 검사를 포함

### 안전 범위

- 실제 YouTube API 신규 수집·댓글 조회 없음
- API endpoint, 요청 body, Azure DB schema·container, localStorage key 변경 없음
- 다음 실제 수집이 필요한 날 운영 완료 카드와 결과 화면 이동을 1개 채널로 재확인

## 183. 2026-07-29 수집 완료 카드·최근 수집 상태 운영 검수

### 실제 실행

- 오늘 볼 채널에서 Jinxy 1개만 명시적으로 선택했습니다.
- YouTube API를 호출하지 않는 Azure DB 목록 조회로 수집 전 영상 정보 103개를 확인했습니다.
- `선택 채널 새 영상 수집 (1/1개)`를 한 번만 실행했고, 진행 중 버튼 잠금과 `새 영상 수집 중...` 안내를 확인했습니다.
- 완료 카드는 Jinxy, 신규 영상 1개, 통계 갱신 90개와 Azure DB 목록 재조회 완료를 표시했습니다.
- 재조회된 수집 영상 정보는 104개였습니다.

### 결과 이동·저장 유지

- `최근 수집 상태에서 자세히 보기`를 눌러 API 재호출 없이 결과 화면으로 이동했습니다.
- 최근 수집 상태에서 Jinxy `방금 전`, 2026-07-29 오후 2:18, 새 영상 1개·통계 갱신 90개를 확인했습니다.
- 과거 실행에도 선택 채널 수집 1개 채널, 성공 1·부분 0·실패 0으로 기록됐습니다.
- 전체 새로고침 뒤에도 같은 시각과 결과가 Azure DB에서 다시 조회됐습니다.
- 새로고침 뒤 임시 채널 선택은 0개로 초기화됐습니다.

### 안전 범위

- YouTube 신규 수집은 Jinxy 1개 채널, 1회만 실행
- 반복 수집·댓글 API 호출 없음
- 새 Azure 자원, API endpoint, Cosmos DB container, localStorage key 변경 없음
- 개선 기록의 `수집 실행 화면 결과 안내` 체크포인트를 확인 완료로 갱신

## 184. 2026-07-31 읽기 전용 GitHub 검사 이름·검수표 정리

### 확인 결과

- `main`과 운영 배포는 `a1f36de`로 일치하며 작업 트리는 깨끗했습니다.
- `npm run test:daily`는 10개 파일, 48개 테스트가 모두 통과했습니다.
- GitHub Build의 읽기 전용 검사는 PR과 `main` push에서 실행되고 매일 예약 실행되는 작업은 아니었습니다.
- 수집 완료 안내는 2026-07-29 실제 Jinxy 단일 채널 수집에서 이미 운영 확인을 마쳤지만 회귀 검수표에는 `다음 실제 수집 때 운영 확인` 문구가 남아 있었습니다.

### 정리

- GitHub 작업명을 실제 실행 조건에 맞게 `Core read-only regression check`로 변경했습니다.
- 개선 기록과 관련 문서에서 이 검사가 PR과 `main` 반영 때 실행된다는 점을 명확히 했습니다.
- 매일 확인이 필요할 때는 사용자가 `npm run test:daily`를 직접 실행하는 기준을 유지했습니다.
- 수집 완료 안내의 회귀 검수표 상태를 `운영 확인 완료 (2026-07-29)`로 갱신했습니다.

### 안전 범위

- 새 예약 실행과 추가 GitHub Actions 사용량 없음
- Azure DB 조회·저장, YouTube API 호출 없음
- 앱 기능, API endpoint, DB schema, localStorage key 변경 없음

## 185. 2026-08-01 레이더 전체 작업 기록 삭제 보호

### 확인한 문제

- `판단 초기화`는 오늘의 판단만 지우는 버튼처럼 보였지만, 실제로는 `video_user_record` 문서 전체를 삭제하여 제작 후보, 대본, 업로드 일정까지 영향을 줄 수 있었습니다.
- 레이더 상단과 후보 처리 완료 화면의 두 곳에 같은 위험 경로가 있었습니다.

### 보완

- 두 화면에서 전체 초기화 버튼을 노출하지 않도록 공통 안전 정책을 적용했습니다.
- 방어적 확인 문구도 `판단 기록`이 아닌 `영상별 전체 작업 기록`을 삭제한다는 실제 범위로 바꾸었습니다.
- 개별 `레이더로 되돌리기`는 유지했습니다.

### 안전 범위

- Azure DB 쓰기·삭제, YouTube API 호출 없음
- API endpoint, DB schema, localStorage key 변경 없음
- 후속으로 선택적 판단 초기화가 필요한지 결정하고, 필요할 때만 별도 저장 계약을 설계

## 186. 2026-08-01 소재 보관·제작 후보 원본 독립

### 확인한 문제

- 제작 후보 상태는 `video_user_record`에 저장되지만 후보 카드의 제목·썸네일은 소재 보관 문서를 사용했습니다.
- 따라서 제작 후보인 영상을 소재 보관함에서 해제하면 후보 상태가 남아도 후보함·대본 작업실·업로드 캘린더에서 원본을 찾지 못할 수 있었습니다.
- `제작 후보로`는 소재 보관 저장과 후보 상태 저장을 순서대로 실행해 두 기능이 같은 기능처럼 묶여 있었습니다.

### 보완

- 기존 소재 보관 문서에 `material`과 `production` 용도를 구분했습니다.
- 제작 후보 지정 시 제작 원본을 먼저 확보하고, 성공한 경우에만 후보 상태를 저장합니다.
- 소재 보관 해제는 모든 화면에서 현재 제작 상태를 확인하고, 제작 중인 항목이면 문서를 삭제하지 않고 소재 보관 용도만 해제합니다.
- 제작 후보 원본은 후보함, 대본 작업실, 업로드 캘린더와 홈 제작 지표에 계속 전달합니다.
- 기존 용도 필드 없는 문서는 소재 보관용으로 호환합니다.

### 검수·안전 범위

- 부분 실패, 제작 전용 원본, 소재 보관 해제 후 제작 연결 유지 자동 테스트 추가
- Azure DB 실제 저장·삭제와 YouTube API 호출 없음
- 새 endpoint, container, localStorage key 없음
- 기존 `/scrapbook` 문서에 선택적 용도 배열만 추가

## 187. 2026-08-01 소재·제작 원본 최신 표시 정보 병합

### 확인한 문제

- 소재 보관 문서가 보관 시점의 영상 정보 복사본을 유지해, 현재 수집 목록에 더 최신 제목·조회수·채널명이 있어도 소재·제작 화면에는 과거 값이 보일 수 있었습니다.

### 보완

- 현재 불러온 수집 영상과 소재·제작 원본을 `videoId`로 대조해 표시 정보만 우선 반영합니다.
- 수집 목록에 없는 보관 항목은 기존 스냅샷을 그대로 유지합니다.
- 소재 보관 용도, 최초 보관 시각, 스크랩 문서 ID는 현재 수집 정보로 덮어쓰지 않습니다.
- 제작 연결된 소재를 해제할 때는 화면에 반영된 최신 표시 정보를 제작 원본에 함께 유지합니다.

### 검수·안전 범위

- 일치 항목 병합, 불일치 항목 보존, 보호 필드, 빈 최신 값 무시, 제작 원본 연결 테스트 추가
- Azure DB 실제 저장·삭제, localStorage 쓰기, YouTube API 호출 없음
- 새 endpoint, container, localStorage key, 유료 자원 없음

## 188. 2026-08-01 제작 기록 전체 덮어쓰기 방지

### 확인한 문제

- 프론트가 한 필드 변경에도 해당 영상의 전체 작업 기록을 전송했습니다.
- 백엔드의 일부 기존 필드는 요청에 없으면 빈 값으로 저장될 수 있어, 대본·일정·상태 저장이 서로를 되돌릴 위험이 있었습니다.

### 보완 순서

- `yt-analyzer-functions` PR #20으로 누락 필드 보존 계약을 먼저 배포했습니다.
- 백엔드 배포 성공 후 프론트의 저장 요청을 변경 필드 중심으로 축소했습니다.
- 상태 변경은 `status`·`statusIds`와 해당 부가 변경만, 대본·메모·일정 저장은 사용자가 바꾼 필드만 전송합니다.
- 실패하면 화면은 기존 기록으로 되돌리고 localStorage를 성공으로 갱신하지 않는 기존 복구 절차를 유지합니다.

### 검수·안전 범위

- 백엔드 누락 필드 보존·명시적 빈 값 삭제 호환 테스트 통과
- 프론트 부분 요청·상태 변경·실패 복구 테스트 추가
- Azure Functions 기존 배포 성공. 새 자원·endpoint·container·YouTube API 호출 없음
- Azure DB 실데이터 쓰기·삭제는 실행하지 않음

## 189. 2026-08-01 과거 제작 상태의 레이더 재노출 차단

### 확인한 문제

- 제작 후보·제작 중·업로드 완료는 오늘의 레이더에서 숨겼지만, 기존 호환 상태인 검토 중·제작 결정·보류는 다시 오늘 후보로 나타날 수 있었습니다.
- 세 상태는 제작 후보함에서 제작 후보 그룹으로 계속 표시되고 있으므로 레이더 재노출은 화면 역할과 맞지 않았습니다.

### 보완

- 모든 제작 상태를 공통 제작 상태 목록 기준으로 레이더에서 숨기도록 통일했습니다.
- 완료 안내에서 제작 진행 영상은 제작 후보함에서 계속 찾을 수 있다고 명시했습니다.
- 모든 제작 상태 제외와 명시적 레이더 복귀 시 제작 상태 제거를 자동 테스트로 고정하고 `npm run test:daily`에 포함했습니다.
- `functionApi.js`와 라우팅 관문은 중복 구현이 아닌 기존 import·화면 연결 호환용임을 확인해 삭제하지 않고 역할 주석만 보강했습니다.

### 배포 경고·안전 범위

- 프론트 Build action은 현재 버전으로 유지합니다.
- `github_id_token`은 과거 제거 시 운영 배포 실패 이력이 있으므로 비차단 경고로 유지합니다.
- Azure DB 쓰기·삭제, localStorage 쓰기, YouTube API 호출 없음
- API endpoint, DB schema, 저장값 마이그레이션 없음

## 190. 2026-08-02 제작 후보 부분 실패 원상복구

### 확인한 문제

- 제작 원본을 `/scrapbook`에 먼저 저장한 뒤 `/video-records`의 제작 후보 상태 저장만 실패하면, 제작 상태도 없고 소재 보관함에도 표시되지 않는 `production` 전용 원본이 남을 수 있었습니다.

### 보완

- 제작 원본 준비 결과에 이번 작업이 새 문서를 만들었는지를 함께 전달합니다.
- 후보 상태 저장이 실패했을 때 새로 만든 `production` 전용 원본만 기존 삭제 API로 원상복구합니다.
- 삭제 직전 현재 브라우저의 원본 용도를 다시 확인해 `material`이 있거나 제작 전용이 아니면 삭제하지 않습니다.
- 정리 실패 시 온라인 저장소 재확인 경고를 표시하고 임시 목록을 그대로 유지합니다.

### 검수·안전 범위

- 새 제작 전용 원본 정리, 기존 소재 보호, 정리 실패 경고 자동 테스트 추가
- 기존 Azure Functions·Cosmos DB·endpoint 사용, 새 자원·container·localStorage key 없음
- 운영 Azure DB 실제 저장·삭제와 YouTube API 호출 없음
- 다중 브라우저에서 같은 영상을 동시에 바꾸는 경우의 서버 조건부 삭제는 후속 결정 항목

## 191. 2026-08-02 백엔드 PR 검수와 main 배포 분리

### 확인한 문제

- 백엔드 workflow는 `main` 반영 뒤 테스트와 배포를 함께 실행해 Pull Request에서 오류를 미리 차단하지 못했습니다.
- 오래된 checkout·setup-node Action은 GitHub의 Node 20 사용 중단 경고를 발생시켰고 `npm install`은 잠금 파일과 다른 의존성 조합을 허용할 수 있었습니다.

### 보완

- Pull Request에서도 Node.js 24, `npm ci`, 전체 단위 테스트를 실행합니다.
- Pull Request에서는 zip 패키징, artifact 업로드, Azure 로그인, Function App 배포를 모두 건너뜁니다.
- `main` 반영과 수동 실행에서만 기존 배포 절차를 유지합니다.
- checkout v7, setup-node v7, upload-artifact v7, download-artifact v8, Azure login v3 기준으로 갱신했습니다.

### 실제 검수

- 백엔드 PR #21: build 성공, package·artifact·deploy 건너뜀
- 병합 커밋 `ff61533`: build·package·Azure Function 배포 성공
- Node 20·punycode Action 경고 제거 확인
- Azure Functions test mode 안내는 예상 단위 테스트 메시지로 유지
- 최신 download-artifact 내부 `Buffer()` 경고 1건은 배포 성공과 분리한 비차단 상위 도구 경고
- 새 Azure 자원·비밀키·API·DB·YouTube 수집 조건 변경 없음

## 192. 2026-08-02 프론트 CI Node.js 실행 환경 일치

### 확인한 문제

- GitHub의 프론트 읽기 전용·전체 검사는 Node.js 20을 사용했습니다.
- 같은 소스를 실제 배포하는 Azure Static Web Apps Oryx 빌드는 로그 기준 Node.js 22.22.0을 사용했습니다.

### 보완

- 두 프론트 검사 job을 Node.js 22로 통일했습니다.
- `actions/setup-node`를 현재 주버전 v7로 갱신했습니다.
- 실제 배포 환경과 가까운 Node 계열에서 PR·main 회귀 검사를 수행합니다.

### 안전 범위

- 앱 코드·의존성·API·Azure DB·YouTube API 호출 조건 변경 없음
- Azure Static Web Apps 인증·배포 workflow 변경 없음
- 기존 GitHub Actions 포함량 사용, 새 자원·비밀키 없음

## 193. 2026-08-02 제작 후보 원본 전달 경로 복구

### 확인한 문제

- 운영 화면에서 같은 Jinxy 제작 후보가 소재 보관함·대본 작업실·업로드 캘린더에는 이어졌지만 제작 후보함은 영상 0개·링크 1개로 표시됐습니다.
- 제작 원본 목록이 `getLegacyMainPanelProps`와 `getLegacyWorkspaceMainPanelViewProps` 두 조립 관문에서 각각 다음 단계로 전달되지 않았습니다.

### 보완

- PR #1035에서 작업 화면 조립 관문이 `productionSourceVideos`를 제작 후보함 속성으로 전달하도록 복구했습니다.
- PR #1036에서 상위 라우팅 관문도 같은 속성을 작업 화면 조립 관문으로 전달하도록 복구했습니다.
- 각 관문의 전용 테스트에 원본 목록 보존 조건을 추가했습니다.

### 검수와 안전 범위

- 관련 테스트 30개, 일일 회귀 테스트 156개, 전체 테스트 1,172개와 production build 통과
- 두 PR의 GitHub 검사와 병합 후 Azure Static Web Apps 배포 성공
- 운영 제작 후보함에서 영상 1개·링크 1개·작업 항목 2개와 Jinxy 원본 제목 표시 확인
- API endpoint, Azure DB, localStorage, YouTube API 호출 조건 변경 없음
- 운영 Azure DB 쓰기·삭제와 YouTube 신규 수집 실행 없음

## 194. 2026-08-02 발견 링크함 역할 명확화

### 확인한 문제

- 메뉴·화면 제목은 `발견 링크 저장`이지만 실제 화면은 저장, 검색, 필터, 수정, 검토 상태와 권리 상태 관리를 모두 수행했습니다.
- 운영 Azure DB에 `Codex 임시 흐름 검증 2026-07-20` 링크가 제작 후보 상태로 남아 있었습니다.

### 보완

- 전체 작업 공간의 이름은 `발견 링크함`으로 변경합니다.
- 실제 동작인 `수동 링크 저장` 영역과 `링크 저장` 버튼 이름은 유지합니다.
- 제작 후보함의 돌아가기와 빈 상태 안내도 같은 작업 공간 이름을 사용합니다.

### 안전 범위와 결정 사항

- 화면 이름과 설명만 변경하며 API·Azure DB·localStorage·YouTube API 계약 변경 없음
- 운영 저장·삭제·신규 수집 실행 없음
- 임시 검증 링크 삭제는 사용자 결정 전까지 보류

## 195. 2026-08-02 YouTube 키워드 영상 찾기 1차 구현

### 변경

- `키워드 탐색` 안에 Azure DB 수집 영상 검색과 YouTube 신규 영상 검색 탭을 분리
- 수동 `GET /api/youtube-search`에서 검색 결과·영상 통계·채널 통계를 결합
- 국가·언어·기간·길이·최소 조회수·정렬·다음 결과 지원
- 임시 결과 다중 선택과 `발견 링크함에 담기` 연결
- 이미 발견 링크함에 있는 YouTube 영상은 저장됨으로 표시하고 다시 선택하지 못하게 함

### 데이터·비용 경계

- 검색어 입력이나 조건 변경만으로 YouTube API 호출 없음
- 검색과 다음 결과 버튼을 누를 때만 YouTube API 사용
- 결과 전체 자동 저장 없음, 선택한 영상만 기존 발견 링크 문서로 저장
- 영상 파일 저장 없음
- 새 Azure 자원·Cosmos DB container·유료 서비스·자동 반복 검색 없음

### 검수

- 백엔드 전체 테스트와 PR #22 main 배포 성공
- 프런트 전체 테스트 1,177개와 production build 성공
- 데스크톱과 390×844 로컬 화면에서 탭 전환·버튼 활성화·가로 넘침 없음 확인
- 로컬 화면에서는 실제 YouTube 검색과 Azure DB 저장을 실행하지 않음
- 프런트 배포 후 운영 검색 1회·결과 표시·선택 1건 저장·재조회·원상복구 예정

## 196. 2026-08-02 YouTube 키워드 찾기 운영 검수와 이동 수정

### 운영 검수

- `바이브 코딩` 검색을 한 번 실행해 최근 30일 기준 25개 결과가 표시되는 것을 확인했습니다.
- 결과 카드에서 영상 제목·채널·게시일·길이·조회수·구독자와 앱 계산 추정 지표가 표시됐습니다.
- 선택한 영상 1건만 발견 링크함에 저장되고 같은 제목·URL·YouTube 영상 ID로 Azure DB에서 재조회되는 것을 확인했습니다.
- 검수용 링크만 삭제한 뒤 같은 영상 ID의 잔여 기록 0건과 기존 `Codex 임시 흐름 검증 2026-07-20` 링크 보존을 확인했습니다.

### 운영에서 발견하고 수정한 오류

- 검색 결과의 `발견 링크함 열기`가 실제 발견 링크함 대신 오늘의 레이더로 이동했습니다.
- 원인은 존재하지 않는 내부 메뉴 ID `discovery-links`를 전달한 것이며 실제 메뉴 ID `vault-sources`로 수정했습니다.
- PR #1041에서 회귀 테스트 3개, production build, GitHub 검사와 Azure Static Web Apps 배포를 완료했습니다.

### 다음 단계

- 영상 검색 1차 흐름은 완료 상태로 유지하고 다음 작은 기능은 키워드 기반 채널 검색·비교·기존 채널 등록 연결입니다.
- 실제 조회 증가 추세는 현재 시점 통계만으로 판단하지 않고 시간별 통계 기록을 별도 단계로 보류합니다.

## 197. 2026-08-03 YouTube 키워드 채널 찾기·비교 1차 구현

### 변경

- `YouTube에서 새로 찾기` 안에 `영상 찾기`와 `채널 찾기·비교`를 분리했습니다.
- 수동 `GET /api/youtube-channel-search`가 키워드 채널 검색과 채널 상세 통계를 결합합니다.
- 결과에서 구독자·전체 영상 수·누적 조회수·영상당 누적 평균을 표시하고 최대 4개를 비교합니다.
- 이미 Azure DB 채널 목록에 있는 채널은 `등록됨`으로 표시합니다.
- `등록 검토하기`는 채널 운영실의 단일 등록 입력칸에 채널 주소를 채우고 등록 단계로 이동합니다.

### 데이터·비용 경계

- 키워드 입력, 조건 변경, 영상·채널 탭 전환만으로 YouTube API를 호출하지 않습니다.
- 채널 검색과 다음 채널 버튼을 누를 때만 YouTube API를 사용합니다.
- 검색 결과는 임시이며 자동 등록·Azure DB 저장·localStorage 저장이 없습니다.
- 등록 화면 이동도 API 호출과 저장이 없고, 기존 `YouTube에서 확인`과 `채널 저장`은 별도 사용자 실행으로 유지합니다.
- 수치는 현재 누적 통계의 스냅샷이며 최근 성장률·실시간 추세가 아닙니다.
- 기존 Azure 자원을 재사용하며 새 자원·container·유료 서비스·자동 반복 검색은 없습니다.

### 검수

- 백엔드 전체 테스트 통과
- 프런트 전체 테스트 260개 파일·1,180개와 production build 통과
- 로컬 데스크톱에서 수집 영상/YouTube, 영상/채널 탭 전환과 검색 버튼 활성화 확인
- 390×844에서 가로 넘침 없음 확인
- 로컬 검수에서는 실제 YouTube 검색·채널 등록·Azure DB 저장을 실행하지 않음
- 운영 검색 1회·결과·비교·등록 입력 전달 검수는 배포 후 진행

## 198. 2026-08-03 YouTube 키워드 채널 찾기 운영 검수

- 백엔드 PR #23의 검사와 기존 Azure Function App 배포가 성공했습니다.
- 프런트 PR #1043의 읽기 전용 검사·전체 검사와 Azure Static Web Apps 배포가 성공했습니다.
- 운영에서 `바이브 코딩` 채널 검색을 정확히 한 번 실행해 12개 결과를 확인했습니다.
- 결과 카드의 현재 구독자·영상 수·누적 조회수·영상당 평균과 최근 성장률이 아니라는 설명을 확인했습니다.
- `코딩알려주는누나`를 비교 목록에 넣어 `비교 중 1개 채널`을 확인했습니다.
- `등록 검토하기`가 채널 운영실 2단계와 정확한 채널 URL 입력으로 이어지는 것을 확인했습니다.
- `YouTube에서 확인`, 채널 저장, Azure DB 쓰기, 새 영상 수집은 실행하지 않았습니다.
- 운영 등록 채널 수는 검수 전후 12개로 유지됐고 브라우저 콘솔 오류는 없었습니다.

다음 작업은 같은 검색 결과를 새 YouTube API 호출 없이 화면에서 정렬하는 기능입니다. 검색 결과 채널을 등록과 별도로 Cloud 후보 목록에 보관하는 기능은 새 저장 계약이 필요하므로 사용자 결정 항목으로 분리합니다.

## 199. 2026-08-03 영상 검색에서 중요 채널 등록 연결

### 확인한 누락

- 키워드 채널 검색 결과는 기존 채널 등록 검토로 이어졌습니다.
- 키워드 영상 검색 결과는 영상 발견 링크 저장만 가능했고, 좋은 영상을 발견해도 출처 채널을 바로 등록 검토할 수 없었습니다.

### 보완

- 영상 결과 카드에 `이 채널 등록 검토`를 추가했습니다.
- 버튼은 영상의 `channelId`로 정확한 YouTube 채널 URL을 만들어 기존 채널 운영실 2단계 입력에 전달합니다.
- 현재 Azure DB 채널 목록에 있는 채널은 `등록 채널`로 표시하고 중복 등록 검토 버튼을 비활성화합니다.
- 영상 선택·발견 링크 저장과 채널 등록 검토는 독립된 작업으로 유지합니다.

### 데이터·비용 경계

- 영상 검색 자체의 기존 명시적 YouTube API 호출 조건은 바뀌지 않습니다.
- 채널 등록 검토 버튼은 화면 이동과 입력 준비만 하며 YouTube API와 Azure DB를 사용하지 않습니다.
- 실제 채널 정보 확인과 Azure DB 저장은 채널 운영실의 기존 버튼을 사용자가 별도로 눌렀을 때만 실행됩니다.
- 새 endpoint·Azure 자원·DB 문서·localStorage key·자동 등록은 없습니다.

## 200. 2026-08-03 영상·채널 검색 결과의 화면 이동 유지

### 운영에서 확인한 문제

- `바이브 코딩` 영상 검색 1회로 25개 결과를 확인했습니다.
- 첫 결과 `투쏠ㅣAI 에이전트`의 `이 채널 등록 검토`가 채널 운영실 2단계와 `https://www.youtube.com/channel/UC8LQNQfoWmTyafVAzua_LCQ` 입력으로 정확히 이어졌습니다.
- `YouTube에서 확인`과 채널 저장을 실행하지 않아 등록 채널 수는 12개 그대로였습니다.
- 채널 운영실에서 키워드 탐색으로 돌아오면 임시 결과와 검색어가 사라져 같은 YouTube API 검색을 다시 해야 했습니다.

### 보완

- 영상 검색의 조건·결과·선택·다음 페이지 정보와 채널 검색의 조건·결과·비교 선택을 상위 `CreatorAppRoutes`의 앱 메모리에 유지합니다.
- 수집 영상/YouTube와 영상/채널 탭 위치도 함께 유지해, 등록 검토 뒤 키워드 탐색으로 돌아오면 이전 결과를 바로 이어서 봅니다.
- 임시 상태는 Azure DB·localStorage·sessionStorage에 저장하지 않고 브라우저 새로고침 때 초기화합니다.
- 화면 복귀만으로 YouTube API를 다시 호출하지 않습니다.

### 구현 검수

- 관련 컴포넌트 테스트 4개 파일·13개 통과
- 복귀 세션으로 전달된 영상 결과를 API 호출 없이 다시 렌더링하는 회귀 테스트 추가
- 전체 260개 파일·1,182개 테스트와 production build 통과

### 배포 후 운영 재검수

- PR #1046의 검사와 Azure Static Web Apps 배포가 성공했습니다.
- 최신 운영 화면에서 `바이브 코딩` 영상 검색을 한 번 실행해 25개 결과와 `이 채널 등록 검토` 25개를 확인했습니다.
- `투쏠ㅣAI 에이전트`의 등록 검토가 채널 운영실 2단계와 정확한 채널 URL로 이어졌습니다.
- 키워드 탐색으로 돌아오자 별도 탭 전환이나 검색 버튼 재실행 없이 YouTube 소스·영상 찾기·검색어·25개 결과·첫 영상 카드가 그대로 복원됐습니다.
- 채널 정보 확인, 채널 저장, 발견 링크 저장과 Azure DB 쓰기는 실행하지 않았고 등록 채널 수는 12개로 유지됐습니다.

## 201. 2026-08-03 검색 지역·우선 언어 의미와 적용 조건 표시

### 확인한 문제

- 운영에서 `copilot`, 대한민국, 최근 30일로 검색한 결과에 일본어·영어 영상이 함께 표시됐습니다.
- 프론트와 백엔드는 `regionCode=KR`을 YouTube API까지 정상 전달하고 있었습니다.
- 원인은 요청 누락이 아니라 `국가`가 제작 국가 제한처럼 보이고 `언어`가 엄격한 언어 제한처럼 보이는 화면 표현이었습니다.
- 당시 언어 선택값은 `언어 전체`였습니다.

### 보완

- `국가`를 `검색 지역`, `언어`를 `우선 언어`로 바꿨습니다.
- 검색 지역은 해당 국가에서 시청 가능한 결과이고, 우선 언어는 다른 언어를 완전히 제외하지 않는다는 설명을 영상·채널 검색에 표시합니다.
- 검색 지역은 기존 3개에서 11개, 우선 언어는 기존 3개에서 10개로 확장했습니다.
- 마지막 검색 성공 시 조건을 별도로 보존해, 사용자가 선택값을 바꿔도 재검색 전 기존 결과의 적용 조건 설명은 그대로 유지합니다.

### 데이터·비용 경계

- 기존 `regionCode`와 `relevanceLanguage` API 계약을 그대로 사용합니다.
- 조건 변경만으로 YouTube API를 호출하지 않으며 검색 버튼의 명시적 실행 원칙을 유지합니다.
- Azure DB, localStorage, endpoint, 저장 문서와 신규 자원은 변경하지 않았습니다.

### 검수

- 관련 단위·컴포넌트 테스트 8개 통과
- 전체 260개 테스트 파일·1,183개 테스트 통과
- production build 통과
- 로컬 데스크톱과 390×844에서 주요 지역·언어 선택지, 설명, 대한민국·한국어 우선 선택과 가로 넘침 없음을 확인
- 실제 YouTube 재검색과 Azure DB 저장은 실행하지 않음

## 202. 2026-08-03 검색 지역·우선 언어 운영 검수

- 프런트 PR #1048의 핵심 읽기 전용 검사와 React/Vite 검사가 통과했습니다.
- `main` 병합 뒤 최종 Build와 Azure Static Web Apps 배포가 성공했습니다.
- 운영에서 `copilot`, 대한민국, 한국어 우선, 최근 30일 조건으로 영상 검색을 정확히 한 번 실행했습니다.
- 25개 결과와 `대한민국에서 시청 가능 · 한국어 우선 · 최근 30일 · 영상 길이 전체 · 관련도순` 표시를 확인했습니다.
- 채널 찾기·비교 탭에도 검색 지역 11개, 우선 언어 10개와 채널 운영 국가 제한이 아니라는 설명이 표시됐습니다.
- 영상 검색 결과로 돌아왔을 때 같은 25개 결과와 적용 조건이 API 재호출 없이 유지됐습니다.
- 결과 선택, 발견 링크 저장, 채널 검색, 채널 확인·등록과 Azure DB 쓰기는 실행하지 않았습니다.
- 등록 채널 수는 12개로 유지됐습니다.

## 203. 2026-08-03 YouTube 검색 편의와 채널 결과 정렬

### 보완

- 영상·채널 검색에 `대한민국·한국어 우선 빠른 설정`을 추가했습니다.
- 마지막 검색 뒤 API 검색 조건이 달라지면 새 조건은 아직 결과에 적용되지 않았다는 안내를 표시합니다.
- 채널 검색 결과를 YouTube 관련도·구독자 수·영상당 평균·영상 수 기준으로 정렬합니다.
- 채널 카드에 채널 운영자가 YouTube에 등록한 국가를 표시하고 값이 없으면 `미등록`으로 표시합니다.

### 데이터·비용 경계

- 빠른 설정과 정렬 변경은 YouTube API를 호출하지 않습니다.
- 채널 결과 정렬은 이미 받은 임시 결과의 순서만 바꿉니다.
- 검색 결과·정렬값은 기존처럼 앱 메모리에만 유지되고 새로고침하면 초기화됩니다.
- Azure DB·localStorage·백엔드 endpoint·새 Azure 자원은 변경하지 않았습니다.
- 엄격한 한국어 전용 필터는 언어 정보가 없는 결과까지 숨길 수 있어 별도 결정 전에는 추가하지 않습니다.

### 검수

- 관련 유틸·영상 검색·채널 검색 테스트 10개 통과
- 전체 260개 테스트 파일·1,185개 테스트와 production build 통과
- 로컬 데스크톱에서 대한민국·한국어 우선 빠른 설정을 확인했습니다.
- 390×844에서 영상·채널 검색 화면의 가로 넘침이 없음을 확인했습니다.
- 로컬 검수에서는 YouTube 검색·Azure DB 저장을 실행하지 않았습니다.

## 204. 2026-08-03 YouTube 검색 편의 운영 검수

- PR #1050의 두 검사와 main Build, Azure Static Web Apps 배포가 성공했습니다.
- 운영에서 `바이브 코딩`·대한민국·한국어 우선 조건으로 채널 검색을 정확히 한 번 실행해 12개 결과를 확인했습니다.
- 결과 카드에 `채널 설정 국가: 대한민국`과 `채널 설정 국가: 미등록`이 실제 데이터에 맞게 표시됐습니다.
- 영상당 평균 높은순으로 바꾸자 첫 결과가 `양실장의 바이브코딩대학`에서 `바이브코딩 레인 RaiN`으로 바뀌고 결과 수는 12개로 유지됐습니다.
- 우선 언어를 영어로 바꾸면 재검색 필요 안내가 나타났고 한국어로 복구하면 안내가 사라졌습니다.
- 정렬과 조건 복구 중 검색 버튼을 다시 누르지 않았습니다.
- 채널 등록·YouTube 채널 확인·Azure DB 저장은 실행하지 않았고 등록 채널 수는 12개로 유지됐습니다.
- 브라우저 콘솔 오류는 없었습니다.

다음 무결정 작업은 채널 검색 결과의 등록 여부와 채널 설정 국가 유무를 이미 받은 결과 안에서 좁혀 보는 화면 필터입니다. 엄격한 한국어 전용 필터와 검색 후보의 별도 온라인 저장은 사용자 결정이 필요합니다.

## 205. 2026-08-03 YouTube 채널 결과 화면 필터와 10개 진행 순서

### 이번 보완

- 채널 검색 결과를 등록된 채널·미등록 채널로 좁힐 수 있습니다.
- 채널 설정 국가 등록·미등록과 비교 선택 채널만 보기 필터를 추가했습니다.
- 표시 수와 받은 결과 전체 수를 함께 보여줍니다.
- 필터 조합으로 0개가 되면 검색 결과가 삭제된 것이 아니라는 설명과 화면 필터 초기화를 표시합니다.
- 비교 요약에도 등록 여부와 채널 설정 국가를 표시합니다.
- 비교 요약에서 구독자·영상 수·누적 조회수·영상당 평균을 함께 보여줍니다.
- 비교 선택은 최대 4개임을 표시하고 `비교 선택 전체 해제`로 한 번에 정리합니다.
- 영상 검색 결과를 출처 채널의 등록·미등록 상태로 화면에서 좁힐 수 있습니다.
- 영상 카드 작업을 `영상 아이디어 작업`과 `출처 채널 작업`으로 나눠 선택·저장·등록 검토의 역할을 구분했습니다.

### 데이터·비용 경계

- 모든 필터는 이미 받은 임시 결과에만 적용합니다.
- 필터·정렬·초기화로 YouTube API와 Azure DB를 호출하지 않습니다.
- 검색 결과 원본, 채널 등록 목록, 발견 링크와 제작 기록을 변경하지 않습니다.
- 화면 필터는 검색 세션과 함께 앱 메모리에 유지되고 새로고침하면 초기화됩니다.

### 다음 진행 순서

1. 등록 상태 필터 — 완료
2. 채널 국가·비교 선택·초기화 — 완료
3. 비교 요약 보강 — 완료
4. 비교 선택 전체 해제·최대 4개 안내 — 완료
5. 영상 결과의 출처 채널 등록 필터 — 완료
6. 영상 저장·채널 등록 검토 버튼 우선순위 — 완료
7. 모바일 필터·정렬·작업 버튼 밀도 — 완료
8. 화면 왕복 상태 유지 회귀 검수 — 완료
9. 엄격한 언어 전용 필터 — 결정 필요
10. 검색 후보 온라인 저장 — 결정 필요

## 206. 2026-08-03 YouTube 결과 필터 운영 검수

### 운영 확인

- PR #1052 배포 뒤 `바이브 코딩`·대한민국·한국어 우선 채널 검색을 정확히 한 번 실행해 12개 결과를 확인했습니다.
- 채널 설정 국가 미등록 필터는 4개를 표시했고, 등록된 채널·국가 미등록 조합으로 0개가 되면 검색 원본을 유지한 채 화면 필터 초기화 안내가 나타났습니다.
- 비교 1개를 선택하면 구독자·영상 수·누적 조회수·영상당 평균과 등록 여부·채널 국가가 함께 표시됐습니다.
- 비교 선택만 보기에서 1개만 표시됐고, 비교 전체 해제 뒤 0개 복구 안내와 필터 초기화가 정상 작동했습니다.
- 390×844 모바일에서 결과 4개를 필터링한 상태로 문서 너비 375px, 화면 너비 390px를 확인해 페이지 전체 가로 넘침이 없었습니다.
- 오늘의 레이더를 열었다가 키워드 탐색으로 돌아온 뒤에도 12개 원본 결과, 영상당 평균순, 국가 미등록 필터, 비교 선택이 유지됐습니다.

### 데이터·비용 경계

- 검수 검색은 1회만 실행했고 다음 페이지 검색은 실행하지 않았습니다.
- 필터·정렬·비교·화면 이동은 이미 받은 임시 결과만 사용했습니다.
- 채널 등록, 발견 링크 저장, Azure DB 쓰기, 새 영상 수집은 실행하지 않았습니다.
- 1~8번 무결정 작업은 완료했습니다. 9번 엄격한 언어 전용 필터와 10번 검색 후보 온라인 저장은 사용자 결정 전까지 구현하지 않습니다.

## 207. 2026-08-03 검색 운영 기준 확정과 임시 결과 정리

### 결정 확정

- 사용자의 `계속` 승인을 추천안 승인으로 반영했습니다.
- 엄격한 언어 전용 필터는 언어 정보가 비어 있는 유효 결과를 숨길 수 있어 추가하지 않고 `우선 언어` 방식을 유지합니다.
- 검색 결과 전체와 채널 후보는 자동으로 온라인 저장하지 않습니다. 사용자가 선택한 영상만 발견 링크함에 저장하고, 중요한 채널만 등록 검토로 연결합니다.

### 이번 구현

- 영상·채널 YouTube 검색 결과에 `임시 결과 지우기`를 추가했습니다.
- 검색어·검색 지역·우선 언어 등 입력 조건은 유지합니다.
- 영상 결과·선택·출처 채널 등록 필터·다음 페이지 토큰을 정리합니다.
- 채널 결과·비교 선택·정렬·등록·국가·비교 필터·다음 페이지 토큰을 정리합니다.
- 정리 결과는 앱 메모리의 검색 세션에도 반영되어 다른 화면에서 돌아와도 지운 결과가 다시 나타나지 않습니다.

### 데이터·비용 경계

- 결과 정리만으로 YouTube API를 호출하지 않습니다.
- Azure DB의 발견 링크·등록 채널·제작 기록을 조회·저장·삭제하지 않습니다.
- 영상 파일을 저장하거나 삭제하지 않습니다.
- 관련 렌더링·세션·개선 기록 테스트 5개 파일, 14개 테스트가 통과했습니다.

## 208. 2026-08-03 비교 요약의 채널 등록 검토 동선

- 비교 요약의 각 채널에 `등록 검토`, `YouTube 보기`, `비교에서 빼기`를 추가했습니다.
- 등록 검토는 채널 운영실의 단일 채널 입력을 준비하는 화면 이동이며 YouTube 확인·Azure DB 저장·영상 수집을 자동 실행하지 않습니다.
- 이미 등록된 채널은 `이미 등록됨`으로 비활성화해 중복 검토를 막습니다.
- 모바일에서는 등록 검토와 YouTube 보기를 두 칸 또는 한 칸으로 배치하고 비교 해제는 전체 폭으로 표시합니다.
- 여러 채널을 한 번에 확인·등록하는 기능은 API 호출과 다중 Azure DB 저장 실패 처리 결정이 필요해 별도 사용자 결정 전에는 구현하지 않습니다.

### 운영 전 로컬 검수

- 최신 production 코드에 검수 탭 전용 모의 채널 2개를 사용했습니다.
- 비교 요약의 등록 검토·YouTube 보기·비교에서 빼기가 의미에 맞는 버튼과 링크로 표시됐습니다.
- 390×844에서 문서 너비 375px를 유지해 가로 넘침이 없었습니다.
- 비교 요약의 등록 검토는 선택한 채널 URL을 채널 운영실 단일 입력에 전달했습니다.
- 키워드 탐색으로 돌아오자 검색 결과 2개와 비교 선택 1개가 유지됐습니다.
- 모의 응답과 모바일 강제 크기는 검수 뒤 해제했으며 Azure DB·YouTube 데이터에는 기록하지 않았습니다.

## 209. 2026-08-03 검색 채널 최대 50개 일괄 등록 기반

- 비교 선택 최대 4개는 수치 비교용으로 유지하고, 별도 등록 후보를 최대 50개까지 선택하도록 분리했습니다.
- 채널 검색은 기본 25개를 표시하고 다음 25개를 이어 받아 등록 후보로 고를 수 있습니다.
- `선택 채널 일괄 등록 검토`는 기존 채널 운영실 일괄 추가 화면에 채널 주소만 전달합니다. 이동만으로 API나 저장은 실행되지 않습니다.
- 채널 운영실에서 태그·언어를 확인하고 최종 저장을 눌렀을 때만 YouTube 확인과 Azure DB 등록을 실행합니다.
- 백엔드는 51개 이상을 실행 전에 차단하고 최대 10개씩 확인합니다. 기존 등록·같은 요청의 중복 입력은 다시 저장하지 않습니다.
- 결과는 새로 저장·기존 등록·중복 입력·실패로 채널마다 표시합니다.
- 이 작업은 채널 등록만 수행하며 새 영상 수집은 실행하지 않습니다.
- 실제 운영 채널 저장은 대상과 태그를 사용자가 확인한 뒤 별도 1회 검수합니다.

### 로컬 화면 검수

- 화면 전용 모의 채널 3개로 등록 후보 전체 선택 → 채널 운영실 일괄 등록 검토 전달을 확인했습니다.
- 전달된 입력은 채널 주소 3개였고 `3/50개 인식됨`, `최대 50개를 10개씩 확인`, `영상 수집은 하지 않습니다` 안내가 함께 표시됐습니다.
- 키워드 탐색으로 돌아온 뒤 검색 조건·결과 3개·등록 후보 3개가 그대로 유지됐습니다.
- 390×844 모바일에서 화면 너비 390px, 문서 너비 375px로 페이지 전체 가로 넘침이 없고 일괄 등록 검토 버튼이 표시됐습니다.
- 모의 응답과 모바일 강제 크기는 검수 뒤 해제했으며 YouTube API·Azure DB 저장·실제 채널 등록은 실행하지 않았습니다.

## 210. 2026-08-03 카이온학습 영상·채널 분류

- 사용자가 `MS Copilot` 검색 결과를 개인 업무 지식·정보 습득용으로 구분하는 `카이온학습` 분류를 승인했습니다.
- 채널 등록 태그와 개별 영상의 발견 링크 태그를 분리했습니다.
- 영상 검색에서 선택 영상 저장 전에 분류를 고를 수 있고, 발견 링크함에서 배지·수정·검색으로 확인할 수 있게 했습니다.
- 백엔드는 기존 발견 링크 문서의 `tags` 배열을 정규화해 저장·수정하며 태그 10개, 항목당 40자로 제한합니다.
- 기존 문서에 태그가 없어도 빈 목록으로 처리하므로 데이터 변환은 필요하지 않습니다.
- 새 Azure 자원·Cosmos DB container·endpoint·localStorage key는 추가하지 않았습니다.
- 배포 전 전체 테스트와 production build, 배포 후 MS Copilot 선택 영상 5개·출처 채널 저장과 Azure DB 재조회를 이어서 확인합니다.

## 211. 2026-08-03 카이온학습 운영 저장·재조회

- 백엔드 PR #25와 프런트 PR #1058의 검사·Azure 배포가 성공했습니다.
- `MS Copilot`·최근 30일·검색 지역 전체·우선 언어 없음 검색을 운영에서 정확히 한 번 실행해 25개 결과를 받았습니다.
- 승인 영상 5개만 `카이온학습` 분류로 발견 링크함에 저장했습니다.
- 영상 출처 채널 5개를 영상 링크로 일괄 확인하고 `카이온학습` 채널 태그로 새로 등록했습니다.
- 일괄 결과는 전체 5개·새로 저장 5개·기존 등록 0개·중복 0개·실패 0개였습니다.
- 전체 새로고침 뒤 발견 링크함에서 `카이온학습` 검색 결과 5개와 각 카드의 분류 선택값을 확인했습니다.
- 채널 운영실에서 전체 17개, `카이온학습` 태그 5/5개와 Mike Tholfsen·Collaboration Simplified·Office Skills with Amy·Scott Brant·M365 Copilot Connection을 확인했습니다.
- 채널 5개는 모두 미수집 상태이며 새 영상 수집은 실행하지 않았습니다.

## 212. 2026-08-03 카이온학습 첫 채널 수집·재조회

- 사용자가 `Mike Tholfsen` 1개 채널을 선택한 상태에서 수집 전 Azure DB 영상 0개와 `미수집` 상태를 확인했습니다.
- `선택 채널 새 영상 수집 (1/1개)`을 정확히 한 번 실행했습니다.
- 신규 영상 250개, 통계 갱신 250개, 또터또 후보 19개와 Azure DB 재조회 250개를 확인했습니다.
- 최근 수집 상태는 채널 전체 545개 중 250개 저장, 45.9%, 추정 미저장 295개의 `부분 성공`으로 기록됐습니다. 이는 최신 범위 수집 완료와 과거 범위 미수집을 함께 나타내며 실행 실패가 아닙니다.
- 전체 새로고침 후 최근 수집 상태를 다시 열어 결과의 온라인 저장 유지를 확인했습니다.
- 나머지 `카이온학습` 4개 채널과 댓글은 수집하지 않았습니다.
- 다음은 YouTube API를 다시 호출하지 않고 저장된 250개와 또터또 후보 19개를 검토합니다. 다음 채널 수집은 사용자 선택이 필요한 결정 지점입니다.

## 213. 2026-08-03 또터또 완료 집계·탐색 기준 통일

- Azure DB에서 Mike Tholfsen 영상 250개를 2페이지로 불러왔고 조회 완료 안내에서 YouTube API 호출이 없었음을 확인했습니다.
- 또터또 탐색은 `6개월 이상·1.5배 이상` 후보 44개를 표시했지만 앞선 수집 완료 카드는 19개를 표시했습니다.
- 원인은 프론트 제품 기준 1.5배와 백엔드 완료 집계의 오래된 3배 기준이 함께 사용된 것이었습니다.
- 백엔드 PR #26에서 완료 집계를 1.5배로 통일하고 전체 테스트와 기존 Azure Function App 배포를 완료했습니다.
- 새 자원·DB 변경·실제 재수집·댓글 API·판단 기록 저장은 없습니다.
- 과거 완료 응답 19개는 당시 기록으로 유지하며, 현재 검토 대상은 화면 기준 44개입니다.

## 214. 2026-08-03 목적별 업로드 기간 필터

- 새 YouTube 영상 검색의 기존 `전체·7일·30일·90일`을 `전체·7일·30일·60일·올해`로 정리했습니다.
- `올해`는 실행 시점의 1월 1일을 `publishedAfter`로 계산하며, 검색 버튼을 누를 때만 YouTube API 요청에 포함합니다.
- Azure DB 수집 영상 검색에는 `7일·60일·올해`를 추가하고 기존 `30일·6개월 이상`을 유지했습니다. 이 필터는 이미 불러온 영상 배열에만 적용합니다.
- 또터또 탐색에 `6개월~1년·1~2년·2년 이상` 후보 연령 필터를 추가하고 초기화 상태에도 연결했습니다.
- 기간 계산과 화면 선택지 단위 테스트를 추가했습니다.
- 새 자원·백엔드 endpoint·Azure DB 구조·localStorage key·자동 API 호출은 추가하지 않았습니다.
- 유사 제목이나 중복 주제 묶음은 기간과 다른 문제이므로 다음 별도 개선 후보로 남겼습니다.

## 215. 2026-08-03 Creator OS AI 활용 경계 기록

- 중앙 자원 원장의 전사 AI 단계적 도입 정책과 Creator OS 프로젝트 선언서를 연결했습니다.
- 현재 기본은 ChatGPT 웹 구독을 이용한 수동 기획이며, OpenAI API는 생성 기능을 구현했다는 뜻이 아니라 선택형 자동화 후보로만 등록했습니다.
- AI 활용 후보는 Azure DB에 저장되었거나 사용자가 직접 고른 영상의 주제 요약, 제목·구성·대본·설명, 썸네일 문구·이미지 프롬프트 초안입니다.
- YouTube 신규 수집과 AI 생성은 서로 다른 사용자 동작으로 유지합니다. API 파일럿은 한 후보 단위, 자동 반복 없음, 사람 검수 필수입니다.
- 실제 API 연결 전에는 요청량·모델 사용량·예상 비용·승인 결과·출력 위치 기록 방식을 먼저 확정합니다.
- 이번 변경은 정책과 자원 선언 기록만 다루며 OpenAI 호출, YouTube API 호출, Azure DB 쓰기, 새 Azure 자원 생성은 실행하지 않았습니다.

## 216. 2026-08-03 선언 자원 재확인·비슷한 주제 1차 묶음

- 프로젝트 `.kaion/project-resources.json`과 중앙 자원 원장 2026-07-29 기준을 대조했습니다.
- 선언된 운영 핵심은 Azure Sponsorship, GitHub, Static Web Apps, Azure Functions, Cosmos DB, YouTube Data API이며 ChatGPT·Canva·Typecast는 선택 제작 자원입니다.
- Azure CLI 읽기 전용 확인에서 구독은 활성 상태이고 `yt-analyzer-rg`의 Static Web App·Function·Cosmos DB를 포함한 기존 지원 자원 8개를 확인했습니다.
- GitHub 저장소의 `main` 기본 브랜치와 API 접근도 확인했습니다. YouTube 실제 할당량은 원장과 동일하게 Google Cloud Console 확인 필요 상태로 유지합니다.
- 수집 영상 검색과 또터또 결과에서 제목 핵심어가 충분히 겹치는 항목을 최대 6개 묶음으로 계산합니다.
- 묶음 요약과 카드의 `비슷한 주제 N개` 표시는 화면 참고 신호이며 영상·DB 문서를 통합하거나 숨기지 않습니다.
- 새 Azure 자원·유료 서비스·백엔드 endpoint·DB 구조·AI API·YouTube API 호출은 없습니다.
- 첫 운영 검수에서 `copilot` 검색 46개 중 29개가 6묶음으로 표시됐고, 검색 공통어 때문에 일부 묶음이 넓은 것을 발견했습니다.
- 현재 결과의 65% 이상에 반복되는 단어와 `new·tutorial·tips·use` 같은 일반 형식어를 제외하도록 즉시 보정했습니다.
- 보정 배포 후 같은 46개에서 묶인 영상이 13개로 줄었으나 `you·should·2026` 같은 잡음 묶음이 남아, 영어 대명사·권유 표현과 연도를 추가 제외했습니다.

## 217. 2026-08-03 비슷한 주제 선택 모아보기

- 수집 영상 검색과 또터또의 비슷한 주제 칩을 선택 가능한 화면 필터로 변경했습니다.
- 선택 묶음의 영상만 표시하고 같은 칩 재선택 또는 검색·기간·정렬 변경 시 전체 결과로 복귀합니다.
- 원본 배열·정렬·판단 기록은 유지하며 Azure DB·localStorage 쓰기, YouTube API, AI API 호출은 없습니다.
- 공통 필터 유틸리티와 선택 상태 안내 테스트를 추가했습니다.
- 각 묶음의 현재 정렬 첫 영상에 `묶음 대표` 배지를 추가했습니다. 새 점수·DB 필드 없이 기존 정렬 결과를 재사용합니다.

## 218. 2026-08-03 검색 결과 → 채널 등록 검토 맥락 보존

- 영상 검색과 채널 검색의 중요 채널 등록 동선을 다시 점검했습니다.
- 두 검색 모두 채널 운영실의 기존 등록 입력으로 정상 연결되지만, 이동 후에는 어떤 검색에서 시작했는지 안내하지 않아 작업 맥락이 끊기는 문제를 확인했습니다.
- 영상 검색은 `검색 영상의 출처 채널`, 채널 단일 검색은 `YouTube 채널 검색`, 채널 일괄 선택은 `일괄 등록 검토`로 출발 경로를 전달합니다.
- 채널 운영실 등록 단계 상단에 주소·목록만 미리 채운 상태이고 최종 확인·저장이 필요하다는 안내를 표시합니다.
- 이 변경은 화면 상태와 안내만 사용하며 YouTube API, Azure DB 읽기·쓰기, 새 영상 수집, localStorage를 추가하지 않습니다.
- 관련 단위 테스트와 전체 회귀 테스트, production build를 실행한 뒤 배포 후 운영 로그인을 복구해 실제 화면을 확인합니다.

## 219. 2026-08-03 채널 등록 검토 → 검색 결과 바로 복귀

- 검색에서 중요 채널을 등록 검토한 뒤 이전 결과로 돌아가려면 사이드 메뉴에서 키워드 탐색을 다시 찾아야 하는 불편을 확인했습니다.
- 영상 검색·채널 검색·일괄 선택에서 시작한 등록 안내에 `검색 결과로 돌아가기` 버튼을 추가했습니다.
- 버튼은 기존 임시 검색 조건·결과·선택 상태가 유지된 키워드 탐색 화면으로 이동합니다.
- 화면 이동만 수행하며 YouTube API 재검색, Azure DB 읽기·쓰기, 채널 저장, 새 영상 수집을 실행하지 않습니다.
- 운영 클릭 검수는 Microsoft 로그인 전환이 정상화된 브라우저 세션에서 이어갑니다. Edge의 인증 완료 주소 차단은 현재 앱 기능 오류로 단정하지 않습니다.

## 220. 2026-08-03 Creator OS 사용자 지정 운영 주소 연결

- Azure 기본 주소의 Microsoft 인증 완료 단계가 Edge·Chrome·Whale·모바일에서 열리지 않는 현상을 확인했습니다.
- `staticwebapp.config.json`, Azure 사용자 역할, `creator_owner`, Static Web App 상태와 서버의 인증 endpoint 응답은 정상이었습니다.
- 카이온 홈페이지의 같은 Azure 관리형 인증은 정상 동작해 Azure 전체 장애나 사용자 계정 자체 문제의 가능성이 낮다고 판단했지만, 근본 원인으로 단정하거나 완전히 배제하지 않았습니다.
- 기존 `kaion.co.kr`, 아이네임즈/UHOST 권한 DNS와 `yt-analyzer` Static Web Apps Standard를 재사용했습니다.
- `creator.kaion.co.kr` CNAME을 `lively-dune-0af1d2a00.7.azurestaticapps.net`에 연결했고 두 권한 DNS 응답과 Azure 사용자 지정 도메인 `Ready`를 확인했습니다.
- Edge에서 `https://creator.kaion.co.kr/` Microsoft 로그인과 Creator OS 진입에 성공했습니다.
- 새로고침 후에도 로그인과 전체 메뉴가 유지됐고 Azure DB 조회로 채널 17개·보관 소재 1개·링크 후보 1개가 다시 표시됐습니다.
- 앱 코드 수정, 프런트 재배포, 새 Azure 서비스, YouTube API 호출, 운영 데이터 저장·삭제는 실행하지 않았습니다.
- 새 주소를 기본 운영 주소로 사용하고 Azure 기본 주소는 복구용으로 유지합니다.
- README, 개인 접근 보호 문서, 공개 앱 Smoke Check와 문서 색인도 새 운영 주소 기준으로 정리하고 장애 기록 문서를 추가했습니다.
- 연결 직후 Google 공용 DNS와 호스트 지정 HTTPS 요청에서는 Azure CNAME과 로그인 이동 `302`가 정상이었지만, 점검 PC의 기본 DNS는 아직 `이름 없음`을 반환했습니다. Edge 로그인 성공과 함께 보면 DNS 전파·재귀 캐시 차이로 판단하며 시스템 DNS 설정은 변경하지 않았습니다.

## 221. 2026-08-03 로그인 후 주요 메뉴 읽기 전용 회귀 검수

- Edge의 `creator.kaion.co.kr` 로그인 세션에서 오늘의 레이더의 채널 17개·보관 소재 1개·링크 후보 1개를 다시 확인했습니다.
- 처음 `키워드 탐색`을 열 때 배포 전에 열려 있던 탭의 지연 로드 파일이 오래되어 `최신 화면을 다시 불러와야 합니다` 안내가 표시됐습니다.
- 앱이 제공하는 `최신 화면 다시 불러오기`를 실행한 뒤 로그인과 Cloud DB 수치가 유지됐고 `키워드 탐색`이 정상 표시됐습니다.
- `키워드 탐색`은 수집 영상에서 찾기와 `YouTube에서 새로 찾기`를 구분하고, YouTube API를 쓰는 버튼에 별도 안내가 표시됩니다.
- `수집 영상 목록`은 온라인 저장소(Azure DB) 조회, 화면 필터·정렬과 필요할 때만 실행하는 새 영상 수집을 구분해 표시합니다.
- `대본 작업실`은 외부 페이지로 이동하지 않고 같은 `https://creator.kaion.co.kr/` 안에서 열렸습니다.
- 대본 작업실에는 제작 후보 2개와 제목·영상 분석·대본 구성안·대본 본문·진행 단계·업로드 예정일 입력 구조가 실제 표시됐습니다.
- `오늘 볼 채널`, `발견 링크함`, `제작 후보함`, `업로드 캘린더`, `채널 운영실`도 오류 안내 없이 실제 화면이 표시됐습니다.
- 업로드 캘린더에는 2026년 8월과 날짜 미정 제작 후보 2개가 표시됐고, 채널 운영실에는 운영 순서와 선택·분류 관리 영역이 표시됐습니다.
- `또터또 탐색`, `채널 태그별 보기`, `소재 보관함`, `최근 수집 상태`, `설정`, `업무 도구함`, `개선 기록`도 읽기 전용 화면 진입을 확인했습니다.
- 설정은 현재 보고된 화면 오류 없음으로 표시됐고, 개선 기록에는 대본 작업실의 현재 범위와 체크포인트가 표시됐습니다.
- `채널 태그별 보기`와 `업무 도구함`은 같은 H2 제목이 페이지 제목과 본문 제목으로 반복됩니다. 동작 오류는 아니지만 화면 계층이 중복되어 다음 소규모 UI 정리 후보입니다.
- 검색 실행, 새 영상 수집, 입력 변경, 저장·수정·삭제와 YouTube API 호출은 하지 않았습니다.

## 222. 2026-08-03 반복 화면 제목 소규모 정리

- 사이드바와 공통 페이지 제목인 `채널 태그별 보기`, `업무 도구함`은 변경하지 않았습니다.
- 채널 태그 화면의 내부 H2를 `태그로 수집 영상 좁히기`로 바꿔 실제 작업 역할을 드러냈습니다.
- 업무 도구 화면의 내부 H2를 `조사 도구 바로가기`로 바꿔 페이지 이름의 단순 반복을 제거했습니다.
- 관련 컴포넌트 테스트 문구와 `src/constants/improvementLog.js`의 메뉴·용어 체크포인트를 함께 갱신했습니다.
- 관련 테스트 12개, `.codex-worktrees/**`를 제외한 실제 앱 범위 262개 파일·1,204개 테스트, production build가 모두 통과했습니다.
- 데이터 로직, API 주소, 메뉴 이동, Azure DB와 YouTube API 동작은 변경하지 않았습니다.
- 커밋·푸시·배포와 운영 화면 반영은 실행하지 않았습니다.

## 223. 2026-08-04 YouTube 검색·채널 등록 검토 왕복 운영 검수

- Edge의 `https://creator.kaion.co.kr/` 로그인 세션에서 `MS Copilot` 영상 검색을 정확히 한 번 실행했습니다.
- 적용 조건은 `대한민국에서 시청 가능·한국어 우선·최근 30일·영상 길이 전체·관련도순`이며 기본 결과 수 25개가 모두 표시됐습니다.
- 결과는 임시 상태이고 선택 0개로 표시됐으며, 선택하지 않은 결과는 Azure DB에 저장되지 않는다는 안내를 확인했습니다.
- 미등록 출처 채널 17개 중 첫 항목의 `이 채널 등록 검토`를 눌렀을 때 채널 운영실 2단계에 정확한 채널 URL만 미리 채워졌습니다.
- 채널 운영실의 `검색 결과로 돌아가기`를 누르자 `MS Copilot` 검색어, 지역·언어·기간 조건, 25개 결과와 선택 0개가 그대로 복원됐습니다.
- 복귀 과정에서 검색 버튼을 다시 누르지 않았으므로 추가 YouTube API 요청은 실행하지 않았습니다.
- 발견 링크 저장, YouTube 채널 정보 확인, 채널 등록, 새 영상 수집, Azure DB 쓰기는 실행하지 않았습니다.
- 화면 수치는 검수 전후 채널 17개·보관 소재 1개·링크 후보 1개로 유지됐습니다.
- 보류됐던 `검색 결과로 돌아가기` 운영 클릭 검수는 정상 완료로 전환합니다.

## 224. 2026-08-05 카이온학습 추천 채널 4개 등록

- 전사 자원 원장과 프로젝트 선언서를 먼저 확인하고 기존 YouTube Data API·Azure Functions·Cosmos DB만 재사용했습니다.
- `MS Copilot` 임시 결과 25개에서 미등록 채널 영상 17개·고유 채널 14개를 화면 필터로 확인했습니다.
- 업무 학습 적합성, 반복 출현, 실무 전문성을 기준으로 `David Fortin`, `Kevin Stratvert`, `The AI Productivity Coach`, `TechByTosh`를 등록 대상으로 선정했습니다.
- 해당 채널 영상 링크 4개를 `카이온학습` 태그·기본 언어 `EN`으로 한 번의 일괄 등록 요청에서 확인·저장했습니다.
- 처리 결과는 전체 4개·새로 저장 4개·기존 등록 0개·중복 입력 0개·실패 0개입니다.
- Azure DB 재조회에서 전체 채널은 17개에서 21개, `카이온학습` 채널은 5개에서 9개로 증가했습니다.
- 네 채널의 이름·구독자·전체 영상 수·평균 조회수가 채널 관리 화면에 표시됐고 모두 `미수집` 상태임을 확인했습니다.
- `카이온학습`은 DB에 이미 존재했지만 현재 브라우저의 화면 카테고리 목록에서 숨겨져 있어 같은 이름으로 화면 목록만 복구했습니다. DB 태그 이름이나 기존 채널 태그는 변경하지 않았습니다.
- 새 영상 수집, 댓글 API, 발견 링크 저장, 채널 등급 변경은 실행하지 않았습니다.

## 225. 2026-08-06 TechByTosh 기존 수집 결과 운영 검수

- `TechByTosh` 한 채널의 새 영상 수집을 실행하기 전에 채널 운영실의 현재 기록을 먼저 확인했습니다.
- 운영 화면에는 최근 수집이 16시간 전 `success`, 신규 영상 95개·기존 영상 통계 95개 갱신·수집 범위 100%로 표시됐습니다.
- 이미 전체 95개가 수집된 상태이므로 반복 수집 금지 원칙에 따라 `선택 채널 새 영상 수집` 버튼을 다시 누르지 않았습니다.
- `TechByTosh`만 선택한 상태에서 `수집 영상 목록 불러오기`를 실행해 온라인 저장소(Azure DB)의 영상 정보 95개를 확인했습니다.
- 화면은 `온라인 저장소(Azure DB) 조회 완료`, `수집된 영상 정보 95개`, `새 YouTube API 호출은 없었습니다`를 표시했습니다.
- 전체 새로고침 뒤 채널 운영실에서 `카이온학습` → `TechByTosh` → 수집 영상 확인 단계를 다시 선택해 Azure DB를 재조회했습니다.
- 새로고침 후에도 `불러온 영상 95개`와 `새 영상 95 · 갱신 95 · 100%` 기록이 유지됐습니다.
- 이번 검수에서는 YouTube API 신규 호출, 댓글 Top 10, 다른 채널 수집, Azure DB 쓰기, 코드 수정과 배포를 실행하지 않았습니다.
- 다음 수집은 최근 수집 기록과 신규 필요성을 먼저 확인하고, 명시적으로 승인된 채널 1개를 1회만 실행합니다.

## 226. 2026-08-06 TechByTosh 95개 읽기 전용 후보 검토

- 온라인 저장소(Azure DB)에서 불러온 `TechByTosh` 영상 정보 95개만 사용했습니다.
- 운영 화면의 `또터또 발굴 (6개월+ · 1.5배+)`을 켜자 후보 9개가 표시됐고, 화면 카드의 순위·제목·판단 신호를 확인했습니다.
- 상위 후보는 Excel 이미지 표 변환 35.9배, Outlook 서명 16.6배, Outlook 공유 사서함 5.1배·2.8배, Teams 녹화 저장 위치 3.1배, SharePoint 문서 라이브러리 2.4배, SharePoint 목록 양식과 Power Apps 1.7배, Teams 만료 녹화 복구 1.5배입니다.
- `Microsoft Office 무료 사용` 3.2배 영상은 조회 성과와 별도로 라이선스·현재 제품 정책 오해 위험이 있어 공식 기준 확인 전 보류합니다.
- 공유 사서함 2개는 한 제작 주제, Teams 녹화 저장 위치·만료 복구 2개는 한 제작 주제로 합쳐 중복 작업을 줄입니다.
- 따라서 9개 영상을 그대로 9개 작업으로 만들지 않고 6개 제작 검토 주제와 1개 보류 주제로 정리합니다.
- 최근 학습 후보는 SharePoint Copilot 대시보드 보안, Copilot 기반 SharePoint 대시보드 제작, SharePoint Copilot 신기능, Word Agents, Copilot Basic·Premium 비교입니다.
- 현재 앱의 `similarTopics`와 동일한 제목 토큰 규칙을 95개 제목에 적용하자 문서 라이브러리 묶음에 커뮤니케이션 사이트·허브 사이트가 포함되고, Microsoft Lists 묶음에 Excel 드롭다운이 포함되는 과대 분류가 확인됐습니다.
- 비슷한 주제 기능은 공통 토큰 두 개만으로 넓어지는 경우를 줄이는 소규모 정확도 개선이 필요합니다.
- 소재 보관, 제작 후보 표시, 판단 기록 저장, 댓글 API, YouTube 신규 수집과 Azure DB 쓰기는 실행하지 않았습니다.

## 227. 2026-08-06 비슷한 주제 일반 표현 과대 분류 보정

- `TechByTosh` 95개 제목에 현재 앱의 비슷한 주제 규칙을 적용해 실제 과대 분류 사례를 재현했습니다.
- `create·microsoft·online`은 실제 기능이나 업무 대상이 달라도 반복돼 묶음을 넓히는 일반 플랫폼 표현으로 확인했습니다.
- 세 단어를 제목 핵심어에서 제외해 SharePoint 문서 라이브러리와 커뮤니케이션·허브 사이트가 같은 묶음으로 합쳐지지 않게 했습니다.
- Microsoft Lists와 Excel 드롭다운 목록도 `microsoft·lists`만으로 잘못 묶이지 않게 했습니다.
- 기존 Copilot 업무 자동화 묶음, 결과 대부분의 반복 단어 제외, 묶음 대표·필터 동작은 유지합니다.
- 과대 분류 두 사례를 고정하는 회귀 테스트 2개를 추가해 `similarTopics` 테스트 8개가 통과했습니다.
- `.codex-worktrees/**`를 제외한 실제 앱 범위 262개 파일·1,206개 테스트와 production build가 통과했습니다.
- 개선 기록의 마지막 점검일·현재 상태·다음 작업·체크포인트와 상세 개선 문서를 함께 갱신했습니다.
- 프런트 화면 계산만 변경하며 YouTube API, Azure DB 읽기·쓰기, localStorage, 원본 영상 데이터와 또터또 기준은 변경하지 않습니다.

## 228. 2026-08-08 자동 수집·Cosmos DB 반복 쓰기 보정

- Azure 사용량과 Functions 실행 기록을 읽기 전용으로 대조해 야간 Timer의 모든 활성 채널 자동 수집과 전체 영상 반복 Upsert를 주원인으로 확인했습니다.
- 기존 채널 문서의 `collectionMode`를 실제 실행 경계로 연결했습니다. 새 채널의 기본 `manual`은 등록만 의미하고, Timer는 명시적 `auto` 활성 채널만 처리합니다.
- 사용자가 실행하는 전체·태그·선택 채널 수동 수집과 활성·보류·폐기 상태 계약은 유지합니다.
- 통계 갱신 영상은 대박지수까지 계산한 뒤 한 번만 저장하고, 통계 갱신 대상이 아니며 대박지수도 같은 영상은 Upsert하지 않습니다.
- 수동 과거 영상 채우기도 신규 영상 통계와 대박지수를 한 번의 저장 단계로 합쳤습니다.
- 야간 완료 로그에서 후보 영상 전체 JSON을 제거하고 대상 채널·실패·신규·통계 갱신·실제 저장 건수만 기록합니다.
- 백엔드 전체 테스트는 통과했습니다. 새 Azure 자원, Cosmos DB container, 스케줄 횟수, YouTube API 기능은 추가하지 않았습니다.
- 아직 커밋·PR·배포와 운영 DB 쓰기 검수는 실행하지 않았습니다. 운영 반영 후 다음 야간 실행과 429 비율을 읽기 전용으로 재점검해야 합니다.

## 229. 2026-08-09 야간 자동 수집 안전 경계 운영 검수 완료

- 백엔드 PR #28을 병합해 Azure Functions에 배포했고 프론트 기록 PR #1077도 Static Web Apps에 반영했습니다.
- Cloud DB 채널 21개는 모두 수동 취급 상태이며 `active + auto`는 0개임을 상세정보를 출력하지 않고 집계했습니다.
- 새벽 3시 Timer는 정상 시작·완료됐고 실행시간은 341ms였습니다.
- 완료 요약은 대상 채널·실패·신규·통계 갱신·영상 저장이 모두 0으로, 등록만 한 채널이 자동 수집되지 않았습니다.
- 같은 15분 구간에서 Cosmos 요청 13,296→4, 429 7,161→0, Upsert 13,146→0, RU 61,464→4를 확인했습니다.
- Functions 실행 단위는 110,336,000→512,000이었고 Application Insights 예외는 0건입니다.
- 검수는 Azure 관리 지표·Application Insights·Cloud DB 설정 조회만 사용했습니다. Timer 수동 실행, YouTube API 호출, DB 쓰기·설정 변경은 하지 않았습니다.
- 데이터·API 안전 검수와 자동 수집 경계·변경 영상 단일 저장·Timer 요약 로그 체크포인트를 확인 완료로 전환합니다.

## 230. 2026-08-09 Static Web Apps OIDC 배포 구성 재확인

- 정상 배포 뒤 `github_id_token`이 지원되지 않는 입력이라는 경고를 없애려고 PR #1079에서 OIDC 권한·토큰 생성 단계·입력을 제거했습니다.
- main 배포는 즉시 `No matching Static Web App was found or the api key was invalid`로 실패했습니다. 저장된 배포 토큰 secret만으로는 현재 앱을 배포할 수 없고, 기존 OIDC 토큰이 실제 인증 경계임을 확인했습니다.
- 같은 구성을 제거했다가 PR #900에서 복원한 과거 이력과 Microsoft의 Static Web Apps OIDC 워크플로 예시도 재확인했습니다. OIDC 권한·토큰 생성·`github_id_token` 입력을 원상복구합니다.
- 입력 경고는 현재 액션 메타데이터와 실제 배포 컨테이너 동작 사이의 차이로 남기며, 배포 성공을 우선합니다. Static Web App, 요금제, secret과 빌드 위치는 변경하지 않습니다.
- 운영 로그인 재검수 중 배포 직후 최신 화면 다시 불러오기를 누르면 Azure 관리형 인증 완료 주소가 Edge에서 차단되는 기존 증상이 재현됐습니다. 앱 인증 경로와 서버의 302 응답은 정상이며, 실제 앱 재진입은 사용자 로그인 후 별도로 확인합니다.

## 231. 2026-08-09 개선 기록 최신 상태 표시 보정

- 운영 로그인 후 개선 기록에서 데이터·API 안전 검수가 `확인 완료`, 마지막 점검 `2026-08-09`로 표시되는 것을 확인했습니다.
- 같은 화면 상단의 전체 마지막 갱신은 수동 상수 때문에 `2026-08-08`로 남아 있어 최신 영역 점검일과 어긋났습니다.
- 전체 마지막 갱신일은 각 개선 영역의 `lastReviewedAt` 중 최신 날짜를 자동으로 사용하도록 바꿉니다.
- 키워드 탐색 역할표의 `채널 운영 검수 예정`도 실제 완료 기록에 맞춰 `영상·채널 운영 검수 완료`로 정리합니다.
- 운영 화면에서 대한민국 빠른 설정이 `KR`·`ko`를 선택하고, 검색어가 없으면 YouTube 검색 버튼이 비활성 상태로 유지되는 것을 확인했습니다. API 호출과 Azure DB 쓰기는 실행하지 않았습니다.

## 232. 2026-08-09 영상 찾기 → 채널 찾기 공통 조건 연결

- 운영 점검에서 영상 찾기에 고른 검색어·검색 지역·우선 언어가 채널 찾기·비교로 처음 전환할 때 초기화되는 불편을 확인했습니다.
- 비어 있는 대상 검색 화면에만 세 공통 조건을 이어주며, 이미 사용한 대상 화면의 검색어·임시 결과·선택은 보호합니다.
- 영상 전용 기간·길이·조회수·정렬과 채널 전용 비교·등록 후보·화면 필터는 서로 섞지 않습니다.
- 탭 전환과 조건 전달은 화면 메모리만 변경하며 YouTube API와 Azure DB를 호출하지 않습니다.

## 233. 2026-08-09 수집 영상 목록 빈 상태 작업 안내 개선

- 운영 화면에서 `등록 채널 21개 · 선택 채널 0개 · 불러온 영상 0개` 상태를 확인했고 브라우저 콘솔 오류는 없었습니다.
- 기능 오류가 아니라 조회 대상을 고르지 않은 초기 상태였지만, 핵심 행동이 아래에 있어 사용자가 빈 화면으로 인식할 수 있었습니다.
- 빈 상태에 현재 선택·불러온 수를 표시하고, 채널이 없으면 오늘 볼 채널 선택을 강조했습니다.
- 선택 채널이 있으면 같은 화면에서 Azure DB의 기존 수집 영상 정보를 불러오는 버튼을 제공합니다. 이 동작은 YouTube API를 호출하지 않습니다.
- 조회 성공 결과가 0개이면 새 영상 수집 화면으로 이동할 수 있지만, 이동만으로 수집이나 DB 쓰기는 실행되지 않습니다.
- 실제 앱 범위 262개 파일·1,211개 테스트와 production build가 통과했습니다. 운영 반영 확인은 배포 뒤 진행합니다.
- PR #1083 검사·main 병합·Azure Static Web Apps 배포가 성공했습니다. OIDC의 `github_id_token` 입력 경고는 남았지만 실제 배포 인증과 완료는 정상입니다.
- 운영에서 선택 채널 0개 상태의 현재 수치·첫 행동 버튼을 확인하고, David Fortin 한 채널을 화면에서 선택했습니다. 선택만으로 조회나 수집은 실행되지 않았습니다.
- 수집 영상 목록으로 돌아오자 `선택 채널 1개 · 불러온 영상 0개`와 직접 Azure DB 조회 버튼이 표시됐습니다.
- 해당 버튼을 한 번 실행해 온라인 저장소(Azure DB)의 영상 정보 251개를 불러왔습니다. YouTube API 신규 수집·DB 저장은 실행하지 않았고 브라우저 콘솔 오류도 없었습니다.
- 현재 21개 등록 채널에는 기존 수집 정보가 있어 조회 성공·0개 상태는 운영에서 인위적으로 만들지 않았습니다. 이 상태는 자동 테스트로 보호합니다.

## 234. 2026-08-09 수집 영상 조회 대상 채널명 표시

- 수집 영상 목록에서 불러온 영상 수만으로는 현재 어떤 채널 범위를 보고 있는지 즉시 알기 어려웠습니다.
- 저장된 채널 목록과 현재 선택 ID를 화면에서 대조해 상단 요약에 선택 채널 이름을 표시합니다.
- 최대 5개 이름을 표시하고 추가 선택은 `외 N개`로 요약합니다. 선택이 없으면 채널 선택 후 이름이 표시된다는 안내를 보여줍니다.
- 새 API 호출, Azure DB 조회·저장, localStorage 쓰기와 YouTube 신규 수집은 추가하지 않았습니다.
- 선택 이름 계산·요약·빈 선택 상태를 회귀 테스트로 보호합니다.
- 전체 263개 테스트 파일·1,213개 테스트와 production build가 통과했고 PR #1085를 main에 병합·배포했습니다.
- 운영에서 David Fortin 1개 선택 직후 채널명 표시를 확인했고, Azure DB 영상 251개·또터또 후보 20개를 불러온 뒤에도 채널명이 유지됐습니다.
- 운영 검수는 Azure DB 읽기 1회만 실행했으며 YouTube API 신규 수집, 댓글 API, 소재 보관·제작 후보 저장은 실행하지 않았습니다.

## 235. 2026-08-09 수집 영상 목록 검토 편의 개선 1~6

- 상단에서 `선택 채널 변경`으로 `오늘 볼 채널`을 바로 열도록 연결했습니다.
- Azure DB 조회 성공 후 현재 목록을 선택 채널별로 집계하고, 조회 전에는 개수 대신 `조회 전`을 표시합니다.
- 기본값을 또터또 여부 → 대박 지수 → 일평균 반응 → 조회수 기준의 `추천순`으로 바꿨습니다.
- `최근 30일`, `오래된 인기(6개월 이상·10만 조회)`, `또터또(6개월 이상·1.5배 반응)` 빠른 보기를 한 영역에 묶었습니다.
- 채널 요약·버튼·셀렉트·정렬·빠른 필터는 모바일에서 전체 너비로 배치되도록 클래스와 SSR 회귀 테스트를 추가했습니다.
- 전체 264개 테스트 파일·1,218개 테스트와 production build가 통과했습니다.
- 새 YouTube API 호출, Azure DB 저장, localStorage 쓰기, Azure 자원 변경은 추가하지 않았습니다.
- 현재 21개 등록 채널에는 기존 수집 정보가 있어 성공·0개 상태를 인위적으로 만들지 않았습니다. 안내는 회귀 테스트로 보호하고 자연 발생 시 운영 검수합니다.
- PR #1087 배포 뒤 조회 전 채널 개수가 `0개`로 보이는 운영 오류를 발견했습니다. `null`을 숫자 0으로 변환하던 표시 로직을 PR #1088에서 보완하고 별도 회귀 테스트를 추가했습니다.
- 재배포 후 TechByTosh·David Fortin은 Azure DB 조회 전에 모두 `조회 전`, 읽기 1회 후 각각 95개·251개로 표시됐고 전체 346개와 합계가 일치했습니다.
- 빠른 보기의 운영 결과는 최근 30일 11개·오래된 인기 12개·또터또 29개였습니다. 필터는 화면 표시만 바꿨고 `선택 채널 변경`은 선택 2개를 유지한 채 오늘 볼 채널로 이동했습니다.
- YouTube 신규 수집·댓글 API·소재 보관·제작 후보 저장·Azure DB 쓰기는 실행하지 않았습니다. 모바일은 전체 너비 반응형 클래스와 SSR 회귀 테스트로 검수했으며 실제 모바일 기기 확인은 다음 정기 사용성 점검에 포함합니다.

## 236. 2026-08-09 수집 영상 목록 후속 검토 편의 개선 1~5

- 빠른 보기 세 버튼에 현재 불러온 전체 목록 기준 해당 영상 수를 표시했습니다. Azure DB 조회 전에는 `조회 전`, 조회 성공 후 결과가 없으면 실제 `0`으로 구분합니다.
- 추천순을 선택하면 또터또 후보 → 대박 지수 → 일평균 반응 → 조회수의 정렬 판단 순서를 바로 확인할 수 있습니다.
- 선택 채널을 5개까지만 요약하는 구조는 유지하고, 6개 이상이면 접이식 전체 목록에서 모든 선택 채널과 채널별 조회 상태·영상 수를 확인하도록 보완했습니다.
- 빠른 보기 개수와 전체 채널 목록은 불러온 데이터의 화면 계산이며 새 API 호출이나 저장을 만들지 않습니다.
- 실제 0개 결과를 만들기 위한 DB 변경은 하지 않았습니다. 조회 전·실제 0개 구분은 회귀 테스트로 보호하고 자연 발생 시 운영 검수합니다.
- 실제 휴대폰을 원격으로 조작하지 못하므로 반응형 컴포넌트 테스트와 배포 후 390px 폭 모의 검수를 먼저 진행하고, 실제 기기 확인은 사용자 사용성 점검으로 남깁니다.
- 전체 265개 테스트 파일·1,223개 테스트와 production build가 통과했습니다.
- 새 YouTube API 호출, Azure DB 조회·저장 방식, localStorage, Azure 자원은 변경하지 않았습니다.

## 237. 2026-08-09 수집 영상 목록 후속 1~5 운영 검수

- PR #1090의 GitHub 검사 2개, main 빌드, Azure Static Web Apps 배포가 모두 성공했습니다.
- Edge 운영 화면에서 You_Ranking·쪼꼬미필름·Peak Viral Shorts·Jinxy·Rusuken ranking·두둠칫_Vibe 6개를 선택했습니다. 선택만으로 API나 DB 조회는 실행되지 않았습니다.
- 수집 영상 목록 조회 전 빠른 보기 세 항목과 전체 채널 목록이 모두 `조회 전`으로 표시되고 추천순 판단 설명이 보이는 것을 확인했습니다.
- 접이식 전체 목록에서 6개 채널 이름을 빠짐없이 확인했습니다.
- Azure DB 읽기 1회 후 채널별 283개·1,271개·261개·114개·1,072개·147개, 합계 3,148개가 표시됐습니다.
- 빠른 보기 개수는 최근 30일 393개·오래된 인기 868개·또터또 230개였고 최근 30일을 누르자 `현재 표시 393개 / 전체 3148개`로 일치했습니다.
- 연결된 Edge 화면 폭은 1,912px였고 브라우저 연결에서 실제 모바일 폭으로 바꿀 수 없어 실제 기기 검수는 완료로 기록하지 않았습니다. 반응형 컴포넌트 테스트는 통과했습니다.
- 자연 발생 0개 채널은 없었으며 DB를 인위적으로 바꾸지 않았습니다. 조회 전·실제 0개 구분은 자동 테스트로 보호합니다.
- YouTube API 신규 수집, 댓글 API, Azure DB 저장, 소재 보관·제작 후보 저장은 실행하지 않았습니다.

## 238. 2026-08-09 수집 영상 대량 목록 표시 개선

- 운영에서 확인한 수집 영상 3,148개를 카드·리스트 모두 한 번에 렌더링하는 구조를 코드에서 확인했습니다.
- 데이터 자체는 모두 유지하고 처음 60개만 화면에 표시한 뒤 `영상 60개 더 보기`로 60개씩 추가하도록 변경했습니다.
- 마지막 단계에서는 남은 실제 개수만 표시하고 모든 결과를 펼치면 완료 문구를 보여줍니다.
- 검색·조회수·길이·빠른 보기·정렬 결과가 바뀌면 표시 범위를 첫 60개로 되돌립니다.
- 빠른 보기 수치는 불러온 전체 목록 기준이며 다른 필터를 함께 쓰면 실제 표시 수가 줄어든다는 설명을 추가했습니다.
- 더 보기는 화면 표시만 변경하며 Azure DB 재조회·저장, YouTube API, localStorage를 사용하지 않습니다.
- 카드·리스트 60개 제한, 마지막 남은 개수, 빠른 보기 설명 회귀 테스트를 추가했습니다.
- 전체 266개 테스트 파일·1,226개 테스트와 production build가 통과했습니다.

## 239. 2026-08-10 수집 영상 대량 목록 운영 검수

- PR #1092를 main에 병합했고 main 빌드와 Azure Static Web Apps 배포가 성공했습니다.
- Edge 운영 화면에서 쪼꼬미필름 1개를 선택했습니다. 선택만으로 조회나 수집은 실행되지 않았습니다.
- 수집 영상 목록으로 이동했을 때 채널 개수와 빠른 보기 세 항목이 모두 `조회 전`으로 표시되고 빈 상태의 Azure DB 조회 안내가 보였습니다.
- Azure DB 읽기 1회로 영상 정보 1,271개를 7페이지에서 불러왔습니다. 최근 30일 82개·오래된 인기 661개·또터또 154개가 표시됐습니다.
- 카드 보기에서 처음 60개만 만들어지고 `영상 60개 더 보기` 후 120개로 늘어나는 것을 DOM 개수와 진행 문구로 확인했습니다.
- 리스트 보기에서도 120개만 표시됐고 최근 30일 필터 적용 뒤 `82개 중 60개`로 표시 범위가 초기화됐습니다.
- 390×844 모의 화면에서 문서 가로 넘침이 없고 마지막 22개 더 보기 버튼이 화면 안에 배치됐습니다. 모의 화면은 실제 휴대폰 검수를 대신하지 않습니다.
- 브라우저 콘솔 오류는 없었습니다. YouTube API 신규 수집·댓글 API·Azure DB 저장·소재 보관·제작 후보 저장은 실행하지 않았습니다.

## 240. 2026-08-10 수집 영상 목록 도구막대 UI 복구

- 운영 1,912px 화면에서 검색·정렬, 새 영상 수집, 빠른 보기 세 구역이 넓은 화면 기준으로 한 줄에 놓이면서 검색 구역의 실제 너비가 0px가 되는 오류를 확인했습니다.
- 글자가 세로로 찢어지고 오른쪽에 큰 빈 공간이 생긴 원인은 데이터가 아니라 `2xl:flex-row` 배치와 세 형제 구역의 너비 충돌이었습니다.
- 검색·정렬과 빠른 보기를 같은 주 작업 영역에 묶고, YouTube API를 사용할 수 있는 새 영상 수집은 22rem 별도 작업 열로 분리했습니다.
- 새 영상 수집 버튼과 설명은 좁은 별도 열에서 다시 눌리지 않도록 세로 배치와 전체 너비 버튼으로 정리했습니다.
- 로컬 1,912px 검수에서 주 작업 영역 964px·새 영상 수집 352px로 표시됐고, 390×844에서는 두 영역이 275px 한 열로 내려왔습니다. 두 화면 모두 가로 넘침이 없었습니다.
- 소재 보관함 → 제작 후보함 → 대본 작업실의 화면 이동과 제목을 읽기 전용으로 확인했습니다. 이동만으로 DB 저장이나 YouTube API 호출은 없었습니다.
- 카드·데스크톱 리스트 썸네일은 `loading=lazy`·`decoding=async`를 사용하며 모바일 간소 리스트는 썸네일을 만들지 않는 기존 성능 구조를 확인했습니다.
- PR #1094 검사·main 병합·Azure Static Web Apps 배포가 성공했습니다. 운영 1,912px 화면에서도 주 작업 964px·새 영상 수집 352px로 표시됐고 가로 넘침과 콘솔 오류가 없었습니다.

## 241. 2026-08-10 수집 영상 목록 상단 정보 간소화

- 운영 화면에서 바깥 페이지 제목과 안쪽 `수집 영상 목록` 제목이 반복되고, 등록 채널·스크랩 소재 수치와 작업 순서 3칸이 첫 화면을 길게 만드는 문제를 확인했습니다.
- 안쪽 제목은 실제 작업을 설명하는 `영상 검토 보드`로 바꾸고, 전역 상단과 겹치던 등록 채널·스크랩 소재 카드는 제거했습니다.
- 안쪽 요약은 불러온 영상·보관 표시·또터또 후보 3개만 남겼습니다.
- 작업 순서 3개는 `이 화면 작업 순서 보기`를 눌렀을 때 펼쳐지는 도움말로 바꿨습니다. 빈 목록의 구체적인 다음 행동 안내는 기존대로 유지합니다.
- 로컬 1,912×867 화면에서 H2 `수집 영상 목록`은 1개, 안쪽 H3 `영상 검토 보드`는 1개이며 작업 순서가 기본으로 접혀 있음을 확인했습니다.
- 화면 표시만 변경했으며 Azure DB 조회·저장, localStorage, YouTube API 계약은 변경하지 않았습니다.
- PR #1096 검사·main 병합·Azure Static Web Apps 배포가 성공했습니다.
- 운영 1,912×866 화면에서 H2 `수집 영상 목록` 1개, H3 `영상 검토 보드` 1개, `이 화면 작업 순서 보기` 기본 접힘을 확인했고 콘솔 오류는 없었습니다.
- 운영 최종 확인은 화면 이동과 표시만 사용했으며 Azure DB 조회·저장과 YouTube API 신규 수집은 실행하지 않았습니다.
