# Creator OS 테스트 전략 선택지 보고서

작성일: 2026-07-06

중요: 이 문서는 선택지 보고서입니다. 코드, API, DB schema, localStorage key, package.json, GitHub Actions workflow를 변경하지 않습니다.

---

## 1. 현재 기준 사실

현재 프론트 저장소의 확인된 상태:

- 2026-07-06 사용자 승인 후 `vitest`를 devDependency로 추가했습니다.
- `package.json`에는 `test: vitest run` 스크립트가 있습니다.
- `jest`, `playwright`, `@testing-library/react` 같은 브라우저/컴포넌트 테스트 도구는 설치되어 있지 않습니다.
- `.github/workflows/build.yml`은 `npm ci` 후 `npm run build`만 실행합니다.
- `package-lock.json`은 존재합니다.
- 현재 검증은 `npm.cmd test`, `npm.cmd run build`, `git diff --check`, GitHub Actions build check에 의존합니다.

현재 의미:

- 앱이 빌드되는지는 확인할 수 있습니다.
- 일부 helper 함수가 값을 제대로 계산하는지는 자동 테스트로 확인할 수 있습니다.
- 버튼 클릭 후 UI 상태까지는 아직 자동 테스트로 확인하지 않습니다.
- GitHub Actions에서 `npm test`를 실행하려면 workflow 변경 결정이 추가로 필요합니다.

---

## 2. 왜 테스트 전략이 필요한가

Creator OS는 지금 데이터 기준과 상태 기준을 안정화하는 단계입니다.

특히 아래 기능은 깨지면 사용자가 바로 불편해집니다.

- 저장 영상 불러오기와 새 영상 수집 구분
- Cloud 저장 성공/실패 처리
- `videoUserRecords`의 `status` / `statusIds` 보존
- 스크랩북 Cloud 우선 + localStorage fallback
- 발견함 링크 상태와 `rightsStatus`
- 제작 후보함에서 영상 후보와 링크 후보 표시
- URL 복사, 필터, 정렬, 후보 제외 같은 반복 작업

테스트는 "기능을 더 빨리 많이 만들기"보다 "이미 쌓은 기능을 덜 깨뜨리기" 위한 안전장치입니다.

---

## 3. 선택지 A: 현재처럼 build 검증만 유지

### 내용

- 새 테스트 도구를 추가하지 않습니다.
- 계속 `npm.cmd run build`, `git diff --check`, GitHub Actions build check만 사용합니다.

### 장점

- 가장 빠릅니다.
- 새 라이브러리와 package 변경이 없습니다.
- 현재 작업 흐름을 바꾸지 않습니다.

### 단점

- 화면 동작이나 상태 계산이 깨져도 빌드가 통과할 수 있습니다.
- 리팩터링이 많아질수록 수동 확인 부담이 커집니다.
- 비개발자인 사용자가 직접 확인해야 하는 일이 많아집니다.

### 적합한 시점

- 문구 수정, 문서 작업, 아주 작은 UI 조정만 할 때.

---

## 4. 선택지 B: Vitest로 작은 유틸/상태 계산 테스트부터 시작

### 내용

- `vitest`를 devDependency로 추가합니다.
- 먼저 React 화면 테스트가 아니라 순수 함수 테스트부터 시작합니다.
- 예: 필터/정렬, 상태 helper, URL 정규화, 발견 링크 컬렉션, production kanban 데이터 계산.

### 장점

- 비교적 가볍습니다.
- UI 전체를 띄우지 않아도 핵심 계산을 자동 확인할 수 있습니다.
- 작은 helper 테스트는 리팩터링 안전망으로 효과가 큽니다.
- package 변경은 있지만 Playwright보다 도입 부담이 낮습니다.

### 단점

- `package.json`과 `package-lock.json` 변경이 필요합니다.
- GitHub Actions에 `npm test`를 추가할지 별도 결정이 필요합니다.
- 실제 브라우저 클릭/화면 렌더링까지 확인하지는 못합니다.

### 적합한 시점

- 상태 계산과 helper가 충분히 분리된 지금 시점에 가장 현실적입니다.

---

## 5. 선택지 C: React Testing Library까지 도입

### 내용

- Vitest에 더해 React 컴포넌트 테스트 도구를 도입합니다.
- 버튼 클릭, 안내 문구 표시, disabled 상태 등을 컴포넌트 단위로 확인합니다.

### 장점

- 사용자가 보는 UI 동작을 더 직접적으로 확인할 수 있습니다.
- Cloud 저장 실패 안내, 후보 버튼 disabled 상태 같은 화면 조건을 검증하기 좋습니다.

### 단점

- 설정과 테스트 코드가 늘어납니다.
- 현재 UI가 계속 변하는 단계에서는 테스트 유지보수 비용이 생길 수 있습니다.
- 새 devDependency가 더 늘어납니다.

### 적합한 시점

- 주요 화면 구조가 조금 더 안정된 뒤.

---

## 6. 선택지 D: Playwright로 브라우저 E2E 테스트 도입

### 내용

- 실제 브라우저를 띄워 앱을 클릭하는 테스트를 만듭니다.
- 예: 홈 → 채널 선택 → 저장 영상 불러오기 버튼 상태 확인.

### 장점

- 실제 사용자 흐름에 가장 가깝게 검증할 수 있습니다.
- 배포 전 화면 깨짐이나 중요한 버튼 누락을 잡기 좋습니다.

### 단점

- 가장 무겁습니다.
- CI 시간이 늘어날 수 있습니다.
- 테스트 데이터, API mock, 로그인/환경변수 처리 전략이 필요합니다.
- 지금 단계에서 바로 도입하면 기능 개발 속도를 늦출 수 있습니다.

### 적합한 시점

- 1차 MVP 화면 흐름이 더 고정된 뒤.

---

## 7. Codex 추천

현재 추천은 **선택지 B: Vitest로 작은 유틸/상태 계산 테스트부터 시작**입니다.

이유:

- 현재 앱은 이미 `utils`와 `hooks` 분리가 많이 진행됐습니다.
- 먼저 순수 함수 테스트를 붙이면 UI 대개편 없이도 안전망을 만들 수 있습니다.
- `videoUserRecords`, discovery links, production kanban, URL/필터/정렬 helper는 테스트 효과가 큽니다.
- Playwright나 React Testing Library보다 도입 부담이 낮습니다.

2026-07-06에 선택지 B가 1차 승인되어 Vitest와 순수 함수 테스트를 추가했습니다.

아직 하지 않은 것:

- GitHub Actions에 `npm test` step 추가
- React Testing Library 도입
- Playwright 도입

---

## 8. 첫 테스트 후보

선택지 B 1차 적용 기준으로 첫 테스트는 아래 순서에서 시작했습니다.

1. `src/utils/discoveryLinkForm.js`
   - URL 정규화
   - 사용 금지 링크를 후보로 보낼 때 확인 필요 여부
   - 1차 테스트 추가 완료

2. `src/utils/discoveryLinkCollection.js`
   - 응답에서 링크 목록 꺼내기
   - 링크 추가/교체/삭제
   - 상태 변경 완료 메시지
   - 1차 테스트 추가 완료

3. `src/utils/videoUserRecords.js`
   - 기존 `status` 유지
   - `statusIds` fallback/보존
   - 레이더 숨김 상태 처리
   - 1차 테스트 추가 완료

4. `src/utils/productionKanbanData.js`
   - 제작 후보 영상 그룹
   - 발견 링크 후보 수
   - 권리 상태 경고 수
   - 1차 테스트 추가 완료

5. `src/utils/videoCollection.js`
   - 저장 영상 조회/새 영상 수집 메시지 구분
   - 스캔 대상 채널 계산
   - 새 영상 수집 결과 요약
   - 1차 테스트 추가 완료

6. `src/utils/video.js`
   - 영상 검색/필터/정렬
   - 터또터 후보 조건
   - 쇼츠/롱폼 길이 구분
   - 1차 테스트 추가 완료

7. `src/utils/creatorOsMetrics.js`
   - 홈/레이더 요약 숫자
   - 스크랩/제작 후보 개수
   - Cloud 태그와 화면 카테고리 차이 계산

---

## 9. 지금 하지 말아야 할 것

- 바로 Playwright E2E부터 시작하기
- 테스트 도입과 UI 대개편을 한 PR에 섞기
- 테스트 도입과 DB schema 변경을 한 PR에 섞기
- 실제 YouTube API를 호출하는 테스트 만들기
- Cloud DB 실제 데이터를 바꾸는 테스트 만들기
- GitHub Actions workflow를 승인 없이 바꾸기

---

## 10. 결정이 필요한 질문

테스트 도구 1차 도입은 완료되었습니다. 다음 단계에서는 아래 결정이 필요합니다.

1. GitHub Actions에서 `npm test`를 바로 실행할까요, 아니면 로컬 테스트만 유지할까요?
2. React 컴포넌트 테스트 도구를 추가할까요?
3. Playwright 같은 브라우저 E2E 테스트를 나중에 도입할까요?

Codex 추천:

- GitHub Actions에는 1차 테스트가 안정된 뒤 `npm test` 추가
- 다음 테스트도 순수 함수 중심으로 조금 더 늘린 뒤 CI 연결
