# 타임머신 CRM - 작업 히스토리

> 이 문서는 프로젝트 변경사항을 시간순으로 기록하기 위한 작업 로그입니다.
> 코드와 문서가 왜 바뀌었는지, 나중에 다시 이어서 작업할 때 맥락을 잃지 않도록 남깁니다.

---

## 2026-06-27

### 1. GitHub 연결 및 저장소 확인

- GitHub Connector 연결 확인
- GitHub 계정: `babooc7579-creator`
- 대상 저장소: `babooc7579-creator/yt-analyzer`
- 저장소 상태: Private
- 기본 브랜치: `main`
- 권한: admin / push / pull 가능

확인된 관련 저장소:

- `babooc7579-creator/my-chat-app`
- `babooc7579-creator/yt-analyzer`
- `babooc7579-creator/yt-analyzer-functions`
- `babooc7579-creator/creator-os`

---

### 2. 기존 프로젝트 구조 확인

확인된 주요 파일:

```txt
yt-analyzer/
├─ README.md
├─ package.json
├─ index.html
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   └─ index.css
```

확인된 기술 스택:

- React
- Vite
- TailwindCSS
- lucide-react
- Azure Function API
- YouTube Data API v3

---

### 3. 앱 설계 문서 추가

파일:

```txt
docs/APP_BLUEPRINT.md
```

커밋:

```txt
docs: add app blueprint
```

커밋 SHA:

```txt
3d86e6cf0695a1cbce9dbd7eba17c2dc87bd0aa1
```

내용:

- 앱의 핵심 목적 정리
- 사용자 기본 흐름 정리
- 대시보드 / 채널 관리 / 영상 발굴 / 또터또 / 스크랩북 / 설정 화면 설계
- UI 톤앤매너 정리
- 초기 개발 우선순위 정리

---

### 4. README 업데이트

파일:

```txt
README.md
```

커밋:

```txt
docs: update project README
```

커밋 SHA:

```txt
5a5528de0579e7dbc6ff80549d0c16a68faa8778
```

내용:

- 프로젝트 소개 보강
- 현재 기능 목록 정리
- 로컬 실행 방법 정리
- Azure Static Web Apps 배포 설정 정리
- 장기 개발 방향 정리

---

### 5. 설정 파일 추가

파일:

```txt
src/config.js
```

커밋:

```txt
refactor: add app config file
```

커밋 SHA:

```txt
969d1e8133b3a4489fae5e30d02105bfbd8f6967
```

내용:

- `FUNCTION_API_BASE` 분리
- `YOUTUBE_API_BASE` 분리
- API Key 같은 민감 정보는 저장하지 않도록 주석 추가

주의:

- 아직 `App.jsx`에서 `config.js`를 import하도록 연결하지는 않았음
- 다음 코드 작업에서 App.jsx 상단 정리 필요

---

### 6. 구조 설계서 추가

파일:

```txt
docs/ARCHITECTURE.md
```

커밋:

```txt
docs: add architecture plan
```

커밋 SHA:

```txt
b45b10b9055323cff64e1b2a0500ba5f885355d6
```

내용:

- 기존 핵심 기능 보존 기준 정리
- 최종 폴더 구조 설계
- App.jsx의 최종 역할 정의
- 화면별 역할 정의
- 데이터 흐름 설계
- 리팩터링 순서 정리
- 피해야 할 구조 정리

---

## 현재까지의 큰 방향

현재까지는 실제 기능 코드를 크게 바꾸지 않고, 먼저 프로젝트의 기준 문서를 만들었습니다.

완료된 것:

```txt
1. 앱 설계도 작성
2. README 정리
3. 설정 파일 추가
4. 구조 설계서 작성
5. 작업 히스토리 문서 추가
```

아직 진행 전:

```txt
1. 오래된 문서와 현재 구현 상태 차이 정리
2. 결정이 필요한 큰 작업의 선택지 보고
3. 기능 동작을 바꾸지 않는 작은 컴포넌트/helper 정리
4. 저장 영상 페이지네이션, scan/API 사용 기록, local assets 같은 큰 변경은 별도 판단 후 진행
```

---

## 작업 원칙

- 기존 기능을 한 번에 갈아엎지 않는다.
- 문서 → 작은 코드 변경 → 확인 → 다음 변경 순서로 진행한다.
- 핵심 기능은 보존한다.
- App.jsx를 점진적으로 얇게 만든다.
- API 호출, 프롬프트 생성, 포맷 함수, 화면 UI를 분리한다.
- 변경 이유와 다음 작업을 항상 기록한다.

---

## 2026-07-06

### 1. 현재 구현 상태 기준 갱신

현재 앱은 초기 `App.jsx` 집중 구조에서 많이 분리된 상태입니다.

확인된 현재 구조:

```txt
src/App.jsx
```

- 현재 13줄 수준의 얇은 연결 파일입니다.
- `CreatorAppLayout`, `CreatorAppRoutes`, `useCreatorAppController`만 연결합니다.
- 실제 화면/상태/데이터 흐름은 `src/components`, `src/hooks`, `src/utils`, `src/services`, `src/constants`로 나뉘어 있습니다.

최근 정리된 기준:

- Cloud DB와 localStorage 역할 구분
- `videoUserRecords`의 기존 `status` 유지 + `statusIds` 보존
- 발견함 `discovery_link` MVP
- 제작 후보함의 영상 후보/링크 후보 표시
- DB 조회와 YouTube API 호출 문구 구분
- 권리 상태는 사용자가 붙이는 표시이며, 사용 허가나 권리 확인 완료를 의미하지 않음

### 2. 2026-07-06 안전 개선 묶음

최근 작업은 기능 동작을 바꾸지 않고 사용자 혼동을 줄이는 방향으로 진행했습니다.

완료된 작업:

- 사용 금지 발견 링크를 제작 후보로 보낼 때 권리 확인 완료가 아님을 명확히 표시
- 발견 링크를 후보에서 되돌리거나 제외할 때 링크 기록은 삭제되지 않는다고 안내
- 발견함의 `권리 확인` 표현을 `권리 상태` 중심으로 정리
- 카테고리 도움말에서 이름 변경과 숨김의 실제 의미 구분
- 영상 필터와 채널 라벨의 기호/이모지 표현을 일반 텍스트로 정리
- `CREATOR_OS_NEXT_IMPLEMENTATION_ISSUES.md`에 2026-07-06 후속 상태 반영

주의:

- API endpoint 변경 없음
- DB schema 변경 없음
- localStorage key 변경 없음
- package.json 변경 없음
- YouTube API 호출량 증가 없음

### 3. 다음 결정이 필요한 큰 작업

아래는 바로 구현하지 않고 선택지 보고가 먼저 필요합니다.

- `/videos` 페이지네이션 구현 방식
- `scan_logs` / `api_quota_logs` 저장 방식
- `local_assets` API 또는 로컬 파일 메타데이터 모델
- `production_candidates` 별도 저장소 도입
- 테스트 러너 추가를 위한 `package.json` 변경
- 배포 workflow 경고 정리
