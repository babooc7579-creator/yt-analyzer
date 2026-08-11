# Creator OS 데이터 소유권 기준

작성일: 2026-07-02

이 문서는 Creator OS에서 어떤 데이터가 Cloud DB 기준인지, 어떤 데이터가 localStorage에 남아 있는지, 어떤 데이터가 아직 목표 설계 단계인지 구분하기 위한 기준 문서입니다.

v2.2 문서는 제품 목표 설계도입니다. 이 문서는 현재 repo와 Backend/API Evidence Audit에서 확인한 실제 구현 상태를 기준으로, 목표 구조까지 가는 중간 기준을 정리합니다.

---

## 1. 현재 기준 사실

아래 내용은 2026-07-27 기준으로 프론트 repo와 백엔드 Functions repo에서 확인한 사실입니다.

- `/video-records`는 기존 대표 상태 `status`를 유지합니다.
- `statusIds`는 최종 상태 설계가 아니라, 현재 프론트의 복수 판단값을 Cloud에 보존하기 위한 호환성 확장입니다.
- 기존 `status`는 대표 상태로 유지하며, `statusIds`는 복수 판단 보존용 보조 필드로 Cloud 저장/조회됩니다.
- `/scrapbook`은 별도 Cosmos container가 아니라 `videos` container 안에 `docType: scrapbook` 형태로 저장됩니다.
- `scan_logs`는 기존 Cosmos `videos` container 안에 `docType: scan_log`로 채널별 수집 실행 이력을 저장하고 `GET /scan-logs`로 조회합니다.
- `api_quota_logs` 별도 저장소는 없습니다.
- `production_candidates` 별도 저장소는 없습니다.
- `discovery_links` 별도 Cosmos container는 없습니다.
- `/discovery-links` API는 존재하며, 기존 `videos` container 안에 `docType: discovery_link` 문서로 저장합니다.
- `local_assets` 별도 저장소는 없습니다.
- `GET /videos?channelIds=...`는 저장된 영상 데이터를 읽는 DB 조회입니다.
- `POST /scan/selected`, `GET /scan`, `GET /scan?tag=...`는 YouTube API 호출과 DB 갱신이 발생할 수 있습니다.
- `GET /channel-preview`는 사용자가 `YouTube API로 확인`을 눌렀을 때 채널 정보만 조회합니다. 온라인 저장소(Azure DB) 저장과 영상 수집은 실행하지 않습니다.
- `POST /channels/bulk`는 사용자가 최종 저장을 눌렀을 때 최대 50개 채널을 10개씩 YouTube API로 확인하고 기존 `channels` 저장소에 등록합니다. 기존 등록·중복 입력은 재저장하지 않으며 영상 수집은 실행하지 않습니다.

중요: 위 항목은 "현재 구현된 사실"입니다. 부족한 부분은 오류라기보다 v2.2 목표로 가기 위한 전환 경로가 필요한 부분입니다.

---

## 2. Source of Truth 원칙

Source of Truth는 "앱이 최종 기준으로 믿어야 하는 저장 위치"를 뜻합니다.

Creator OS에서는 다음 원칙을 우선합니다.

1. Cloud DB는 장기 기준 데이터의 원본입니다.
2. localStorage는 임시 캐시, 복구, 기존 사용자 호환을 위한 보조 저장소입니다.
3. 비용이 발생할 수 있는 YouTube API 호출 결과와 단순 DB 조회 결과는 화면과 문서에서 분리합니다.
4. 아직 구현되지 않은 데이터 모델은 UI에서 실제 기능처럼 보이게 하지 않습니다.
5. 기존 데이터를 깨뜨릴 수 있는 변경은 별도 Issue로 분리해 결정합니다.

---

## 3. 데이터별 소유권 기준

| 데이터 | 현재 기준 데이터 | 목표 기준 데이터 | 현재 저장 위치 | 목표 저장 위치 | localStorage 역할 | Cloud DB 역할 | 미구현 여부 | 충돌 위험 |
|---|---|---|---|---|---|---|---|---|
| `channels` | Cloud DB | Cloud DB | Cosmos `channels` container | Cosmos `channels` container | 원칙상 기준 아님 | 채널 목록, 태그, 언어, 등급, 상태, 마지막 수집 요약 저장 | 구현됨 | 낮음. 기존 데이터에 필드가 없어도 기본값 보정 필요 |
| `videos` | Cloud DB | Cloud DB | Cosmos `videos` container | Cosmos `videos` container | 원칙상 기준 아님 | YouTube에서 수집한 영상 목록과 통계 저장. 선택형 페이지 조회 지원 | 구현됨 | 낮음. 프론트가 모든 페이지를 완료한 뒤 전체 목록으로 사용 |
| `videoUserRecords` | Cloud DB + localStorage fallback | Cloud DB | Cosmos `videos` container 안의 `docType: video_user_record` | 장기적으로 Cloud DB 기준. 현재 단계는 대표 `status` 유지 + 호환용 `statusIds`, 수동 집중 표시 `focusPinnedAt` 보존 | Cloud 성공 캐시/장애 시 임시 fallback | 영상별 사용자 판단 상태, 노트, 제작 관련 필드, 오늘 집중 고정 시각 저장 | 부분 구현 | 중간. Cloud 저장 실패 시 화면 임시 기록과 Cloud 기준이 달라질 수 있음 |
| `scrapbook` | Cloud DB + localStorage fallback | Cloud DB | Cosmos `videos` container 안의 `docType: scrapbook` | Cloud DB. 별도 container 여부는 나중에 판단 | Cloud 성공 캐시/장애 시 임시 fallback | 별표/스크랩 저장 영상 목록 저장 | 부분 구현 | 중간. 별도 컨테이너가 아니라 `videos`와 섞여 있음 |
| `production candidates` | `videoUserRecords`에 얹힌 상태 | 미정 | 별도 저장소 없음. 프론트는 `videoUserRecords` 상태로 표현 | v1에서는 `videoUserRecords` 유지 가능. 장기적으로 별도 모델 검토 | 기준 아님 | 현재는 `/video-records`가 사실상 후보 상태를 저장 | 별도 저장소 미구현 | 높음. 영상 상태와 제작 프로젝트 상태가 섞일 수 있음 |
| `discovery links` | Cloud DB | Cloud DB | Cosmos `videos` container 안의 `docType: discovery_link` | MVP는 기존 Cloud DB에 `docType: discovery_link` 방식 유지. 장기적으로 별도 container 재검토 | 기준 아님 | 수동 저장 링크, 메모, 발견함 상태, 권리 상태 저장 | 부분 구현 | 중간. `/videos` 조회에 discovery link 문서가 섞이지 않도록 API 경계 유지 필요 |
| `local assets` | 없음 | 로컬 파일 메타데이터 + Cloud DB 인덱스 후보 | 없음 | 별도 `local_assets` 모델 후보 | 로컬 파일 자체는 브라우저 localStorage로 다루면 안 됨 | 파일 경로/출처/연결 메타데이터만 저장 후보 | 미구현 | 높음. 브라우저 보안, 파일 위치 변경, 출처 추적 이슈 |
| `scan logs` | Cloud DB | Cloud DB | Cosmos `videos` container 안의 `docType: scan_log` | MVP는 현재 구조 유지. 규모 증가 시 별도 container 재검토 | 기준 아님 | 채널별 수집 실행 이력, 성공/부분 성공/실패, 새 영상 수, 오류 기록 | 1차 구현 | 중간. 전체 실행 단위 집계와 보관 기간 정책은 아직 없음 |
| `api quota logs` | 없음 | Cloud DB | 없음 | 별도 `api_quota_logs` 모델 후보 | 기준 아님 | YouTube API 호출량과 비용 위험 기록 | 미구현 | 높음. 비용성 작업 추적 불가 |

---

## 4. 데이터별 현재 위치와 목표 방향

### 4.1 channels

현재는 Cloud DB의 `channels` container가 기준입니다.

저장되는 주요 값:

- 채널 ID
- 채널명
- 썸네일
- uploadsId
- 통계
- 태그
- 언어
- `grade`
- `status`
- `lastScanSummary`
- `lastScannedAt`

목표 방향:

- 계속 Cloud DB를 기준으로 유지합니다.
- `grade`는 중요도 판단 보조 신호입니다.
- `status`는 수집 대상 여부를 결정하는 운영 상태입니다.
- localStorage를 기준 데이터로 추가하지 않습니다.

충돌 위험:

- 낮음.
- 다만 채널 상태는 YouTube API 호출 여부에 영향을 주므로, 화면에서 "활성/보류/제외" 의미를 명확히 해야 합니다.

### 4.2 videos

현재는 Cloud DB의 `videos` container가 기준입니다.

저장되는 주요 값:

- 영상 ID
- 채널 ID
- 제목
- 썸네일
- 업로드일
- 조회수
- 좋아요 수
- 댓글 수
- 쇼츠 여부
- 대박지수 `multiplier`
- 통계 갱신 시각

목표 방향:

- 계속 Cloud DB를 기준으로 유지합니다.
- 저장 영상 불러오기는 DB 조회로 유지합니다.
- 새 영상 수집과 명확히 분리합니다.

충돌 위험:

- 중간.
- 현재 `GET /videos?channelIds=...`의 기존 전체 조회 계약은 호환을 위해 유지합니다.
- 2026-07-02 기준 운영 데이터는 저장 영상 1,821개, 응답 약 1.16MB로 측정됐습니다.
- 2026-07-26부터 프론트는 선택형 페이지 조회를 사용해 기본 200개씩 모든 페이지를 순차 조회합니다.
- 중간 페이지 결과는 기준 데이터로 노출하지 않으며, 전체 조회가 끝난 결과만 레이더/검색/정렬에 사용합니다.
- 페이지 조회도 Cloud DB 읽기이며 YouTube API 수집과 분리됩니다.

### 4.3 videoUserRecords

현재는 Cloud DB와 localStorage가 함께 사용됩니다.

현재 구조:

- 백엔드: `videos` container 안의 `docType: video_user_record`
- 백엔드 저장: 기존 대표 상태 `status`와 복수 판단 보존용 `statusIds`
- 제작 후보 수동 집중 표시: 선택적인 `focusPinnedAt`
- 프론트: `status`와 `statusIds`를 함께 해석
- localStorage key: Cloud 성공 캐시/Cloud 장애 fallback 역할

목표 방향:

- 장기 기준은 Cloud DB입니다.
- 현재 단계에서는 `status`를 대표 상태로 유지하고, `statusIds`는 복수 판단 보존용 호환 필드로 유지합니다.
- `statusIds`는 최종 상태 설계가 아닙니다.
- `focusPinnedAt`은 제작 상태가 아니라 사용자가 고른 집중 후보와 고정 순서를 보존하는 보조 필드입니다.
- 장기적으로는 `lifecycleStatus`, `usagePurposeTags`, `productionStatus` 분리를 별도 설계로 검토할 수 있습니다.

충돌 위험:

- 중간.
- Cloud 저장 실패 시 화면에는 임시 반영됐지만 Cloud 기준 데이터와 다를 수 있습니다.
- 제작 상태와 영상 검토 상태가 한 문서에 섞일 수 있습니다.

### 4.4 scrapbook

현재는 Cloud DB와 localStorage가 함께 사용됩니다.

현재 구조:

- 백엔드: `videos` container 안의 `docType: scrapbook`
- 별도 `scrapbook` container 없음
- localStorage는 Cloud 성공 캐시/Cloud 장애 fallback 역할

목표 방향:

- 장기 기준은 Cloud DB입니다.
- localStorage는 Cloud 조회 실패 시 임시 복구/fallback 용도로만 봅니다.
- localStorage 스크랩을 Cloud로 자동 업로드하지 않습니다.
- 별도 container 분리는 지금 결정하지 않습니다.

충돌 위험:

- 중간.
- `videos` container 안에 영상 원본, 스크랩북, 사용자 기록이 함께 있으므로 `docType` 기준이 중요합니다.

### 4.5 production candidates

현재 별도 저장소는 없습니다.

현재 구조:

- 프론트 제작 칸반은 `videoUserRecords`의 상태값을 사용합니다.
- 영상 제작 후보의 `focusPinnedAt`을 읽어 오늘 집중 목록을 일반 후보와 분리합니다.
- 백엔드에 `production_candidates` endpoint나 container는 없습니다.

목표 방향:

- MVP 단계에서는 `videoUserRecords` 기반으로 유지할 수 있습니다.
- 실제 제작 프로젝트, 일정, 업로드 결과, 원본/변형 관계가 커지면 별도 모델을 검토합니다.
- 1차 MVP 범위는 `CREATOR_OS_PRODUCTION_CANDIDATES_MVP_SCOPE.md`를 기준으로 봅니다.
- 집중 고정은 자동 날짜 초기화 없이 사용자가 해제하거나 제작 상태를 이동할 때까지 유지합니다.

충돌 위험:

- 높음.
- 영상의 "검토 상태"와 콘텐츠의 "제작 상태"가 같은 상태 필드에 섞일 수 있습니다.

### 4.6 discovery links

현재 1차 MVP가 부분 구현되어 있습니다.

목표 방향:

- 외부에서 발견한 링크를 저장하는 별도 문서 타입입니다.
- YouTube 영상, 인스타 링크, 웹 링크, 메모, 출처 확인 상태를 연결할 수 있어야 합니다.
- 1차 MVP는 수동 링크 저장 중심의 발견함으로 시작했습니다.
- MVP에서는 새 `discovery_links` Cosmos container를 바로 만들지 않습니다.
- MVP 저장 위치는 기존 Cloud DB 구조 안에서 `docType: discovery_link` 방식으로 작게 시작했습니다.
- 단, 기존 저장 영상 조회인 `/videos` 응답에 `docType: discovery_link` 문서가 섞이면 안 됩니다.
- 링크 수와 기능이 커지면 `discovery_links` 별도 container 분리를 다시 검토합니다.
- 자세한 범위 선택지는 `CREATOR_OS_DISCOVERY_LINKS_MVP_SCOPE.md`를 기준으로 봅니다.
- 무단 크롤링이나 자동 다운로드를 전제로 하지 않습니다.

충돌 위험:

- 높음.
- 링크 저장, 원본 출처, 권리 확인, 로컬 파일 연결 기준을 먼저 정해야 합니다.

### 4.7 local assets

현재 구현되어 있지 않습니다.

목표 방향:

- 다운로드한 로컬 파일 자체를 Cloud DB에 넣는 것이 아니라, 파일을 설명하는 메타데이터를 관리하는 모델 후보입니다.
- 예: 파일명, 사용자가 적은 메모, 원본 링크, 연결된 discovery link, 출처 상태.
- 1차 MVP에서는 실제 파일 참조보다 파일 메모 카드 수준을 2차 후보로 봅니다.
- 자세한 범위 선택지는 `CREATOR_OS_DISCOVERY_LINKS_MVP_SCOPE.md`를 기준으로 봅니다.

충돌 위험:

- 높음.
- 브라우저 앱은 사용자의 로컬 파일 경로를 안정적으로 소유하기 어렵습니다.
- 데스크톱/브라우저/클라우드 저장 방식 중 어떤 방향으로 갈지 별도 판단이 필요합니다.

### 4.8 scan logs

2026-07-27 선택지 B 승인 이후 기존 Cloud 저장소에 수집 이력 문서가 추가되었습니다.

현재 구조:

- 각 채널 문서에 `lastScanSummary`가 저장됩니다.
- 각 채널 수집 시 Cosmos `videos` container에 `docType: scan_log` 채널별 실행 이력을 추가 저장합니다.
- `GET /scan-logs`는 최근 이력을 페이지 단위로 조회합니다.
- 기존 container의 partition key `/channelId`를 그대로 사용합니다.
- 이력 저장 실패가 기존 영상 수집의 성공 결과를 실패로 바꾸지 않습니다.
- `lastScanSummary`는 계속 마지막 상태 표시 용도로 유지합니다.

목표 방향:

- 채널별 과거 이력은 `scan_logs`를 기준으로 봅니다.
- `/videos` 조회는 `docType: video`만 읽으므로 수집 로그 문서가 저장 영상에 섞이지 않습니다.
- 이력 규모가 커질 때만 별도 `scan_logs` container 분리를 재검토합니다.
- 전체 수집 요청 1회를 묶어 보는 실행 단위 집계는 후속 검토 대상입니다.
- 보관 기간과 자동 삭제 정책은 운영량을 확인한 뒤 별도 결정합니다.
- 자세한 목표 모델은 `CREATOR_OS_SCAN_API_USAGE_MODEL.md`를 기준으로 봅니다.

충돌 위험:

- 중간.
- API 호출량은 기록하지 않으므로 `scan_logs`를 쿼터 장부로 해석하면 안 됩니다.
- 이력 저장 실패는 수집 결과에 영향을 주지 않기 때문에 일부 실행 이력이 빠질 가능성은 남습니다.

### 4.9 api quota logs

현재 구현되어 있지 않습니다.

목표 방향:

- YouTube API 호출량과 비용성 작업을 기록하는 별도 모델 후보입니다.
- 사용자가 "조회"와 "수집"을 혼동하지 않도록 돕는 운영 로그로 봅니다.
- 자세한 목표 모델은 `CREATOR_OS_SCAN_API_USAGE_MODEL.md`를 기준으로 봅니다.

충돌 위험:

- 높음.
- 현재는 API 호출량을 앱 내부에서 확인할 수 없습니다.

### 4.10 historical backfill progress

2026-07-27 선택 채널 전체 수집 C안 승인으로 채널별 수동 과거 영상 수집 진행 상태를 기존 `channels` 문서에 가산 방식으로 저장합니다.

현재 구조:

- 기준 저장 위치: Cosmos `channels` container의 채널 문서
- 필드: `backfillState`
- `nextPageToken`: 다음 수동 실행이 이어서 확인할 YouTube 업로드 목록 위치
- `completed`: 업로드 목록 끝까지 확인했는지 여부
- `pagesFetchedTotal`, `videosInspectedTotal`, `videosSavedTotal`: 수동 과거 보강 누적치
- `inspectionProgressRate`: 채널 업로드 목록 중 확인을 마친 범위의 진행률
- `lastRun`: 마지막 실행의 확인 수, 신규 저장 수, 목록 확인 진행률, Cloud 저장 합계, 추정 미저장 수, 완료 여부

운영 원칙:

- Cloud DB가 기준 데이터이며 localStorage에는 진행 커서를 저장하지 않습니다.
- 기존 `lastScanSummary`는 일반 새 영상 수집의 마지막 상태로 유지합니다.
- 과거 보강 진행은 `backfillState`로 분리해 최신 수집과 혼동하지 않습니다.
- 이미 존재하는 영상은 ID 기준으로 중복 저장하지 않습니다.
- 선택한 채널 하나에서 한 번에 최대 500개를 확인하며, 목록 끝에 도달하면 즉시 완료합니다.
- 500개 안에 끝나지 않으면 `nextPageToken`을 저장하고 사용자의 다음 실행에서 이어갑니다.
- 운영 화면은 `backfillState`를 기준으로 과거 수집을 `확인 전`, `확인 중`, `목록 끝 확인 완료`로 표시합니다.
- `completed: true`는 공개 업로드 목록의 끝을 확인했다는 뜻이며, 삭제·비공개 영상과 집계 시점 차이 때문에 Cloud 저장 수가 채널 통계보다 적거나 많아도 모순이 아닙니다.
- 화면의 저장률은 최대 100%로 제한해 표시하고 실제 개수 차이는 별도로 안내합니다. 이 표시는 기존 Cloud 원본 값을 변경하지 않습니다.
- 과거 목록 확인 완료 후 새 업로드는 기존 일반 새 영상 수집 흐름에서 확인합니다.
- 사용자가 채널 하나를 직접 실행할 때만 진행하며 자동 반복·예약·전체 채널 일괄 실행은 하지 않습니다.
- 기존 채널에 `backfillState`가 없어도 첫 실행 시 처음부터 시작하므로 마이그레이션은 필요하지 않습니다.

충돌 위험:

- YouTube 페이지 토큰이 장기간 지난 뒤 무효화될 가능성이 있습니다. 실패 시 완료로 표시하지 않고 같은 위치를 보존합니다.
- 채널 전체 영상 수는 YouTube 채널 통계 기준이므로 삭제·비공개 영상 때문에 Cloud 저장 수와 정확히 일치하지 않을 수 있습니다.
- `backfillState`는 진행 상태이며 정확한 API quota 장부가 아닙니다.

---

## 5. localStorage 원칙

localStorage는 지금 당장 제거하지 않습니다.

현재 원칙:

1. localStorage는 기준 데이터가 아닙니다.
2. localStorage는 Cloud 성공 캐시, 장애 시 임시 fallback, 기존 사용자 호환 용도로만 봅니다.
3. Cloud 조회가 성공하면 Cloud 응답을 기준으로 삼습니다. Cloud 응답이 빈 결과여도 Cloud가 기준입니다.
4. localStorage key 변경 또는 제거는 별도 Issue에서 판단합니다.
5. 기존 사용자의 스크랩북이나 영상 상태가 사라질 수 있는 변경은 금지합니다.
6. 마이그레이션이 필요하면 먼저 백업/복구 전략을 문서화합니다.
7. localStorage와 Cloud 데이터를 자동 병합하지 않습니다.
8. localStorage 데이터를 Cloud에 자동 업로드하지 않습니다.

현재 localStorage가 의미 있는 영역:

- `videoUserRecords` Cloud 조회 실패 시 임시 fallback
- `scrapbook` Cloud 조회 실패 시 임시 fallback
- 브라우저 환경에서 사용하던 기존 데이터 보호

하지 말아야 할 일:

- localStorage를 기준 저장소로 설계하기
- Cloud DB와 의미가 다른 데이터를 조용히 덮어쓰기
- localStorage 데이터를 Cloud로 자동 업로드하기
- Cloud 데이터와 localStorage 데이터를 자동 병합하기
- key를 대량 변경하기
- 기존 key를 바로 삭제하기

---

## 6. 지금 결정하지 말아야 할 것

아래 항목은 현재 문서에서 방향만 기록하고, 구현이나 구조 변경은 하지 않습니다.

- `status/statusIds`를 장기 상태 모델로 분리할지 여부
- `production_candidates` 별도 DB를 도입할지 여부
- `discovery_links` 별도 Cosmos container를 도입할지 여부
- `local_assets` API를 구현할지 여부
- `discovery_links` 별도 Cosmos container를 도입할지 여부
- localStorage 제거 또는 key 변경
- DB schema 변경
- 새 Cosmos container 추가
- 기존 endpoint 동작 변경
- YouTube API 호출 증가가 생길 수 있는 자동화

이 항목들은 제품 판단과 데이터 안전성이 걸려 있으므로, 별도 선택지 보고 후 결정합니다.

---

## 7. 다음 문서로 넘길 항목

### 7.1 상태값 사전

다음 문서에서 다룰 내용:

- 영상 상태
- 제작 후보 상태
- 채널 상태
- 수집 상태
- 스크랩북 상태
- 발견 링크 상태
- 로컬 파일 출처 상태
- 단일 `status`와 복수 `statusIds`의 관계

### 7.2 API 동작 맵

다음 문서에서 다룰 내용:

- 어떤 버튼이 DB 조회인지
- 어떤 버튼이 YouTube API 호출인지
- 어떤 버튼이 Cloud DB에 저장하는지
- 어떤 기능이 아직 준비중인지
- 화면에서 비용성 작업을 어떻게 표시할지

### 7.3 discovery links / local assets 모델

다음 문서에서 다룰 내용:

- 외부 링크 저장 목적
- 원본 링크와 로컬 파일 연결 방식
- 링크만 있는 경우
- 파일만 있는 경우
- 발견함 MVP 상태값: `inbox`, `reviewing`, `saved`, `candidate`, `discarded`
- 권리 확인 상태값: `rightsStatus`의 `unknown`, `needs_check`, `cleared`, `do_not_use`
- 원본 후보/리포스트 의심은 MVP status에 섞지 않고 별도 메모 또는 후속 `sourceStatus` 검토 항목으로 둠
- 무단 크롤링 없이 안전하게 설계하는 방법

---

## 8. 당장 적용할 운영 기준

현재 단계에서 Codex와 사용자는 아래 기준으로 작업합니다.

1. 채널과 영상 원본 데이터는 Cloud DB 기준으로 본다.
2. 영상별 사용자 판단은 Cloud DB 기준으로 옮겨가는 중인 데이터로 본다.
3. 스크랩북은 Cloud DB 기준으로 옮겨가는 중인 데이터로 본다.
4. localStorage는 삭제하지 않고 보조 저장소로만 본다.
5. 제작 후보는 아직 별도 DB가 없으므로 `videoUserRecords` 기반 MVP로 본다.
6. 발견 링크는 1차 MVP가 구현되었고, 수동 링크 저장 중심의 `docType: discovery_link` 문서 타입으로 작게 시작한다.
7. 로컬 파일 관리는 아직 목표 설계 단계로 본다.
8. 수집 로그와 API 사용량 로그는 아직 구현되지 않은 운영 데이터로 본다.
9. API 호출 가능성이 있는 작업은 화면/문서에서 반드시 DB 조회와 분리한다.
---

## 2026-07-02 결정 기록: videoUserRecords statusIds Cloud 보존

현재 단계에서는 `/video-records`의 기존 `status`를 대표 상태로 계속 유지합니다.

추가 결정:

- 기존 `status` 필드는 삭제하지 않습니다.
- 기존 `status` 의미와 UI 동작은 바꾸지 않습니다.
- `statusIds`는 최종 상태 설계가 아니라 복수 판단 보존용 호환 필드로 Cloud DB에도 함께 저장합니다.
- `statusIds`는 string 배열이며, 저장 시 중복 값은 제거합니다.
- 기존 record에 `statusIds`가 없어도 조회 응답에서 프론트가 깨지지 않도록 `status` 기반 fallback을 제공합니다.
- `production_candidates` 별도 DB는 아직 만들지 않습니다.
- localStorage key는 변경하지 않습니다.
- 전체 상태 모델 재설계는 하지 않습니다.

장기적으로는 `lifecycleStatus`, `usagePurposeTags`, `productionStatus` 분리를 별도 설계로 검토할 수 있습니다.

---

## 2026-07-13 결정 기록: 제작 후보 오늘 집중 Cloud 보존

레이더는 현재 우선 후보를 계속 갱신하고, 사용자가 제작 후보함에서 고른 영상만 `오늘 집중`으로 고정하는 혼합 방식을 사용합니다.

저장 원칙:

- 기존 `/video-records` endpoint와 `docType: video_user_record` 문서를 그대로 사용합니다.
- 선택적인 `focusPinnedAt` 문자열 필드에 Cloud 고정 시각을 저장합니다.
- 기존 `status`와 `statusIds`의 의미나 저장 규칙은 바꾸지 않습니다.
- 기존 record에 `focusPinnedAt`이 없으면 고정되지 않은 후보로 처리합니다.
- 이전 프론트가 `focusPinnedAt`을 보내지 않아도 기존 Cloud 고정값은 보존합니다.
- 빈 문자열을 명시적으로 저장하면 고정만 해제하고 제작 후보 상태는 유지합니다.
- 날짜가 바뀌어도 자동 초기화하지 않습니다. 사용자가 해제하거나 제작 중/업로드 완료로 이동할 때 해제합니다.
- 고정 목록은 `focusPinnedAt`이 빠른 순서대로 표시합니다.

범위 제한:

- 새 `production_candidates` container나 endpoint를 만들지 않습니다.
- `production_decided`를 오늘 집중 상태로 재해석하지 않습니다.
- discovery link의 오늘 집중 고정은 이번 범위에 포함하지 않습니다.
- 수동 드래그 순서와 `focusOrder` 필드는 이번 범위에 포함하지 않습니다.
- YouTube API 호출이나 localStorage key 변경을 추가하지 않습니다.

---

## 2026-07-02 결정 기록: discovery links MVP 저장/상태 기준

현재 단계에서는 발견함을 수동 링크 저장 중심으로 작게 시작했습니다.

추가 결정:

- MVP에서는 새 `discovery_links` Cosmos container를 바로 만들지 않습니다.
- MVP 저장 위치는 기존 Cloud DB 구조 안에서 `docType: discovery_link` 방식입니다.
- `/videos` 저장 영상 조회에 `docType: discovery_link` 문서가 섞이면 안 됩니다.
- 링크 수, 검색/필터, 로컬 파일 연결, 별도 제작 프로젝트 모델이 커지면 별도 `discovery_links` container 분리를 다시 검토합니다.
- 발견함의 메인 `status`는 작게 시작합니다: `inbox`, `reviewing`, `saved`, `candidate`, `discarded`.
- 권리 확인은 메인 `status`에 섞지 않고 `rightsStatus`로 분리합니다: `unknown`, `needs_check`, `cleared`, `do_not_use`.
- 무단 크롤링, 자동 다운로드, 메타데이터 자동 수집은 MVP에서 제외합니다.

주의:

- 이 결정은 문서 기준입니다.
- 아직 API, DB schema, UI 구현은 변경하지 않았습니다.

---

## 2026-07-02 결정 기록: Cloud 우선 + localStorage 명시적 fallback

현재 단계에서는 Cloud DB를 기준 데이터로 봅니다.

적용 원칙:

- Cloud 조회가 성공하면 Cloud 응답이 기준입니다.
- Cloud 조회 성공 결과가 비어 있어도 localStorage로 대체하지 않습니다.
- localStorage fallback은 Cloud 요청 실패, 서버 오류, 네트워크 오류, endpoint 장애 때만 사용합니다.
- fallback으로 표시되는 데이터는 UI에서 "임시 기록" 또는 "Cloud 연결 실패로 브라우저 기록 표시 중"으로 안내합니다.
- Cloud 저장이 성공한 뒤에만 localStorage 캐시를 갱신합니다.
- Cloud 저장이 실패하면 화면에 임시 반영될 수 있지만, localStorage에 조용히 저장 완료처럼 남기지 않습니다.
- Cloud 데이터와 localStorage 데이터는 자동 병합하지 않습니다.
- localStorage 데이터를 Cloud로 자동 업로드하지 않습니다.
- 수동 복구/마이그레이션은 별도 Issue로 검토합니다.

금지:

- localStorage key 변경
- localStorage 대량 삭제
- 자동 마이그레이션
- Cloud/localStorage 양방향 병합
- DB schema 변경
- endpoint 변경

---

## 2026-07-03 결정 기록: discovery link platform 저장

현재 단계에서는 새로 저장하는 discovery link에 한해 URL에서 추정한 `platform` 값을 함께 Cloud로 보냅니다.

적용 원칙:

- 새 링크 저장 시 `platform`은 URL 기준으로 `instagram`, `youtube`, `tiktok`, `web`, `unknown` 중 하나로 추정합니다.
- 기존 discovery link 문서에는 일괄 마이그레이션을 하지 않습니다.
- 기존 문서에 `platform`이 없으면 화면에서는 URL을 기준으로 표시용 플랫폼을 추정합니다.
- 이 변경은 기존 `status`, `rightsStatus`, `docType: discovery_link`, `/discovery-links` endpoint 구조를 바꾸지 않습니다.
- 별도 `discovery_links` container 생성이나 DB schema 대개편은 하지 않습니다.

주의:

- `platform`은 현재 자동 수집이나 외부 사이트 크롤링 결과가 아니라, 사용자가 입력한 URL 문자열에서 추정한 표시/분류 보조값입니다.
- 플랫폼 값을 수동 수정하는 기능은 아직 만들지 않습니다.

### 2026-07-03 백엔드 확인 기록

`yt-analyzer-functions` repo의 `src/functions/discoveryLinks.js`와 `test/discoveryLinks.test.js` 기준으로 아래를 확인했습니다.

- 백엔드는 `youtube`, `instagram`, `tiktok`, `web`, `unknown`을 discovery link `platform` 허용값으로 둡니다.
- 새 discovery link 생성 시 프론트가 보낸 `platform`이 허용값이면 그대로 저장합니다.
- `platform`이 없거나 허용값이 아니면 백엔드가 URL에서 다시 추정합니다.
- URL 수정 시 `platform`을 같이 보내지 않으면 백엔드가 새 URL 기준으로 다시 추정합니다.
- 클라이언트 응답에는 `platform`이 포함되고, 내부 필드인 `docType`, `userId`, `channelId`는 제외됩니다.

따라서 프론트에서 새 링크 저장 시 `platform`을 보내는 현재 방식은 백엔드 저장/응답 구조와 맞습니다. 기존 문서에 대한 일괄 마이그레이션은 여전히 하지 않습니다.

---

## 2026-07-26 결정 기록: 업무 도구 즐겨찾기 Cloud 저장

업무 도구함의 개인 설정은 브라우저가 아니라 Cloud DB를 기준으로 사용합니다.

저장 구조:

- 기존 `videos` 컨테이너 안에 사용자별 문서 1개를 `docType: work_tool_preferences`로 저장합니다.
- 새 컨테이너를 만들지 않습니다.
- 저장 항목은 `customTools`, `hiddenDefaultToolIds`, `toolOrder`, `updatedAt`입니다.
- 기본 도구 원본은 프론트 코드가 기준이며 Cloud에서는 숨김 여부와 표시 순서만 보존합니다.
- 개인 도구는 이름, 설명, URL, 분류, 배지를 Cloud에 저장합니다.

운영 원칙:

- 설정 화면에서 추가·수정·숨김·삭제·순서 변경 후 명시적으로 Cloud 저장합니다.
- 저장 실패를 완료처럼 표시하지 않습니다.
- 기본 도구는 삭제하지 않고 숨김 처리하며 기본값 복원이 가능합니다.
- 외부 사이트의 검색 결과, 검색량, 로그인 정보는 수집하거나 저장하지 않습니다.
- localStorage fallback, 자동 병합, 자동 마이그레이션은 추가하지 않습니다.
