# Creator OS scan/API 사용 기록 모델 검토

작성일: 2026-07-02

이 문서는 Creator OS에서 YouTube API를 쓰는 작업을 어떻게 기록하고, 사용자가 "조회"와 "수집"을 혼동하지 않도록 어떤 기준을 둘지 정리합니다.

중요: 이 문서는 목표 모델과 현재 적용 상태를 함께 기록합니다. 2026-07-27 승인된 B안은 `scan_logs`만 최소 구현하며 `api_quota_logs`는 포함하지 않습니다.

## 2026-07-27 현재 적용 상태

- 오퍼레이션 관제의 `최근 수집 상태` 화면에서 기존 `channels.lastScanSummary`와 `channels.lastScannedAt`을 모아봅니다.
- 같은 화면에서 기존 `videos` container의 `docType: scan_log` 최근 채널별 실행 이력 최대 100건을 Cloud DB로 조회합니다.
- 채널 이름, 태그, 등급, 오류 검색과 상태 필터는 프론트 화면 표시만 변경합니다.
- 화면 열기와 이력 새로고침은 Cloud DB 조회만 실행하고, YouTube API 호출, Cloud 저장, localStorage 변경은 실행하지 않습니다.
- `scan_logs`는 1차 구현됐고 `api_quota_logs`는 미구현입니다.
- 따라서 채널별 과거 이력은 볼 수 있지만 정확한 YouTube API 쿼터 장부가 구현된 것으로 해석하면 안 됩니다.

---

## 1. 현재 기준 사실

아래 내용은 2026-07-02 현재 프론트 repo와 기존 Backend/API Evidence Audit 기준입니다.

- 저장 영상 불러오기 `GET /videos?channelIds=...`는 Cloud DB 조회입니다.
- 선택 채널 새 영상 수집은 `POST /scan/selected`입니다.
- 전체/태그 새 영상 수집은 `GET /scan`, `GET /scan?tag=...`입니다.
- `POST /scan/selected`, `GET /scan`, `GET /scan?tag=...`는 YouTube API 호출과 Cloud DB 갱신이 발생할 수 있습니다.
- `GET /scan`은 HTTP 메서드상 GET이지만 단순 조회가 아니라 비용성/변경 작업으로 봐야 합니다.
- 채널별 마지막 수집 상태는 `channels.lastScanSummary`와 `channels.lastScannedAt` 중심으로 표시됩니다.
- `scan_logs`는 기존 `videos` container의 `docType: scan_log` 문서와 `GET /scan-logs` 읽기 endpoint가 있습니다.
- `api_quota_logs` 별도 저장소는 없습니다.
- 댓글 Top 10 조회는 백엔드 Functions가 아니라 프론트에서 사용자의 YouTube API Key로 직접 YouTube API를 호출합니다.
- 채널 미리보기와 채널 저장도 YouTube API 조회가 필요할 수 있습니다.

근거 파일:

- `src/services/functionApi.js`
- `src/hooks/useVideoCollectionActions.js`
- `src/utils/videoCollection.js`
- `src/utils/channelScanDisplay.js`
- `src/services/youtubeApi.js`
- `docs/CREATOR_OS_API_BEHAVIOR_MAP.md`
- `docs/CREATOR_OS_DATA_OWNERSHIP.md`

---

## 2. 현재 동작 흐름

### 2.1 저장 영상 불러오기

```txt
사용자가 채널 선택
→ 저장된 영상 불러오기 클릭
→ GET /videos?channelIds=...
→ Cloud DB에 저장된 영상 조회
→ 프론트에 표시
```

판정:

- YouTube API 호출 없음
- Cloud DB 읽기
- Cloud DB 변경 없음
- scan 로그 대상 아님
- api quota 로그 대상 아님

### 2.2 선택 채널 새 영상 수집

```txt
사용자가 채널 체크
→ 선택 채널 새 영상 수집 클릭
→ 운영중 채널만 필터링
→ POST /scan/selected
→ YouTube API로 새 영상/통계 확인 가능
→ Cloud DB에 영상/채널 상태 저장 또는 갱신 가능
→ 채널 목록과 저장 영상 다시 불러오기
```

판정:

- YouTube API 호출 가능
- Cloud DB 읽기 가능
- Cloud DB 변경 가능
- 향후 `scan_logs` 기록 대상
- 향후 `api_quota_logs` 기록 대상

### 2.3 전체/태그 새 영상 수집

```txt
전체 운영중 채널 또는 태그 채널 대상
→ GET /scan 또는 GET /scan?tag=...
→ YouTube API로 새 영상/통계 확인 가능
→ Cloud DB에 영상/채널 상태 저장 또는 갱신 가능
```

판정:

- HTTP GET이지만 단순 조회가 아님
- YouTube API 호출 가능
- Cloud DB 변경 가능
- 향후 `scan_logs` 기록 대상
- 향후 `api_quota_logs` 기록 대상

### 2.4 댓글 Top 10 조회

```txt
사용자가 댓글 Top 10 보기 클릭
→ 프론트가 YouTube commentThreads API 직접 호출
→ 화면에 댓글 표시
```

판정:

- YouTube API 호출 있음
- 현재 Cloud DB 저장 없음
- 서버 기준 scan 로그 대상은 아님
- 향후 API 사용량 안내 대상은 될 수 있음
- 사용자의 API Key로 실행되므로 서버 `api_quota_logs`에 자동 기록하기 어렵습니다.

---

## 3. 현재 구조의 한계

| 한계 | 설명 | 사용자 영향 |
|---|---|---|
| 실행 단위 집계 없음 | `scan_logs`는 현재 채널별 실행 기록입니다. | 한 번의 전체/분야 수집을 하나의 묶음으로 분석하기는 어렵습니다. |
| 보관 정책 없음 | 최근 이력 조회는 가능하지만 자동 삭제 기간은 아직 정하지 않았습니다. | 장기 운영 전 데이터 증가량 확인이 필요합니다. |
| API 사용량 추정 불가 | 앱 안에서 YouTube API 호출 규모를 볼 수 없습니다. | 비용/쿼터 위험을 감으로만 판단하게 됩니다. |
| GET `/scan` 오해 위험 | URL과 메서드만 보면 조회처럼 보입니다. | 사용자가 단순 새로고침처럼 누를 수 있습니다. |
| 댓글 API 사용량 분리 | 댓글 Top 10은 사용자 API Key로 프론트에서 직접 호출합니다. | 서버 수집 API 사용량과 합산하기 어렵습니다. |

---

## 4. `lastScanSummary`, `scan_logs`, `api_quota_logs` 역할 구분

### 4.1 `lastScanSummary`

현재 역할:

- 채널 카드에서 마지막 수집 상태를 빠르게 보여주는 요약값입니다.
- 현재 구현되어 있습니다.
- 채널 문서에 붙어 있는 최신 상태입니다.

목표 역할:

- 계속 "마지막 상태 표시" 용도로 유지합니다.
- 과거 이력 저장소로 확장하지 않습니다.
- 수집 로그 화면을 만들 때도 채널 카드 요약은 `lastScanSummary`를 유지합니다.

예상 필드:

```txt
channels.lastScanSummary = {
  status,
  scannedAt,
  newVideosFound,
  statsRefreshed,
  coverageRate,
  error
}
```

### 4.2 `scan_logs`

목표 역할:

- "수집 실행 1회"를 기록합니다.
- 사용자가 언제 어떤 범위로 수집을 실행했는지 볼 수 있게 합니다.
- 성공/부분 성공/실패, 새 영상 수, 대상 채널 수, 실패 원인을 남깁니다.

기준 성격:

- 운영 이력 데이터입니다.
- 캐시가 아닙니다.
- Cloud DB 기준이어야 합니다.
- 2026-07-27 선택지 B 범위로 1차 구현되었습니다.

현재 1차 구현 필드:

```txt
scan_log = {
  id,
  docType: "scan_log",
  channelId,
  channelTitle,
  status: "success" | "partial" | "failed",
  scannedAt,
  newVideosFound,
  statsRefreshed,
  stoppedAtLatestVideoId,
  savedVideosTotal,
  channelTotalVideos,
  estimatedMissingVideos,
  coverageRate,
  error,
  trigger: "manual_all" | "manual_tag" | "selected" | "timer" | "unknown",
  scanRunId
}
```

운영 원칙:

- 기존 Cosmos `videos` container에 `docType: scan_log`로 저장하고 partition key `/channelId`를 공유합니다.
- 기존 `GET /videos`는 영상 문서만 필터링하므로 로그가 영상 목록에 섞이지 않습니다.
- `scan_logs`는 채널별 수집 실행 결과를 기록합니다.
- API quota 비용을 정확히 보장하는 장부는 아닙니다.
- 채널별 마지막 표시는 계속 `lastScanSummary`를 사용합니다.
- 이력 저장 실패는 기존 영상 수집 결과를 실패로 바꾸지 않습니다.
- `GET /scan-logs`는 기본 100건, 최대 200건의 페이지 조회를 지원합니다.
- 화면은 우선 최근 100건을 읽습니다.
- 보관 기간과 자동 삭제는 운영량을 확인한 뒤 별도 결정합니다.

### 4.3 `api_quota_logs`

목표 역할:

- YouTube API를 호출할 수 있는 작업의 사용량 위험을 기록합니다.
- 정확한 과금 장부라기보다 앱 안에서 보는 "쿼터 사용 추정 기록"으로 시작합니다.
- scan, channel preview, channel save, comments 같은 YouTube API 사용 흐름을 구분합니다.

기준 성격:

- 운영 이력 데이터입니다.
- Cloud DB 기준 후보입니다.
- 아직 미구현입니다.
- 실제 YouTube quota 사용량은 Google Cloud Console이 최종 기준입니다.

초안 필드 후보:

```txt
api_quota_log = {
  id,
  docType: "api_quota_log",
  provider: "youtube",
  operation: "scan" | "channel_preview" | "channel_save" | "comments_top10",
  apiKeyScope: "server" | "user",
  endpointGroup,
  requestCount,
  estimatedUnits,
  relatedScanLogId,
  relatedChannelIds,
  relatedVideoId,
  status: "success" | "failed",
  error,
  createdAt
}
```

운영 원칙:

- 처음에는 정확한 비용 장부가 아니라 추정치로 봅니다.
- 서버 API Key를 쓰는 작업과 사용자 API Key를 쓰는 작업을 구분합니다.
- 댓글 Top 10처럼 프론트에서 직접 호출하는 작업은 서버 로그와 자동 합산하기 어렵습니다.
- 사용자에게는 "예상 사용량" 또는 "앱 기준 추정"으로 표시해야 합니다.

---

## 5. 저장 위치 후보

| 데이터 | 현재 저장 위치 | 목표 저장 위치 후보 | 현재 구현 | 기준 데이터 여부 | 비고 |
|---|---|---|---:|---:|---|
| `lastScanSummary` | `channels` 문서 | `channels` 문서 유지 | 예 | 예 | 마지막 상태 표시 |
| `scan_logs` | Cosmos `videos` container의 `docType: scan_log` | MVP는 현재 구조 유지. 규모 증가 시 별도 container 재검토 | 예 | 예 | 채널별 수집 실행 이력 |
| `api_quota_logs` | 없음 | Cloud DB 별도 container 또는 `videos` container docType | 아니오 | 후보 | API 사용량 추정 |
| 댓글 Top 10 사용량 | 없음 | 별도 검토 | 아니오 | 후보 | 사용자 API Key라 자동 기록 어려움 |

현재 판단:

- 승인된 B안에 따라 기존 `videos` container의 `docType: scan_log` 문서와 읽기 endpoint를 사용합니다.
- 새 container를 만들지 않아 Cosmos 무료 처리량 한도 안에서 운영합니다.
- `api_quota_logs`는 만들지 않습니다.
- 두 로그의 역할과 향후 저장소 판단은 계속 분리합니다.

---

## 6. 구현 선택지

### 선택지 A: 현재 구조 유지

내용:

- `lastScanSummary`만 유지합니다.
- 별도 수집 로그와 API 사용량 로그를 만들지 않습니다.

장점:

- 가장 안전합니다.
- 백엔드/API/DB 변경이 없습니다.
- 현재 기능을 건드리지 않습니다.

단점:

- 과거 수집 이력과 API 사용량을 추적할 수 없습니다.
- 사용자가 나중에 "언제 수집했지?"를 확인하기 어렵습니다.

현재 적합도:

- 지금 당장 구현 기준으로는 적합합니다.
- 다만 Creator OS 운영 도구로 커지려면 부족합니다.

### 선택지 B: `scan_logs`만 추가

내용:

- 새 영상 수집 실행 이력만 남깁니다.
- API quota 추정은 아직 만들지 않습니다.

장점:

- 사용자가 수집 이력을 확인할 수 있습니다.
- 수집 실패 원인을 추적하기 쉬워집니다.
- `api_quota_logs`보다 범위가 작습니다.

단점:

- API 사용량 위험은 여전히 별도 추적이 어렵습니다.
- 수집 실행과 API 호출량의 관계를 나중에 다시 연결해야 합니다.

적합한 경우:

- 수집 로그 화면을 먼저 만들고 싶을 때
- 비용 추정보다 실패 추적이 더 급할 때

### 선택지 C: `scan_logs`와 `api_quota_logs`를 함께 설계

내용:

- 수집 실행 이력과 API 사용량 추정 기록을 분리해서 설계합니다.
- 구현은 단계적으로 하더라도 모델은 함께 맞춥니다.

장점:

- "수집 실행"과 "API 사용량"을 혼동하지 않게 됩니다.
- 운영 도구로 확장하기 좋습니다.
- 나중에 사용량 대시보드로 이어질 수 있습니다.

단점:

- DB/API 설계 결정이 필요합니다.
- 실제 구현 범위가 커질 수 있습니다.
- 정확한 quota 계산은 YouTube API 특성상 추정으로 시작해야 합니다.

적합한 경우:

- 1차 안정화 이후 운영 기록 화면을 만들 때
- API 사용량 안내를 앱의 핵심 안정성 기능으로 볼 때

### 선택지 D: localStorage에만 임시 로그 저장

내용:

- 브라우저 localStorage에 수집 실행 이력을 남깁니다.

장점:

- 백엔드 변경 없이 만들 수 있습니다.

단점:

- 기준 데이터가 아닙니다.
- 브라우저 캐시 삭제 시 사라질 수 있습니다.
- Cloud 기준 원칙과 충돌합니다.
- 여러 기기에서 이력이 이어지지 않습니다.

현재 판단:

- 추천하지 않습니다.
- localStorage는 기준 데이터가 아니라 임시 fallback 역할로만 둡니다.

---

## 7. Codex 추천

현재는 **선택지 A를 유지하고, 선택지 C를 목표 모델로 문서화**하는 것을 추천합니다.

이유:

1. 지금은 DB schema와 endpoint를 바꾸지 않는 안정화 단계입니다.
2. `scan_logs`와 `api_quota_logs`는 새 저장소 또는 새 `docType` 설계가 필요하므로 사용자 판단이 필요합니다.
3. YouTube API 사용량은 비용성 영역이라 정확한 의미를 먼저 정해야 합니다.
4. 앱의 다음 단계에서는 "수집 실행 이력"과 "API 사용량 추정"을 분리해야 운영 도구로 커질 수 있습니다.

즉, 지금 당장 만들지는 않되, 나중에 만들 때는 `scan_logs`와 `api_quota_logs`를 개념상 분리하는 방향이 좋습니다.

---

## 8. UI 원칙

사용자가 버튼을 누르기 전에 아래를 알 수 있어야 합니다.

### 8.1 새 영상 수집 버튼

표시해야 할 것:

- YouTube API 호출이 발생할 수 있음
- Cloud DB에 영상/채널 상태가 저장 또는 갱신될 수 있음
- 대상 채널 수
- 운영중 채널만 수집 대상이라는 점

피해야 할 표현:

- 불러오기
- 새로고침
- 보기

권장 표현:

- 선택 채널 새 영상 수집
- 전체 운영중 채널 새 영상 수집
- YouTube API로 새 영상 여부를 확인합니다

### 8.2 저장 영상 불러오기 버튼

표시해야 할 것:

- Cloud DB에 이미 저장된 영상만 조회
- YouTube API를 새로 호출하지 않음
- 새 영상 수집과 다름

권장 표현:

- 저장된 영상 불러오기
- 클라우드 DB 조회
- YouTube API 호출 없음

### 8.3 최근 수집 상태 화면

현재 `lastScanSummary` 기반의 최근 상태 화면이 구현되어 있습니다.

현재 보여주는 항목:

- 채널별 마지막 실행 시각
- 성공/부분 성공/실패/미수집
- 신규 영상 수
- 통계 갱신 수
- 마지막 오류 요약
- 최근 채널별 과거 수집 이력 최대 100건
- 수집 방식, 실행 시각, 신규 영상 수, 통계 갱신 수, 오류

아직 보여줄 수 없는 항목:

- 전체/분야 수집 1회를 하나로 묶은 실행 단위 상세
- 정확한 API 쿼터 사용량

### 8.4 API 사용량 화면

아직 구현되지 않았으므로 준비중으로 표시해야 합니다.

보여줄 후보:

- 오늘 추정 호출량
- 작업별 추정 사용량
- scan, channel preview, comments 구분
- 서버 API Key와 사용자 API Key 구분
- 정확한 quota는 Google Cloud Console이 최종 기준이라는 안내

---

## 9. 지금 결정하지 말아야 할 것

2026-07-27 B안 승인으로 `docType: scan_log` 저장과 `GET /scan-logs`는 구현 범위에 포함되었습니다. 아래 항목은 여전히 결정하거나 구현하지 않습니다.

- `api_quota_logs` container 추가
- 기존 `GET /scan` 동작 변경
- `GET /scan`을 `POST /scan`으로 전환
- 자동 스캔 스케줄링
- API 사용량 제한 또는 차단 정책
- 사용자 API Key 저장 방식
- 댓글 Top 10을 백엔드로 이동
- YouTube API 호출량을 늘리는 자동화

---

## 10. 다음 단계

사용자 결정 없이 가능한 다음 작업:

1. 실제 운영 이력 누적 여부를 확인합니다.
2. 반복 실패 채널의 가독성을 작은 UI 개선으로 보강합니다.
3. 문서와 화면 문구가 채널별 이력과 전체 실행 집계를 혼동하지 않는지 유지합니다.

사용자 결정이 필요한 다음 작업:

1. `api_quota_logs`를 실제로 만들지
2. API 사용량을 정확한 값으로 볼지, 추정치로 볼지
3. 전체 수집 요청 1회를 묶은 실행 단위 상세를 추가할지
4. `scan_logs` 보관 기간이나 자동 삭제 정책을 둘지

---

## 11. 최종 판정

현재 단계에서는 `scan_logs`만 채널별 실행 이력으로 1차 구현합니다. `api_quota_logs`는 구현하지 않습니다.

현재 앱은 `lastScanSummary`로 마지막 상태를 빠르게 보여주고, `scan_logs`로 최근 채널별 과거 이력을 조회합니다. 정확한 API 사용량 관리와 전체 실행 단위 분석은 아직 제공하지 않습니다.

Creator OS가 실사용 운영 도구로 커지면 실제 누적량을 기준으로 보관 정책과 전체 실행 집계를 검토합니다. `api_quota_logs`는 성격이 다른 데이터이므로 계속 분리해서 판단합니다.
