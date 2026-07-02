# Creator OS 문서 인덱스

작성일: 2026-07-02

이 문서는 Creator OS 관련 문서를 어떤 순서로 읽고, 각 문서를 어떤 판단에 사용해야 하는지 정리합니다.

중요: v2.2와 Definition 문서는 목표 방향입니다. 현재 구현 상태는 감사 문서와 API/데이터 문서를 기준으로 확인해야 합니다.

---

## 1. 문서 읽는 순서

### 1단계. 제품 방향 이해

1. `CREATOR_OS_DEFINITION_BLUEPRINT.md`

Creator OS가 어떤 제품이어야 하는지 정의한 상위 기준 문서입니다.

이 문서는 현재 구현 완료 목록이 아니라 제품 방향과 판단 기준입니다.

### 2단계. 현재 데이터 기준 확인

2. `CREATOR_OS_DATA_OWNERSHIP.md`

Cloud DB, localStorage, 미구현 데이터의 역할을 구분합니다.

코드 작업 전 가장 먼저 확인해야 하는 데이터 기준 문서입니다.

3. `CREATOR_OS_STATUS_DICTIONARY.md`

채널, 영상, 제작 후보, 스크랩북, 발견 링크, 로컬 파일의 상태값을 정리합니다.

상태값을 새로 만들거나 이름을 바꾸기 전에 확인해야 합니다.

### 3단계. API와 저장 흐름 확인

4. `CREATOR_OS_API_BEHAVIOR_MAP.md`

각 버튼과 API가 DB 조회인지, Cloud DB 변경인지, YouTube API 호출인지 구분합니다.

버튼 문구, 비용성 작업, scan 관련 UI를 수정하기 전에 확인해야 합니다.

5. `CREATOR_OS_VIDEOS_PAGINATION_AUDIT.md`

저장 영상 조회가 현재 전체 조회 구조로 유지 가능한지, 언제 페이지네이션을 다시 검토해야 하는지 정리합니다.

`GET /videos?channelIds=...` 응답 구조, 저장 영상 수, 검색/정렬/터또터 영향도를 수정하기 전에 확인해야 합니다.

6. `CREATOR_OS_VIDEO_USER_RECORDS_AUDIT.md`

영상별 사용자 판단 기록이 프론트, localStorage, Cloud DB 사이에서 어떻게 움직이는지 정리합니다.

`reviewed`, `production_candidate`, `watch_later` 같은 상태 저장을 수정하기 전에 확인해야 합니다.

7. `CREATOR_OS_CATEGORY_TAGS_AUDIT.md`

화면 카테고리 목록과 Cloud 채널 태그의 불일치 가능성을 정리합니다.

카테고리 추가, 삭제, 이름 변경, 태그별 스캔을 수정하기 전에 확인해야 합니다.

### 4단계. 미래 기능 모델 확인

8. `CREATOR_OS_SCAN_API_USAGE_MODEL.md`

YouTube API 호출이 발생하는 새 영상 수집, 채널 확인, 댓글 조회를 어떻게 기록할지 정리합니다.

`scan_logs`, `api_quota_logs`, 자동 스캔, API 사용량 화면을 검토하기 전에 확인해야 합니다.

9. `CREATOR_OS_DISCOVERY_LINKS_LOCAL_ASSETS_MODEL.md`

인스타/외부 링크, 로컬 파일, 출처 확인, 제작 후보 연결의 목표 모델을 정리합니다.

아직 구현된 기능이 아니므로 실제 기능처럼 표현하면 안 됩니다.

10. `CREATOR_OS_DISCOVERY_LINKS_MVP_SCOPE.md`

discovery links / local assets의 1차 MVP 범위를 선택지로 정리합니다.

수동 링크 저장, 파일 메모 카드, 스크랩북 확장, 로컬 파일 참조 중 어디까지 할지 구현 전 확인해야 합니다.

11. `CREATOR_OS_PRODUCTION_CANDIDATES_MVP_SCOPE.md`

제작 후보와 제작 칸반을 1차 MVP에서 `videoUserRecords` 기반으로 유지할지, 별도 `production_candidates`로 분리할지 정리합니다.

제작 후보, 제작 칸반, 업로드 완료, 제작 상태 저장을 수정하기 전에 확인해야 합니다.

### 5단계. 결정이 필요한 선택지 확인

12. `CREATOR_OS_VIDEO_RECORDS_SCHEMA_OPTIONS.md`

`/video-records`의 단일 `status`와 프론트 `statusIds` 불일치를 어떻게 정리할지 선택지를 정리합니다.

2026-07-02 기준 선택지 B가 채택되어 `statusIds` Cloud 저장/조회가 구현됐습니다. 기존 결정의 배경을 확인할 때 봅니다.

13. `CREATOR_OS_VIDEO_RECORDS_LONG_TERM_MODEL.md`

`status/statusIds` 이후의 장기 상태 모델을 어떻게 가져갈지 정리합니다.

제작 상태 분리, `production_candidates` 별도 DB, `lifecycleStatus/usagePurposeTags/productionStatus` 명시 필드 검토 전 확인합니다.

14. `CREATOR_OS_LOCAL_STORAGE_CLOUD_SYNC_OPTIONS.md`

Cloud DB와 localStorage 충돌을 어떻게 처리할지 선택지를 정리합니다.

localStorage 제거, migration, Cloud-first sync 구현 전 반드시 확인해야 합니다.

### 6단계. 실행 순서 확인

15. `CREATOR_OS_NEXT_IMPLEMENTATION_ISSUES.md`

위 문서들을 바탕으로 다음 작업을 작은 Issue 단위로 쪼갠 실행 계획입니다.

코드 작업을 시작하기 전 다음 순서를 확인하는 문서입니다.

---

## 2. 문서별 용도

| 문서 | 용도 | 현재 구현 기준 여부 | 목표 설계 여부 | 코드 작업 전 확인 |
|---|---|---:|---:|---:|
| `CREATOR_OS_DEFINITION_BLUEPRINT.md` | 제품의 큰 방향 | 아니오 | 예 | 필요 |
| `CREATOR_OS_DATA_OWNERSHIP.md` | 데이터 소유권 기준 | 예 | 예 | 필수 |
| `CREATOR_OS_STATUS_DICTIONARY.md` | 상태값 사전 | 예 | 예 | 필수 |
| `CREATOR_OS_API_BEHAVIOR_MAP.md` | API 동작 구분 | 예 | 예 | 필수 |
| `CREATOR_OS_VIDEOS_PAGINATION_AUDIT.md` | 저장 영상 조회 성능/페이지네이션 판단 | 예 | 일부 | `/videos` 수정 전 필수 |
| `CREATOR_OS_VIDEO_USER_RECORDS_AUDIT.md` | 영상 판단 기록 저장 흐름 | 예 | 일부 | 필수 |
| `CREATOR_OS_CATEGORY_TAGS_AUDIT.md` | 카테고리/태그 구조 감사 | 예 | 일부 | 필수 |
| `CREATOR_OS_SCAN_API_USAGE_MODEL.md` | 수집 로그/API 사용량 목표 모델 | 예 | 예 | scan/API 작업 전 필수 |
| `CREATOR_OS_DISCOVERY_LINKS_LOCAL_ASSETS_MODEL.md` | 발견 링크/로컬 파일 목표 모델 | 아니오 | 예 | 관련 작업 시 필수 |
| `CREATOR_OS_DISCOVERY_LINKS_MVP_SCOPE.md` | 발견함 1차 MVP 범위 선택지 | 아니오 | 예 | discovery 구현 전 필수 |
| `CREATOR_OS_PRODUCTION_CANDIDATES_MVP_SCOPE.md` | 제작 후보/칸반 1차 MVP 범위 | 예 | 예 | 제작 후보 작업 전 필수 |
| `CREATOR_OS_VIDEO_RECORDS_SCHEMA_OPTIONS.md` | statusIds 보존 결정 배경 | 예 | 예 | video records 작업 전 참고 |
| `CREATOR_OS_VIDEO_RECORDS_LONG_TERM_MODEL.md` | video records 장기 상태 모델 선택지 | 예 | 예 | 제작 상태 분리 전 필수 |
| `CREATOR_OS_LOCAL_STORAGE_CLOUD_SYNC_OPTIONS.md` | Cloud/localStorage sync 선택지 | 예 | 예 | sync 작업 전 필수 |
| `CREATOR_OS_NEXT_IMPLEMENTATION_ISSUES.md` | 다음 구현 Issue 순서 | 예 | 예 | 필수 |

---

## 3. 작업 전 빠른 판단표

| 하려는 작업 | 먼저 볼 문서 |
|---|---|
| 버튼 문구 수정 | `CREATOR_OS_API_BEHAVIOR_MAP.md` |
| 스캔 버튼 또는 영상 수집 흐름 수정 | `CREATOR_OS_API_BEHAVIOR_MAP.md`, `CREATOR_OS_DATA_OWNERSHIP.md` |
| 저장 영상 불러오기 수정 | `CREATOR_OS_API_BEHAVIOR_MAP.md`, `CREATOR_OS_VIDEOS_PAGINATION_AUDIT.md` |
| 영상 상태 저장 수정 | `CREATOR_OS_VIDEO_USER_RECORDS_AUDIT.md`, `CREATOR_OS_STATUS_DICTIONARY.md` |
| 제작 후보 기능 수정 | `CREATOR_OS_STATUS_DICTIONARY.md`, `CREATOR_OS_VIDEO_RECORDS_LONG_TERM_MODEL.md`, `CREATOR_OS_PRODUCTION_CANDIDATES_MVP_SCOPE.md` |
| 스크랩북 저장 수정 | `CREATOR_OS_DATA_OWNERSHIP.md`, `CREATOR_OS_LOCAL_STORAGE_CLOUD_SYNC_OPTIONS.md` |
| 카테고리/태그 수정 | `CREATOR_OS_CATEGORY_TAGS_AUDIT.md` |
| localStorage 제거 또는 key 변경 | `CREATOR_OS_LOCAL_STORAGE_CLOUD_SYNC_OPTIONS.md` |
| scan logs 또는 API 사용량 기능 구현 | `CREATOR_OS_SCAN_API_USAGE_MODEL.md`, `CREATOR_OS_API_BEHAVIOR_MAP.md` |
| discovery links 또는 local assets 구현 | `CREATOR_OS_DISCOVERY_LINKS_LOCAL_ASSETS_MODEL.md`, `CREATOR_OS_DISCOVERY_LINKS_MVP_SCOPE.md` |
| 새 DB container 추가 | `CREATOR_OS_DATA_OWNERSHIP.md`, 관련 선택지 문서 |

---

## 4. 현재 바로 진행 가능한 작업

현재 사용자 결정 없이 진행 가능한 작업:

- 문서 보강
- 화면 문구 audit
- DB 조회와 YouTube API 호출 문구 구분
- 카테고리 삭제/이름 변경 설명 보강
- 저장 실패 안내 방식 검토
- 기존 코드 동작을 바꾸지 않는 작은 컴포넌트 분리

단, 작은 컴포넌트 분리도 기존 기능 보존과 `npm run build` 확인을 전제로 합니다.

---

## 5. 구현 전 반드시 결정해야 하는 작업

아래 작업은 문서만으로는 진행하지 않고, 선택지 보고 후 사용자 결정을 받아야 합니다.

- `status/statusIds` 장기 역할을 어디까지 분리할지
- `lifecycleStatus`, `usagePurposeTags`, `productionStatus` 명시 필드를 도입할지
- 카테고리 목록을 Cloud 태그 기준으로 바꿀지
- `production_candidates` 별도 저장소를 만들지
- `discovery_links` API를 만들지
- `local_assets` API를 만들지
- `scan_logs`, `api_quota_logs` container를 만들지
- `/videos` pagination을 어떤 방식으로 구현할지

---

## 6. 현재 금지할 작업

현재 단계에서는 아래 작업을 하지 않습니다.

- 전체 UI 대개편
- `App.jsx` 대규모 재작성
- DB schema 대개편
- localStorage key 변경 또는 제거
- 기존 endpoint 동작 변경
- 새 endpoint 추가
- 새 라이브러리 추가
- 로그인, 권한, 결제 구조
- YouTube API 호출이 늘어나는 자동화
- 인스타 자동 크롤링 또는 자동 다운로드

---

## 7. 다음 추천 순서

1. discovery links 구현 전 저장 위치와 상태값을 사용자에게 선택지로 보고합니다.
2. `scan_logs`와 `api_quota_logs` 실제 구현 여부는 별도 선택지 보고 후 결정합니다.
3. 제작 칸반 확장은 1차 MVP 이후 별도 판단합니다.

페이지네이션 감사는 2026-07-02에 완료됐고, 현재는 전체 조회 유지가 권장됩니다.
scan/API 사용 기록 모델 검토도 2026-07-02에 완료됐고, 현재는 구현 없이 목표 모델만 문서화했습니다.
discovery links/local assets MVP 범위 검토도 2026-07-02에 완료됐고, 현재는 수동 링크 저장 중심의 발견함이 권장됩니다.
제작 후보/칸반 MVP 범위 검토도 2026-07-02에 완료됐고, 현재는 `videoUserRecords` 기반 유지가 권장됩니다.
