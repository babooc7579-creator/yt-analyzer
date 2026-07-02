# Creator OS 제작 후보 / 제작 칸반 MVP 범위

작성일: 2026-07-02

이 문서는 Creator OS에서 "제작 후보"와 "제작 칸반"을 1차 MVP에서 어떤 데이터 기준으로 볼지 정리합니다.

중요: 이 문서는 범위 결정 문서입니다. 코드, API, DB schema, localStorage key는 변경하지 않습니다.

---

## 1. 현재 기준 사실

아래 내용은 2026-07-02 현재 repo 기준입니다.

- `production_candidates` 별도 저장소는 없습니다.
- `production_candidates` API endpoint는 없습니다.
- 제작 후보와 제작 칸반은 현재 `videoUserRecords` 기반으로 동작합니다.
- `/video-records`는 `videos` container 안의 `docType: video_user_record` 구조를 사용합니다.
- `status`는 기존 대표/호환 필드로 유지됩니다.
- `statusIds`는 복수 판단 보존용으로 저장/조회됩니다.
- 제작 관련 보조 필드로 `draftTitle`, `note`, `targetPublishDate`, `uploadedAt`이 사용됩니다.
- 제작 칸반은 현재 저장된 YouTube 영상과 `videoUserRecords`를 조합해 표시합니다.
- 제작 칸반의 주요 칼럼은 `제작 후보`, `제작 중`, `업로드 완료`입니다.
- discovery links / local assets는 아직 구현되지 않았고, 제작 후보와 직접 연결되지 않습니다.

근거 파일:

- `src/constants/status.js`
- `src/hooks/useVideoProductionActions.js`
- `src/components/ProductionKanban.jsx`
- `docs/CREATOR_OS_VIDEO_USER_RECORDS_AUDIT.md`
- `docs/CREATOR_OS_VIDEO_RECORDS_LONG_TERM_MODEL.md`
- `docs/CREATOR_OS_STATUS_DICTIONARY.md`
- `docs/CREATOR_OS_DATA_OWNERSHIP.md`

---

## 2. 현재 구현 흐름

### 2.1 제작 후보로 보내기

```txt
사용자가 영상에서 "제작 후보로" 클릭
→ 영상이 스크랩북에 없으면 먼저 스크랩북 저장 시도
→ videoUserRecord에 production_candidate 상태 저장
→ status/statusIds 기준으로 제작 후보 판정
```

의미:

- 현재 "제작 후보로"는 **제작 프로젝트 생성**이 아닙니다.
- 현재는 YouTube 영상 1개에 대한 사용자 판단 기록입니다.
- 제작 후보가 되면 제작 칸반에서 볼 수 있습니다.

### 2.2 제작 칸반 표시

```txt
저장된 videos 배열
→ videoUserRecords 확인
→ production status 추출
→ 제작 후보 / 제작 중 / 업로드 완료 칼럼에 표시
```

현재 사용하는 제작 상태:

| 저장값 | 화면 의미 | 현재 구현 |
|---|---|---:|
| `production_candidate` | 제작 후보 | 예 |
| `production_active` | 제작 중 | 예 |
| `uploaded` | 업로드 완료 | 예 |
| `production_reviewing` | 검토 중 | 상수는 있으나 칸반 기본 칼럼 아님 |
| `production_decided` | 제작 결정 | 상수는 있으나 칸반 기본 칼럼 아님 |
| `production_on_hold` | 보류 | 상수는 있으나 칸반 기본 칼럼 아님 |

### 2.3 제작 메모/일정 저장

```txt
제작 칸반에서 제목 초안, 메모, 업로드 예정일 입력
→ /video-records 저장
→ Cloud 성공 시 기준 데이터로 유지
```

현재 사용하는 보조 필드:

| 필드 | 의미 | 현재 구현 |
|---|---|---:|
| `draftTitle` | 내가 만들 제목 초안 | 예 |
| `note` | 제작/검토 메모 | 예 |
| `targetPublishDate` | 업로드 예정일 | 예 |
| `uploadedAt` | 업로드 완료일 | 예 |

---

## 3. 용어 구분

현재 단계에서 가장 중요한 것은 용어를 섞지 않는 것입니다.

| 용어 | 현재 의미 | 목표 의미 | 지금 판단 |
|---|---|---|---|
| 제작 후보 | 만들 만한 YouTube 영상 후보 | 제작 후보 소재 또는 프로젝트 | MVP에서는 `videoUserRecords` 상태 |
| 제작 칸반 | 후보 영상의 진행 상태 뷰 | 제작 프로젝트 관리 화면 | MVP에서는 `videoUserRecords` 기반 뷰 |
| 제작 프로젝트 | 여러 원본/링크/파일/작업을 묶은 단위 | 장기 목표 | 아직 미구현 |
| 업로드 완료 | 이 후보로 만든 영상이 완료됨 | 제작 완료 기록 | MVP에서는 `uploaded` 상태 |
| 사용함 | 소재를 사용했다는 영상 판단 | 제작 완료와 다름 | `used`와 `uploaded` 구분 유지 |

운영 원칙:

- `production_candidate`는 현재 제작 프로젝트 ID가 아닙니다.
- 제작 칸반은 현재 별도 DB를 가진 프로젝트 관리 도구가 아닙니다.
- `uploaded`는 제작 흐름의 완료 상태입니다.
- `used`는 원본 영상 소재를 사용했다는 판단 상태입니다.

---

## 4. 선택지

### 선택지 A: `videoUserRecords` 기반 MVP 유지

내용:

- 현재 구조를 유지합니다.
- 제작 후보, 제작 중, 업로드 완료를 `status/statusIds` 안에서 관리합니다.
- `draftTitle`, `note`, `targetPublishDate`, `uploadedAt`을 계속 사용합니다.
- 제작 칸반은 별도 DB가 아니라 `videoUserRecords` 기반 화면으로 봅니다.

장점:

- 기존 기능을 가장 안전하게 유지합니다.
- 새 DB/API가 필요 없습니다.
- 현재 제작 칸반과 레이더 흐름이 깨지지 않습니다.
- 1차 MVP에서 충분히 실사용 가능합니다.

단점:

- 제작 후보가 YouTube 영상 1개에 묶입니다.
- 외부 링크, 로컬 파일, 여러 원본 영상을 하나의 후보로 묶기 어렵습니다.
- 영상 검토 상태와 제작 진행 상태가 같은 record 안에 남습니다.

위험도:

- 낮음에서 중간.

현재 판단:

- 1차 MVP 추천안입니다.

### 선택지 B: 같은 `video_user_record` 안에서 명시 필드 추가

내용:

- 기존 `/video-records` 문서에 `productionStatus` 같은 명시 필드를 추가합니다.
- `status/statusIds`는 호환용으로 유지합니다.

예상 구조:

```txt
status: "production_candidate"
statusIds: ["production_candidate", "reference_material"]
productionStatus: "candidate"
```

장점:

- 영상 검토 상태와 제작 진행 상태가 더 명확해집니다.
- 별도 production DB보다는 전환 비용이 낮습니다.

단점:

- DB schema 확장입니다.
- 백엔드 저장/조회 변경이 필요합니다.
- 기존 record 보정 정책이 필요합니다.

위험도:

- 중간.

현재 판단:

- 1차 MVP에서는 보류합니다.

### 선택지 C: `production_candidates` 별도 저장소 도입

내용:

- 제작 후보를 별도 문서로 분리합니다.
- 하나의 제작 후보가 여러 YouTube 영상, discovery link, local asset을 묶을 수 있게 합니다.

예상 구조:

```txt
production_candidate = {
  id,
  title,
  status,
  sourceVideoIds,
  discoveryLinkIds,
  localAssetIds,
  draftTitle,
  note,
  targetPublishDate,
  uploadedAt,
  createdAt,
  updatedAt
}
```

장점:

- 장기 Creator OS 구조에 가장 가깝습니다.
- 제작 프로젝트 관리 도구로 확장하기 좋습니다.
- 외부 링크/로컬 파일/여러 원본 영상 연결이 가능합니다.

단점:

- 새 DB 저장소 또는 새 `docType` 설계가 필요합니다.
- 새 endpoint가 필요합니다.
- 기존 `videoUserRecords` 후보와의 관계를 정해야 합니다.
- 마이그레이션과 중복 표시 위험이 있습니다.

위험도:

- 높음.

현재 판단:

- 지금은 만들지 않습니다.
- discovery links / local assets가 실제로 들어오고, 여러 원본을 묶는 필요가 분명해질 때 다시 검토합니다.

### 선택지 D: 스크랩북을 제작 후보 저장소처럼 사용

내용:

- 스크랩북에 저장된 영상을 제작 후보처럼 취급합니다.

장점:

- 구현이 빠르게 보일 수 있습니다.

단점:

- 스크랩북은 "보관"이고 제작 후보는 "만들 판단"입니다.
- 모든 스크랩이 제작 후보는 아닙니다.
- 현재 코드도 별표/스크랩과 제작 후보 상태를 구분하고 있습니다.

위험도:

- 중간.

현재 판단:

- 추천하지 않습니다.

---

## 5. 선택지 비교

| 선택지 | 구현 속도 | 데이터 위험 | 기존 기능 안정성 | 장기 확장성 | Codex 판단 |
|---|---:|---:|---:|---:|---|
| A. `videoUserRecords` 유지 | 빠름 | 낮음~중간 | 높음 | 중간 | 추천 |
| B. 명시 필드 추가 | 중간 | 중간 | 중간 | 중간 이상 | 1차 이후 |
| C. 별도 production DB | 느림 | 높음 | 중간 이하 | 높음 | 나중 |
| D. 스크랩북 대체 | 빠름 | 중간 | 낮음 | 낮음 | 비추천 |

---

## 6. Codex 추천

1차 MVP는 **선택지 A: `videoUserRecords` 기반 제작 후보 유지**를 추천합니다.

추천 이유:

1. 지금 이미 작동하는 제작 후보/칸반 흐름이 있습니다.
2. Cloud DB에 `status`, `statusIds`, `draftTitle`, `note`, `targetPublishDate`, `uploadedAt`이 저장됩니다.
3. 1인 사용 MVP에서는 YouTube 영상 기반 제작 후보만으로도 실사용 가치가 있습니다.
4. `production_candidates` 별도 DB는 discovery links/local assets가 실제로 붙기 전에는 과합니다.
5. 현재 필요한 것은 DB 추가가 아니라 화면과 문서에서 "제작 후보 = 영상 기반 후보"임을 명확히 하는 것입니다.

1차 MVP 기준:

- 제작 후보는 YouTube 영상 기반입니다.
- 제작 후보 상태는 `videoUserRecords.status/statusIds`에 저장합니다.
- 제작 칸반은 `videoUserRecords`를 읽는 화면입니다.
- 별도 `production_candidates` 저장소는 만들지 않습니다.
- 제작 메모/일정은 기존 필드를 유지합니다.
- `uploaded`와 `used`는 구분합니다.

---

## 7. 1차 MVP에서 가능한 것

현재 구조로 가능한 작업:

- 영상 하나를 제작 후보로 보내기
- 제작 후보를 제작 중으로 이동
- 제작 중 후보를 업로드 완료로 이동
- 제목 초안 저장
- 제작 메모 저장
- 업로드 예정일 저장
- 업로드 완료일 기록
- 제작 후보 수 요약
- 일정 미정/지난 일정 표시

현재 구조로 어렵거나 하지 않는 작업:

- 여러 영상을 하나의 제작 후보로 묶기
- 인스타/웹 링크를 제작 후보로 직접 보내기
- 로컬 파일을 제작 후보와 연결하기
- 제작 프로젝트별 세부 작업 관리
- 제작 결과 성과 회고
- 업로드 플랫폼별 결과 기록

---

## 8. 별도 `production_candidates`가 필요한 시점

아래 조건 중 여러 개가 실제로 필요해지면 별도 모델을 다시 검토합니다.

- 하나의 제작물이 여러 YouTube 영상을 참고해야 합니다.
- discovery link를 제작 후보로 직접 보내야 합니다.
- local asset을 제작 후보에 연결해야 합니다.
- 제목/대본/썸네일/편집/업로드 같은 세부 작업을 관리해야 합니다.
- 제작 후보와 최종 업로드 영상을 분리해서 기록해야 합니다.
- 제작 완료 후 성과 회고를 붙여야 합니다.
- 여러 채널 또는 여러 플랫폼 업로드를 관리해야 합니다.
- 제작 후보가 단순 "영상 1개 상태"를 넘어 "프로젝트"가 됩니다.

그 전까지는 `videoUserRecords` 기반 MVP가 더 안전합니다.

---

## 9. UI 표현 원칙

사용자가 오해하지 않도록 아래 원칙을 둡니다.

### 9.1 제작 후보로 보내기

의미:

- 이 YouTube 영상을 제작 후보로 표시합니다.
- 필요한 경우 스크랩북에도 저장합니다.
- 별도 제작 프로젝트를 생성하는 것은 아닙니다.

피해야 할 표현:

- 프로젝트 생성
- 제작실 저장 완료
- 업로드 예약 완료

### 9.2 제작 칸반

의미:

- YouTube 영상 기반 제작 후보를 진행 상태별로 보여줍니다.
- 제작 후보, 제작 중, 업로드 완료 상태를 관리합니다.

피해야 할 표현:

- 전체 제작 프로젝트 관리
- 모든 자료 통합 관리
- 자동 제작 추적

### 9.3 업로드 완료

의미:

- 이 후보를 바탕으로 만든 콘텐츠가 완료됐다고 기록합니다.
- 원본 영상 자체가 "사용함" 상태인지와는 다를 수 있습니다.

---

## 10. 지금 하지 말아야 할 것

현재 단계에서는 아래를 하지 않습니다.

- `production_candidates` DB 생성
- `production_candidates` endpoint 추가
- 기존 `videoUserRecords` 후보 데이터 마이그레이션
- `status` 필드 제거
- `statusIds` 전체 재설계
- `lifecycleStatus`, `usagePurposeTags`, `productionStatus` 명시 필드 추가
- 제작 칸반 대개편
- 스크랩북을 제작 후보 저장소로 대체
- discovery links / local assets를 제작 후보와 자동 연결
- 제작 후보 자동 생성
- AI 기반 자동 판단

---

## 11. 다음 단계

사용자 결정 없이 가능한 다음 작업:

1. 문서 인덱스에 이 문서를 연결합니다.
2. 다음 이슈 계획에서 Issue 10을 "검토 완료, 1차 MVP는 `videoUserRecords` 유지"로 갱신합니다.
3. 화면 문구는 이후 별도 UI wording 작업으로 필요할 때만 다룹니다.

사용자 결정이 필요한 다음 작업:

1. discovery links 실제 구현 전 API 경계와 `/videos` 조회 분리 방식 결정
2. discovery link 첫 화면 흐름과 제작 후보 연결 범위 결정
3. `production_candidates` 별도 DB 도입 여부
4. 제작 칸반을 3단계에서 더 확장할지 여부
5. `productionStatus` 명시 필드 도입 여부

---

## 12. 최종 판정

현재 단계에서는 `production_candidates` 별도 DB를 만들지 않습니다.

1차 MVP에서는 제작 후보와 제작 칸반을 **기존 `videoUserRecords` 기반 YouTube 영상 제작 흐름**으로 유지합니다.

장기적으로 discovery links, local assets, 여러 원본 영상이 하나의 제작물로 묶여야 하는 시점이 오면 `production_candidates` 별도 모델을 다시 검토합니다.
