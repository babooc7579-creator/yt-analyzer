# Creator OS 다음 구현 이슈 계획

작성일: 2026-07-02

이 문서는 지금까지 작성한 Creator OS 기준 문서들을 실제 작업 순서로 바꾸기 위한 실행 계획입니다.

중요: 이 문서는 구현 문서가 아니라 작업 분해 문서입니다. 코드, API, DB schema, localStorage key는 변경하지 않습니다.

---

## 1. 현재 기준

현재 Creator OS는 "저장된 유튜브 채널과 영상 데이터를 바탕으로 소재를 발굴하는 도구"에서 "오늘 무엇을 만들지 결정하게 돕는 운영 OS"로 넘어가는 중입니다.

지금 단계의 핵심은 큰 기능 추가가 아니라 데이터 기준을 안정화하는 것입니다.

현재 고정된 사실:

- `GET /videos?channelIds=...`는 저장된 영상 DB 조회입니다.
- `POST /scan/selected`, `GET /scan`, `GET /scan?tag=...`는 YouTube API 호출과 DB 갱신이 발생할 수 있습니다.
- `/video-records`는 기존 대표 상태 `status`를 유지합니다.
- `statusIds`는 복수 판단 보존용 보조 필드로 백엔드 저장/조회에 추가됐고, 2026-07-02 배포 smoke로 확인됐습니다.
- `/scrapbook`은 별도 container가 아니라 `videos` container 안의 `docType: scrapbook` 구조입니다.
- `scan_logs`, `api_quota_logs`, `production_candidates`, `discovery_links`, `local_assets`는 아직 별도 저장소가 없습니다.
- 카테고리 화면 목록은 localStorage 중심이고, 실제 채널 태그는 Cloud DB `channels.tags` 중심입니다.
- Cloud/localStorage 동기화는 선택지 B로 결정됐습니다. Cloud 조회 성공 시 Cloud가 기준이고, localStorage는 Cloud 실패 시 명시적 fallback으로만 사용합니다.

---

## 2. 우선순위 기준

### P0: 지금 바로 안전하게 가능한 작업

코드 동작을 바꾸지 않는 문서 정리, 감사, 이슈 분해 작업입니다.

### P1: 작은 프론트 정리

기존 데이터 구조를 바꾸지 않고, 버튼 문구나 안내 문구처럼 사용자의 오해를 줄이는 작업입니다.

### P2: 데이터 기준 결정 후 가능한 작업

`status/statusIds` 장기 분리, Cloud/localStorage sync, 카테고리/태그 기준처럼 데이터 의미가 바뀔 수 있는 작업입니다.

### P3: 백엔드/API/DB 변경이 필요한 작업

새 endpoint, 새 저장소, pagination, scan logs, api quota logs 같은 작업입니다.

### P4: 1차 안정화 이후 작업

대규모 UI 개편, 제작 칸반 확장, discovery links/local assets 실제 구현, 자동화, AI 연동입니다.

---

## 3. 지금 사용자가 결정해야 하는 것

현재 시점에서 즉시 결정해야 하는 것은 없습니다.

다만 아래 작업을 구현하기 직전에는 사용자 결정을 받아야 합니다.

- `status`, `statusIds`를 장기적으로 `lifecycleStatus`, `usagePurposeTags`, `productionStatus`로 분리할지
- 카테고리 목록을 Cloud 태그 기준으로 바꿀지
- `production_candidates`를 별도 DB로 만들지
- `discovery_links`, `local_assets` API를 만들지
- `scan_logs`, `api_quota_logs` 저장소를 만들지

---

## 4. 추천 작업 순서

### Issue 1. 문서 인덱스와 작업 기준 문서 정리

- 목적: 지금까지 만든 기준 문서가 흩어지지 않도록 다음 작업자가 한 번에 이해할 수 있게 합니다.
- 현재 상태: 여러 개의 Creator OS 문서가 있지만, 읽는 순서와 용도가 한 곳에 모여 있지 않습니다.
- 왜 필요한가: 비슷한 판단을 반복하지 않고, 코드 작업 전에 기준 문서를 먼저 확인하게 하기 위해서입니다.
- 작업 범위: `docs` 안에 문서 목록, 읽는 순서, 각 문서의 목적을 정리합니다.
- 건드릴 파일: `docs/CREATOR_OS_DOCUMENT_INDEX.md` 또는 기존 README성 문서.
- 건드리면 안 되는 것: 앱 코드, API, DB schema, localStorage key.
- 위험도: 낮음.
- 완료 기준: 어떤 문서를 먼저 봐야 하는지 한 페이지에서 확인할 수 있습니다.
- 사용자 판단 필요 여부: 필요 없음.

### Issue 2. "저장 영상 불러오기"와 "새 영상 수집" 문구 정리

- 목적: 사용자가 비용성 작업과 단순 조회를 헷갈리지 않게 합니다.
- 현재 상태: 원칙은 문서화됐지만 화면 문구가 모든 위치에서 완전히 일관적인지는 추가 확인이 필요합니다.
- 왜 필요한가: YouTube API 호출은 비용과 quota가 걸릴 수 있어 버튼을 누르기 전 의미가 명확해야 합니다.
- 작업 범위: 버튼명, 보조 설명, 안내 문구를 점검하고 필요한 곳만 작게 수정합니다.
- 건드릴 파일 예상: `src/App.jsx`, 관련 컴포넌트, 필요 시 `src/constants`.
- 건드리면 안 되는 것: API 호출 로직, scan 동작, 저장 데이터 구조.
- 위험도: 낮음.
- 완료 기준: DB 조회 버튼과 YouTube API 호출 버튼이 화면에서 명확히 구분됩니다.
- 사용자 판단 필요 여부: 문구 방향은 Codex가 진행 가능. 다만 큰 UI 재배치는 별도 판단 필요.

### Issue 3. 카테고리 삭제/이름 변경의 실제 의미를 UI에서 분리

- 목적: "카테고리 삭제"가 Cloud 채널 태그 삭제인지, 화면 목록에서 숨기는 것인지 오해를 줄입니다.
- 현재 상태: 카테고리 추가/삭제는 localStorage 중심이고, 이름 변경은 Cloud 태그 변경까지 수행합니다.
- 왜 필요한가: 사용자는 카테고리를 지웠다고 생각하지만 Cloud 채널 태그는 남을 수 있습니다.
- 작업 범위: 삭제/이름 변경 버튼 설명, 확인 문구, 위험 안내를 작게 개선합니다.
- 건드릴 파일 예상: `src/components/ChannelAddForm.jsx`, `src/App.jsx`, 카테고리 관련 상수/유틸.
- 건드리면 안 되는 것: `/tags/rename` endpoint 동작, Cloud 태그 구조, localStorage key.
- 위험도: 낮음에서 중간.
- 완료 기준: 화면에서 "화면 목록에서 제거"와 "Cloud 태그 이름 변경"이 구분됩니다.
- 사용자 판단 필요 여부: 문구 개선은 필요 없음. 카테고리 구조 변경은 필요.

### Issue 4. videoUserRecords 저장 흐름 실패 안내 보강

- 목적: 영상 상태 저장이 Cloud에 실패했을 때 사용자가 알 수 있게 합니다.
- 현재 상태: 프론트는 localStorage에 먼저 반영하고 Cloud 저장을 시도합니다. 실패하면 화면과 Cloud DB가 달라질 수 있습니다.
- 왜 필요한가: "검토 완료", "제작 후보" 같은 판단 기록은 앱의 핵심 데이터입니다.
- 작업 범위: 저장 실패 시 안내 표시, 재시도 후보, Cloud sync 상태 표시를 작게 검토합니다.
- 건드릴 파일 예상: `src/App.jsx`, `src/services/functionApi.js`, 상태 표시 컴포넌트.
- 건드리면 안 되는 것: `/video-records` schema, `statusIds` 저장 방식, localStorage key.
- 위험도: 중간.
- 완료 기준: 저장 실패가 조용히 묻히지 않고 사용자가 인지할 수 있습니다.
- 사용자 판단 필요 여부: 작게 실패 안내만 추가하면 필요 없음. sync 정책 변경은 필요.

### Issue 5. `/video-records` 장기 상태 모델 검토

- 목적: 지금은 `status`와 `statusIds`를 함께 쓰되, 장기적으로 영상 상태/용도 태그/제작 진행 상태를 분리할 필요가 있는지 검토합니다.
- 현재 상태: `status`는 기존 대표 상태로 유지하고, `statusIds`는 복수 판단 보존용으로 Cloud에 저장/조회됩니다.
- 왜 필요한가: "제작 후보", "자료 참고", "사용함" 같은 값이 많아질수록 단일 상태와 복수 태그의 역할이 흐려질 수 있습니다.
- 작업 범위: 장기 모델 선택지 검토. 당장 재설계하지 않습니다.
- 건드릴 파일 예상: 문서 우선. 이후 필요 시 상태 상수, 제작 후보 화면, 백엔드 `videoUserRecords` endpoint.
- 건드리면 안 되는 것: 기존 `status` 제거, 기존 `statusIds` 의미 변경, 기존 데이터 마이그레이션.
- 위험도: 높음.
- 완료 기준: 1차 완성까지 현재 구조를 유지할지, 별도 상태 모델 분리를 언제 검토할지 기준이 정리됩니다.
- 사용자 판단 필요 여부: 필요.

### Issue 6. Cloud/localStorage sync 정책 적용 완료

- 목적: Cloud DB와 localStorage가 다를 때 어느 쪽을 기준으로 볼지 확정합니다.
- 현재 상태: 선택지 B가 승인되어 적용됐습니다. Cloud-first + 명시적 local fallback입니다.
- 왜 필요한가: 몇 달 모은 스크랩북이나 영상 판단 기록이 사라져 보이는 상황을 막아야 합니다.
- 작업 범위: Cloud 조회 성공 시 Cloud 기준, Cloud 실패 시 localStorage 임시 fallback, Cloud 저장 성공 후에만 localStorage 캐시 갱신.
- 건드릴 파일 예상: `src/App.jsx`, `src/services/storage.js`, scrapbook/videoUserRecords 관련 코드.
- 건드리면 안 되는 것: localStorage key 제거, 자동 마이그레이션, 자동 업로드, Cloud/localStorage 자동 병합.
- 위험도: 중간.
- 완료 기준: Cloud 실패 시 localStorage fallback이 임시 기록으로 표시되고, Cloud 성공 데이터가 기준으로 유지됩니다.
- 사용자 판단 필요 여부: 완료됨. 수동 복구/마이그레이션 기능은 별도 판단 필요.

### Issue 7. 저장 영상 조회 페이지네이션 필요성 평가

- 목적: 영상 수가 많아졌을 때 `GET /videos`가 느려지는 문제를 미리 평가합니다.
- 현재 상태: `/videos?channelIds=...`는 DB 조회지만 페이지네이션 없이 `fetchAll()` 구조입니다.
- 왜 필요한가: 채널과 영상이 늘면 앱 첫 사용감이 무거워질 수 있습니다.
- 작업 범위: 현재 데이터 양, 응답 크기, 화면 사용 흐름을 audit합니다. 바로 구현하지 않습니다.
- 건드릴 파일 예상: 백엔드 videos endpoint, 프론트 영상 로딩 로직.
- 건드리면 안 되는 것: endpoint 응답 구조 변경, 정렬/필터 동작 변경.
- 위험도: 중간.
- 완료 기준: pagination을 지금 할지, 1차 완성 후 할지 판단할 근거가 생깁니다.
- 사용자 판단 필요 여부: 평가만 하면 필요 없음. 구현은 필요.

### Issue 8. scan/API 사용 기록 모델 검토

- 목적: YouTube API 호출이 언제, 왜 발생했는지 추적할 기준을 만듭니다.
- 현재 상태: `scan_logs`, `api_quota_logs`는 없습니다. 채널별 `lastScanSummary`만 있습니다.
- 왜 필요한가: 사용자가 "조회"와 "수집"을 구분하고, API 사용량을 관리하기 위해 필요합니다.
- 작업 범위: 모델 선택지 작성. 바로 endpoint나 container를 만들지 않습니다.
- 건드릴 파일 예상: 문서 우선. 이후 백엔드 Functions, Cosmos container 설정.
- 건드리면 안 되는 것: 새 container 추가, scan endpoint 동작 변경, 자동 스캔.
- 위험도: 중간에서 높음.
- 완료 기준: scan log와 quota log를 따로 둘지, 어떤 필드가 필요한지 정리됩니다.
- 사용자 판단 필요 여부: 구현 전 필요.

### Issue 9. discovery links/local assets MVP 범위 결정

- 목적: 인스타/외부 링크와 다운로드한 로컬 파일을 안전하게 연결하는 최소 범위를 정합니다.
- 현재 상태: 목표 모델 문서는 있지만 실제 기능은 없습니다.
- 왜 필요한가: Creator OS가 "소재 발굴"에서 "제작 준비"로 넘어가려면 외부 링크와 파일 출처가 연결되어야 합니다.
- 작업 범위: 수동 링크 저장 MVP, 로컬 파일 메타데이터, 권리 확인 상태의 최소 범위 결정.
- 건드릴 파일 예상: 문서 우선. 이후 프론트 화면, 백엔드 API, DB 모델.
- 건드리면 안 되는 것: 인스타 자동 크롤링, 자동 다운로드, 무단 수집, 새 API 구현.
- 위험도: 높음.
- 완료 기준: 1차 MVP에서 링크만 저장할지, 파일 메타데이터까지 저장할지 결정됩니다.
- 사용자 판단 필요 여부: 필요.

### Issue 10. 제작 후보와 제작 칸반의 데이터 기준 결정

- 목적: "제작 후보"가 단순 영상 상태인지, 별도 제작 프로젝트인지 구분합니다.
- 현재 상태: 별도 `production_candidates` 저장소는 없고 `videoUserRecords` 상태값으로 표현합니다.
- 왜 필요한가: 후보에서 업로드 완료까지 추적하려면 영상 검토 상태와 제작 진행 상태가 점점 달라집니다.
- 작업 범위: MVP에서는 `videoUserRecords`를 유지할지, 이후 별도 모델로 분리할지 결정합니다.
- 건드릴 파일 예상: 상태 상수, 제작 후보 화면, 백엔드 모델.
- 건드리면 안 되는 것: 별도 DB 즉시 추가, 기존 후보 상태 삭제.
- 위험도: 높음.
- 완료 기준: 1차 완성 범위에서 제작 후보를 어디에 저장할지 결정됩니다.
- 사용자 판단 필요 여부: 필요.

---

## 5. Codex 추천 진행 순서

바로 다음 작업은 아래 순서를 추천합니다.

1. Issue 1: 문서 인덱스와 작업 기준 문서 정리
2. Issue 2: DB 조회와 YouTube API 호출 문구 정리
3. Issue 3: 카테고리 삭제/이름 변경 의미 정리
4. Issue 4: videoUserRecords 저장 실패 안내 보강
5. Issue 5: `/video-records` 장기 상태 모델 검토

이 순서가 안전한 이유:

- 먼저 문서 기준을 고정합니다.
- 그다음 사용자가 실수하기 쉬운 UI 문구를 정리합니다.
- 이후에야 데이터 구조 결정으로 넘어갑니다.
- DB/API 변경은 마지막에 별도 판단을 받고 진행합니다.

---

## 6. 지금 하지 말아야 할 작업

현재 단계에서 아래 작업은 하지 않습니다.

- 전체 UI 대개편
- `App.jsx` 대규모 재작성
- 새 endpoint 추가
- 새 Cosmos container 추가
- 기존 `status` 제거 또는 의미 변경
- `statusIds` 전체 재설계
- localStorage key 변경 또는 제거
- 기존 데이터 마이그레이션
- YouTube API 호출이 늘어나는 자동화
- 인스타 자동 크롤링 또는 자동 다운로드
- 로그인, 권한, 결제 구조
- 새 라이브러리 추가

---

## 7. 다음 작업 전 체크리스트

코드 작업을 시작하기 전에는 매번 아래를 확인합니다.

- 이 작업이 DB 조회인지, YouTube API 호출인지 구분했는가?
- Cloud DB 기준 데이터와 localStorage 보조 데이터를 구분했는가?
- 기존 사용자의 저장 데이터가 사라질 위험이 없는가?
- `App.jsx`를 한 번에 크게 바꾸지 않는가?
- 기능 변경과 UI/UX 개선을 분리했는가?
- 사용자 결정이 필요한 데이터 구조 변경은 아닌가?
