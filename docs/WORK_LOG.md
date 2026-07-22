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
