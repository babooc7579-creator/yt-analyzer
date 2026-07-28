# 타임머신 CRM - 구조 설계서

> 이 문서는 타임머신 CRM / Creator OS의 현재 구조와 장기 구조 방향을 함께 정리한 설계서입니다.
> 기존 기능은 보존하고, 수정과 확장이 쉬운 Creator OS형 구조를 유지하는 것이 목표입니다.

---

## 1. 핵심 방향

타임머신 CRM은 단순한 유튜브 조회 앱이 아니라, 크리에이터가 매일 사용하는 소재 발굴 OS입니다.

핵심 흐름은 다음과 같습니다.

```txt
채널 등록 → 데이터 수집 → 영상 발굴 → 또터또 판단 → 스크랩/발견함 → 제작 후보 → 리메이크 기획
```

앞으로의 개발은 기존 기능을 버리는 것이 아니라, 이 흐름에 맞게 역할을 나누고 화면을 재배치하는 방식으로 진행합니다.

---

## 2. 기존 코드에서 반드시 보존할 기능

- 채널 등록
- 채널 미리보기
- 채널 일괄 추가
- 태그/카테고리/언어/채널 등급/운영 상태 관리
- Azure Function API 연동
- 클라우드 채널 목록 불러오기
- 채널 스캔 요청
- 수집된 영상 조회
- 쇼츠/롱폼 구분
- 조회수/성과배수/일조회수/좋아요 비율 정렬
- 6개월 이상 지난 영상 기반 또터또 발굴
- 댓글 Top 10 조회
- Cloud 기준 영상 스크랩
- 영상별 사용자 판단 기록
- 발견 링크 수동 저장
- 발견 링크 제작 후보 연결
- 제작 후보함
- AI 리메이크 프롬프트 복사

---

## 3. 현재 폴더 구조 기준

현재 프론트엔드는 이미 `App.jsx` 중심 구조에서 많이 분리되어 있습니다.

```txt
src/
├─ App.jsx
├─ main.jsx
├─ config.js
├─ constants/
├─ hooks/
├─ services/
│  ├─ channelApi.js
│  ├─ discoveryLinksApi.js
│  ├─ functionApi.js
│  ├─ functionApiClient.js
│  ├─ scanApi.js
│  ├─ scrapbookApi.js
│  ├─ videoRecordsApi.js
│  ├─ youtubeApi.js
│  └─ storage.js
│
├─ components/
├─ utils/
└─ index.css
```

현재 기준:

- `src/App.jsx`는 얇은 연결 파일입니다.
- `src/hooks`는 채널, 영상, 스크랩북, 발견함, 제작 후보, 라우트 조립 같은 상태 흐름을 담당합니다.
- `src/components`는 실제 화면 조각을 담당합니다.
- `src/utils`는 화면 props, 문구, 계산, 분류, 포맷팅을 담당합니다.
- `src/services`는 Cloud Function, YouTube API, localStorage 보조 저장 접근을 담당합니다.
- `src/constants`는 메뉴, 상태값, 옵션, 문구 상수를 담당합니다.

장기적으로 `features/` 폴더를 도입할 수는 있지만, 지금은 이미 작동하는 구조를 크게 옮기지 않고 현재 분리 방향을 유지합니다.

---

## 4. App.jsx의 최종 역할

`App.jsx`는 전체 기능을 직접 처리하지 않습니다.

최종적으로 App.jsx는 다음 역할만 담당합니다.

- 앱 레이아웃 연결
- 현재 화면 선택
- 공통 알림/에러 표시
- 전역 상태 최소 연결

현재 기준으로 App.jsx에서 큰 책임은 대부분 제거되었습니다. 앞으로도 App.jsx에 다시 아래 책임이 쌓이지 않도록 주의합니다.

- API 호출
- 영상 필터링/정렬
- 프롬프트 생성
- 채널 폼 전체 구현
- 영상 카드 반복 UI
- localStorage 직접 제어

---

## 5. 화면 구조

```txt
Topbar
└─ 앱 이름 / 현재 작업 / 연결 상태 / 빠른 실행

Sidebar
├─ 오늘 레이더 / 홈
├─ 채널 목록 / 채널 등록
├─ 수집 영상 목록
├─ 발견함 / 링크 수집
├─ 스크랩북 / 참고 보관함
├─ 제작 후보함
├─ 대본 작업실
├─ 업로드 캘린더
├─ 개선 기록
└─ 준비중 메뉴

Main Content
└─ 선택된 기능 화면
```

---

## 6. 화면별 역할

### 오늘 레이더 / 홈

앱의 관제실입니다. 오늘 볼 후보, 저장된 데이터 현황, 제작 후보와 발견 링크 후보를 빠르게 보여줍니다.

- 등록 채널 수
- 수집 영상 수
- 오늘 레이더 후보
- 제작 후보 수
- 발견 링크 후보 수
- 다음 행동 버튼

### 채널 관리

수집 대상 채널을 관리합니다.

- 단일 채널 추가
- 일괄 채널 추가
- 채널 미리보기
- 태그/언어 지정
- 채널 메모
- 태그별 채널 목록
- 스캔 실행

### 영상 발굴

수집된 영상에서 좋은 소재를 찾습니다.

- 키워드 검색
- 조회수 필터
- 쇼츠/롱폼 필터
- 정렬 옵션
- 영상 카드
- 댓글 분석
- 스크랩
- AI 프롬프트 복사

### 또터또 모드

오래됐지만 다시 쓸 수 있는 떡상 소재를 찾습니다.

- 180일 이상 지난 영상
- 채널 평균 대비 높은 성과
- 리메이크 가능성 높은 제목 구조
- 댓글 반응이 강한 영상
- 향후 점수화 예정

### 스크랩북

발굴한 소재를 저장하고 제작 후보로 이어갑니다.

- 스크랩 영상 목록
- 메모
- 원본 바로가기
- AI 프롬프트 복사
- 제작 후보로 표시

### 발견함

외부에서 찾은 URL을 수동 저장합니다.

- URL 수동 저장
- 제목/메모
- 발견 링크 상태
- 권리 상태
- 제작 후보함 연결
- 자동 크롤링/자동 다운로드 없음

### 제작 후보함

실제로 만들 후보를 확인합니다.

- 저장 영상 후보
- 발견 링크 후보
- 원본 링크, 제목 초안, 제작 메모, 업로드 예정일 준비 여부
- 권리 확인/일정/후보 수 기준 우선 확인 안내

### 대본 작업실

제작 후보의 원본을 분석하고 구성·작성·수정하는 작업에 집중합니다.

- 제작 후보함과 동일한 Cloud `videoUserRecords` 사용
- `draftTitle`: 내가 만들 제목
- `note`: 작업 메모와 대본 초안을 함께 적는 현재 MVP 통합 입력
- `targetPublishDate`: 업로드 예정일
- 명시적 Cloud 저장과 저장 성공/실패 표시
- 검색, 진행 단계 필터, 오늘 집중 작업 표시
- 제작 후보함과 업로드 캘린더 왕복 연결
- 화면 표시와 이동만으로 YouTube API 호출 없음

현재 분석, 구성, 대본 본문, 수정 이력, 대본 상태는 별도 필드로 분리되지 않았습니다.
백엔드는 `draftTitle`, `note`, `targetPublishDate`만 대본 관련 값으로 보존하므로 새 저장 필드는 프론트와 백엔드 계약을 함께 승인한 뒤 추가합니다.
현재 별도 대본 저장소, 새 endpoint, 자동 저장, AI 생성 기능은 없습니다.

### 개선 기록

기능별 현재 상태, 목표 방향, 체크포인트, 다음 작업과 결정 필요 사항을 읽기 전용으로 표시합니다.

- 화면: `인사이트 / 학습 → 개선 기록`
- 기록 원본: `src/constants/improvementLog.js`
- 운영 기준: `docs/CREATOR_OS_IMPROVEMENT_LOG.md`
- Git 커밋과 Pull Request로 변경 추적
- API 호출, Cloud 조회·저장, YouTube 신규 수집 없음

### 설정

기술 설정과 연결 상태를 모읍니다. 2026-07-15 기준 독립 설정 메뉴의 1차 화면이 연결됐습니다.

- 채널 분야 목록 관리
- 숨긴 기본 분야/Cloud 태그의 브라우저 화면 목록 복원
- localStorage 화면 목록과 Cloud 채널 태그의 차이 안내
- Azure Function API Base URL
- 저장 영상 DB 조회와 YouTube API 수집 구분
- 댓글 Top 10용 사용자 YouTube API Key 입력과 메모리 보관 원칙
- Cloud 기록 동기화 경고, 현재 화면 오류, GitHub Actions 배포 확인 경로
- 기존 `GET /channels`를 이용한 수동 재조회와 오류 유형별 다음 행동 안내

CORS의 정확한 원인 자동 판별, 로컬 실행 진단, Azure 리소스 상태 자동 확인은 후속 범위입니다.

---

## 7. 데이터 흐름

### 채널 데이터

```txt
ChannelsPage → useCloudChannels / useChannelActions → services/channelApi.js → Azure Function → Cosmos DB
```

### 영상 데이터

```txt
VideosPage → useVideoCollectionActions / useVideoUserRecords → services/videoRecordsApi.js 또는 services/scanApi.js → Azure Function → Cosmos DB
```

중요:

- 저장 영상 불러오기는 Cloud DB 조회입니다.
- 새 영상 수집은 YouTube API 호출과 DB 갱신이 발생할 수 있습니다.
- 채널 선택만으로 YouTube API를 새로 호출하지 않는 방향을 유지합니다.

### 댓글 데이터

```txt
VideoCard → services/youtubeApi.js → YouTube Data API → CommentModal
```

### 스크랩북 데이터

```txt
ScrapbookPage → useScrapbook → services/scrapbookApi.js → Azure Function → Cosmos DB
```

현재 스크랩북은 Cloud DB를 기준 데이터로 봅니다. 백엔드에서는 별도 `scrapbook` container가 아니라 `videos` container 안의 `docType: scrapbook` 문서로 저장합니다.

`localStorage`는 기준 저장소가 아니라 Cloud 연결 실패 시 임시 fallback과 기존 데이터 보호 용도로만 유지합니다. Cloud 조회가 성공하면 Cloud 응답이 기준이며, localStorage와 자동 병합하지 않습니다.

### 발견 링크 데이터

```txt
DiscoveryLinksPage → useDiscoveryLinks → services/discoveryLinksApi.js → Azure Function → Cosmos DB
```

현재 발견 링크는 별도 `discovery_links` container가 아니라 기존 Cloud DB의 `videos` container 안에 `docType: discovery_link` 문서로 저장합니다.

### 제작 후보 데이터

```txt
ProductionKanban → videoUserRecords + discovery links status:candidate
```

현재 별도 `production_candidates` 저장소는 없습니다. 저장 영상 후보는 영상별 판단 기록을 사용하고, 발견 링크 후보는 발견함 상태값을 사용합니다.

---

## 8. 리팩터링 순서

한 번에 갈아엎지 않고 아래 순서로 진행합니다.

1. 완료된 분리 구조를 유지합니다.
2. 새로운 로직은 먼저 `utils` 또는 작은 hook으로 분리합니다.
3. 새 화면 조합은 관련 테스트를 먼저 보강합니다.
4. 공통 UI는 반복이 실제로 생겼을 때만 분리합니다.
5. `App.jsx`를 다시 두껍게 만들지 않습니다.
6. DB/API/localStorage 의미가 바뀌는 작업은 별도 선택지 보고 후 진행합니다.
7. 전체 폴더 대이동은 지금 하지 않습니다.

---

## 9. 피해야 할 구조

- 모든 기능을 App.jsx에 계속 추가
- 화면 컴포넌트에서 fetch 직접 호출
- 카드/버튼/모달을 여러 곳에 복붙
- API 주소를 여러 파일에 흩뿌림
- 프롬프트 문장을 UI 코드 안에 길게 작성
- 또터또 판단 기준을 화면 코드에 섞어둠
- localStorage를 여러 컴포넌트에서 직접 만짐
- 발견 링크, 제작 후보, 스크랩북을 실제 저장소 구조와 다르게 표현
- 준비중 기능을 실제 동작하는 기능처럼 표현

---

## 10. 최종 목표

타임머신 CRM은 다음 질문에 빠르게 답해야 합니다.

1. 오늘 어떤 채널에서 좋은 소재가 나왔는가?
2. 어떤 영상이 평소보다 훨씬 잘 터졌는가?
3. 오래됐지만 다시 쓸 수 있는 또터또 소재는 무엇인가?
4. 이 소재를 한국형 쇼츠/롱폼으로 바꾸면 어떤 제목과 대본이 나오는가?
5. 내가 저장한 소재 중 제작할 것은 무엇인가?
6. 외부에서 발견한 링크 중 제작 후보로 검토할 것은 무엇인가?

---

## 한 줄 결론

기존 핵심 기능은 보존하고, 현재의 hooks/components/services/utils 분리 구조를 깨지 않으면서 Cloud 기준 데이터, 안전한 화면 흐름, 명확한 버튼 문구를 쌓아 Creator OS형 구조로 발전시킵니다.
