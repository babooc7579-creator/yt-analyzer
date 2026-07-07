# Creator OS 저장 Hook 흐름 Audit

작성일: 2026-07-07

이 문서는 현재 프론트엔드 hook 기준으로 사용자 기록이 어디서 읽히고, 어디에 저장되고, Cloud 장애 시 localStorage가 어떤 역할을 하는지 정리합니다.

중요: 이 문서는 구현 변경 문서가 아닙니다. 현재 코드가 실제로 하는 일을 기준으로 기록합니다.

---

## 1. 현재 기준 결론

현재 저장 흐름은 세 갈래입니다.

| 영역 | 현재 기준 데이터 | localStorage 역할 | Cloud 실패 시 동작 | 조용한 local-only 저장 여부 |
|---|---|---|---|---|
| 영상 판단 기록 `videoUserRecords` | Cloud `/video-records` | Cloud 성공 응답의 임시 캐시, 장애 시 fallback 표시 | 브라우저에 남은 판단 기록을 임시 표시하고 경고 노출 | 없음 |
| 스크랩북 `scrapbook` | Cloud `/scrapbook` | Cloud 성공 응답의 임시 캐시, 장애 시 fallback 표시 | 브라우저에 남은 스크랩북을 임시 표시하고 경고 노출 | 없음 |
| 발견 링크 `discoveryLinks` | Cloud `/discovery-links` | 사용하지 않음 | 오류 메시지만 표시 | 없음 |

현재 코드 흐름은 사용자가 결정한 원칙과 대체로 맞습니다.

- Cloud 조회가 성공하면 Cloud 응답을 기준으로 사용합니다.
- Cloud 조회가 실패한 경우에만 localStorage fallback을 사용합니다.
- Cloud 저장이 성공한 뒤에만 localStorage 캐시를 갱신합니다.
- Cloud 저장 실패를 localStorage 저장 완료처럼 처리하지 않습니다.
- Cloud 데이터와 localStorage 데이터를 자동 병합하지 않습니다.
- localStorage 데이터를 Cloud로 자동 업로드하지 않습니다.

---

## 2. 대상 파일

| 파일 | 역할 |
|---|---|
| `src/hooks/useVideoUserRecords.js` | 영상별 사용자 판단 기록 로드/저장/초기화 |
| `src/hooks/useScrapbook.js` | 스크랩북 로드/추가/삭제 |
| `src/hooks/useDiscoveryLinks.js` | 발견 링크 로드/추가/수정/삭제 |
| `src/services/videoRecordsApi.js` | `/video-records` API wrapper |
| `src/services/scrapbookApi.js` | `/scrapbook` API wrapper |
| `src/services/discoveryLinksApi.js` | `/discovery-links` API wrapper |
| `src/services/storage.js` | localStorage key와 JSON read/write helper |
| `src/constants/syncWarnings.js` | Cloud/localStorage fallback 경고 문구 |

---

## 3. 영상 판단 기록 흐름

대상 hook: `src/hooks/useVideoUserRecords.js`

대상 API:

- `GET /video-records`
- `POST /video-records`
- `DELETE /video-records`

대상 localStorage key:

- `yt_crm_video_user_records`

### 3.1 조회 흐름

1. 화면 로드 시 `fetchVideoUserRecords()`로 Cloud `/video-records`를 조회합니다.
2. Cloud 조회가 성공하면 응답의 `records`를 정규화해서 화면 상태로 사용합니다.
3. Cloud 조회가 성공하면 같은 데이터를 localStorage에 캐시합니다.
4. Cloud 조회가 실패하면 localStorage의 `yt_crm_video_user_records`를 읽어 임시로 표시합니다.
5. fallback 표시 시 `VIDEO_RECORDS_SYNC_WARNINGS.loadFallback` 경고를 노출합니다.

이 흐름에서 Cloud 성공 결과가 비어 있으면, 빈 결과가 기준입니다. localStorage 데이터로 자동 대체하지 않습니다.

### 3.2 저장 흐름

1. 사용자가 제작 후보, 제외, 사용함 등 상태를 누르면 화면은 먼저 낙관적으로 바뀝니다.
2. 이후 `saveVideoUserRecord(record)`로 Cloud `/video-records`에 저장합니다.
3. Cloud 저장이 성공하면 Cloud 응답 record를 기준으로 화면 상태를 갱신합니다.
4. Cloud 저장이 성공한 뒤에만 localStorage 캐시를 갱신합니다.
5. Cloud 저장이 실패하면 화면을 이전 상태로 되돌리고 `VIDEO_RECORDS_SYNC_WARNINGS.saveFailed`를 표시합니다.

즉, 저장 실패 상태를 브라우저에만 조용히 저장하고 "저장 완료"처럼 보이게 하지 않습니다.

### 3.3 초기화 흐름

1. 판단 기록 초기화는 사용자 확인창 이후 진행됩니다.
2. 화면 상태를 먼저 비운 뒤 `clearVideoUserRecords()`로 Cloud `/video-records` 삭제를 요청합니다.
3. Cloud 초기화가 성공하면 localStorage 캐시도 빈 객체로 갱신합니다.
4. Cloud 초기화가 실패하면 이전 판단 기록을 다시 화면에 표시하고 `VIDEO_RECORDS_SYNC_WARNINGS.clearFailed`를 표시합니다.

### 3.4 위험 지점

- 저장 실패 시 이전 record로 되돌리는 rollback 흐름을 바꾸면 사용자가 누른 상태가 저장된 것처럼 보일 수 있습니다.
- `status`와 `statusIds` 호환 로직은 `src/utils/videoUserRecords.js`에 있으므로, hook에서 임의로 상태 의미를 재정의하면 안 됩니다.
- localStorage key 변경은 기존 브라우저 임시 기록을 못 읽게 만들 수 있으므로 별도 이슈 없이 변경하면 안 됩니다.

---

## 4. 스크랩북 흐름

대상 hook: `src/hooks/useScrapbook.js`

대상 API:

- `GET /scrapbook`
- `POST /scrapbook`
- `DELETE /scrapbook/:videoId`

대상 localStorage key:

- `yt_crm_saved_videos`

### 4.1 조회 흐름

1. 화면 로드 시 `fetchScrapbook()`으로 Cloud `/scrapbook`을 조회합니다.
2. Cloud 조회가 성공하면 응답의 `videos`를 기준으로 화면 상태를 사용합니다.
3. Cloud 조회가 성공하면 `scrapbookCloudReady`를 `true`로 둡니다.
4. Cloud 조회가 성공하면 같은 데이터를 localStorage에 캐시합니다.
5. Cloud 조회가 실패하면 localStorage의 `yt_crm_saved_videos`를 읽어 임시로 표시합니다.
6. fallback 표시 시 `SCRAPBOOK_SYNC_WARNINGS.loadFallback` 경고를 노출합니다.

### 4.2 추가/삭제 흐름

1. 사용자가 스크랩 버튼을 누르면 먼저 `scrapbookCloudReady`를 확인합니다.
2. Cloud 스크랩북을 확인하지 못한 상태라면 저장/삭제를 막고 `SCRAPBOOK_SYNC_WARNINGS.cloudRequired`를 표시합니다.
3. 이미 저장된 영상이면 `deleteScrapbookVideo(video.videoId)`로 Cloud 삭제를 요청합니다.
4. 새로 저장하는 영상이면 `saveScrapbookVideos([video])`로 Cloud 저장을 요청합니다.
5. Cloud 변경이 성공하면 Cloud 기준 캐시를 갱신하고 localStorage에도 반영합니다.
6. Cloud 변경이 실패하면 `SCRAPBOOK_SYNC_WARNINGS.saveFailed`를 표시하고, localStorage만 저장 완료 처리하지 않습니다.

### 4.3 위험 지점

- `scrapbookCloudReady` gate를 제거하면 Cloud 장애 상태에서 localStorage만 바뀌는 일이 생길 수 있습니다.
- 스크랩북은 fallback 표시와 저장 가능 상태가 분리되어 있습니다. fallback으로 보이더라도 Cloud 확인 전에는 저장/삭제가 막히는 것이 현재 안전장치입니다.
- localStorage key 변경은 기존 브라우저 임시 스크랩북을 못 읽게 만들 수 있으므로 별도 이슈 없이 변경하면 안 됩니다.

---

## 5. 발견 링크 흐름

대상 hook: `src/hooks/useDiscoveryLinks.js`

대상 API:

- `GET /discovery-links`
- `POST /discovery-links`
- `PATCH /discovery-links/:id`
- `DELETE /discovery-links/:id`

대상 localStorage key:

- 없음

### 5.1 조회 흐름

1. 화면 로드 시 `fetchDiscoveryLinks()`로 Cloud `/discovery-links`를 조회합니다.
2. Cloud 조회가 성공하면 응답의 `links` 또는 `items`를 정규화해 화면에 표시합니다.
3. Cloud 조회가 실패하면 오류 메시지를 표시합니다.
4. localStorage fallback은 없습니다.

### 5.2 추가/수정/삭제 흐름

1. 링크 추가는 `createDiscoveryLink(payload)`로 Cloud에 저장합니다.
2. 링크 수정은 `updateDiscoveryLink({ id, updates })`로 Cloud에 반영합니다.
3. 링크 삭제는 `deleteDiscoveryLink(id)`로 Cloud에서 삭제합니다.
4. Cloud 응답에 변경된 link가 있으면 화면 상태를 갱신하고, 응답이 없으면 목록을 다시 불러옵니다.
5. 실패 시 오류 메시지를 표시합니다.

### 5.3 위험 지점

- 발견 링크에는 localStorage fallback이 없으므로 Cloud 장애 시 사용자가 이전 링크 목록을 볼 수 없습니다.
- 이는 현재 구조상 더 안전한 선택입니다. 자동 병합, 임시 저장, 자동 업로드 문제를 만들지 않기 때문입니다.
- 나중에 발견 링크에도 fallback을 넣으려면 "임시 표시인지", "저장 실패인지", "Cloud 재동기화가 필요한지"를 별도 정책으로 정해야 합니다.

---

## 6. 공통 Source of Truth 원칙

현재 코드 기준으로 유지해야 할 원칙입니다.

| 원칙 | 현재 코드 상태 | 유지 이유 |
|---|---|---|
| Cloud 성공 응답이 기준 | 구현됨 | 사용자가 여러 브라우저/기기에서 같은 기준을 보게 하기 위함 |
| localStorage는 기준 데이터가 아님 | 구현됨 | 브라우저 캐시가 Cloud 데이터를 덮어쓰는 위험 방지 |
| Cloud 성공 뒤 localStorage 캐시 갱신 | 구현됨 | 장애 시 최근 성공 데이터를 임시 표시하기 위함 |
| Cloud 실패 때만 fallback 사용 | 영상 판단 기록, 스크랩북에 구현됨 | Cloud 빈 결과와 장애를 구분하기 위함 |
| Cloud/localStorage 자동 병합 금지 | 구현됨 | 삭제된 데이터가 브라우저 캐시 때문에 되살아나는 위험 방지 |
| localStorage 자동 업로드 금지 | 구현됨 | 오래된 브라우저 기록이 Cloud 기준 데이터를 오염시키는 위험 방지 |
| 저장 실패를 local-only 완료로 처리 금지 | 구현됨 | 사용자가 저장 성공으로 오해하지 않게 하기 위함 |

---

## 7. 다음 리팩터링 후보

아래 작업은 기능 변경 없이 작게 진행할 수 있는 후보입니다. 단, 저장 흐름은 위험도가 있으므로 순서를 지켜야 합니다.

### 후보 1. 문구와 경고 표시 audit 보강

- 목적: Cloud 장애/fallback 메시지가 화면에서 실제로 충분히 보이는지 확인합니다.
- 위험도: 낮음
- 이유: 데이터 흐름은 그대로 두고 사용자 혼동만 줄일 수 있습니다.

### 후보 2. 발견 링크 hook의 saving/error 상태 정리

- 목적: `useDiscoveryLinks`의 반복되는 저장 상태 처리 코드를 작은 helper로 정리합니다.
- 위험도: 낮음에서 중간
- 이유: discovery links는 localStorage fallback이 없어 저장 기준 충돌 위험이 상대적으로 낮습니다.

### 후보 3. 스크랩북 helper 테스트 보강

- 목적: Cloud 성공 후 캐시 갱신, 삭제/추가 helper가 기존 동작을 유지하는지 테스트로 고정합니다.
- 위험도: 낮음
- 이유: hook을 직접 바꾸기 전에 순수 helper부터 고정할 수 있습니다.

### 후보 4. 영상 판단 기록 hook의 저장 rollback 테스트 전략 검토

- 목적: Cloud 저장 실패 시 화면이 이전 상태로 돌아가는 안전장치를 테스트로 고정할 방법을 검토합니다.
- 위험도: 중간
- 이유: 이 부분은 사용자 기록 신뢰도와 직결되므로 바로 리팩터링하지 말고 테스트 전략을 먼저 잡는 것이 안전합니다.

---

## 8. 지금 하지 말아야 할 것

현재 단계에서는 아래 작업을 하지 않습니다.

- localStorage key 변경
- localStorage 대량 삭제
- Cloud/localStorage 자동 병합
- localStorage 데이터를 Cloud에 자동 업로드
- 저장 실패 시 localStorage만 저장 완료 처리
- `/video-records`, `/scrapbook`, `/discovery-links` endpoint 변경
- DB schema 변경
- `status/statusIds` 의미 재설계
- discovery links fallback 정책을 즉흥적으로 추가
- 스크랩북의 `scrapbookCloudReady` 안전장치 제거
- 영상 판단 기록의 저장 실패 rollback 제거

---

## 9. 최종 판정

현재 저장 hook 구조는 "Cloud 기준 + localStorage fallback 안전망" 원칙을 대체로 지키고 있습니다.

다만 위험도는 영역별로 다릅니다.

- `videoUserRecords`: 사용자의 제작 판단과 직결되므로 가장 조심해야 합니다.
- `scrapbook`: Cloud 확인 전 저장/삭제를 막는 안전장치가 있으므로 이 gate를 유지해야 합니다.
- `discoveryLinks`: 현재 Cloud-only라 단순하지만, 장애 시 fallback UX는 아직 없습니다.

따라서 다음 구현은 저장 구조를 크게 바꾸기보다, 경고 문구 표시 확인과 순수 helper 테스트 보강부터 진행하는 것이 안전합니다.
