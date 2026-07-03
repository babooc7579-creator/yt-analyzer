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
- discovery links 1차 MVP는 별도 저장소 없이 기존 `videos` container의 `docType: discovery_link` 방식으로 부분 구현되었습니다.
- 2026-07-03 읽기 전용 확인에서 `GET /discovery-links`는 배포 환경에서 성공했고, 현재 Cloud 발견함 링크는 0개였습니다.
- 2026-07-03 사용자 승인 후 발견 링크 저장/상태 수정/제목·메모 수정/삭제 smoke test를 완료했습니다. 임시 테스트 링크는 삭제됐고, 재조회에서 Cloud 발견함 링크 0개와 임시 smoke 링크 0개를 확인했습니다.
- 2026-07-03 읽기 전용 확인에서 `GET /videos`는 `channelIds` 없이 호출하면 400으로 거절되어, 저장 영상 조회가 채널 기준 DB 조회로 제한되는 것을 확인했습니다.
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

대규모 UI 개편, 제작 칸반 확장, discovery links 후속 확장, local assets 실제 구현, 자동화, AI 연동입니다.

---

## 3. 지금 사용자가 결정해야 하는 것

현재 시점에서 즉시 결정해야 하는 것은 없습니다.

다만 아래 작업을 구현하기 직전에는 사용자 결정을 받아야 합니다.

- `status`, `statusIds`를 장기적으로 `lifecycleStatus`, `usagePurposeTags`, `productionStatus`로 분리할지
- 카테고리 목록을 Cloud 태그 기준으로 바꿀지
- `production_candidates`를 별도 DB로 만들지
- `discovery_links`를 별도 저장소로 분리할지, `local_assets` API를 만들지
- `scan_logs`, `api_quota_logs` 저장소를 만들지

---

## 4. 추천 작업 순서

### Issue 1. 문서 인덱스와 작업 기준 문서 정리

- 목적: 지금까지 만든 기준 문서가 흩어지지 않도록 다음 작업자가 한 번에 이해할 수 있게 합니다.
- 현재 상태: 2026-07-03 기준 적용됨. `CREATOR_OS_DOCUMENT_INDEX.md`에서 모든 docs 문서를 읽는 순서, 작업 기준, 참고/히스토리 문서로 연결합니다.
- 왜 필요한가: 비슷한 판단을 반복하지 않고, 코드 작업 전에 기준 문서를 먼저 확인하게 하기 위해서입니다.
- 작업 범위: `docs` 안에 문서 목록, 읽는 순서, 각 문서의 목적을 정리했습니다.
- 건드릴 파일: `docs/CREATOR_OS_DOCUMENT_INDEX.md`.
- 건드리면 안 되는 것: 앱 코드, API, DB schema, localStorage key.
- 위험도: 낮음.
- 완료 기준: 완료. 어떤 문서를 먼저 봐야 하는지 한 페이지에서 확인할 수 있습니다.
- 사용자 판단 필요 여부: 필요 없음.

### Issue 2. "저장 영상 불러오기"와 "새 영상 수집" 문구 정리

- 목적: 사용자가 비용성 작업과 단순 조회를 헷갈리지 않게 합니다.
- 현재 상태: 2026-07-02에 채널 확인/저장, 저장 영상 불러오기 문구를 1차 정리했습니다. 전체 화면의 세부 문구는 이후 화면 단위 점검으로 이어갑니다.
- 추가 상태: 2026-07-03에 버튼, 입력/선택 컨트롤, 새 탭 링크, 발견함 피드백 메시지의 `title` / `aria-label` / 상태 안내를 보강했습니다. 이후 발견 링크 카드에 `제작 후보로` 빠른 버튼을 추가해 기존 `status: candidate` 저장 흐름을 더 명확히 했습니다.
- 왜 필요한가: YouTube API 호출은 비용과 quota가 걸릴 수 있어 버튼을 누르기 전 의미가 명확해야 합니다.
- 작업 범위: 버튼명, 보조 설명, 안내 문구를 점검하고 필요한 곳만 작게 수정합니다.
- 건드릴 파일 예상: `src/App.jsx`, 관련 컴포넌트, 필요 시 `src/constants`.
- 건드리면 안 되는 것: API 호출 로직, scan 동작, 저장 데이터 구조.
- 위험도: 낮음.
- 완료 기준: 1차 완료. DB 조회 버튼과 YouTube API 호출 버튼이 주요 흐름에서 구분되고, 발견함에서 제작 후보로 보내는 흐름이 상태 선택뿐 아니라 명시 버튼으로도 보입니다.
- 사용자 판단 필요 여부: 문구 방향은 Codex가 진행 가능. 다만 큰 UI 재배치는 별도 판단 필요.

### Issue 3. 카테고리 삭제/이름 변경의 실제 의미를 UI에서 분리

- 목적: "카테고리 삭제"가 Cloud 채널 태그 삭제인지, 화면 목록에서 숨기는 것인지 오해를 줄입니다.
- 현재 상태: 2026-07-02 기준 1차 적용됨. 카테고리 삭제는 화면 목록에서만 숨긴다는 확인 문구와 tooltip이 있고, 이름 변경은 Cloud 태그 이름 변경으로 안내합니다.
- 왜 필요한가: 사용자는 카테고리를 지웠다고 생각하지만 Cloud 채널 태그는 남을 수 있습니다.
- 작업 범위: 삭제/이름 변경 버튼 설명, 확인 문구, 위험 안내를 작게 개선합니다.
- 건드릴 파일 예상: `src/components/ChannelAddForm.jsx`, `src/App.jsx`, 카테고리 관련 상수/유틸.
- 건드리면 안 되는 것: `/tags/rename` endpoint 동작, Cloud 태그 구조, localStorage key.
- 위험도: 낮음에서 중간.
- 완료 기준: 1차 완료. 화면에서 "화면 목록에서 제거"와 "Cloud 태그 이름 변경"이 구분됩니다.
- 사용자 판단 필요 여부: 문구 개선은 필요 없음. 카테고리 구조 변경은 필요.

### Issue 4. videoUserRecords 저장 흐름 실패 안내 보강

- 목적: 영상 상태 저장이 Cloud에 실패했을 때 사용자가 알 수 있게 합니다.
- 현재 상태: 2026-07-02 기준 1차 적용됨. Cloud-first + localStorage fallback 정책에 맞춰 저장 실패 시 상단 경고 배너로 안내하고, Cloud 저장 성공 기록만 localStorage 캐시에 반영합니다.
- 왜 필요한가: "검토 완료", "제작 후보" 같은 판단 기록은 앱의 핵심 데이터입니다.
- 작업 범위: 저장 실패 시 안내 표시, 재시도 후보, Cloud sync 상태 표시를 작게 검토합니다.
- 건드릴 파일 예상: `src/App.jsx`, `src/services/functionApi.js`, 상태 표시 컴포넌트.
- 건드리면 안 되는 것: `/video-records` schema, `statusIds` 저장 방식, localStorage key.
- 위험도: 중간.
- 완료 기준: 1차 완료. 저장 실패가 조용히 묻히지 않고 사용자가 인지할 수 있습니다.
- 사용자 판단 필요 여부: 1차 실패 안내는 완료됨. 재시도 큐, pending sync, 수동 복구/마이그레이션은 별도 판단 필요.

### Issue 5. `/video-records` 장기 상태 모델 검토

- 목적: 지금은 `status`와 `statusIds`를 함께 쓰되, 장기적으로 영상 상태/용도 태그/제작 진행 상태를 분리할 필요가 있는지 검토합니다.
- 현재 상태: `status`는 기존 대표 상태로 유지하고, `statusIds`는 복수 판단 보존용으로 Cloud에 저장/조회됩니다. 2026-07-02에 `CREATOR_OS_VIDEO_RECORDS_LONG_TERM_MODEL.md`로 장기 선택지를 정리했고, 선택지 B가 승인되어 상태 역할 helper를 1차 적용했습니다.
- 왜 필요한가: "제작 후보", "자료 참고", "사용함" 같은 값이 많아질수록 단일 상태와 복수 태그의 역할이 흐려질 수 있습니다.
- 작업 범위: 장기 모델 선택지 검토. 당장 재설계하지 않습니다.
- 건드릴 파일 예상: 문서 우선. 이후 필요 시 상태 상수, 제작 후보 화면, 백엔드 `videoUserRecords` endpoint.
- 건드리면 안 되는 것: 기존 `status` 제거, 기존 `statusIds` 의미 변경, 기존 데이터 마이그레이션.
- 위험도: 높음.
- 완료 기준: 1차 완료. DB/API 변경 없이 영상 검토 상태와 제작 상태를 구분하는 helper가 추가됐습니다.
- 사용자 판단 필요 여부: 현재 없음. `status: new` 처리, 명시 필드 분리, production_candidates DB 도입은 별도 판단 필요.

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
- 현재 상태: 2026-07-02 기준 감사 완료. `/videos?channelIds=...`는 DB 조회지만 페이지네이션 없이 전체 조회 구조입니다.
- 왜 필요한가: 채널과 영상이 늘면 앱 첫 사용감이 무거워질 수 있습니다.
- 작업 범위: 현재 데이터 양, 응답 크기, 화면 사용 흐름을 audit했습니다. 바로 구현하지 않습니다.
- 건드릴 파일 예상: 백엔드 videos endpoint, 프론트 영상 로딩 로직.
- 건드리면 안 되는 것: endpoint 응답 구조 변경, 정렬/필터 동작 변경.
- 위험도: 중간.
- 확인 결과: 운영 데이터 기준 저장 영상 1,821개, `/videos` 응답 약 1.16MB입니다.
- 완료 기준: 감사 문서 `CREATOR_OS_VIDEOS_PAGINATION_AUDIT.md` 작성 완료. 현재는 전체 조회 유지가 권장됩니다.
- 다시 검토할 조건: 저장 영상 5,000개 이상, 응답 5MB 이상, 로딩 3초 이상, 카드/리스트 스크롤 지연, 모바일 렌더링 지연.
- 사용자 판단 필요 여부: 현재 없음. 실제 페이지네이션 구현은 endpoint 응답 구조와 정렬/필터 기준이 바뀌므로 별도 판단 필요.

### Issue 8. scan/API 사용 기록 모델 검토

- 목적: YouTube API 호출이 언제, 왜 발생했는지 추적할 기준을 만듭니다.
- 현재 상태: 2026-07-02 기준 검토 완료. `scan_logs`, `api_quota_logs`는 없습니다. 채널별 `lastScanSummary`만 있습니다.
- 왜 필요한가: 사용자가 "조회"와 "수집"을 구분하고, API 사용량을 관리하기 위해 필요합니다.
- 작업 범위: 모델 선택지 작성 완료. 바로 endpoint나 container를 만들지 않습니다.
- 건드릴 파일 예상: 문서 우선. 이후 백엔드 Functions, Cosmos container 설정.
- 건드리면 안 되는 것: 새 container 추가, scan endpoint 동작 변경, 자동 스캔.
- 위험도: 중간에서 높음.
- 완료 기준: `CREATOR_OS_SCAN_API_USAGE_MODEL.md` 작성 완료. `scan_logs`와 `api_quota_logs`는 개념상 분리하는 방향이 권장됩니다.
- 사용자 판단 필요 여부: 현재 없음. 실제 구현은 새 저장소 또는 새 `docType`, endpoint가 필요하므로 별도 판단 필요.

### Issue 9. discovery links/local assets MVP 범위 결정

- 목적: 인스타/외부 링크와 다운로드한 로컬 파일을 안전하게 연결하는 최소 범위를 정합니다.
- 현재 상태: 2026-07-02 기준 MVP 범위 검토 완료. discovery links 수동 저장 1차 MVP는 부분 구현되었고, local assets는 아직 목표 모델 단계입니다.
- 추가 확인: 2026-07-03 기준 배포 환경에서 `GET /discovery-links` 읽기 호출은 성공했습니다. 사용자 승인 후 임시 링크를 Cloud에 만들고, `status: candidate`, `rightsStatus: needs_check`, 제목·메모 수정, 삭제까지 확인했습니다. 최종 재조회에서 Cloud 발견함 링크 0개와 임시 smoke 링크 0개를 확인했습니다.
- 왜 필요한가: Creator OS가 "소재 발굴"에서 "제작 준비"로 넘어가려면 외부 링크와 파일 출처가 연결되어야 합니다.
- 작업 범위: 수동 링크 저장 MVP는 구현 기준으로 반영했고, 로컬 파일 메타데이터와 권리 확인 상태의 확장 범위를 선택지로 정리했습니다.
- 건드릴 파일 예상: 문서 우선. 이후 프론트 화면, 백엔드 API, DB 모델.
- 건드리면 안 되는 것: 인스타 자동 크롤링, 자동 다운로드, 무단 수집, 새 API 구현.
- 위험도: 높음.
- 완료 기준: `CREATOR_OS_DISCOVERY_LINKS_MVP_SCOPE.md` 작성 완료. 1차 MVP는 수동 링크 저장 중심의 발견함으로 부분 구현되었습니다.
- 사용자 판단 필요 여부: 현재 문서화와 1차 MVP 연결은 완료. MVP 저장 위치는 `docType: discovery_link`, 상태값은 `inbox/reviewing/saved/candidate/discarded`와 `rightsStatus` 분리로 정리됨. 다음 판단은 local assets, 제작 후보 연결, 별도 `discovery_links` container 분리 여부입니다.

### Issue 10. 제작 후보와 제작 칸반의 데이터 기준 결정

- 목적: "제작 후보"가 단순 영상 상태인지, 별도 제작 프로젝트인지 구분합니다.
- 현재 상태: 2026-07-02 기준 MVP 범위 검토 완료. 별도 `production_candidates` 저장소는 없고 `videoUserRecords` 상태값으로 표현합니다.
- 왜 필요한가: 후보에서 업로드 완료까지 추적하려면 영상 검토 상태와 제작 진행 상태가 점점 달라집니다.
- 작업 범위: MVP에서는 `videoUserRecords`를 유지하고, 이후 별도 모델로 분리할 조건을 정리했습니다.
- 건드릴 파일 예상: 상태 상수, 제작 후보 화면, 백엔드 모델.
- 건드리면 안 되는 것: 별도 DB 즉시 추가, 기존 후보 상태 삭제.
- 위험도: 높음.
- 완료 기준: `CREATOR_OS_PRODUCTION_CANDIDATES_MVP_SCOPE.md` 작성 완료. 1차 MVP는 `videoUserRecords` 기반 유지가 권장됩니다.
- 사용자 판단 필요 여부: 현재 문서화는 완료. 별도 `production_candidates` DB 도입은 나중에 별도 판단 필요.

---

## 5. Codex 추천 진행 순서

바로 다음 작업은 아래 순서를 추천합니다.

1. GitHub Actions와 Azure Static Web Apps 경고를 별도 배포 설정 이슈로 검토. 2026-07-03 기준 선택지 B인 배포 token 방식 단순화는 실제 main 배포에서 실패했습니다. 우선 기존 OIDC 흐름을 복구하고, deployment token 또는 Azure 인증 설정 확인 후 다시 검토합니다.
2. local assets, 발견 링크의 제작 후보 연결, 별도 `discovery_links` container 분리 여부는 별도 선택지 보고 후 결정
3. 발견 링크 저장/수정/삭제 smoke test는 완료됐으므로, 다음 discovery 작업은 실제 사용 중 발견한 UI 불편이나 local assets 연결 판단이 생길 때 진행

이 순서가 안전한 이유:

- 문서 기준, UI 문구 감사, 저장 영상 페이지네이션 감사, scan/API 사용 기록 모델, discovery MVP 범위 검토, 제작 후보 MVP 범위 검토는 완료됐습니다.
- discovery links 1차 MVP는 `/discovery-links`와 `docType: discovery_link` 방식으로 부분 구현되었습니다.
- 이후에는 이미 구현된 발견함을 안정화한 뒤, local assets와 제작 후보 연결처럼 데이터 의미가 커지는 작업을 별도 판단으로 넘깁니다.
- DB/API 변경은 계속 별도 판단을 받고 진행합니다.

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
