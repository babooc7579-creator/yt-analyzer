# Creator OS API 동작 맵

작성일: 2026-07-02

이 문서는 Creator OS에서 각 기능이 어떤 종류의 작업인지 구분하기 위한 기준 문서입니다.

사용자는 버튼을 누르기 전에 다음을 알 수 있어야 합니다.

- 저장된 DB를 단순 조회하는가
- YouTube API를 호출하는가
- Cloud DB에 새로 저장하거나 수정하는가
- localStorage만 쓰는가
- 아직 준비중이라 실제 동작이 없는가

이 문서는 코드 변경 없이 현재 프론트 repo와 Backend/API Evidence Audit에서 확인한 API 동작을 정리합니다.

---

## 1. 현재 기준 사실

아래 내용은 2026-07-02 기준입니다.

- `GET /videos?channelIds=...`는 저장된 영상 데이터를 읽는 DB 조회입니다.
- `POST /scan/selected`, `GET /scan`, `GET /scan?tag=...`는 YouTube API 호출과 DB 갱신이 발생할 수 있습니다.
- `GET /channel-preview?handle=...`는 저장 전 미리보기이지만 YouTube API 조회가 필요합니다.
- `POST /channels`, `POST /channels/bulk`는 채널을 Cloud DB에 저장하며, 채널 정보 확인을 위해 YouTube API 조회가 필요합니다.
- `/scrapbook`은 Cloud DB에 저장되지만 별도 container가 아니라 `videos` container 안의 `docType: scrapbook`입니다.
- `/video-records`는 Cloud DB에 저장되며 기존 `status`를 대표 상태로 유지합니다. 선택지 B 승인 이후 `statusIds`는 복수 판단 보존용 보조 필드로 저장/조회됩니다.
- `/discovery-links`는 Cloud DB에 저장되며 기존 `videos` container 안의 `docType: discovery_link` 문서를 조회/저장/수정/삭제합니다.
- 2026-07-03 배포 환경 읽기 전용 확인에서 `GET /discovery-links`는 200으로 성공했고 현재 링크 목록은 0개였습니다.
- 2026-07-03 사용자 승인 후 `POST /discovery-links`, `PATCH /discovery-links/{id}`, `DELETE /discovery-links/{id}` smoke test를 완료했습니다. 임시 링크 생성, 상태/권리 상태 수정, 제목/메모 수정, 삭제가 모두 200으로 성공했고, 재조회에서 임시 링크가 남지 않았습니다.
- 2026-07-03 배포 환경 읽기 전용 확인에서 `GET /videos`는 `channelIds` 없이 호출하면 400으로 거절됩니다. 저장 영상 조회는 `channelIds`가 있는 DB 조회 흐름으로 사용합니다.
- `GET /tags/rename`은 메서드는 GET이지만 실제로 채널 태그를 수정하는 DB 변경 작업입니다.
- 댓글 Top 10 조회는 프론트에서 YouTube API를 직접 호출합니다.
- localStorage는 기준 데이터가 아니라 캐시/복구/기존 호환 역할입니다.

---

## 2. 동작 분류

| 분류 | 의미 | 사용자에게 보여줄 표현 | 비용/위험 |
|---|---|---|---|
| DB 조회 | 이미 Cloud DB에 저장된 데이터만 읽음 | 저장된 데이터 불러오기 | 낮음. 단, 데이터가 많으면 느려질 수 있음 |
| DB 저장/수정 | Cloud DB에 데이터를 추가, 수정, 삭제 | 클라우드에 저장/수정 | 중간. 기존 데이터 변경 |
| YouTube API 조회 | YouTube API로 새 정보를 가져옴 | YouTube API 조회 | 중간. API quota 사용 가능 |
| YouTube API + DB 갱신 | YouTube API로 수집하고 DB에 저장/갱신 | 새 영상 수집 | 높음. quota 사용 및 DB 변경 |
| localStorage 보조 | 브라우저 안에 임시 저장 | 임시 저장/복구 | 중간. 브라우저 캐시 삭제 시 사라질 수 있음 |
| 준비중 | 실제 API/DB 변경 없음 | 준비 중 | 낮음. 실제 기능처럼 보이면 위험 |

---

## 3. 현재 API 동작 표

| 기능 | 프론트 함수 | Endpoint 또는 호출 | 동작 분류 | YouTube API 호출 | DB 조회 | DB 변경 | localStorage | 현재 사용 | 위험 |
|---|---|---|---|---|---|---|---|---|---|
| 채널 목록 불러오기 | `fetchChannels` | `GET /channels` | DB 조회 | 아니오 | 예 | 아니오 | 아니오 | 가능 | 낮음 |
| 채널 미리보기 | `fetchChannelPreview` | `GET /channel-preview?handle=...` | YouTube API 조회 | 예 | 아니오 | 아니오 | 아니오 | 가능 | 저장은 안 하지만 quota 사용 가능 |
| 채널 저장 | `createChannel` | `POST /channels` | YouTube API + DB 저장 | 예 | 아니오 | 예 | 아니오 | 가능 | 채널 정보 조회 후 Cloud DB 저장 |
| 채널 일괄 저장 | `createChannelsBulk` | `POST /channels/bulk` | YouTube API + DB 저장 | 예 | 아니오 | 예 | 아니오 | 가능 | 여러 채널이면 quota 사용 증가 |
| 채널 삭제 | `removeChannel` | `DELETE /channels/{id}?category=...` | DB 변경 | 아니오 | 아니오 | 예 | 아니오 | 가능 | 삭제 전 확인 필요 |
| 채널 등급/상태/태그 수정 | `updateChannel` | `PATCH /channels/{id}?category=...` | DB 변경 | 아니오 | 아니오 | 예 | 아니오 | 가능 | `status`는 스캔 대상 여부에 영향 |
| 채널 기록 추가 | `createChannelNote` | `POST /channels/{id}/notes?category=...` | DB 변경 | 아니오 | 아니오 | 예 | 아니오 | 가능 | 낮음 |
| 저장된 영상 불러오기 | `fetchStoredVideosByChannelIds` | `GET /videos?channelIds=...` | DB 조회 | 아니오 | 예 | 아니오 | 아니오 | 가능 | 페이지네이션 없음 |
| 선택 채널 새 영상 수집 | `scanSelectedChannels` | `POST /scan/selected` | YouTube API + DB 갱신 | 예 | 예 | 예 | 아니오 | 가능 | quota 사용 및 영상/채널 갱신 |
| 전체/태그 새 영상 수집 | `scanChannels` | `GET /scan`, `GET /scan?tag=...` | YouTube API + DB 갱신 | 예 | 예 | 예 | 아니오 | 가능 | GET이지만 비용성/변경 작업 |
| 태그 이름 변경 | `renameTag` | `GET /tags/rename?from=...&to=...` | DB 변경 | 아니오 | 예 | 예 | 아니오 | 가능 | GET이지만 DB 변경. 오해 위험 높음 |
| 스크랩북 불러오기 | `fetchScrapbook` | `GET /scrapbook` | DB 조회 | 아니오 | 예 | 아니오 | 아니오 | 가능 | `videos` container 안의 `docType` 조회 |
| 스크랩북 저장 | `saveScrapbookVideos` | `POST /scrapbook` | DB 저장 | 아니오 | 아니오 | 예 | localStorage 보조 | 가능 | Cloud 실패 시 동기화 차이 가능 |
| 스크랩북 삭제 | `deleteScrapbookVideo` | `DELETE /scrapbook/{videoId}` | DB 변경 | 아니오 | 아니오 | 예 | localStorage 보조 | 가능 | Cloud 실패 시 화면/DB 차이 가능 |
| 영상 판단 기록 불러오기 | `fetchVideoUserRecords` | `GET /video-records` | DB 조회 | 아니오 | 예 | 아니오 | localStorage 보조 | 가능 | localStorage와 Cloud 차이 가능 |
| 영상 판단 기록 저장 | `saveVideoUserRecord` | `POST /video-records` | DB 저장 | 아니오 | 아니오 | 예 | localStorage 보조 | 가능 | 기존 `status` 유지 + `statusIds` 보존. 2026-07-02 배포 smoke 확인 |
| 영상 판단 기록 전체 삭제 | `clearVideoUserRecords` | `DELETE /video-records` | DB 변경 | 아니오 | 아니오 | 예 | 예 | 가능 | 큰 변경. 사용자 확인 필요 |
| 발견 링크 불러오기 | `fetchDiscoveryLinks` | `GET /discovery-links` | DB 조회 | 아니오 | 예 | 아니오 | 아니오 | 가능 | 기존 `videos` container의 `docType: discovery_link` 조회. 2026-07-03 배포 읽기 확인 성공 |
| 발견 링크 저장 | `createDiscoveryLink` | `POST /discovery-links` | DB 저장 | 아니오 | 아니오 | 예 | 아니오 | 가능 | 수동 입력 URL/제목/메모/상태와 URL 추정 `platform` 저장. 백엔드도 허용 `platform`을 보존하며, 없거나 잘못되면 URL로 재추정. 자동 크롤링 없음. 2026-07-03 smoke 성공 |
| 발견 링크 상태 수정 | `updateDiscoveryLink` | `PATCH /discovery-links/{id}` | DB 변경 | 아니오 | 아니오 | 예 | 아니오 | 가능 | `status`, `rightsStatus`, 제목, 메모 변경. 2026-07-03 smoke 성공 |
| 발견 링크 삭제 | `deleteDiscoveryLink` | `DELETE /discovery-links/{id}` | DB 변경 | 아니오 | 아니오 | 예 | 아니오 | 가능 | Cloud 문서 삭제. localStorage fallback 없음. 2026-07-03 smoke 성공, 임시 링크 잔여 0개 |
| 댓글 Top 10 보기 | `fetchTopComments` | YouTube `commentThreads` | YouTube API 조회 | 예 | 아니오 | 아니오 | 아니오 | 가능 | 사용자의 API Key와 quota 사용. API Key가 없거나 YouTube 오류가 오면 저장 작업 없이 오류 안내 |
| URL 복사 / URL 목록 복사 | `CopyUrlButton`, `formatNumberedUrlList` | Clipboard | 로컬 동작 | 아니오 | 아니오 | 아니오 | 아니오 | 가능 | 채널/영상/오늘 레이더/스크랩북/발견 링크 URL을 클립보드에 복사합니다. API 호출, DB 변경, localStorage 변경 없음 |
| AI 리메이크 프롬프트 복사 | `copyPromptForVideos`, `copyTextToClipboard` | Clipboard | 로컬 동작 | 아니오 | 아니오 | 아니오 | 아니오 | 가능 | 외부 AI 호출 없음. 선택/스크랩 영상 기반 요청문을 클립보드에 복사하고, 브라우저가 막으면 실패 안내를 표시 |
| 준비중 메뉴 | `ComingSoonView` | 없음 | 준비중 | 아니오 | 아니오 | 아니오 | 아니오 | 가능 | 실제 기능처럼 보이면 안 됨 |

---

## 4. 사용자 화면 문구 원칙

### 4.1 DB 조회 버튼

DB 조회 버튼은 다음처럼 표현합니다.

권장 표현:

- 저장된 영상 불러오기
- 클라우드에 저장된 데이터만 조회합니다
- YouTube API를 새로 호출하지 않습니다

피해야 할 표현:

- 분석 시작
- 새로 찾기
- 스캔
- 업데이트

이유:

- 사용자가 비용성 작업으로 오해하거나, 반대로 비용성 작업을 단순 조회로 오해하지 않게 해야 합니다.

### 4.2 YouTube API 호출 버튼

YouTube API 호출 버튼은 다음처럼 표현합니다.

권장 표현:

- 새 영상 수집
- YouTube API로 새 영상 여부를 확인합니다
- 필요한 채널만 선택해서 실행하세요

피해야 할 표현:

- 불러오기
- 보기
- 새로고침

이유:

- 새 수집은 quota를 사용할 수 있고, DB에 영상/채널 상태를 갱신할 수 있습니다.

### 4.3 Cloud DB 저장 버튼

Cloud DB 저장 버튼은 다음처럼 표현합니다.

권장 표현:

- 클라우드에 저장
- 변경 내용 저장
- 채널 목록에 저장
- 판단 기록 저장

피해야 할 표현:

- 확인
- 완료
- 닫기

이유:

- 사용자가 데이터가 실제로 바뀌는 시점을 알아야 합니다.

### 4.4 localStorage 보조 동작

localStorage 관련 표현은 조심해야 합니다.

권장 원칙:

- localStorage를 사용자에게 기준 저장소처럼 설명하지 않습니다.
- "임시 보관", "복구용", "기존 데이터 보호" 정도로만 설명합니다.
- localStorage 삭제/초기화 버튼은 만들기 전에 별도 판단이 필요합니다.

### 4.5 클립보드 복사 버튼

URL 복사, URL 목록 복사, AI 프롬프트 복사는 Cloud DB나 YouTube API 작업이 아닙니다.

권장 표현:

- 클립보드에 복사합니다
- YouTube API 호출이나 저장 작업은 없습니다
- 외부 사이트 수집이나 다운로드는 하지 않습니다
- AI 프롬프트 복사는 외부 AI API를 호출하지 않고, 복사 성공/실패 상태만 화면에 표시합니다

피해야 할 표현:

- 저장
- 수집
- 가져오기
- 동기화

---

## 5. 현재 위험 지점

### 5.1 `GET /scan`이 실제로 DB를 갱신함

일반적으로 GET은 조회처럼 보입니다. 하지만 현재 `GET /scan`은 YouTube API를 호출하고 DB를 갱신할 수 있습니다.

운영 기준:

- 화면에서는 반드시 "새 영상 수집"으로 표시합니다.
- "저장된 영상 불러오기"와 같은 위치에 두더라도 문구와 색상, 설명을 분리합니다.

### 5.2 `GET /tags/rename`이 실제로 DB를 수정함

`GET /tags/rename`은 태그 이름을 바꾸는 DB 변경 작업입니다.

운영 기준:

- 사용자에게는 "태그 이름 변경"으로 표시합니다.
- 단순 조회처럼 보이지 않게 합니다.
- 나중에 백엔드 변경 기회가 있으면 `PATCH` 또는 `POST` 전환을 검토합니다.

### 5.3 `/video-records` status 구조 불일치

프론트는 `statusIds`를 일부 사용하지만 백엔드는 단일 `status` 중심입니다.

운영 기준:

- 상태 저장 화면에서는 과도한 복수 상태 기능을 확장하지 않습니다.
- 현재 단계에서는 `status`를 대표 상태로 말하고, `statusIds`는 복수 판단 보존용 보조 필드로 말합니다.

### 5.4 `/videos` 페이지네이션 없음

`GET /videos?channelIds=...`는 현재 저장된 영상을 한 번에 가져옵니다.

운영 기준:

- 지금은 MVP로 유지할 수 있습니다.
- 2026-07-02 기준 운영 데이터는 저장 영상 1,821개, 응답 약 1.16MB로 측정됐습니다.
- 지금 당장 페이지네이션을 넣으면 대박지수/터또터/검색/정렬의 전체 기준이 흔들릴 수 있으므로 구현하지 않습니다.
- 저장 영상 5,000개 이상, 응답 5MB 이상, 로딩 3초 이상, 카드/리스트 스크롤 지연이 확인되면 `limit`, `continuationToken`, 서버 정렬/검색 기준을 다시 검토합니다.
- 자세한 판단 근거는 `CREATOR_OS_VIDEOS_PAGINATION_AUDIT.md`를 기준으로 봅니다.

### 5.5 댓글 Top 10은 직접 YouTube API 호출

댓글 조회는 백엔드 Functions가 아니라 프론트에서 YouTube API로 직접 호출합니다.

운영 기준:

- 사용자 API Key가 필요합니다.
- DB에 저장되는 기능이 아니라 조회 기능으로 설명합니다.
- 비용성 호출임을 표시합니다.
- API Key가 없거나 YouTube 오류 응답이 오면 화면/상단 안내로 알려주며 Cloud DB나 localStorage를 변경하지 않습니다.

### 5.6 수집 로그와 API 사용량 로그 없음

현재 `scan_logs`와 `api_quota_logs`는 별도 저장소나 endpoint가 없습니다.

운영 기준:

- 지금은 채널 문서의 `lastScanSummary`를 마지막 수집 상태 표시로만 사용합니다.
- 과거 수집 이력과 API 사용량 추정은 아직 구현된 기능처럼 표시하지 않습니다.
- 나중에 구현할 때는 `scan_logs`와 `api_quota_logs`를 개념상 분리합니다.
- 자세한 목표 모델은 `CREATOR_OS_SCAN_API_USAGE_MODEL.md`를 기준으로 봅니다.

---

## 6. 화면별 동작 기준

| 화면/영역 | 기본 동작 | API 호출 가능성 | DB 변경 가능성 | 원칙 |
|---|---|---|---|---|
| 오늘의 레이더 | 저장된 데이터 기반 추천/요약, 원본 URL 복사 | 기본 없음 | 판단 저장 시 있음 | 새 수집과 분리. URL 복사는 로컬 클립보드 동작 |
| 채널 관리 | 채널 조회/저장/상태 변경 | 미리보기/저장 시 YouTube API 가능 | 있음 | 저장과 스캔을 분리 |
| 영상 찾기/보관함 | 저장 영상 조회, 필터, 정렬 | 댓글 조회 제외 기본 없음 | 스크랩/상태 저장 시 있음 | 조회와 저장을 분리 |
| 제작 후보/칸반 | `videoUserRecords` 기반 상태 관리 | 없음 | 있음 | 제작 상태와 영상 상태 혼동 주의 |
| 스크랩북 | 스크랩 조회/저장/삭제 | 없음 | 있음 | Cloud 우선, localStorage 보조 |
| 수집/스캔 | 새 영상 확인 | 있음 | 있음 | 비용성 작업으로 명확히 표시 |
| 준비중 화면 | 안내 | 없음 | 없음 | 클릭해도 변경 없어야 함 |

---

## 7. 앞으로 API를 추가할 때의 기준

새 API를 만들기 전에 다음을 먼저 문서화합니다.

1. 이 API는 조회인가, 저장인가, 수집인가?
2. YouTube API 또는 외부 API 호출이 발생하는가?
3. Cloud DB의 어떤 container를 읽거나 쓰는가?
4. localStorage와 충돌 가능성이 있는가?
5. 실패했을 때 화면과 데이터는 어떻게 복구되는가?
6. 사용자가 버튼을 누르기 전에 비용/변경 여부를 알 수 있는가?

---

## 8. 지금 결정하지 말아야 할 것

이 문서는 API 동작을 정리하는 문서이며, 아래 항목은 결정하지 않습니다.

- `GET /scan`을 `POST /scan` 중심으로 바꿀지 여부
- `GET /tags/rename`을 `PATCH` 또는 `POST`로 바꿀지 여부
- `/video-records`에 `statusIds`를 추가할지 여부
- `/videos` 페이지네이션을 어떤 방식으로 구현할지 여부
- `scan_logs` 또는 `api_quota_logs` endpoint 추가 여부
- `local_assets` API 추가 여부 또는 `discovery_links` 별도 container 분리 여부
- 댓글 조회를 백엔드로 옮길지 여부

이 항목들은 기존 기능과 데이터 구조에 영향이 있으므로 별도 선택지 보고 후 결정합니다.

---

## 9. 다음 작업 기준

다음 작은 작업 후보:

1. `videoUserRecords` 저장 흐름 audit
2. discovery links 확장 / local assets 모델 문서 갱신
3. 위험 endpoint 개선 선택지 보고서 작성

코드 변경은 위 기준 문서와 선택지 보고 이후 진행합니다.
