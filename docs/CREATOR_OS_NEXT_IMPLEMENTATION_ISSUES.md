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
- 2026-07-03 UI 문구 안정화 3차 작업을 완료했습니다. 제작 후보함, 발견함, 홈, 채널 목록, 저장 영상 카드/리스트, 오늘 레이더, 새 영상 수집 버튼에서 Cloud 저장/삭제/상태 변경/YouTube API 호출 여부를 더 명확히 안내합니다.
- 2026-07-03 배포 정적 smoke 확인을 완료했습니다. 배포 앱 루트는 200 OK였고, 최신 번들 `index-BfGF_95e.js`에 새 영상 수집/발견함/제작 후보 관련 보강 문구가 포함된 것을 확인했습니다. 이 확인은 화면 클릭 테스트가 아니라 배포 파일 기준 확인입니다.
- 2026-07-03 배포 화면 smoke 확인을 완료했습니다. 홈, 발견함, 제작 후보함, 채널 목록 화면이 열렸고 주요 안내 문구가 보였습니다. 저장/삭제/수집 같은 데이터 변경 버튼은 누르지 않았고, 브라우저 콘솔 error 로그는 없었습니다.
- 2026-07-03 기준 GitHub Actions의 Node.js 20 경고와 Azure Static Web Apps `github_id_token` 경고는 남아 있지만, main 빌드와 Azure 배포는 계속 성공하고 있습니다. 배포 설정 변경은 별도 판단 후 진행합니다.
- 2026-07-03 사용자 결정 기준으로 원본 파일 자동 다운로드/업로드는 MVP에서 제외하고, 채널/영상/발견 링크의 URL 보존과 복사 편의를 우선합니다. URL 복사는 클립보드 편의 기능이며 YouTube API 호출, DB schema 변경, localStorage key 변경을 만들지 않습니다.
- 2026-07-03 오늘 레이더 후보 카드에도 원본 URL 복사를 추가했습니다. 이 동작은 로컬 클립보드 복사이며 YouTube API 호출, Cloud DB 변경, localStorage 변경을 만들지 않습니다.
- 2026-07-03 AI 리메이크 프롬프트 복사는 공통 클립보드 helper를 사용하도록 정리했고, 선택 영상/스크랩북/제작 후보함 버튼에 복사 성공/실패 피드백을 표시합니다. 이 동작은 외부 AI API를 호출하지 않습니다.
- 2026-07-03 댓글 Top 10 조회의 YouTube API 요청 URL 인코딩과 오류/비JSON 응답 처리를 보강했습니다. 댓글 조회는 여전히 사용자 API Key 기반의 YouTube API 호출이며 Cloud DB나 localStorage를 변경하지 않습니다.
- 2026-07-03 프론트 Cloud Function API helper의 응답 처리를 보강했습니다. 비정상 HTTP 응답이나 JSON이 아닌 응답은 사용자용 오류 메시지로 정리되며 endpoint, DB schema, localStorage key는 변경하지 않았습니다.
- 2026-07-08 구조 안정화 후속 작업으로 레이더 후보, Creator OS 지표, 제작 칸반 데이터 모델을 hook 밖의 순수 유틸로 분리했고, 홈 화면 내비게이션 props와 홈 빠른 작업 버튼 문구, 홈 레이더 작업 흐름 안내, 저장 영상 안내 카드, 태그별 새 영상 수집 안내, 채널 추가 안내 문구, 제작 후보함의 발견 링크 설명, 제작 칸반 요약/범례 문구를 테스트로 보강했습니다. 이후 홈 다음 행동의 저장 영상/채널 목록 이동과 발견함의 제작 후보함 이동을 추가했습니다. main 빌드와 Azure Static Web Apps 배포가 통과했고, 공개 앱 루트는 200 OK로 응답했습니다.

- 2026-07-09 제작 후보함 빈 상태에서 홈의 오늘 레이더로 돌아가는 버튼을 추가했습니다. 이 이동은 화면 전환만 수행하며 YouTube API 호출, Cloud DB 변경, localStorage 변경을 만들지 않습니다.
- 2026-07-11 스크랩북/참고 보관함 빈 화면과 필터 결과 없음 화면의 다음 행동 흐름을 보강했습니다. 스크랩북/참고 보관함 버튼은 화면 이동만 수행하고, 필터 초기화는 검색어/조회수 조건/영상 길이/터또터 모드만 기본값으로 돌립니다. 이 흐름은 Cloud 저장, DB 쓰기, YouTube API 호출을 직접 실행하지 않습니다.
- 2026-07-11 빈 화면 액션 버튼과 단계 안내 카드 렌더링을 `EmptyStateActions`, `EmptyStateSteps` 공통 컴포넌트로 정리했습니다. 화면 문구와 버튼 동작은 유지했고, API/DB/localStorage/YouTube API 호출 조건은 변경하지 않았습니다.
- 2026-07-11 홈 다음 행동과 홈/제작 후보 지표 안내 문구를 보강했습니다. 화면 이동, Cloud DB 조회, Cloud 판단 기록 저장, YouTube API 호출 가능성을 더 명확히 나눠 설명하며, API/DB/localStorage/YouTube API 호출 조건은 변경하지 않았습니다.
- 2026-07-11 기준 `npm.cmd test -- --reporter=dot`은 테스트 파일 166개, 테스트 734개 통과 상태입니다.
- 2026-07-11 발견함 수동 링크 저장 버튼과 제작 후보함의 영상/발견 링크 상태 이동 버튼 렌더링 테스트를 보강했습니다. 수동 링크 저장은 Cloud 발견함 저장이고, 제작 후보 상태 이동은 Cloud 판단 기록 또는 Cloud 발견함 상태 저장이며, 외부 사이트 수집/삭제/YouTube API 호출 조건은 바꾸지 않았습니다.
- 2026-07-11 홈 레이더 흐름, 발견함 빈 상태/필터/헤더 액션, 스크랩북/참고 보관함, 제작 후보함 빈 상태와 저장 실패 안내, 채널 안전 버튼, 영상 액션, 댓글 Top 10 모달 상태 문구도 컴포넌트 렌더링 테스트로 보강했습니다.
- 2026-07-11 오늘 레이더 완료 상태에서 제작 후보함으로 이동하는 버튼, 스크랩북 카드에서 제작 후보로 표시하는 버튼, 제작 후보함의 저장 영상/발견함 다음 행동 버튼을 추가했습니다. 모두 화면 이동 또는 기존 Cloud 판단 기록 저장 흐름을 사용하며 endpoint, DB schema, localStorage key, YouTube API 호출 조건은 변경하지 않았습니다.
- 2026-07-11 제작 후보 영상 카드에 작업 준비 체크를 추가했습니다. 원본 링크, 제목 초안, 제작 메모, 업로드 예정일의 준비 여부를 표시만 하며, 저장이나 API 호출은 실행하지 않습니다. 발견함 링크 후보 섹션에는 외부 링크 후보 개수 배지를 추가해 영상 후보와 별도로 보이게 했습니다.
- 2026-07-11 제작 후보함 상단에 우선 확인 안내를 추가했습니다. 권리 확인 필요 링크, 지난 일정, 일정 없는 제작 중 후보, 제작 중/후보/링크 후보를 순서대로 안내하며 표시만 하고 저장이나 API 호출은 실행하지 않습니다. 홈 지표에는 제작 후보와 발견 링크 후보 숫자를 추가했고, 발견함 오류 화면에는 localStorage 자동 병합/자동 업로드 없음 안내를 추가했습니다.
- 2026-07-11 Azure 리소스가 Microsoft Azure Sponsorship 구독으로 이동된 뒤 프론트엔드 Build와 Azure Static Web Apps CI/CD가 여러 차례 성공했고 공개 앱 루트는 200 OK로 확인됐습니다. backend Function App 배포와 Sponsorship 비용 반영은 남은 운영 확인 항목입니다.

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
- 추가 상태 2: 2026-07-03 후속 작업으로 제작 후보 카드, 발견 링크 카드, 발견 링크 삭제/제외, 홈 발견함 바로가기, 홈 후보 처리 문구, 채널 삭제/등급/상태 선택 설명을 보강했습니다.
- 추가 상태 3: 2026-07-03 후속 작업으로 저장 영상 카드/리스트, 오늘 레이더 판단 버튼, 발견함 상태 변경/새로고침, 새 영상 수집 버튼 설명을 보강했습니다.
- 추가 상태 4: 2026-07-06 후속 작업으로 발견 링크 제작 후보 전환, 사용 금지 링크 경고, 권리 상태 표시, 영상 필터 라벨, 채널 통계/언어 라벨의 혼동 가능 문구를 정리했습니다.
- 추가 상태 5: 2026-07-08 후속 작업으로 홈 빠른 작업 버튼이 채널 저장, YouTube API 수집, Cloud DB 조회, 수동 URL 저장을 더 명확히 구분하도록 정리했습니다.
- 추가 상태 6: 2026-07-11 후속 작업으로 스크랩북/참고 보관함 빈 화면에는 이동 전용 버튼을, 필터 결과 없음 화면에는 조건 초기화 버튼을 추가했습니다. 모두 Cloud 저장, DB 쓰기, YouTube API 호출을 직접 실행하지 않습니다.
- 추가 상태 7: 2026-07-11 후속 작업으로 빈 화면 액션 버튼과 단계 안내 카드 렌더링을 공통 컴포넌트로 정리했습니다. 화면별 색상, 간격, 문구, 버튼 동작은 유지했습니다.
- 왜 필요한가: YouTube API 호출은 비용과 quota가 걸릴 수 있어 버튼을 누르기 전 의미가 명확해야 합니다.
- 작업 범위: 버튼명, 보조 설명, 안내 문구를 점검하고 필요한 곳만 작게 수정합니다.
- 건드릴 파일 예상: `src/App.jsx`, 관련 컴포넌트, 필요 시 `src/constants`.
- 건드리면 안 되는 것: API 호출 로직, scan 동작, 저장 데이터 구조.
- 위험도: 낮음.
- 완료 기준: 2차 완료. DB 조회 버튼과 YouTube API 호출 버튼이 주요 흐름에서 구분되고, Cloud 기록 삭제/상태 저장/외부 수집 없음/채널 수집 대상 여부/빈 화면 다음 행동이 주요 화면에서 설명됩니다.
- 사용자 판단 필요 여부: 문구 방향은 Codex가 진행 가능. 다만 큰 UI 재배치는 별도 판단 필요.

### Issue 3. 카테고리 삭제/이름 변경의 실제 의미를 UI에서 분리

- 목적: "카테고리 삭제"가 Cloud 채널 태그 삭제인지, 화면 목록에서 숨기는 것인지 오해를 줄입니다.
- 현재 상태: 2026-07-02 기준 1차 적용됨. 카테고리 삭제는 화면 목록에서만 숨긴다는 확인 문구와 tooltip이 있고, 이름 변경은 Cloud 태그 이름 변경으로 안내합니다.
- 추가 상태: 2026-07-06에 카테고리 도움말 문구를 "이름 변경은 Cloud 태그명 변경, 숨김은 화면 카테고리 목록에서만 제외"로 정리했습니다.
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
- 건드릴 파일 예상: `src/hooks/useVideoUserRecords.js`, `src/services/videoRecordsApi.js`, 상태 표시 컴포넌트.
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
- 건드릴 파일 예상: `src/services/storage.js`, `src/hooks/useScrapbook.js`, `src/hooks/useVideoUserRecords.js`, scrapbook/videoUserRecords 관련 코드.
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
- 추가 상태: 발견 링크는 `status: candidate`로 저장해 제작 후보함에서 링크 후보로 볼 수 있습니다. 이 연결은 별도 `production_candidates` DB 없이 discovery link 상태값만 사용합니다.
- 추가 상태 2: 2026-07-08 후속 작업으로 제작 후보함의 발견 링크 섹션이 "별도 제작 DB가 아니라 Cloud 발견함 기록을 제작 참고 목록으로 보여준다"는 점과 자동 수집/다운로드를 실행하지 않는다는 점을 명확히 설명합니다.
- 왜 필요한가: Creator OS가 "소재 발굴"에서 "제작 준비"로 넘어가려면 외부 링크와 파일 출처가 연결되어야 합니다.
- 작업 범위: 수동 링크 저장 MVP는 구현 기준으로 반영했고, 로컬 파일 메타데이터와 권리 확인 상태의 확장 범위를 선택지로 정리했습니다.
- 건드릴 파일 예상: 문서 우선. 이후 프론트 화면, 백엔드 API, DB 모델.
- 건드리면 안 되는 것: 인스타 자동 크롤링, 자동 다운로드, 무단 수집, 새 API 구현.
- 위험도: 높음.
- 완료 기준: `CREATOR_OS_DISCOVERY_LINKS_MVP_SCOPE.md` 작성 완료. 1차 MVP는 수동 링크 저장 중심의 발견함으로 부분 구현되었고, 제작 후보함 연결까지 상태값 기반으로 동작합니다.
- 사용자 판단 필요 여부: 현재 문서화와 1차 MVP 연결은 완료. MVP 저장 위치는 `docType: discovery_link`, 상태값은 `inbox/reviewing/saved/candidate/discarded`와 `rightsStatus` 분리로 정리됨. 다음 판단은 local assets, 별도 제작 프로젝트 모델, 별도 `discovery_links` container 분리 여부입니다.

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

### Issue 11. 프론트 테스트 전략 결정

- 목적: 기능을 많이 쌓은 뒤 작은 수정으로 기존 흐름이 깨지는 위험을 줄입니다.
- 현재 상태: 2026-07-06 사용자 승인 후 `vitest`와 `test: vitest run` 스크립트를 추가했습니다. 2026-07-11 기준 `npm.cmd test`에서 테스트 파일 166개, 테스트 734개가 통과합니다. GitHub Actions `Build` workflow는 `npm test` 후 `npm run build`를 실행합니다.
- 왜 필요한가: `status/statusIds`, discovery links, production kanban, Cloud/localStorage fallback처럼 깨지면 사용자가 바로 불편한 계산이 늘었습니다.
- 작업 범위: 1차는 `src/utils/discoveryLinkForm.js`, `src/utils/discoveryLinkCollection.js`, `src/utils/videoUserRecords.js`, `src/utils/productionKanbanData.js`, `src/utils/videoCollection.js`, `src/utils/video.js`, `src/utils/creatorOsMetrics.js`, `src/utils/channels.js`, `src/utils/channelScanDisplay.js`, `src/utils/channelScanSummaryBoxProps.js`, `src/utils/channelListItemProps.js`, `src/utils/channelListItemActionsProps.js`, `src/utils/channelListItemMetaProps.js`, `src/utils/channelMetadataControlsProps.js`, `src/utils/channelTagSelectorProps.js`, `src/utils/channelCategoryChipProps.js`, `src/utils/channelAddFormProps.js`, `src/utils/channelAddActions.js`, `src/utils/channelActions.js`, `src/utils/channelNotesModal.js`, `src/utils/clipboard.js`, `src/utils/dates.js`, `src/utils/urls.js`, `src/utils/formatters.js`, `src/utils/discoveryLinks.js`, `src/utils/discoveryLinksRouteProps.js`, `src/utils/discoveryLinksWorkspaceProps.js`, `src/utils/scrapbook.js`, `src/utils/scrapbookHeaderActions.js`, `src/utils/prompts.js`, `src/utils/radarCandidates.js`, `src/utils/productionVideoCard.js`, `src/utils/productionKanbanColumn.js`, `src/utils/productionKanbanProps.js`, `src/utils/productionKanbanActions.js`, `src/utils/videoCard.js`, `src/utils/videoDashboardControls.js`, `src/utils/videoToolbarProps.js`, `src/utils/videoToolbarFiltersProps.js`, `src/utils/videoListTableProps.js`, `src/utils/videoListTableRowProps.js`, `src/utils/videoListRowBadgesProps.js`, `src/utils/videoListRowContentProps.js`, `src/utils/videoListRowMetaActionsProps.js`, `src/utils/videoListRowCandidateActionProps.js`, `src/utils/videoListRowStatsProps.js`, `src/utils/appLayoutProps.js`, `src/utils/appRouteProps.js`, `src/utils/homeRouteProps.js`, `src/utils/legacyWorkspaceRouteProps.js`, `src/utils/routesProps.js`, `src/utils/productionSchedule.js`, `src/utils/homeActionShortcuts.js`, `src/utils/discoveryLinkActionCopy.js`, `src/utils/creatorHomeViewProps.js`, `src/utils/legacyWorkspaceProps.js`, `src/utils/legacyAsideProps.js`, `src/utils/legacyWorkPanelIntroProps.js`, `src/utils/legacyChannelPanelProps.js`, `src/utils/legacyMainPanelProps.js`, `src/utils/legacyWorkspaceMainPanelViewProps.js`, `src/utils/legacyDashboardTabViewProps.js`, `src/utils/legacyVaultTabViewProps.js`, `src/utils/legacyChannelPanelViewProps.js`, `src/utils/discoveryLinksCopy.js`, `src/utils/productionVideoStatusProps.js`, `src/utils/radarCandidateStateProps.js`, `src/utils/scrapbookHeaderProps.js`, `src/utils/selectedVideosActionBarProps.js`, `src/utils/productionDiscoveryLinkActionProps.js`, `src/utils/radarDecisionViewProps.js`의 순수 함수 테스트입니다.
- 건드린 파일: `package.json`, `package-lock.json`, `src/utils/*.test.js`, `CREATOR_OS_TESTING_STRATEGY_OPTIONS.md`.
- 건드리면 안 되는 것: 추가 승인 없는 workflow test step 추가, React/Playwright 테스트 도구 추가, 실제 YouTube API/Cloud DB를 호출하는 테스트.
- 위험도: 중간.
- 완료 기준: 1차 완료. `npm.cmd test`로 순수 함수와 서비스 wrapper 테스트를 실행할 수 있고, 발견함/영상 상태/제작 후보함 계산/저장 영상 조회와 수집 안내/영상 필터와 정렬/홈 요약 숫자/채널 태그와 최근 수집일/채널 수집 상태 표시/채널 목록 항목 안내/채널 복사·메모·삭제 안내/채널 메타 표시/채널 등급·상태 컨트롤/채널 태그 선택 안내/카테고리 칩 의미 구분/채널 추가 폼 props 연결/채널 Cloud 저장 문구/채널 삭제 안전 문구/채널 기록 모달/클립보드 fallback/날짜 표시/URL 복사 목록/숫자·비율 표시/발견함 필터·행 표시/발견함 라우트 props/발견함 작업 화면 props/스크랩북 보관함 표시/스크랩북 헤더 버튼/AI 요청문 생성/오늘 후보 레이더/제작 후보 카드/제작 칸반 컬럼/제작 칸반 전체 props/제작 칸반 액션/영상 카드 props/영상 대시보드 컨트롤/영상 툴바 props/영상 툴바 필터 props/영상 리스트 테이블 props/영상 리스트 행 props/영상 리스트 배지 props/영상 리스트 콘텐츠 props/영상 리스트 메타 액션 props/영상 리스트 제작 후보 액션 props/영상 리스트 통계 props/앱 레이아웃 props/앱 라우트 props/홈 라우트 props/기존 작업 화면 라우트 props/라우트 props 최종 묶음/제작 일정 신호/홈 빠른 작업 버튼/발견 링크 Cloud 액션 문구/Creator OS 홈 화면 props/홈 화면 내비게이션 props/홈 레이더 작업 흐름 안내/저장 영상 안내 카드/태그별 새 영상 수집 안내/채널 추가 안내 문구/제작 후보함의 발견 링크 설명/제작 칸반 요약과 범례 문구/기존 작업 화면 props 출입구/기존 좌측 보조 패널 props/기존 채널 패널 props/기존 메인 패널 props/기존 메인 패널 하위 뷰 props/기존 대시보드 탭 props/기존 보관함 탭 props/기존 채널 패널 하위 뷰 props/서비스 API wrapper/동기화 경고/레이더 후보 상태 문구/발견함 헤더·필터 빈 상태·재조회 문구/스크랩북 헤더 문구/제작 칸반 상태·저장 문구/선택 영상 AI 요청문 복사 바/제작 후보함 발견 링크 액션/레이더 후보 헤더·처리 기록 문구/채널 추가 헤더·일괄 결과·카테고리·빈 상태 문구/채널 URL 목록 복사·로딩 문구/채널 미리보기·언어 선택·카테고리 도움말 문구/채널 메모 모달·메타 컨트롤·일괄 실패 문구/영상 툴바 검색·필터·정렬·보기·터또터 버튼 문구/영상 카드·리스트 행 배지·복사·통계·AI 요청문 선택 문구/공통 복사 버튼·좌측 메뉴·작업 헤더·작업 탭·준비중 화면 문구/발견함 수동 링크 폼·검색·필터·상태 변경·중복 링크 안내 문구/제작 후보함 지표·일정·영상 카드·입력 필드·외부 링크 버튼 문구/레이더 후보 카드·지표·스크랩·요약 문구/홈 레이더 히어로·운영 기준·후보 워크플로우·다음 행동 문구/스크랩북 영상 카드·썸네일·통계 문구/댓글 Top 10 모달 제목·로딩·빈 상태 문구/`src/utils` 테스트 목록 점검이 통과합니다.
- 추가 완료: 기존 작업 화면 안내 문구와 선택 영상 바 문구도 순수 유틸 테스트로 보강했습니다.
- 추가 완료 2: 홈 다음 행동에서 저장 영상/채널 목록으로 이동하는 흐름과 발견함에서 제작 후보함으로 이동하는 흐름도 테스트로 보강했습니다.
- 추가 완료 3: 스크랩북/참고 보관함 빈 화면 이동 흐름과 필터 결과 없음 화면의 조건 초기화 흐름도 테스트로 보강했습니다.
- 추가 완료 4: 빈 화면 액션 버튼과 단계 안내 카드의 공통 렌더링 컴포넌트도 테스트로 보강했습니다.
- 추가 완료 5: 홈 다음 행동 영향 안내, 홈 지표 hover 설명, 제작 후보함 요약 카드 hover 설명도 컴포넌트 렌더링 테스트로 보강했습니다.
- 추가 완료 6: 공통 URL 복사 버튼의 로컬 클립보드 안내, 비활성 상태, 접근성 문구도 컴포넌트 렌더링 테스트로 보강했습니다.
- 추가 완료 7: 준비중 화면의 미연결 설계 자리 안내와 홈 이동 버튼 안전 문구도 컴포넌트 렌더링 테스트로 보강했습니다.
- 추가 완료 8: 저장 영상 불러오기 버튼과 새 영상 수집 버튼의 DB 조회/YouTube API 호출 구분도 컴포넌트 렌더링 테스트로 보강했습니다.
- 추가 완료 9: 발견함 수동 링크 저장 버튼의 Cloud 저장/외부 크롤링 없음/중복 링크/저장 중 문구도 컴포넌트 렌더링 테스트로 보강했습니다.
- 추가 완료 10: 제작 후보함의 영상 상태 이동과 발견 링크 후보 이동 버튼의 Cloud 저장/삭제 없음/YouTube API 호출 없음 문구도 컴포넌트 렌더링 테스트로 보강했습니다.
- 추가 완료 11: 홈 레이더 흐름, 발견함 상태, 스크랩북/참고 보관함, 제작 후보함 빈 상태와 저장 실패, 채널 안전 버튼, 영상 액션, 댓글 Top 10 모달 상태 문구도 컴포넌트 렌더링 테스트로 보강했습니다.
- 추가 완료 12: 저장 영상 카드 상태 배지와 채널 등급/상태 배지에 Cloud/후보함/YouTube API 호출 없음 안내를 추가하고 컴포넌트 렌더링 테스트로 보강했습니다.
- 추가 완료 13: 레이더 완료 화면에서 제작 후보함으로 이어지는 버튼, 스크랩북 영상 카드의 제작 후보 표시 버튼, 제작 후보함의 저장 영상/발견함 다음 행동 버튼과 관련 테스트를 보강했습니다.
- 추가 완료 14: 제작 후보 영상 카드의 작업 준비 체크와 발견함 링크 후보 개수 배지를 추가하고, 저장/API 호출 없는 표시 전용 흐름을 테스트로 보강했습니다.
- 추가 완료 15: 제작 후보함 우선 확인 안내, 발견 링크 후보 확인 순서, 홈 제작 후보/발견 링크 후보 지표, 발견함 오류 복구 안내를 표시 전용 흐름으로 추가하고 관련 테스트를 보강했습니다.
- 추가 완료 16: `WORK_LOG` 번호를 문서 순서 기준으로 정리했고, 채널 목록/발견함 로딩 문구를 Cloud 조회와 API 미호출 기준으로 보강했습니다. 관련 컴포넌트 렌더링 테스트도 추가했습니다.
- 사용자 판단 필요 여부: 현재 없음. React Testing Library나 Playwright 테스트를 도입하는 단계는 별도 판단 필요.

---

## 5. Codex 추천 진행 순서

바로 다음 작업은 아래 순서를 추천합니다.

1. 구조 안정화 후속 작업은 작은 hook/utility 분리와 테스트 보강 중심으로 진행합니다. DB/API/localStorage 의미가 바뀌는 작업은 이 문서의 판단 필요 항목으로 분리합니다.
2. 화면 흐름 개선은 저장/수집/삭제를 직접 실행하지 않는 이동 버튼, 필터 초기화, 복사 편의처럼 되돌리기 쉬운 단위부터 진행합니다.
3. 실제 기능 확장 전에는 선택지가 필요한 항목을 먼저 분리합니다. local assets, 별도 제작 프로젝트 모델, 별도 `discovery_links` container 분리 여부는 별도 선택지 보고 후 결정합니다.
4. GitHub Actions와 Azure Static Web Apps `github_id_token` 경고는 별도 배포 설정 이슈로 남깁니다. 현재 main 배포는 성공하므로, deployment token 또는 Azure OIDC 설정 변경은 사용자가 배포 설정 작업을 승인한 뒤 진행합니다.
5. Azure Sponsorship 이전 후 frontend 배포는 정상 확인됐습니다. backend Function App 배포와 비용 반영은 운영 확인 항목으로 남깁니다.
6. 공개 앱 smoke check는 `CREATOR_OS_PUBLIC_APP_SMOKE_CHECK.md` 기준으로 main Build, Azure Static Web Apps 배포, 공개 앱 루트 200 OK를 확인합니다. 저장/삭제/수집 버튼은 누르지 않습니다.

이 순서가 안전한 이유:

- 문서 기준, UI 문구 감사, 주요 화면 문구 안정화, 빈 화면/오류/로딩 안내, 빈 화면 공통 렌더링 정리, 홈/제작 후보 흐름 안내 문구와 렌더링 테스트, 레이더/스크랩북/제작 후보함 다음 행동 연결, 제작 후보 카드 준비 체크, 제작 후보함 우선 확인 안내, 발견함/제작 후보 이동 버튼 렌더링 테스트, 주요 화면 흐름 렌더링 테스트, 저장 영상 페이지네이션 감사, scan/API 사용 기록 모델, discovery MVP 범위 검토, 제작 후보 MVP 범위 검토는 완료됐습니다.
- discovery links 1차 MVP는 `/discovery-links`와 `docType: discovery_link` 방식으로 부분 구현되었습니다.
- 이후에는 이미 구현된 발견함을 안정화한 뒤, local assets와 별도 제작 프로젝트 모델처럼 데이터 의미가 커지는 작업을 별도 판단으로 넘깁니다.
- DB/API 변경은 계속 별도 판단을 받고 진행합니다.

다음 기능 개선 후보:

1. 제작 후보함에서 "오늘 처리할 후보"를 더 쉽게 고르는 정렬/그룹 표시를 보강합니다. 저장 구조는 바꾸지 않고 화면 표시만 다룹니다.
2. 발견함 링크를 제작 후보로 표시한 뒤 어떤 후보가 권리 확인 필요인지 더 선명하게 보여줍니다. `rightsStatus` 의미는 유지합니다.
3. 스크랩북/참고 보관함에서 제작 후보로 이어지는 버튼과 설명을 더 다듬습니다. 기존 Cloud 판단 기록 저장 흐름만 사용합니다.
4. 홈/오늘 레이더에서 다음 행동 버튼의 우선순위를 더 명확히 합니다. 화면 이동과 기존 Cloud 조회만 사용합니다.
5. 위 항목 중 DB schema, endpoint, localStorage key, YouTube API 호출량이 바뀌는 순간에는 별도 선택지 보고 후 멈춥니다.

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
