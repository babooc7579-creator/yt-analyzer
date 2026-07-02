# Creator OS videoUserRecords 장기 상태 모델 결정 보고서

작성일: 2026-07-02

이 문서는 `videoUserRecords`를 장기적으로 어떻게 가져갈지 결정하기 위한 보고서입니다.

중요: 이 문서는 결정 보고서입니다. 코드, API, DB schema, localStorage key는 변경하지 않습니다.

1차 MVP에서 제작 후보와 제작 칸반을 어디까지 볼지는 `CREATOR_OS_PRODUCTION_CANDIDATES_MVP_SCOPE.md`를 기준으로 확인합니다.

---

## 1. 현재 상황

2026-07-02 기준 현재 구현은 아래 상태입니다.

- `/video-records`는 기존 대표 상태 `status`를 유지합니다.
- `/video-records`는 복수 판단 보존용 `statusIds`도 저장/조회합니다.
- Cloud DB가 기준 데이터이고, localStorage는 Cloud 실패 시 임시 fallback입니다.
- `production_candidates` 별도 저장소는 없습니다.
- 제작 후보와 제작 칸반은 현재 `videoUserRecords` 위에서 동작합니다.
- 프론트는 `VIDEO_STATUS`와 `PRODUCTION_STATUS`를 같은 record의 `status/statusIds`로 함께 다룹니다.
- 제작 칸반은 현재 `제작 후보`, `제작 중`, `업로드 완료` 3개 칼럼 중심입니다.

현재 구조의 핵심 장점:

- 기존 레이더, 스크랩북, 제작 후보 흐름이 이미 작동합니다.
- `statusIds` 보존으로 "자료 참고이면서 제작 후보" 같은 복수 판단을 잃지 않을 수 있습니다.
- 큰 DB 변경 없이 1차 MVP를 계속 안정화할 수 있습니다.

현재 구조의 핵심 위험:

- 영상 검토 상태와 제작 진행 상태가 한 필드 묶음에 섞여 있습니다.
- `production_candidate`가 영상 판단값이면서 제작 상태값처럼도 쓰입니다.
- `uploaded`와 `used`의 의미가 다릅니다. 하나는 제작 완료, 하나는 소재 사용 여부입니다.
- 백엔드 기본값 `new`는 프론트 상태 사전에 없습니다.
- 향후 discovery links, local assets가 들어오면 "제작 후보 = YouTube 영상 1개" 구조가 부족해질 수 있습니다.

---

## 2. 결정해야 하는 문제

지금 결정해야 하는 것은 "바로 DB를 바꿀 것인가"가 아닙니다.

더 정확한 질문은 아래입니다.

1. 1차 완성까지 `videoUserRecords` 기반 제작 후보 구조를 유지할 것인가?
2. `status/statusIds`를 지금 더 쪼개지 않고, 코드와 문서에서 역할만 더 엄격히 나눌 것인가?
3. 장기적으로 `lifecycleStatus`, `usagePurposeTags`, `productionStatus` 같은 명시 필드로 분리할 것인가?
4. `production_candidates` 별도 DB는 언제 검토할 것인가?

---

## 3. 선택지 A: 현재 구조 그대로 유지

### 설명

현재처럼 `status`와 `statusIds`만 사용합니다.

제작 후보, 자료 참고, 제목 참고, 제작 중, 업로드 완료까지 모두 `videoUserRecords.status/statusIds` 안에 남깁니다.

### 장점

- 가장 빠릅니다.
- 추가 DB schema 변경이 없습니다.
- 기존 화면과 API를 거의 건드리지 않습니다.
- 1인 사용 MVP에서는 충분히 버틸 수 있습니다.

### 단점

- 상태 의미가 계속 섞입니다.
- `used`, `uploaded`, `production_active` 같은 값의 역할이 흐려집니다.
- 제작 칸반이 커질수록 유지보수가 어려워집니다.
- discovery links나 local assets와 연결하기 어렵습니다.

### 비용/속도/확장성/유지보수 영향

| 항목 | 영향 |
|---|---|
| 비용 | 낮음 |
| 속도 | 가장 빠름 |
| 확장성 | 낮음 |
| 유지보수 | 단기 쉬움, 장기 어려움 |

---

## 4. 선택지 B: 현재 DB 유지 + 상태 역할을 코드/문서에서 엄격히 분리

### 설명

DB schema는 지금 그대로 둡니다.

단, 코드와 문서에서 아래 역할을 명확히 나눕니다.

| 개념 | 현재 저장 | 운영 기준 |
|---|---|---|
| 대표 상태 | `status` | 기존 호환용. 제거하지 않음 |
| 복수 판단 | `statusIds` | 자료 참고, 제목 참고, 제작 후보 등 여러 판단 보존 |
| 영상 검토 상태 | `status/statusIds` 중 `VIDEO_STATUS` 값 | 레이더와 영상 목록에서 사용 |
| 제작 진행 상태 | `status/statusIds` 중 `PRODUCTION_STATUS` 값 | 제작 칸반에서만 사용 |
| 제작 메모/일정 | `draftTitle`, `note`, `targetPublishDate`, `uploadedAt` | 제작 칸반의 보조 필드 |

실제 구현은 작은 리팩터링으로 진행합니다.

- `isVideoReviewStatus()`
- `isProductionStatus()`
- `getVideoReviewStatusIds()`
- `getProductionStatusFromRecord()`
- `withRecordStatus()` 책임 정리

### 장점

- DB와 API를 바꾸지 않습니다.
- 기존 기능을 가장 안전하게 유지합니다.
- 상태 의미 혼선을 줄입니다.
- 1차 완성까지 가장 현실적입니다.
- 나중에 명시 필드나 별도 DB로 갈 때도 중간 다리가 됩니다.

### 단점

- 데이터 구조 자체가 완전히 깨끗해지는 것은 아닙니다.
- `status/statusIds` 안에 여러 종류의 상태가 남습니다.
- 장기적으로는 다시 한 번 모델 분리 판단이 필요합니다.

### 비용/속도/확장성/유지보수 영향

| 항목 | 영향 |
|---|---|
| 비용 | 낮음 |
| 속도 | 빠름 |
| 확장성 | 중간 |
| 유지보수 | 중간. 역할 함수가 잘 잡히면 안정적 |

---

## 5. 선택지 C: 같은 video_user_record 문서 안에서 명시 필드로 분리

### 설명

기존 `/video-records` 문서를 유지하되, 아래 필드를 추가하는 방향입니다.

예상 구조:

```txt
status: "production_candidate"              // 기존 호환용
statusIds: ["reference_material", "production_candidate"]
lifecycleStatus: "reviewed"                 // 영상 검토 흐름
usagePurposeTags: ["reference_material"]     // 자료/제목/훅 참고 목적
productionStatus: "candidate"               // 제작 진행 상태
```

### 장점

- 영상 검토, 참고 목적, 제작 진행이 명확히 나뉩니다.
- 기존 `/video-records` endpoint를 크게 늘리지 않고 확장할 수 있습니다.
- 별도 `production_candidates` DB보다 전환 비용이 낮습니다.

### 단점

- DB schema 확장입니다.
- 백엔드 저장/조회 로직 변경이 필요합니다.
- 기존 record 보정 정책이 필요합니다.
- 지금 바로 하면 범위가 커질 수 있습니다.

### 비용/속도/확장성/유지보수 영향

| 항목 | 영향 |
|---|---|
| 비용 | 중간 |
| 속도 | 중간 |
| 확장성 | 중간 이상 |
| 유지보수 | 장기적으로 좋아짐. 전환기 복잡도 있음 |

---

## 6. 선택지 D: production_candidates 별도 저장소 도입

### 설명

제작 후보를 `videoUserRecords`에서 분리합니다.

예상 구조:

```txt
production_candidates:
- id
- title
- status
- sourceVideoIds
- discoveryLinkIds
- localAssetIds
- draftTitle
- note
- targetPublishDate
- uploadedAt
```

### 장점

- 장기 Creator OS 구조에 가장 가깝습니다.
- 하나의 제작 후보가 여러 YouTube 영상, 외부 링크, 로컬 파일을 묶을 수 있습니다.
- 제작 칸반이 진짜 제작 프로젝트 관리 도구로 확장됩니다.

### 단점

- 새 DB 저장소 또는 새 docType 설계가 필요합니다.
- 새 endpoint가 필요할 가능성이 큽니다.
- 기존 제작 후보 데이터 마이그레이션 판단이 필요합니다.
- 지금 단계에서는 범위가 큽니다.

### 비용/속도/확장성/유지보수 영향

| 항목 | 영향 |
|---|---|
| 비용 | 높음 |
| 속도 | 느림 |
| 확장성 | 높음 |
| 유지보수 | 장기 좋음, 단기 복잡 |

---

## 7. 선택지 비교

| 기준 | A 현상 유지 | B 역할 분리 | C 명시 필드 추가 | D 별도 제작 DB |
|---|---:|---:|---:|---:|
| 기존 기능 안정성 | 높음 | 높음 | 중간 | 중간 이하 |
| 구현 속도 | 가장 빠름 | 빠름 | 중간 | 느림 |
| DB 변경 | 없음 | 없음 | 있음 | 큼 |
| endpoint 변경 | 없음 | 없음 | 가능성 있음 | 높음 |
| 상태 의미 명확성 | 낮음 | 중간 | 높음 | 높음 |
| 제작 흐름 확장성 | 낮음 | 중간 | 중간 이상 | 높음 |
| 지금 단계 적합도 | 중간 | 높음 | 낮음 | 낮음 |

---

## 8. Codex 추천

현재는 **선택지 B: 현재 DB 유지 + 상태 역할을 코드/문서에서 엄격히 분리**를 추천합니다.

이유:

1. 이미 `statusIds` Cloud 저장/조회가 가능하므로 큰 schema 변경 없이 복수 판단 보존은 됩니다.
2. 지금 가장 위험한 것은 DB 부재가 아니라 상태 의미 혼합입니다.
3. 1차 완성 전에는 `production_candidates` 별도 DB가 과합니다.
4. `lifecycleStatus`, `usagePurposeTags`, `productionStatus` 명시 필드는 장기적으로 좋지만, 지금은 전환 비용이 큽니다.
5. 선택지 B는 나중에 C 또는 D로 넘어갈 수 있는 안전한 중간 단계입니다.

추천 진행:

1. 1차 완성까지는 `videoUserRecords` 기반 제작 후보 구조 유지
2. `status`는 대표/호환 필드로 유지
3. `statusIds`는 복수 판단 보존 필드로 유지
4. 코드에서는 `VIDEO_STATUS`와 `PRODUCTION_STATUS`를 더 명확히 분리해서 읽기
5. `production_candidates` 별도 DB는 discovery links/local assets MVP 범위 결정 이후 재검토

---

## 9. 결정이 필요한 질문

아래 질문에 대한 결정이 있어야 다음 코드 작업으로 넘어갈 수 있습니다.

1. 1차 완성까지 `production_candidates` 별도 DB를 만들지 않고, `videoUserRecords` 기반 제작 후보 구조를 유지해도 될까요?
2. 지금은 DB schema를 바꾸지 않고, 상태 역할 분리 함수와 문서 기준만 강화하는 선택지 B로 진행해도 될까요?
3. `status`는 기존 호환용 대표 상태로 계속 유지해도 될까요?
4. `statusIds`는 복수 판단 보존용으로 계속 사용해도 될까요?
5. `lifecycleStatus`, `usagePurposeTags`, `productionStatus` 명시 필드 분리는 1차 완성 이후 다시 검토해도 될까요?

---

## 9.1 2026-07-02 결정 기록

사용자는 선택지 B 진행을 승인했습니다.

결정 내용:

- 1차 완성까지 `production_candidates` 별도 DB를 만들지 않습니다.
- 현재 `videoUserRecords` 기반 제작 후보 구조를 유지합니다.
- DB schema는 바꾸지 않습니다.
- 기존 `status`는 대표/호환 필드로 유지합니다.
- `statusIds`는 복수 판단 보존용으로 계속 사용합니다.
- `lifecycleStatus`, `usagePurposeTags`, `productionStatus` 명시 필드 분리는 1차 완성 이후 다시 검토합니다.

1차 적용 내용:

- `src/constants/status.js`에 영상 검토 상태와 제작 상태를 구분하는 helper를 추가합니다.
- 제작 후보 판정은 production helper를 사용합니다.
- 레이더의 봤음/나중에 보기/제외 판정은 video review helper를 사용합니다.
- 레이더 숨김 여부는 별도 helper로 중앙화합니다.

---

## 10. 지금 하면 안 되는 작업

현재 단계에서 아래 작업은 하지 않습니다.

- 기존 `status` 제거
- `statusIds` 의미 변경
- `production_candidates` DB 생성
- `/video-records` endpoint 응답 구조 대개편
- 기존 제작 칸반 데이터 마이그레이션
- localStorage key 변경
- 전체 제작 칸반 UI 대개편

---

## 11. 다음 작은 작업 후보

선택지 B 승인 후 1차 적용된 항목:

1. `src/constants/status.js`에 상태 분류 helper를 추가합니다.
2. 제작 상태와 영상 검토 상태를 판별하는 함수를 명시합니다.
3. 제작 후보 판정은 제작 상태 helper를 사용합니다.
4. 레이더 판단 일부는 영상 검토 상태 helper를 사용합니다.

남은 작은 작업 후보:

1. `status: new` 처리 정책을 문서와 코드에서 정리합니다.
2. `ProductionKanban` 내부의 3단계 칼럼과 장기 제작 상태 후보를 별도 문서로 연결합니다.
3. 레이더/보관함/제작 칸반에서 상태 표시명이 같은 의미로 쓰이는지 추가 audit합니다.

이 작업은 DB schema, endpoint, localStorage key를 바꾸지 않는 작은 프론트 리팩터링입니다.
