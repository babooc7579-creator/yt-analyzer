# Creator OS /video-records schema 선택지 보고서

작성일: 2026-07-02

이 문서는 `/video-records`의 현재 단일 `status` 구조와 프론트의 `statusIds` 호환 구조를 어떻게 정리할지 선택지를 제시합니다.

중요: 이 문서는 결정 보고서입니다. 코드, API, DB schema, localStorage key는 변경하지 않습니다.

---

## 1. 현재 상황

현재 `/video-records`는 영상별 사용자 판단 기록을 저장합니다.

현재 확인된 구조:

- 프론트는 `videoUserRecords`를 React state로 관리합니다.
- 프론트는 localStorage `yt_crm_video_user_records`를 캐시/복구 용도로 사용합니다.
- 프론트는 `status`와 `statusIds`를 함께 해석합니다.
- 백엔드는 `/video-records` 문서를 Cosmos `videos` container 안에 `docType: video_user_record`로 저장합니다.
- 백엔드는 단일 `status`만 저장합니다.
- 백엔드는 `statusIds`를 저장하지 않습니다.
- 백엔드 기본 status는 `new`입니다.
- 프론트 상태 사전에는 `new`가 없습니다.

현재 백엔드 저장 필드:

| 필드 | 현재 저장 여부 |
|---|---:|
| `videoId` | 예 |
| `status` | 예 |
| `draftTitle` | 예 |
| `note` | 예 |
| `targetPublishDate` | 예 |
| `uploadedAt` | 예 |
| `createdAt` | 예 |
| `updatedAt` | 예 |
| `statusIds` | 아니오 |

---

## 2. 문제 정의

현재 구조는 MVP로 동작하지만, 다음 문제가 있습니다.

1. 프론트는 복수 상태처럼 보이지만 Cloud DB에는 단일 상태만 남습니다.
2. `reference_material`과 `production_candidate`처럼 동시에 의미가 있는 상태를 장기 저장하기 어렵습니다.
3. 백엔드 기본값 `new`와 프론트 기본값 `unseen`이 다릅니다.
4. 제작 상태와 영상 검토 상태가 같은 `status` 필드에 섞입니다.
5. localStorage에는 있던 `statusIds`가 Cloud 조회 후 사라질 수 있습니다.

---

## 3. 선택지 A: 현재 단일 `status` 구조 유지

### 설명

백엔드 schema를 바꾸지 않습니다. 프론트도 지금처럼 `status` 중심으로 저장하고, `statusIds`는 화면 호환용으로만 제한합니다.

### 장점

- 가장 빠릅니다.
- 백엔드 변경이 없습니다.
- 기존 Cloud 데이터와 충돌이 가장 적습니다.
- 배포 위험이 낮습니다.

### 단점

- 복수 상태를 안정적으로 저장할 수 없습니다.
- v2.2 목표인 "자료 참고이면서 제작 후보" 같은 상태 조합이 어렵습니다.
- 프론트 `statusIds`는 계속 임시값이 됩니다.
- 제작 상태와 영상 검토 상태 혼합 문제가 남습니다.

### 비용/속도/확장성/유지보수 영향

| 항목 | 영향 |
|---|---|
| 비용 | 낮음 |
| 속도 | 가장 빠름 |
| 확장성 | 낮음 |
| 유지보수 | 단기 쉬움, 장기 어려움 |

### 적합한 경우

- 지금 당장 기능 안정화가 더 중요할 때
- 복수 상태가 아직 실사용에 꼭 필요하지 않을 때
- 백엔드 변경을 최대한 미루고 싶을 때

---

## 4. 선택지 B: 단일 `status` 유지 + 백엔드에 `statusIds` 보존 필드 추가

### 설명

기존 `status`는 유지하고, 백엔드가 `statusIds`도 저장하도록 확장합니다.

예상 방향:

```txt
status: "production_candidate"
statusIds: ["reference_material", "production_candidate"]
```

`status`는 대표 상태 또는 기존 호환 필드로 유지합니다. `statusIds`는 복수 상태의 기준 후보가 됩니다.

### 장점

- 기존 데이터와 호환됩니다.
- 프론트의 현재 호환 함수와 잘 맞습니다.
- 복수 상태 저장이 가능해집니다.
- 한 번에 큰 모델 분리를 하지 않아도 됩니다.
- v2.2 방향으로 가는 중간 단계로 적합합니다.

### 단점

- 백엔드 schema 변경이 필요합니다.
- `status`와 `statusIds`가 서로 다를 때 기준을 정해야 합니다.
- 기존 문서 중 `statusIds`가 없는 record를 읽는 호환 정책이 필요합니다.
- localStorage와 Cloud 충돌 정책도 같이 정리해야 합니다.

### 비용/속도/확장성/유지보수 영향

| 항목 | 영향 |
|---|---|
| 비용 | 중간 |
| 속도 | 중간 |
| 확장성 | 중간 이상 |
| 유지보수 | 중간. 기준만 잘 정하면 안정적 |

### 적합한 경우

- 지금 구조를 크게 깨지 않고 v2.2로 가고 싶을 때
- 레이더, 스크랩, 제작 후보 상태를 조금 더 섬세하게 저장해야 할 때
- `production_candidates` 별도 DB는 아직 이르다고 볼 때

---

## 5. 선택지 C: `videoUserRecords`를 영상 상태와 제작 상태로 분리

### 설명

`videoUserRecords`는 영상 검토 상태만 담당하고, 제작 상태는 별도 `production_candidates` 또는 별도 문서 구조로 분리합니다.

예상 방향:

```txt
videoUserRecords:
- videoId
- statusIds
- note
- reviewedAt

productionCandidates:
- id
- sourceVideoId
- productionStatus
- draftTitle
- targetPublishDate
- uploadedAt
```

### 장점

- 장기 구조가 가장 명확합니다.
- 영상 검토와 제작 진행이 섞이지 않습니다.
- 여러 원본 영상, discovery link, local asset을 하나의 제작 후보로 묶을 수 있습니다.
- v2.2 최종 목표에 가장 가깝습니다.

### 단점

- 백엔드 endpoint와 DB 모델 추가가 필요합니다.
- 기존 제작 칸반 흐름을 크게 손봐야 합니다.
- 데이터 마이그레이션이 필요할 수 있습니다.
- 지금 단계에서 범위가 큽니다.

### 비용/속도/확장성/유지보수 영향

| 항목 | 영향 |
|---|---|
| 비용 | 높음 |
| 속도 | 느림 |
| 확장성 | 높음 |
| 유지보수 | 장기 좋음, 단기 복잡 |

### 적합한 경우

- 제작 후보가 YouTube 영상, 외부 링크, 로컬 파일을 함께 묶어야 할 때
- 여러 원본을 하나의 콘텐츠 프로젝트로 관리해야 할 때
- MVP보다 장기 제품 구조가 우선일 때

---

## 6. 선택지 비교

| 기준 | 선택지 A: 현상 유지 | 선택지 B: `statusIds` 보존 추가 | 선택지 C: 제작 상태 분리 |
|---|---|---|---|
| 기존 기능 안정성 | 높음 | 높음 | 중간 |
| 구현 속도 | 빠름 | 중간 | 느림 |
| DB 변경 필요 | 없음 | 있음 | 큼 |
| 기존 데이터 마이그레이션 | 없음 | 거의 없음 또는 낮음 | 높음 |
| 복수 상태 지원 | 낮음 | 가능 | 가능 |
| 제작 흐름 확장성 | 낮음 | 중간 | 높음 |
| 지금 단계 적합도 | 중간 | 높음 | 낮음 |

---

## 7. Codex 추천

현재 단계에서는 **선택지 B: 단일 `status` 유지 + 백엔드에 `statusIds` 보존 필드 추가**를 추천합니다.

이유:

1. 기존 기능을 크게 깨지 않습니다.
2. 현재 프론트 코드가 이미 `statusIds`를 해석할 준비가 되어 있습니다.
3. `production_candidates` 별도 DB 도입은 아직 이릅니다.
4. v2.2 방향으로 가는 중간 단계로 가장 안전합니다.
5. `reference_material`, `title_reference`, `production_candidate` 같은 복수 의미를 잃지 않을 수 있습니다.

단, 바로 구현하지는 않습니다.

구현 전에 먼저 정해야 할 기준:

- `status`는 대표 상태로 유지할지
- `statusIds`가 있으면 `status`보다 우선할지
- 백엔드 기본값 `new`를 유지할지 `unseen`으로 바꿀지
- 기존 record에 `statusIds`가 없을 때 어떻게 보정할지
- localStorage와 Cloud가 충돌할 때 어느 쪽을 우선할지

---

## 8. 결정이 필요한 질문

아래 질문에 대한 결정이 있어야 구현으로 넘어갈 수 있습니다.

1. 복수 상태를 Cloud DB에 저장해야 하나요?
2. `statusIds`를 백엔드에 추가하는 방향을 허용하나요?
3. 기존 단일 `status`는 당분간 유지해도 될까요?
4. 백엔드 기본값 `new`는 `unseen`으로 바꾸는 것이 좋을까요?
5. 제작 후보 별도 DB는 지금은 미루고, `videoUserRecords` 기반 MVP를 유지해도 될까요?

---

## 9. 지금 하면 안 되는 작업

이 문서 작성 시점에서는 아래 작업을 하지 않습니다.

- 백엔드 `/video-records` schema 변경
- `statusIds` 실제 저장 구현
- 기존 Cloud DB 데이터 마이그레이션
- localStorage key 변경
- `production_candidates` endpoint 추가
- 제작 칸반 구조 변경
- 기존 `status` 제거

---

## 10. 권장 후속 작업

1. localStorage와 Cloud 동기화 정책 선택지 보고서를 작성합니다.
2. `status: new` 처리 정책을 상태값 사전에 보강합니다.
3. 사용자가 선택지 B를 승인하면 작은 백엔드 PR로 `statusIds` 보존만 추가합니다.
---

## 2026-07-02 결정 기록: 선택지 B 채택

`/video-records`는 선택지 B로 진행합니다.

결정 내용:

- 기존 `status`는 유지합니다.
- `status`의 의미와 기존 동작은 바꾸지 않습니다.
- `statusIds`를 백엔드 저장/조회 응답에 추가합니다.
- `statusIds`는 복수 판단 보존용입니다.
- `production_candidates` 별도 DB는 지금 만들지 않습니다.
- 전체 상태 모델 재설계는 지금 하지 않습니다.
- localStorage 제거 또는 key 변경은 하지 않습니다.

구현 원칙:

- additive only
- 기존 필드 삭제 금지
- 기존 문서 호환 유지
- `statusIds`가 없다고 기존 `statusIds`를 의도치 않게 삭제하지 않음
- 기존 record에 `statusIds`가 없으면 조회 시 `status` 기반 fallback 제공

장기적으로는 `lifecycleStatus`, `usagePurposeTags`, `productionStatus` 분리를 별도 설계로 검토할 수 있습니다.
