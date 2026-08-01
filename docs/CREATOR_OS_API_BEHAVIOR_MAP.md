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
- `/scrapbook`은 Cloud DB에 저장되지만 별도 container가 아니라 `videos` container 안의 `docType: scrapbook`입니다. 2026-08-01부터 `scrapbookPurposes`로 사용자 소재 보관(`material`)과 제작 후보 원본 유지(`production`) 용도를 구분하며, 이 필드가 없는 기존 문서는 소재 보관용으로 해석합니다.
- 현재 선택 채널의 수집 영상 목록을 불러온 경우, 같은 `videoId`의 제목·조회수·채널명 등 현재 표시 정보를 소재 보관함과 제작 화면에 우선 반영합니다. 이는 프론트 화면용 병합으로 `POST /scrapbook`, YouTube API, localStorage 쓰기를 자동 실행하지 않습니다. `scrapbookPurposes`, `savedAt`, 스크랩 문서 `id`는 기존 보관 값을 유지합니다.
- `/video-records`는 Cloud DB에 저장되며 기존 `status`를 대표 상태로 유지합니다. `statusIds`는 복수 판단 보존용 보조 필드로, `focusPinnedAt`은 제작 후보 수동 집중 고정 시각으로 저장/조회됩니다.
- `/discovery-links`는 Cloud DB에 저장되며 기존 `videos` container 안의 `docType: discovery_link` 문서를 조회/저장/수정/삭제합니다.
- 2026-07-03 배포 환경 읽기 전용 확인에서 `GET /discovery-links`는 200으로 성공했고 현재 링크 목록은 0개였습니다.
- 2026-07-03 사용자 승인 후 `POST /discovery-links`, `PATCH /discovery-links/{id}`, `DELETE /discovery-links/{id}` smoke test를 완료했습니다. 임시 링크 생성, 상태/권리 상태 수정, 제목/메모 수정, 삭제가 모두 200으로 성공했고, 재조회에서 임시 링크가 남지 않았습니다.
- 2026-07-03 배포 환경 읽기 전용 확인에서 `GET /videos`는 `channelIds` 없이 호출하면 400으로 거절됩니다. 저장 영상 조회는 `channelIds`가 있는 DB 조회 흐름으로 사용합니다.
- `GET /tags/rename`은 메서드는 GET이지만 실제로 채널 태그를 수정하는 DB 변경 작업입니다.
- 댓글 Top 10 조회는 프론트에서 YouTube API를 직접 호출합니다.
- 프론트의 Cloud Function 호출은 도메인별 서비스 파일(`channelApi.js`, `scanApi.js`, `videoRecordsApi.js`, `scrapbookApi.js`, `discoveryLinksApi.js`)을 거치며, 공통 요청/응답 처리는 `functionApiClient.js`가 담당합니다. `functionApi.js`는 기존 import 호환을 위한 re-export 관문으로 유지합니다. 2026-07-03 기준 비정상 HTTP 응답이나 JSON이 아닌 응답은 사용자용 오류 메시지로 정리됩니다.
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
| 저장된 영상 불러오기 | `fetchAllStoredVideosByChannelIds` | `GET /videos?channelIds=...&pageSize=...&continuationToken=...` | DB 조회 | 아니오 | 예 | 아니오 | 아니오 | 가능 | 프론트가 페이지 수, 누적 영상 수, 경과 시간을 안내하며 모든 페이지를 순차 조회한 뒤 전체 목록 제공. 중간 실패 시 일부 목록은 노출하지 않고 재시도 안내. 기존 무페이지 호출도 호환 유지 |
| 선택 채널 새 영상 수집 | `scanSelectedChannels` | `POST /scan/selected` | YouTube API + DB 갱신 | 예 | 예 | 예 | 아니오 | 가능 | quota 사용 및 영상/채널 갱신 |
| 채널별 과거 영상 채우기 | `backfillChannelHistory` | `POST /scan/backfill` | YouTube API + DB 갱신 | 예 | 예 | 예 | 아니오 | 가능 | 사용자가 채널 하나를 직접 실행. 1회 기본 2페이지·서버 최대 3페이지로 제한. 진행 커서는 채널의 `backfillState`에 저장하며 자동 반복 없음 |
| 전체/태그 새 영상 수집 | `scanChannels` | `GET /scan`, `GET /scan?tag=...` | YouTube API + DB 갱신 | 예 | 예 | 예 | 아니오 | 가능 | GET이지만 비용성/변경 작업 |
| 태그 이름 변경 | `renameTag` | `GET /tags/rename?from=...&to=...` | DB 변경 | 아니오 | 예 | 예 | 아니오 | 가능 | GET이지만 DB 변경. 오해 위험 높음 |
| 소재·제작 원본 불러오기 | `fetchScrapbook` | `GET /scrapbook` | DB 조회 | 아니오 | 예 | 아니오 | 아니오 | 가능 | `videos` container 안의 `docType` 조회. 현재 불러온 수집 영상과 `videoId`가 같으면 화면에서만 최신 표시 정보 병합 |
| 소재 보관·제작 원본 저장 | `saveScrapbookVideos` | `POST /scrapbook` | DB 저장 | 아니오 | 아니오 | 예 | localStorage 보조 | 가능 | `scrapbookPurposes`의 `material`·`production` 용도를 보존. 제작 후보 지정은 원본 저장 성공 후 판단 기록을 별도 저장 |
| 소재 보관 해제 | `deleteScrapbookVideo` 또는 `saveScrapbookVideos` | `DELETE /scrapbook/{videoId}` 또는 `POST /scrapbook` | DB 변경 | 아니오 | 아니오 | 예 | localStorage 보조 | 가능 | 제작 기록이 없으면 문서 삭제. 제작 후보이면 `material` 용도만 해제하고 `production` 원본은 유지 |
| 영상 판단 기록 불러오기 | `fetchVideoUserRecords` | `GET /video-records` | DB 조회 | 아니오 | 예 | 아니오 | localStorage 보조 | 가능 | localStorage와 Cloud 차이 가능 |
| 영상 판단·제작 기록 저장 | `saveVideoUserRecord` | `POST /video-records` | DB 저장 | 아니오 | 아니오 | 예 | localStorage 보조 | 가능 | 프론트는 변경 필드만 전송하고 백엔드는 요청에 없는 상태·대본·메모·일정·업로드 기록을 보존. 명시적 빈 값은 삭제로 처리. YouTube API 호출 없음 |
| 영상별 전체 작업 기록 삭제 | `clearVideoUserRecords` | `DELETE /video-records` | DB 변경 | 아니오 | 아니오 | 예 | 예 | 화면 사용 차단 | 판단만이 아니라 제작 후보·대본·업로드 일정도 삭제할 수 있어 2026-08-01부터 사용자 UI 실행 경로 없음. API는 호환성 목적으로 유지 |
| 발견 링크 불러오기 | `fetchDiscoveryLinks` | `GET /discovery-links` | DB 조회 | 아니오 | 예 | 아니오 | 아니오 | 가능 | 기존 `videos` container의 `docType: discovery_link` 조회. 2026-07-03 배포 읽기 확인 성공 |
| 발견 링크 저장 | `createDiscoveryLink` | `POST /discovery-links` | DB 저장 | 아니오 | 아니오 | 예 | 아니오 | 가능 | 수동 입력 URL/제목/메모/상태와 URL 추정 `platform` 저장. 백엔드도 허용 `platform`을 보존하며, 없거나 잘못되면 URL로 재추정. 자동 크롤링 없음. 2026-07-03 smoke 성공 |
| 발견 링크 상태 수정 | `updateDiscoveryLink` | `PATCH /discovery-links/{id}` | DB 변경 | 아니오 | 아니오 | 예 | 아니오 | 가능 | `status`, `rightsStatus`, 제목, 메모 변경. 2026-07-03 smoke 성공 |
| 발견 링크 삭제 | `deleteDiscoveryLink` | `DELETE /discovery-links/{id}` | DB 변경 | 아니오 | 아니오 | 예 | 아니오 | 가능 | Cloud 문서 삭제. localStorage fallback 없음. 2026-07-03 smoke 성공, 임시 링크 잔여 0개 |
| 댓글 Top 10 보기 | `fetchTopComments` | YouTube `commentThreads` | YouTube API 조회 | 예 | 아니오 | 아니오 | 아니오 | 가능 | 사용자의 API Key와 quota 사용. API Key가 없거나 YouTube 오류/비JSON 응답이 오면 저장 작업 없이 오류 안내 |
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

### 5.3 `/video-records` 대표 상태와 보조 필드

백엔드는 기존 대표 `status`와 복수 판단 보존용 `statusIds`를 함께 저장합니다. 제작 후보의 수동 오늘 집중 고정은 상태값이 아닌 선택적 `focusPinnedAt`으로 분리합니다.

운영 기준:

- 상태 저장 화면에서는 과도한 복수 상태 기능을 확장하지 않습니다.
- 현재 단계에서는 `status`를 대표 상태로 말하고, `statusIds`는 복수 판단 보존용 보조 필드로 말합니다.
- `focusPinnedAt`은 사용자가 직접 고른 제작 후보의 고정 시각이며, 기존 제작 상태를 변경하지 않습니다.
- 필드가 없는 기존 record는 고정되지 않은 상태로 읽고, 필드를 보내지 않은 저장에서는 기존 Cloud 고정값을 보존합니다.
- 2026-08-01부터 프론트는 영상별 전체 작업 기록이 아니라 사용자가 바꾼 필드만 `POST /video-records`로 전송합니다.
- 백엔드는 요청에 없는 `status`, `statusIds`, `draftTitle`, `note`, `targetPublishDate`, `uploadedAt`, `focusPinnedAt`, 구조화 대본 필드와 `createdAt`을 기존 Cosmos DB 문서에서 보존합니다.
- 사용자가 입력을 지우고 저장해 명시적으로 빈 문자열을 보낸 필드는 빈 값으로 갱신합니다.
- 백엔드 보존 계약은 `yt-analyzer-functions` PR #20으로 먼저 배포한 뒤 프론트의 부분 요청을 적용했습니다.

### 5.4 `/videos` 선택형 페이지네이션

`GET /videos?channelIds=...`는 기존처럼 저장된 영상을 한 번에 가져옵니다. 프론트 앱은 `pageSize`와 `continuationToken`을 사용해 여러 페이지를 순차 조회한 뒤 전체 목록을 완성합니다.

운영 기준:

- 2026-07-26 승인된 B안으로 선택형 cursor pagination을 추가했습니다.
- `pageSize`가 없는 기존 요청과 기존 `{ success, videos }` 응답은 그대로 유지합니다.
- 프론트는 기본 200개씩 조회하지만 중간 페이지만 화면에 노출하지 않고, 모든 페이지를 받은 뒤 레이더/검색/정렬에 전달합니다.
- 중간 페이지가 실패하면 일부 데이터로 성공한 것처럼 표시하지 않습니다.
- 조회 진행은 공통 상태 영역에 페이지 수, 누적 영상 수, 경과 시간으로 표시합니다.
- Cloud 성공 후 0개인 경우는 장애 fallback과 구분하고, 채널 선택 또는 새 영상 수집 준비로 이어지는 다음 행동을 안내합니다.
- 이 작업은 Cloud DB 조회이며 YouTube API를 호출하지 않습니다.
- 서버 검색/정렬은 아직 도입하지 않았습니다. 전체 기준 점수와 필터 의미는 기존과 같습니다.
- 자세한 판단 근거는 `CREATOR_OS_VIDEOS_PAGINATION_AUDIT.md`를 기준으로 봅니다.

### 5.5 댓글 Top 10은 직접 YouTube API 호출

댓글 조회는 백엔드 Functions가 아니라 프론트에서 YouTube API로 직접 호출합니다.

운영 기준:

- 사용자 API Key가 필요합니다.
- DB에 저장되는 기능이 아니라 조회 기능으로 설명합니다.
- 비용성 호출임을 표시합니다.
- API Key가 없거나 YouTube 오류/비JSON 응답이 오면 화면/상단 안내로 알려주며 Cloud DB나 localStorage를 변경하지 않습니다.

### 5.6 수집 로그와 API 사용량 로그

2026-07-27 기준 채널별 수집 이력은 기존 Cosmos `videos` container 안의 `docType: scan_log` 문서로 저장하며, `GET /scan-logs`로 최근 이력을 조회합니다. `api_quota_logs`는 별도 저장소나 endpoint가 없습니다.

운영 기준:

- 채널 문서의 `lastScanSummary`는 마지막 상태 표시로 계속 사용합니다.
- `scan_logs`는 채널별 성공/부분 성공/실패, 신규 영상 수, 통계 갱신 수, 오류를 보존합니다.
- 기존 `/videos` 조회는 `docType: video`만 읽어 수집 로그가 저장 영상 목록에 섞이지 않습니다.
- `GET /scan-logs`는 Cloud DB 조회이며 YouTube API를 호출하지 않습니다.
- `scan_logs` 저장 실패는 기존 영상 수집 성공을 실패로 바꾸지 않습니다.
- API 사용량 추정은 아직 구현된 기능처럼 표시하지 않습니다.
- `scan_logs`와 `api_quota_logs`는 개념과 저장 책임을 분리합니다.
- 자세한 목표 모델은 `CREATOR_OS_SCAN_API_USAGE_MODEL.md`를 기준으로 봅니다.

### 5.6.1 채널별 과거 영상 채우기

2026-07-27 선택지 B 승인에 따라 일반 새 영상 수집과 별도로 수동 과거 보강 기능을 둡니다.

- `POST /scan/backfill`은 저장된 운영중 채널 하나만 처리합니다.
- 프론트 기본값과 서버 상한은 10페이지이며, 선택한 채널 하나에서 한 번에 최대 500개 업로드 항목을 확인합니다.
- 이 500개는 신규 저장 목표가 아니라 업로드 목록 확인 범위입니다. 이미 Cloud에 있는 영상을 제외하므로 실제 신규 저장 수는 500개보다 적거나 0개일 수 있습니다.
- 500개 안에 업로드 목록 끝이 나오면 완료하고, 더 많으면 `nextPageToken`을 저장해 다음 수동 실행에서 이어갑니다.
- 이미 저장된 영상 ID는 다시 저장하지 않습니다.
- 다음 페이지 위치는 채널 문서의 `backfillState.nextPageToken`에 저장합니다.
- 업로드 목록 끝까지 확인하면 `backfillState.completed`를 `true`로 저장하고 다음 실행에서 YouTube API를 호출하지 않습니다.
- 화면은 과거 수집을 `확인 전`, `확인 중`, `목록 끝 확인 완료`로 구분합니다. 확인 중인 채널은 저장된 `nextPageToken`부터 이어서 실행하며 처음부터 다시 시작하지 않습니다.
- `목록 끝 확인 완료`는 공개 업로드 목록을 끝까지 확인했다는 뜻입니다. 삭제·비공개 영상과 집계 시점 차이로 Cloud 저장 수가 채널 통계보다 적거나 많아도 완료 상태일 수 있습니다.
- 화면의 Cloud 저장률은 최대 100%로 표시하고, 실제 저장 수가 채널 통계를 넘으면 초과 개수를 별도로 안내합니다. 원본 Cloud 값은 수정하거나 삭제하지 않습니다.
- 최근 수집 상태 화면은 `성공/실패/부분 성공/미수집`과 `과거 확인 전/진행 중/확인 완료`를 별도 필터로 제공하며 두 조건을 함께 적용할 수 있습니다. 필터 변경은 이미 조회한 Cloud 채널 목록의 표시만 바꾸며 YouTube API 호출이나 Cloud 저장을 실행하지 않습니다.
- 과거 수집 추천 정렬은 진행 중인 채널을 먼저 마무리하고, 확인 전 채널은 추정 미저장 영상이 많은 순서로 보여줍니다. 채널 이름·남은 영상·최근 확인 순으로 바꿀 수 있으며 모두 이미 조회한 Cloud 데이터의 화면 정렬입니다.
- 과거 목록 확인이 끝난 뒤 새로 게시되는 영상은 일반 `선택 채널 새 영상 수집`으로 확인합니다.
- 일반 새 영상 수집의 `lastScanSummary`와 `scan_log`는 덮어쓰지 않습니다.
- 자동 반복, 예약 실행, 전체 채널 일괄 과거 보강은 하지 않습니다.
- 정확한 quota 사용량 장부는 아직 없으므로 화면은 최대 확인 범위와 비용성 작업이라는 사실만 안내합니다.

### 5.7 외부 키워드 조사 도구는 바로가기

키워드 탐색과 `업무 도구함`에서 Google Trends, 네이버 DataLab, 네이버 검색광고, YouTube 검색으로 이동할 수 있습니다.

- Creator OS가 외부 검색량을 자동 수집하지 않습니다.
- 별도 외부 API endpoint, API Key, DB 저장, localStorage 저장을 추가하지 않습니다.
- Google Trends와 YouTube 검색은 현재 입력한 키워드를 URL에 담아 새 창으로 엽니다.
- 네이버 DataLab과 네이버 검색광고는 공식 도구를 열고, 필요하면 복사한 키워드를 사용자가 직접 입력합니다.
- 외부 사이트의 로그인, 이용약관, 조회 결과는 해당 서비스 기준을 따릅니다.
- 외부 바로가기 사용은 Cloud 저장 영상, 판단 기록, YouTube API 수집 흐름을 변경하지 않습니다.

### 5.8 업무 도구 개인 설정은 Cloud 저장

`GET /work-tool-preferences`와 `PUT /work-tool-preferences`는 업무 도구함의 사용자 설정 문서 1개를 조회·저장합니다.

- 저장 위치는 기존 `videos` container의 `docType: work_tool_preferences` 문서입니다.
- GET은 문서가 없으면 안전한 빈 설정을 반환합니다.
- PUT은 개인 도구, 숨긴 기본 도구 ID, 표시 순서를 검증한 뒤 전체 설정을 저장합니다.
- 개인 도구 URL은 `http` 또는 `https`만 허용합니다.
- 기본 도구 원본은 프론트 코드 기준이며 Cloud에서 직접 덮어쓰지 않습니다.
- 외부 도구의 검색 데이터나 로그인 정보는 조회·저장하지 않습니다.
- YouTube API 호출, localStorage 저장, 자동 동기화 큐는 없습니다.

---

## 6. 화면별 동작 기준

| 화면/영역 | 기본 동작 | API 호출 가능성 | DB 변경 가능성 | 원칙 |
|---|---|---|---|---|
| 오늘의 레이더 | 저장된 데이터 기반 추천/요약, 원본 URL 복사 | 기본 없음 | 판단 저장 시 있음 | 새 수집과 분리. URL 복사는 로컬 클립보드 동작 |
| 채널 관리 | 채널 조회/저장/상태 변경 | 미리보기/저장 시 YouTube API 가능 | 있음 | 저장과 스캔을 분리 |
| 영상 찾기/보관함 | 저장 영상 조회, 필터, 정렬 | 댓글 조회 제외 기본 없음 | 스크랩/상태 저장 시 있음 | 조회와 저장을 분리 |
| 제작 후보/칸반 | `videoUserRecords` 기반 상태 관리 + `focusPinnedAt` 수동 집중 고정 | 없음 | 있음 | 집중 고정은 제작 상태와 분리. 발견 링크 고정은 현재 범위 아님 |
| 스크랩북 | 스크랩 조회/저장/삭제 | 없음 | 있음 | Cloud 우선, localStorage 보조 |
| 수집/스캔 | 새 영상 확인 | 있음 | 있음 | 비용성 작업으로 명확히 표시 |
| 준비중 화면 | 안내 | 없음 | 없음 | 클릭해도 변경 없어야 함 |
| 키워드 탐색 / 업무 도구함 | 외부 공식 조사 도구 바로가기 | Creator OS API 호출 없음 | 없음 | 링크 이동과 키워드 복사만 제공 |
| 설정 / 업무 도구 관리 | 개인 도구와 표시 순서 관리 | Cloud 설정 조회·저장 | 있음 | 외부 검색 데이터는 수집하지 않음 |

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
- `/video-records`의 장기 상태 모델을 명시 필드로 분리할지 여부
- `/videos` 서버 검색/정렬 또는 화면 가상화를 추가할지 여부
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
