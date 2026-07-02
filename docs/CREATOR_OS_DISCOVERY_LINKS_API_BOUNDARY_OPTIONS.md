# Creator OS discovery links API 경계 선택지

작성일: 2026-07-02

이 문서는 발견함 MVP 구현 전에 검토한 API 경계와 첫 화면 흐름을 정리합니다. 2026-07-02 현재 추천 조합이 승인되어 1차 MVP가 부분 구현되었습니다.

중요: 이 문서는 API 경계 결정 기록입니다. 현재 구현된 것과 이후 확장 후보를 구분합니다. DB schema 대개편, localStorage key 변경, local assets 구현은 별도 작업에서 판단합니다.

---

## 1. 현재 상황

현재 repo 기준:

- 발견함 UI는 `발견함 / 링크 수집` 메뉴로 부분 구현되었습니다.
- discovery links 관련 프론트 함수가 추가되었습니다.
- discovery links 관련 백엔드 API가 추가되었습니다.
- `GET /videos?channelIds=...`는 저장된 YouTube 영상만 불러오는 DB 조회입니다.
- `/scrapbook`과 `/video-records`는 Cloud DB의 같은 `videos` container 안에서 `docType`으로 문서 종류를 나누는 구조입니다.
- 새 `discovery_links` Cosmos container는 만들지 않는 방향이 1차 MVP 기준입니다.
- 발견함 MVP 저장 후보는 기존 Cloud DB 구조 안의 `docType: discovery_link`입니다.

이미 정한 기준:

- 수동 링크 저장부터 시작합니다.
- 인스타/외부 사이트 자동 크롤링은 하지 않습니다.
- 자동 다운로드는 하지 않습니다.
- 링크 메타데이터 자동 수집은 1차에서 제외합니다.
- `/videos` 저장 영상 조회에 `docType: discovery_link` 문서가 섞이면 안 됩니다.
- 메인 상태는 `inbox`, `reviewing`, `saved`, `candidate`, `discarded`입니다.
- 권리 확인은 `rightsStatus`로 분리하고 `unknown`, `needs_check`, `cleared`, `do_not_use`를 사용합니다.

---

## 2. 이번에 결정할 범위

이번 결정은 세 가지입니다.

1. 발견함 API endpoint 이름
2. `/videos` 저장 영상 조회와 discovery link 문서를 분리하는 방식
3. 발견함 첫 화면의 최소 흐름

이번 결정에 포함하지 않는 것:

- 새 Cosmos container 생성
- local assets 구현
- 파일 업로드
- 인스타 자동 수집
- 제작 후보 DB 생성
- AI 분석
- 로그인/권한/결제

---

## 3. 선택지 1: API endpoint 이름

### 선택지 A: `/discovery-links`

발견함을 별도 API로 만듭니다.

예상 endpoint:

```txt
GET /discovery-links
POST /discovery-links
PATCH /discovery-links/{id}
DELETE /discovery-links/{id}
```

장점:

- 사용자와 개발자 모두 "발견함 데이터"로 이해하기 쉽습니다.
- 내부 저장소가 `videos` container여도 API 의미는 분리됩니다.
- `/videos`와 섞일 위험을 줄입니다.
- 나중에 별도 container로 분리해도 프론트 API 이름을 유지하기 쉽습니다.

단점:

- 백엔드 endpoint를 새로 만들어야 합니다.
- 구현 전 backend repo 수정이 필요합니다.

비용/속도/확장성/유지보수 영향:

- 비용: 낮음. YouTube API 호출 없음.
- 속도: 중간. 새 endpoint 작업 필요.
- 확장성: 좋음.
- 유지보수: 좋음.

### 선택지 B: `/scrapbook/links`

스크랩북 아래에 링크 저장 기능을 붙입니다.

장점:

- "보관" 관점에서는 이해하기 쉽습니다.
- 기존 스크랩북 기능과 가까워 빠르게 보일 수 있습니다.

단점:

- 발견함과 스크랩북의 의미가 섞입니다.
- 검토 전 링크와 보관 완료 링크가 구분되기 어렵습니다.
- 나중에 제작 후보와 연결할 때 구조가 애매해집니다.

비용/속도/확장성/유지보수 영향:

- 비용: 낮음.
- 속도: 빠름처럼 보이나, 의미 혼동 비용이 큼.
- 확장성: 낮음.
- 유지보수: 중간에서 낮음.

### 선택지 C: `/videos?docType=discovery_link`

기존 `/videos` endpoint에 discovery link 조회를 같이 넣습니다.

장점:

- endpoint 수를 줄일 수 있습니다.

단점:

- 저장 영상 조회와 발견함 조회가 섞입니다.
- 사용자가 "영상 불러오기"와 "링크 불러오기"를 혼동할 수 있습니다.
- `/videos`가 YouTube 영상 기준이라는 현재 원칙을 깨뜨립니다.

비용/속도/확장성/유지보수 영향:

- 비용: 낮음.
- 속도: 처음에는 빠를 수 있음.
- 확장성: 낮음.
- 유지보수: 낮음.

Codex 추천:

- **선택지 A: `/discovery-links`**를 추천합니다.

---

## 4. 선택지 2: `/videos` 조회 분리 방식

### 선택지 A: 백엔드에서 `/videos`는 YouTube 영상 문서만 반환

`/videos` handler가 저장 영상 문서만 조회하도록 명확히 제한합니다.

예상 원칙:

- `GET /videos?channelIds=...`는 YouTube 영상만 반환합니다.
- `docType: discovery_link`, `docType: scrapbook`, `docType: video_user_record` 문서는 반환하지 않습니다.
- discovery link는 `/discovery-links`에서만 조회합니다.

장점:

- 사용자 화면에 잘못된 문서가 섞일 위험이 낮습니다.
- 프론트에서 방어 코드를 많이 만들 필요가 없습니다.
- 현재 "저장 영상 불러오기 = DB 조회" 원칙을 유지합니다.

단점:

- 백엔드 쿼리 조건 확인이 필요합니다.
- 기존 video 문서의 `docType` 유무를 조심해야 합니다.

비용/속도/확장성/유지보수 영향:

- 비용: 낮음.
- 속도: 중간. 백엔드 확인 필요.
- 확장성: 좋음.
- 유지보수: 좋음.

### 선택지 B: 프론트에서 받은 뒤 필터링

백엔드가 섞어서 보내도 프론트에서 YouTube 영상만 걸러냅니다.

장점:

- 백엔드 수정이 줄어들 수 있습니다.

단점:

- 잘못된 데이터가 네트워크로 이미 내려옵니다.
- 화면마다 방어 코드가 늘어납니다.
- `/videos` 원칙이 흐려집니다.

비용/속도/확장성/유지보수 영향:

- 비용: 낮음.
- 속도: 빠름.
- 확장성: 낮음.
- 유지보수: 낮음.

### 선택지 C: 발견함은 처음부터 별도 container

`discovery_links` container를 새로 만들어 물리적으로 분리합니다.

장점:

- 가장 깨끗하게 분리됩니다.
- `/videos`와 섞일 위험이 거의 없습니다.

단점:

- 이번 MVP의 "새 container를 바로 만들지 않는다" 기준과 다릅니다.
- DB schema/infra 판단이 커집니다.

비용/속도/확장성/유지보수 영향:

- 비용: 중간.
- 속도: 느림.
- 확장성: 좋음.
- 유지보수: 좋지만 지금은 과함.

Codex 추천:

- **선택지 A: 백엔드에서 `/videos`는 YouTube 영상 문서만 반환**을 추천합니다.

---

## 5. 선택지 3: 발견함 첫 화면 흐름

### 선택지 A: 최소 발견함

첫 화면은 링크 저장과 검토만 다룹니다.

필드:

- URL
- 제목
- 메모
- 플랫폼
- `status`
- `rightsStatus`

주요 버튼:

- 링크 추가
- 링크 열기
- 확인 중
- 보관
- 제작 후보 표시
- 제외
- 권리 상태 변경
- 삭제

준비중으로 둘 기능:

- 제작 칸반으로 실제 전송
- 로컬 파일 연결
- 자동 메타데이터 가져오기
- AI 요약

장점:

- 가장 안전합니다.
- 실제 사용자가 당장 링크를 잃어버리지 않게 합니다.
- 무단 수집 위험이 없습니다.
- Cloud 저장 기준을 먼저 만들 수 있습니다.

단점:

- 자동 썸네일/제목 수집이 없어 처음에는 수동 입력이 많습니다.
- 제작 후보와 완전히 연결되지는 않습니다.

비용/속도/확장성/유지보수 영향:

- 비용: 낮음.
- 속도: 좋음.
- 확장성: 좋음.
- 유지보수: 좋음.

### 선택지 B: 제작 후보 연결 포함

발견 링크를 바로 제작 후보로 보내는 흐름까지 1차에 포함합니다.

장점:

- 소재 발견에서 제작으로 이어지는 느낌이 강합니다.

단점:

- 현재 `production_candidates` 별도 DB가 없습니다.
- YouTube 영상 기반 제작 칸반과 외부 링크 기반 제작 후보가 섞일 수 있습니다.
- 1차 MVP 범위가 커집니다.

비용/속도/확장성/유지보수 영향:

- 비용: 중간.
- 속도: 느림.
- 확장성: 중간.
- 유지보수: 중간에서 낮음.

### 선택지 C: 로컬 파일 메모 카드 포함

링크와 함께 "내 컴퓨터에 파일 있음" 메모까지 1차에 포함합니다.

장점:

- 실제 소재 수집 흐름과 가깝습니다.

단점:

- 파일 본문 저장, 파일 경로, 출처 연결 기준을 사용자가 오해할 수 있습니다.
- local assets 모델이 아직 목표 설계 단계입니다.
- 1차 MVP 범위가 커집니다.

비용/속도/확장성/유지보수 영향:

- 비용: 중간.
- 속도: 느림.
- 확장성: 좋지만 지금은 과함.
- 유지보수: 중간.

Codex 추천:

- **선택지 A: 최소 발견함**을 추천합니다.

---

## 6. 결정된 조합

추천 조합:

1. API endpoint: `/discovery-links`
2. `/videos` 분리: 백엔드에서 YouTube 영상 문서만 반환
3. 첫 화면: 최소 발견함

이 조합의 의미:

- 저장 위치는 기존 Cloud DB의 `docType: discovery_link`로 작게 시작합니다.
- API 이름은 `/discovery-links`로 분리해 사용자가 영상 조회와 혼동하지 않게 합니다.
- `/videos`는 계속 저장된 YouTube 영상만 조회합니다.
- 발견함은 수동 링크 저장, 메모, 상태 변경까지만 1차로 구현합니다.
- 제작 후보 연결, 로컬 파일 연결, 자동 메타데이터 수집은 후속 작업으로 둡니다.

---

## 7. 반영된 결정

아래 조합은 승인되어 1차 MVP에 반영되었습니다.

1. 발견함 API 이름은 `/discovery-links`입니다.
2. `/videos`는 YouTube 영상만 반환하고, discovery link는 백엔드에서 분리합니다.
3. 발견함 첫 화면은 "최소 발견함"으로 시작하고, 제작 후보 전송/로컬 파일/자동 메타데이터는 아직 확장하지 않습니다.

---

## 8. 결정 후 예상 작업 단위

결정이 내려진 뒤에도 한 번에 크게 만들지 않습니다.

### Issue A. 백엔드 discovery links 최소 API

- 목적: 수동 링크 저장 데이터를 Cloud에 저장/조회/수정/삭제합니다.
- 범위: `GET/POST/PATCH/DELETE /discovery-links`
- 저장 후보: 기존 Cloud DB `videos` container 안의 `docType: discovery_link`
- 반드시 지킬 것: `/videos` 저장 영상 조회에 discovery link 문서가 섞이지 않게 함
- 위험도: 중간. 새 endpoint 추가가 필요함

### Issue B. 프론트 discovery links API client

- 목적: 프론트에서 `/discovery-links`를 호출할 함수를 추가합니다.
- 범위: `src/services/functionApi.js`에 discovery link 함수 추가
- 반드시 지킬 것: 기존 `/videos`, `/scrapbook`, `/video-records` 함수 의미 변경 금지
- 위험도: 낮음에서 중간

### Issue C. 발견함 최소 화면

- 목적: 사용자가 외부 링크를 수동 저장하고 상태를 바꿀 수 있게 합니다.
- 범위: 링크 입력, 목록, 상태 변경, 권리 상태 변경, 삭제
- 반드시 지킬 것: 자동 크롤링, 자동 다운로드, AI 분석 금지
- 위험도: 중간

### Issue D. UI 문구 점검

- 목적: "저장 영상 불러오기"와 "발견 링크 저장"을 사용자가 혼동하지 않게 합니다.
- 범위: 버튼명, 안내 문구, 준비중 표시
- 반드시 지킬 것: 비용성 작업처럼 보이지 않게 구분
- 위험도: 낮음

---

## 9. 지금 하지 말아야 할 것

- 새 `discovery_links` Cosmos container 생성
- `/videos` endpoint 의미 변경
- discovery link 문서를 `/videos` 응답에 포함
- localStorage only MVP
- 인스타 자동 크롤링
- 외부 사이트 자동 다운로드
- 링크 메타데이터 자동 수집
- 로컬 파일 업로드
- 제작 후보 DB 생성
- AI 분석 연결

---

## 10. 최종 판정

현재 발견함은 1차 MVP 부분 구현 단계입니다.

반영된 기준은 **`/discovery-links` API + 기존 Cloud DB `docType: discovery_link` 저장 + 최소 발견함 화면**입니다.

이 방식은 새 container를 만들지 않으면서도, 사용자가 저장 영상 조회와 발견 링크 저장을 혼동하지 않게 하는 가장 안전한 MVP 경로입니다.
