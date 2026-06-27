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
1. App.jsx에서 config.js import 적용
2. constants 분리
3. utils 분리
4. services 분리
5. components 분리
6. features 화면 분리
```

---

## 작업 원칙

- 기존 기능을 한 번에 갈아엎지 않는다.
- 문서 → 작은 코드 변경 → 확인 → 다음 변경 순서로 진행한다.
- 핵심 기능은 보존한다.
- App.jsx를 점진적으로 얇게 만든다.
- API 호출, 프롬프트 생성, 포맷 함수, 화면 UI를 분리한다.
- 변경 이유와 다음 작업을 항상 기록한다.
