# Creator OS videoUserRecords 저장 흐름 감사

작성일: 2026-07-02

이 문서는 Creator OS의 영상별 사용자 판단 기록인 `videoUserRecords`가 프론트 상태, localStorage, 백엔드 `/video-records`, Cloud DB 사이에서 어떻게 흐르는지 정리합니다.

이 작업은 분석/문서 작업입니다. 코드, API, DB schema, localStorage key는 변경하지 않습니다.

---

## 1. 현재 기준 사실

아래 내용은 2026-07-02 기준 repo 확인 결과입니다.

- 프론트는 `videoUserRecords`를 React state로 들고 있습니다.
- 앱 시작 시 localStorage의 `yt_crm_video_user_records`를 먼저 읽습니다.
- 앱 시작 후 `/video-records`에서 Cloud DB 데이터를 불러와 프론트 state를 덮어씁니다.
- 프론트 state가 바뀔 때마다 localStorage에도 다시 기록합니다.
- 프론트는 `status`와 `statusIds`를 함께 다루는 호환 구조입니다.
- 백엔드 `/video-records`는 단일 `status` 중심으로 저장합니다.
- 이 감사 시점에는 백엔드가 `statusIds`를 저장 문서에 포함하지 않았습니다. 이후 선택지 B가 승인되어 `status` 유지 + `statusIds` 보존이 반영됐고, 2026-07-02 배포 smoke test에서 저장/조회/삭제 흐름을 확인했습니다.
- 백엔드 기본 status는 `new`입니다.
- 프론트 상태 상수에는 `new`가 정의되어 있지 않습니다.
- `/video-records`는 별도 container가 아니라 Cosmos `videos` container 안의 `docType: video_user_record` 문서로 저장됩니다.

---

## 2. 현재 저장 위치

| 위치 | 역할 | 기준 데이터 여부 | 현재 내용 |
|---|---|---|---|
| React state `videoUserRecords` | 화면에서 즉시 쓰는 현재 상태 | 임시 기준 | 앱 실행 중 판단 기록 |
| localStorage `yt_crm_video_user_records` | 캐시/복구/기존 호환 | 기준 아님 | 최근 프론트 state 복사본 |
| `/video-records` API | Cloud 저장/조회 통로 | 장기 기준 후보 | 영상별 사용자 기록 |
| Cosmos `videos` container | 실제 Cloud DB 저장 위치 | 장기 기준 | `docType: video_user_record` 문서 |

운영 기준:

- 장기 기준은 Cloud DB입니다.
- localStorage는 삭제하지 않지만 기준 데이터로 보지 않습니다.
- 현재는 Cloud 저장 실패 시 localStorage가 임시 안전망 역할을 합니다.

---

## 3. 백엔드 저장 schema

백엔드 `/video-records`가 저장하는 필드는 현재 다음과 같습니다.

| 필드 | 저장 여부 | 의미 | 비고 |
|---|---:|---|---|
| `id` | 예 | `${userId}:${videoId}` | 내부 문서 ID |
| `docType` | 예 | `video_user_record` | videos container 안에서 문서 구분 |
| `userId` | 예 | 사용자 ID | 현재 기본값 `default` |
| `channelId` | 예 | 파티션 키 | 실제 채널 ID가 아니라 `__video_user_records_default` 형태 |
| `videoId` | 예 | 대상 영상 ID | 필수 |
| `status` | 예 | 단일 상태값 | 없으면 `new` |
| `draftTitle` | 예 | 내가 만들 제목 초안 | 제작 칸반에서 사용 |
| `note` | 예 | 제작/검토 메모 | 제작 칸반에서 사용 |
| `targetPublishDate` | 예 | 업로드 예정일 | 제작 칸반에서 사용 |
| `uploadedAt` | 예 | 업로드 완료일 | 제작 칸반에서 사용 |
| `createdAt` | 예 | 생성일 | 기존 값 유지 가능 |
| `updatedAt` | 예 | 갱신일 | 저장 시 갱신 |
| `statusIds` | 예 | 복수 상태 후보 | 선택지 B 승인 이후 보존 대상으로 추가. 기존 `status`는 유지 |

중요:

- 백엔드가 저장하지 않는 필드는 다음 Cloud 조회 때 사라질 수 있습니다.
- 따라서 현재 `statusIds`는 Cloud 기준 데이터라고 볼 수 없습니다.

---

## 4. 프론트 로딩 흐름

앱 시작 시 흐름:

```txt
localStorage 읽기
→ React state videoUserRecords 초기값 설정
→ /video-records Cloud 조회 시도
→ 성공하면 Cloud records로 state 교체
→ state 변경을 localStorage에 다시 기록
```

의미:

- Cloud 조회가 성공하면 Cloud 데이터가 화면 기준이 됩니다.
- Cloud 조회가 실패하면 localStorage 데이터가 임시로 남습니다.
- Cloud 데이터가 오래되었고 localStorage가 더 최신인 경우에도, 현재 구조에서는 Cloud 성공 응답이 state를 덮어쓸 수 있습니다.

위험:

- Cloud 저장 실패 후 localStorage에만 남은 판단 기록이 다음 실행에서 Cloud 데이터로 덮일 수 있습니다.
- 별도 충돌 해결 로직은 없습니다.

---

## 5. 상태 저장 흐름

### 5.1 레이더 판단 저장

사용자가 레이더에서 `봤음`, `나중에 보기`, `제작 후보`, `제외` 등을 누르는 흐름입니다.

```txt
사용자 클릭
→ withRecordStatus()로 status/statusIds 생성
→ React state 즉시 변경
→ localStorage 자동 반영
→ POST /video-records 저장 시도
→ 실패해도 화면에는 local state 유지
```

장점:

- Cloud가 잠시 실패해도 사용자는 작업을 계속할 수 있습니다.

위험:

- Cloud 저장 실패 시 다음 Cloud 동기화에서 판단 기록이 사라질 수 있습니다.
- 선택지 B 구현 전에는 `statusIds`가 백엔드에 저장되지 않아 복수 상태 정보가 사라질 수 있었습니다. 현재는 `statusIds` 저장/조회가 가능하지만, Cloud 저장 실패 시 다음 동기화에서 local 임시 기록이 사라질 수 있습니다.

### 5.2 제작 칸반 메모/일정 저장

제작 칸반에서 제목, 메모, 업로드 예정일을 저장하는 흐름입니다.

```txt
제작 칸반에서 초안 입력
→ 변경 내용 저장 클릭
→ updateVideoUserRecord()
→ React state 즉시 변경
→ localStorage 자동 반영
→ POST /video-records 저장 시도
```

백엔드에 보존되는 필드:

- `draftTitle`
- `note`
- `targetPublishDate`
- `uploadedAt`
- `status`

주의:

- 기존 record에 `status`가 없으면 백엔드 기본값 `new`가 들어갈 수 있습니다.
- `new`는 프론트 상태 사전에 없으므로 나중에 정리가 필요합니다.

### 5.3 제작 상태 이동

제작 칸반에서 `제작 후보`, `제작 중`, `업로드 완료`로 이동하는 흐름입니다.

```txt
상태 이동 클릭
→ markRadarVideoStatus()
→ withRecordStatus()
→ React state 즉시 변경
→ POST /video-records 저장
```

현재 유지되는 점:

- 프론트에서는 production status끼리 중복되지 않도록 정리합니다.
- `uploaded`로 이동하면 `uploadedAt`도 기록할 수 있습니다.

위험:

- 프론트의 `statusIds`에는 여러 상태가 남을 수 있지만 Cloud에는 단일 `status`만 남습니다.
- 예를 들어 `reference_material`과 `production_candidate`를 동시에 의미 있게 유지하려면 현재 백엔드 schema로는 부족합니다.

### 5.4 레이더로 되돌리기

```txt
레이더로 되돌리기 클릭
→ 숨김 상태들을 statusIds에서 제거
→ status를 unseen으로 설정
→ React state 변경
→ POST /video-records 저장
```

위험:

- 프론트에서는 일부 statusIds를 유지하려 하지만 백엔드는 `statusIds`를 저장하지 않습니다.
- 되돌리기 이후 Cloud 기준으로는 결국 단일 `unseen`만 남을 수 있습니다.

### 5.5 판단 기록 초기화

```txt
판단 초기화 클릭
→ React state 전체를 {}
→ localStorage도 {}로 갱신
→ DELETE /video-records 시도
```

위험:

- 매우 큰 변경입니다.
- Cloud DELETE가 실패하면 local은 비었지만 Cloud에는 기록이 남을 수 있습니다.
- 다음 실행에서 Cloud 기록이 다시 살아날 수 있습니다.

운영 기준:

- 이 기능은 사용자가 "전체 판단 기록 삭제"임을 명확히 이해해야 합니다.
- 나중에 확인 모달 또는 삭제 범위 분리가 필요할 수 있습니다.

---

## 6. 현재 상태 해석 함수

프론트는 `status`와 `statusIds`를 함께 읽기 위해 다음 원칙을 사용합니다.

```txt
statusIds가 있으면 statusIds 사용
status가 있고 statusIds에 없으면 status도 추가해서 해석
```

이 구조의 장점:

- 기존 단일 `status` 데이터도 읽을 수 있습니다.
- 복수 상태 실험도 프론트 안에서는 어느 정도 가능합니다.

이 구조의 한계:

- Cloud 저장 후 다시 불러오면 `statusIds`가 사라질 수 있습니다.
- 백엔드가 모르는 상태는 장기 보존되지 않습니다.
- `status: new` 같은 프론트 미정의 값이 들어오면 해석이 애매합니다.

---

## 7. 충돌 위험 정리

| 위험 | 현재 영향 | 심각도 | 설명 | 당장 조치 |
|---|---|---:|---|---|
| `statusIds` 보존 회귀 | 복수 상태 유실 | 중간 | 향후 수정에서 `statusIds` 응답/저장이 빠지면 Cloud가 단일 상태만 보존할 수 있음 | `/video-records` 회귀 테스트 후보 |
| `status: new` 미정의 | 상태 해석 혼란 | 중간 | 백엔드 기본값이 프론트 상태 사전에 없음 | 상태값 사전에서 결정 필요 |
| Cloud/localStorage 충돌 | 판단 기록 되돌아감/사라짐 | 높음 | Cloud 성공 응답이 local 최신값을 덮을 수 있음 | 마이그레이션/동기화 정책 별도 Issue |
| 저장 실패 후 local만 유지 | 다음 실행 시 유실 가능 | 중간 | 사용자에게는 저장된 것처럼 보일 수 있음 | 저장 실패 UI 강화 후보 |
| 전체 삭제 실패 | Cloud 기록 재등장 가능 | 중간 | local 삭제 성공, Cloud 삭제 실패 시 불일치 | 확인/재시도 정책 후보 |
| 제작 상태와 영상 상태 혼합 | 기능 확장 시 혼란 | 높음 | `videoUserRecords.status`가 두 역할을 동시에 가짐 | MVP는 유지, 장기 모델 검토 |

---

## 8. 지금 결정하지 말아야 할 것

아래 항목은 이 감사 문서에서 결정하지 않습니다.

- `status`/`statusIds`를 장기적으로 `lifecycleStatus`, `usagePurposeTags`, `productionStatus`로 분리할지 여부
- 기존 `status`를 제거할지 여부
- 백엔드 기본값 `new`를 `unseen`으로 바꿀지 여부
- localStorage와 Cloud 충돌 해결 방식을 어떻게 할지
- `production_candidates`를 별도 DB로 분리할지 여부
- 판단 기록 초기화 UX를 어떻게 바꿀지

이 항목들은 기존 데이터와 사용자 작업 기록에 영향을 줄 수 있으므로 별도 선택지 보고가 필요합니다.

---

## 9. 권장 다음 단계

### 9.1 문서 기준 다음 작업

1. discovery links / local assets 모델 문서 작성
2. `/video-records` schema 선택지 보고서 작성
3. localStorage와 Cloud 동기화 정책 선택지 보고서 작성

### 9.2 코드 기준 다음 작업 후보

아래 작업은 바로 구현하지 않고, 먼저 선택지 보고가 필요합니다.

- `status: new` 처리 정책 결정
- `statusIds` 백엔드 저장 여부 결정
- 저장 실패 시 사용자 안내 강화
- 판단 기록 초기화 확인 모달 추가

---

## 10. 최종 판정

현재 `videoUserRecords`는 MVP 기능으로는 작동하지만, v2.2의 장기 기준으로는 아직 안정화가 필요합니다.

현재 판정:

- 영상별 단일 판단 저장: 가능
- 제작 칸반 메모/일정 저장: 가능
- 복수 상태 장기 저장: 불안정
- Cloud/localStorage 충돌 해결: 미구현
- 제작 후보 별도 모델: 미구현

따라서 당장 큰 schema 변경으로 들어가기보다, 현재 구조를 유지한 상태에서 `status/statusIds`와 동기화 정책을 별도 결정하는 것이 안전합니다.
