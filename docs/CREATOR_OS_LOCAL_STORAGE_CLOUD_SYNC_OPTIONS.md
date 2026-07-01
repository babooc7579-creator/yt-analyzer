# Creator OS localStorage / Cloud 동기화 정책 선택지 보고서

작성일: 2026-07-02

이 문서는 Creator OS에서 localStorage와 Cloud DB가 동시에 쓰이는 영역의 동기화 정책을 어떻게 정리할지 선택지를 제시합니다.

중요: 이 문서는 결정 보고서입니다. 코드, API, DB schema, localStorage key는 변경하지 않습니다.

---

## 1. 현재 상황

현재 앱은 Cloud DB를 장기 기준으로 옮겨가는 중이지만, 일부 데이터는 localStorage를 보조 저장소로 사용합니다.

현재 localStorage key:

| key | 데이터 | 현재 역할 |
|---|---|---|
| `yt_crm_categories` | 카테고리/태그 목록 | 프론트 UI용 카테고리 캐시 |
| `yt_crm_saved_videos` | 기존 스크랩 영상 | 스크랩북 Cloud 이전/복구 보조 |
| `yt_crm_video_user_records` | 영상별 사용자 판단 기록 | 판단 기록 캐시/복구 보조 |

현재 Cloud 기준 데이터:

| 데이터 | Cloud 위치 | 현재 상태 |
|---|---|---|
| channels | Cosmos `channels` container | Cloud 기준 |
| videos | Cosmos `videos` container | Cloud 기준 |
| scrapbook | Cosmos `videos` container 안의 `docType: scrapbook` | Cloud 기준으로 이전 중 |
| videoUserRecords | Cosmos `videos` container 안의 `docType: video_user_record` | Cloud 기준으로 이전 중 |

---

## 2. 현재 동기화 흐름

### 2.1 videoUserRecords

현재 흐름:

```txt
앱 시작
→ localStorage yt_crm_video_user_records 읽기
→ React state 초기값으로 사용
→ /video-records Cloud 조회
→ 성공하면 Cloud records로 state 교체
→ state 변경 시 localStorage에 다시 기록
```

현재 의미:

- Cloud 조회가 성공하면 Cloud가 화면 기준이 됩니다.
- Cloud 조회가 실패하면 localStorage가 임시 복구 역할을 합니다.
- Cloud 저장 실패 후 localStorage에만 남은 최신 판단은 다음 Cloud 조회 성공 시 덮일 수 있습니다.

### 2.2 scrapbook

현재 흐름:

```txt
앱 시작
→ localStorage yt_crm_saved_videos 읽기
→ local에 스크랩 영상이 있으면 /scrapbook으로 Cloud 저장 시도
→ /scrapbook Cloud 조회
→ 성공하면 Cloud videos로 state 교체
→ state 변경 시 localStorage에 다시 기록
```

현재 의미:

- 기존 local 스크랩을 Cloud로 올리려는 마이그레이션 성격이 있습니다.
- Cloud 준비가 되면 Cloud 스크랩북이 화면 기준이 됩니다.
- Cloud 실패 시 local state가 임시로 남습니다.

### 2.3 categories

현재 흐름:

```txt
앱 시작
→ localStorage yt_crm_categories 읽기
→ React state로 사용
→ state 변경 시 localStorage에 저장
```

현재 의미:

- 카테고리 목록은 localStorage 중심입니다.
- 다만 실제 채널 태그는 Cloud `channels.tags/category`에도 존재합니다.
- local 카테고리와 Cloud 채널 태그가 다를 수 있습니다.

---

## 3. 문제 정의

현재 구조의 문제는 다음입니다.

1. Cloud와 localStorage 중 어느 쪽이 최신인지 판단하는 기준이 없습니다.
2. Cloud 저장 실패 후 localStorage에만 남은 데이터가 나중에 사라질 수 있습니다.
3. localStorage가 기준 데이터처럼 보일 수 있습니다.
4. 스크랩북과 videoUserRecords의 동기화 방식이 서로 다릅니다.
5. 카테고리 목록은 local 중심이지만 채널 태그는 Cloud에도 있어 불일치가 생길 수 있습니다.
6. localStorage key를 바꾸거나 삭제하면 기존 사용자의 자료가 날아갈 수 있습니다.

---

## 4. 선택지 A: 현재 방식 유지, 문구와 문서만 보강

### 설명

코드 동작은 바꾸지 않습니다. localStorage는 계속 보조 저장소로 두고, Cloud 기준이라는 원칙만 문서와 UI 문구로 강화합니다.

### 장점

- 가장 안전하고 빠릅니다.
- 기존 기능에 영향이 없습니다.
- DB/API 변경이 없습니다.
- 배포 위험이 낮습니다.

### 단점

- Cloud/localStorage 충돌 문제는 그대로 남습니다.
- 저장 실패 후 local에만 남은 데이터가 나중에 사라질 수 있습니다.
- 사용자는 "저장됨"과 "임시 보관됨"을 구분하기 어렵습니다.

### 비용/속도/확장성/유지보수 영향

| 항목 | 영향 |
|---|---|
| 비용 | 낮음 |
| 속도 | 가장 빠름 |
| 확장성 | 낮음 |
| 유지보수 | 단기 쉬움, 장기 위험 유지 |

### 적합한 경우

- 지금 당장 기능 구현보다 기준 정리가 우선일 때
- 사용자 데이터 손실 위험을 만들고 싶지 않을 때
- 아직 Cloud schema 결정을 미루고 싶을 때

---

## 5. 선택지 B: Cloud 우선 + localStorage는 명시적 fallback으로 제한

### 설명

Cloud 조회가 성공하면 Cloud를 기준으로 사용합니다. localStorage는 Cloud 조회 실패 시에만 fallback으로 사용합니다.

추가로 화면 또는 내부 상태에서 다음을 구분합니다.

- Cloud 저장됨
- 임시로 브라우저에만 저장됨
- Cloud 동기화 실패

### 장점

- Cloud 기준 원칙이 명확합니다.
- 사용자가 "클라우드에 저장됐는지"를 이해하기 쉬워집니다.
- 장기적으로 localStorage 제거 또는 축소가 쉬워집니다.
- 기존 key를 유지하면서도 역할을 줄일 수 있습니다.

### 단점

- 저장 실패 상태를 표시하는 UI가 필요할 수 있습니다.
- local 최신값과 Cloud 오래된 값이 충돌하는 경우 local 데이터가 밀릴 수 있습니다.
- 일부 흐름에서는 사용자에게 "임시 저장" 상태를 보여줘야 합니다.

### 비용/속도/확장성/유지보수 영향

| 항목 | 영향 |
|---|---|
| 비용 | 중간 |
| 속도 | 중간 |
| 확장성 | 중간 이상 |
| 유지보수 | 장기 안정적 |

### 적합한 경우

- Cloud DB를 장기 기준으로 확정하고 싶을 때
- localStorage를 삭제하지 않고 안전하게 역할을 줄이고 싶을 때
- 스크랩북과 판단 기록의 저장 실패를 사용자에게 더 분명히 보여주고 싶을 때

---

## 6. 선택지 C: 양방향 병합 정책 도입

### 설명

Cloud와 localStorage 데이터를 비교해서 더 최신 데이터 또는 더 많은 데이터를 병합합니다.

예상 기준:

```txt
videoId가 같으면 updatedAt 비교
Cloud에 없고 local에 있으면 Cloud 업로드 후보
Cloud와 local 모두 있으면 최신 updatedAt 우선
```

### 장점

- Cloud 저장 실패 후 local에만 남은 자료를 복구할 수 있습니다.
- 사용자가 브라우저에서 작업한 기록이 덜 사라집니다.
- 마이그레이션 UX가 좋아질 수 있습니다.

### 단점

- 구현이 복잡합니다.
- `updatedAt`이 없는 기존 데이터 처리 기준이 필요합니다.
- 잘못 병합하면 삭제한 데이터가 다시 살아날 수 있습니다.
- 스크랩북, videoUserRecords, categories마다 병합 기준이 다릅니다.

### 비용/속도/확장성/유지보수 영향

| 항목 | 영향 |
|---|---|
| 비용 | 높음 |
| 속도 | 느림 |
| 확장성 | 높음 |
| 유지보수 | 정책이 명확하면 좋지만 초기 복잡도 큼 |

### 적합한 경우

- 기존 localStorage 데이터가 매우 중요하고 손실을 최소화해야 할 때
- 사용자가 여러 브라우저/기기에서 작업할 가능성이 커질 때
- 동기화 상태 UI를 만들 준비가 되었을 때

---

## 7. 선택지 D: localStorage 제거 또는 key 변경

### 설명

localStorage 저장을 제거하거나 key를 바꿉니다.

### 장점

- 구조가 단순해집니다.
- Cloud 기준이 명확해집니다.
- localStorage와 Cloud 충돌이 사라집니다.

### 단점

- 기존 사용자 데이터가 사라질 수 있습니다.
- Cloud 장애 시 fallback이 없습니다.
- 현재 단계에서는 위험이 큽니다.
- 사용자가 몇 달 모은 스크랩/판단 기록을 잃을 수 있습니다.

### 비용/속도/확장성/유지보수 영향

| 항목 | 영향 |
|---|---|
| 비용 | 중간 |
| 속도 | 빠를 수 있으나 위험 큼 |
| 확장성 | Cloud 기준으로는 좋음 |
| 유지보수 | 단순해지지만 사용자 신뢰 위험 |

### 적합한 경우

- Cloud 저장이 완전히 안정화된 뒤
- 백업/복구/마이그레이션 절차가 준비된 뒤
- 사용자가 명시적으로 동의한 뒤

현재 단계에서는 추천하지 않습니다.

---

## 8. 선택지 비교

| 기준 | A: 현상 유지 | B: Cloud 우선 + fallback | C: 양방향 병합 | D: localStorage 제거 |
|---|---|---|---|---|
| 기존 기능 안정성 | 높음 | 높음 | 중간 | 낮음 |
| 사용자 데이터 보호 | 중간 | 중간 이상 | 높음 | 낮음 |
| 구현 속도 | 빠름 | 중간 | 느림 | 중간 |
| 복잡도 | 낮음 | 중간 | 높음 | 중간 |
| 장기 방향성 | 낮음 | 높음 | 높음 | 중간 |
| 지금 단계 적합도 | 중간 | 높음 | 낮음 | 매우 낮음 |

---

## 9. 데이터별 권장 정책

| 데이터 | 현재 상태 | 권장 정책 | 이유 |
|---|---|---|---|
| `videoUserRecords` | Cloud + localStorage 보조 | B 우선 | 판단 기록은 Cloud 기준이어야 하지만 저장 실패 fallback 필요 |
| `scrapbook` | Cloud + localStorage 보조 | B 우선, 초기 1회 업로드 보존 | 기존 스크랩 손실 방지가 중요 |
| `categories` | localStorage 중심 | 별도 audit 필요 | Cloud 채널 태그와 중복/불일치 가능 |
| `channels` | Cloud 기준 | localStorage 사용 금지 | 채널 운영 데이터는 Cloud 기준 |
| `videos` | Cloud 기준 | localStorage 사용 금지 | 수집 데이터는 Cloud 기준 |

---

## 10. Codex 추천

현재 단계에서는 **선택지 B: Cloud 우선 + localStorage는 명시적 fallback으로 제한**을 추천합니다.

추천 이유:

1. 기존 localStorage 데이터를 바로 삭제하지 않습니다.
2. Cloud DB를 장기 기준으로 세울 수 있습니다.
3. 사용자에게 "클라우드 저장됨"과 "임시 저장됨"을 구분해 줄 수 있습니다.
4. 선택지 C보다 구현 범위가 작습니다.
5. 선택지 D처럼 데이터 손실 위험이 크지 않습니다.

단, 바로 구현하지는 않습니다.

선행되어야 할 것:

- `/video-records` schema에서 `statusIds` 보존 여부 결정
- 저장 실패 UI 기준 정리
- 스크랩북 초기 local → Cloud 업로드를 언제까지 유지할지 결정
- 카테고리 localStorage와 Cloud 태그의 관계 audit

---

## 11. 결정이 필요한 질문

구현 전에 아래 질문에 답해야 합니다.

1. Cloud 조회 성공 시 Cloud를 항상 기준으로 삼아도 될까요?
2. Cloud 저장 실패 시 "브라우저에만 임시 저장됨"을 화면에 표시할까요?
3. localStorage에만 있는 videoUserRecords를 Cloud로 자동 업로드할까요, 아니면 사용자가 직접 선택하게 할까요?
4. 스크랩북의 local → Cloud 자동 업로드는 계속 유지할까요?
5. `yt_crm_categories`는 계속 localStorage 기준으로 둘까요, Cloud 채널 태그에서 파생할까요?

---

## 12. 지금 하면 안 되는 작업

이 문서 작성 시점에서는 아래 작업을 하지 않습니다.

- localStorage key 변경
- localStorage 삭제
- Cloud/localStorage 병합 로직 구현
- 자동 마이그레이션 구현
- 기존 사용자 데이터 초기화
- Cloud DB schema 변경
- 스크랩북 동기화 흐름 변경
- videoUserRecords 동기화 흐름 변경

---

## 13. 권장 후속 작업

1. 카테고리 localStorage와 Cloud 채널 태그 관계 audit
2. 저장 실패 UI/문구 기준 문서 작성
3. 사용자가 선택지 B를 승인하면 작은 프론트 리팩터링 Issue로 분리
