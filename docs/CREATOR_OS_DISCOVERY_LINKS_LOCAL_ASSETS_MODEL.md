# Creator OS discovery links / local assets 모델 초안

작성일: 2026-07-02

이 문서는 Creator OS v2.2 목표 중 `discovery_links`와 `local_assets`의 목표 모델을 정리합니다. `discovery_links`는 1차 MVP가 부분 구현되었고, `local_assets`는 아직 구현되지 않았습니다.

중요: 이 문서는 목표 모델 문서입니다. 구현된 것과 목표 설계를 구분합니다. API, DB schema, localStorage key, UI 흐름 변경은 별도 작업에서 판단합니다.

이 문서는 발견함 확장 전 확인할 `DISCOVERY_LINKS_MODEL` 기준 문서 역할도 합니다. 1차 MVP는 local assets보다 `수동 링크 저장 발견함`을 먼저 다루며, 현재 수동 링크 저장은 부분 구현되어 있습니다.

1차 MVP 범위와 선택지는 `CREATOR_OS_DISCOVERY_LINKS_MVP_SCOPE.md`를 기준으로 확인합니다.

---

## 1. 현재 기준 사실

아래 내용은 2026-07-03 기준입니다.

- `discovery_links` 별도 Cosmos container는 없습니다.
- `/discovery-links` API는 존재하며, 기존 `videos` container 안의 `docType: discovery_link` 문서로 저장합니다.
- `local_assets` 저장소는 없습니다.
- discovery links 관련 API는 1차 MVP 범위로 구현되었습니다.
- local assets 관련 API는 없습니다.
- 인스타/외부 링크 수동 저장 기능은 1차 MVP 범위로 부분 구현되어 있습니다.
- 새 discovery link 저장 시 `platform`은 URL 문자열 기준으로 추정해 Cloud에 저장합니다.
- 백엔드는 `youtube`, `instagram`, `tiktok`, `web`, `unknown` 플랫폼 값을 허용하고, 없거나 잘못된 값은 URL 기준으로 다시 추정합니다.
- 로컬 파일과 원본 링크를 연결하는 기능은 아직 구현되어 있지 않습니다.
- 현재 제작 후보는 별도 `production_candidates` 저장소 없이 `videoUserRecords` 상태값 위에서 표현됩니다.
- 현재 스크랩북은 YouTube 영상 중심이며, Cloud DB `videos` container 안의 `docType: scrapbook`으로 저장됩니다.
- MVP에서는 새 `discovery_links` Cosmos container를 바로 만들지 않습니다.
- MVP 저장 위치는 기존 Cloud DB 구조 안에서 `docType: discovery_link` 방식입니다.
- 단, 저장 영상 조회인 `/videos` 응답에 `docType: discovery_link` 문서가 섞이면 안 됩니다.
- 2026-07-03 사용자 결정 기준으로 로컬 원본 파일 자동 다운로드/업로드는 MVP에서 제외합니다.
- 현재 우선순위는 채널, 영상, 발견 링크의 URL을 보존하고 나중에 쉽게 복사/붙여넣기 하는 흐름입니다.

따라서 이 문서는 "현재 구현된 발견함 MVP"와 "아직 목표 설계 단계인 local assets/후속 연결"을 분리해서 봐야 합니다.

---

## 2. 왜 이 모델이 필요한가

현재 앱은 YouTube 채널과 영상 중심으로 잘 작동합니다. 하지만 실제 소재 발굴 과정에서는 YouTube 영상만 보지 않습니다.

사용자가 실제로 모으는 소재는 다음처럼 다양합니다.

- 인스타 링크
- 유튜브 영상 링크
- 웹 기사 링크
- 쇼츠/릴스 참고 링크
- 다운로드한 로컬 파일
- 출처를 잊어버린 파일
- 원본인지 리포스트인지 불확실한 링크
- 나중에 제작 후보로 보낼 아이디어 조각

이것들을 바로 스크랩북이나 제작 후보에 섞어 넣으면 문제가 생깁니다.

- 원본 출처를 잃을 수 있습니다.
- 파일만 남고 링크가 사라질 수 있습니다.
- 링크는 있는데 다운로드 파일이 어디 있는지 모를 수 있습니다.
- 권리 확인이 필요한 자료를 바로 제작 후보로 착각할 수 있습니다.
- YouTube 영상 상태와 외부 링크 상태가 섞일 수 있습니다.

그래서 `discovery_links`와 `local_assets`는 스크랩북 앞단의 "출처 정리 영역"으로 설계하는 것이 안전합니다.

---

## 3. 용어 정의

| 용어 | 의미 | 현재 구현 |
|---|---|---|
| Discovery link | 사용자가 외부에서 발견한 링크 | 부분 구현 |
| Local asset | 사용자가 가진 로컬 파일의 메타데이터 | 미구현 |
| Source URL | 소재의 원본 또는 출처로 추정되는 URL | 미구현 |
| Repost suspected | 원본이 아니라 재업로드일 가능성이 있는 상태 | 미구현 |
| Rights check needed | 제작에 쓰기 전 권리 확인이 필요한 상태 | 미구현 |
| Production candidate | 제작 후보로 보낼 수 있는 소재 | 현재는 `videoUserRecords` 기반 부분 구현 |

---

## 4. 모델의 역할 분리

### 4.1 discovery links

목적:

- 외부에서 발견한 링크를 잃어버리지 않게 저장합니다.
- 링크의 출처와 신뢰도를 판단합니다.
- 제작 후보로 보내기 전에 "원본인지", "권리 확인이 필요한지"를 정리합니다.

저장 대상 예시:

- 인스타 게시물 URL
- 유튜브 영상 URL
- 웹페이지 URL
- 참고 자료 URL
- 원본 후보 URL
- 리포스트 의심 URL

저장하지 말아야 할 것:

- 무단 크롤링으로 가져온 콘텐츠 본문
- 자동 다운로드한 영상 파일
- 권한 없이 수집한 개인정보
- 자동 업로드된 로컬 원본 파일

### 4.2 local assets

목적:

- 사용자가 가진 로컬 파일을 소재 흐름 안에서 잃어버리지 않게 설명합니다.
- 파일 자체보다 "이 파일이 어디서 왔고 무엇과 연결되는지"를 기록합니다.

저장 대상 예시:

- 파일명
- 사용자가 적은 설명
- 파일 유형
- 원본 링크 또는 관련 discovery link
- 출처 확인 상태
- 권리 확인 상태

저장하지 말아야 할 것:

- 로컬 파일 본문 자체
- 브라우저가 안정적으로 접근할 수 없는 파일 경로를 기준 데이터로 삼는 것
- 사용자가 선택하지 않은 파일을 자동 스캔하는 것
- 사용자가 명시적으로 요청하지 않은 자동 업로드/다운로드

---

## 5. 목표 데이터 모델 초안

### 5.1 discovery link 후보 schema

아래는 목표 후보입니다. 아직 DB schema로 확정하지 않습니다.

| 필드 후보 | 의미 | 필수 후보 | 비고 |
|---|---|---:|---|
| `id` | discovery link 문서 ID | 예 | 생성 방식 미정 |
| `docType` | discovery link 문서 타입 | 예 | MVP 후보값: `discovery_link` |
| `url` | 사용자가 저장한 링크 | 예 | 정규화 필요 |
| `normalizedUrl` | 중복 판단용 URL | 후보 | 쿼리 제거 기준 별도 결정 |
| `platform` | `youtube`, `instagram`, `web`, `tiktok`, `unknown` 등 | 예 | 현재 새 링크 저장 시 URL 기준 추정값을 저장. 기존 문서는 일괄 마이그레이션하지 않음 |
| `title` | 사용자가 적은 제목 또는 가져온 제목 | 후보 | 자동 메타데이터 수집은 나중에 판단 |
| `memo` | 사용자의 메모 | 후보 | 소재 포인트 |
| `status` | 발견함 안에서의 작업 상태 | 예 | MVP 후보값: `inbox`, `reviewing`, `saved`, `candidate`, `discarded` |
| `rightsStatus` | 권리 확인 상태 | 후보 | MVP 후보값: `unknown`, `needs_check`, `cleared`, `do_not_use` |
| `sourceStatus` | 원본/리포스트 판단 상태 | 후속 후보 | MVP에서는 메인 `status`에 섞지 않고 메모 또는 후속 필드로 검토 |
| `linkedVideoId` | YouTube 영상과 연결될 경우 | 후보 | 기존 `videos`와 연결 |
| `linkedAssetIds` | 관련 local asset 목록 | 후보 | 파일 여러 개 가능 |
| `productionCandidateId` | 제작 후보와 연결될 경우 | 후보 | 현재는 별도 저장소 없음 |
| `createdAt` | 생성 시각 | 예 |  |
| `updatedAt` | 수정 시각 | 예 |  |

### 5.2 local asset 후보 schema

아래는 목표 후보입니다. 아직 DB schema로 확정하지 않습니다.

| 필드 후보 | 의미 | 필수 후보 | 비고 |
|---|---|---:|---|
| `id` | local asset 문서 ID | 예 | 생성 방식 미정 |
| `displayName` | 화면에 보여줄 파일명 | 예 | 실제 파일명과 다를 수 있음 |
| `fileName` | 사용자가 선택한 파일명 | 후보 | 파일 이동 시 깨질 수 있음 |
| `fileType` | 이미지, 영상, 문서 등 | 후보 | MIME 또는 수동 분류 |
| `localRef` | 로컬 파일 참조 정보 | 후보 | 브라우저에서는 안정성 제한 있음 |
| `sourceUrl` | 원본 또는 출처 URL | 후보 | 없을 수 있음 |
| `discoveryLinkId` | 연결된 discovery link | 후보 | 링크 기반 연결 |
| `sourceStatus` | 출처 상태 | 예 | 상태값 사전 기준 |
| `rightsStatus` | 권리 확인 상태 | 후보 | 제작 사용 전 확인 |
| `memo` | 사용자의 메모 | 후보 |  |
| `createdAt` | 생성 시각 | 예 |  |
| `updatedAt` | 수정 시각 | 예 |  |

---

## 6. 상태값 후보

### 6.1 discovery link 메인 상태

| 저장값 후보 | 화면 표시 | 의미 |
|---|---|---|
| `inbox` | 받은 링크 | 새로 저장했고 아직 검토하지 않은 링크 |
| `reviewing` | 확인 중 | 출처와 소재성을 검토 중 |
| `saved` | 보관 | 나중에 다시 볼 가치가 있어 보관한 링크 |
| `candidate` | 제작 후보 | 제작 후보로 검토할 수 있는 링크 |
| `discarded` | 제외 | 더 이상 보지 않음 |

### 6.2 discovery link 권리 상태

권리 확인은 메인 `status`에 섞지 않고 `rightsStatus`로 분리합니다.

| 저장값 후보 | 화면 표시 | 의미 |
|---|---|---|
| `unknown` | 권리 미확인 | 아직 권리 확인을 하지 않음 |
| `needs_check` | 확인 필요 | 제작 사용 전 확인이 필요함 |
| `cleared` | 확인 완료 | 사용자가 확인 완료로 표시함 |
| `do_not_use` | 사용 금지 | 제작에 쓰면 안 되는 자료로 판단함 |

### 6.3 local asset 출처 상태

| 저장값 후보 | 화면 표시 | 의미 |
|---|---|---|
| `unlinked` | 링크 없음 | 파일만 있고 출처 링크가 없음 |
| `linked` | 링크 연결됨 | 원본 또는 참고 링크가 연결됨 |
| `source_unknown` | 출처 불명 | 출처를 알 수 없음 |
| `source_verified` | 출처 확인 | 출처 확인 완료 |
| `rights_check_needed` | 권리 확인 필요 | 사용 전 확인 필요 |
| `ready_for_reference` | 참고 가능 | 내부 참고용으로 사용 가능 |

주의:

- 위 상태값은 목표 후보입니다.
- 현재 코드 상수에 추가하지 않습니다.
- discovery link MVP의 메인 상태와 `rightsStatus`는 위 값을 우선 기준으로 봅니다.
- 원본 후보/리포스트 의심은 MVP 메인 `status`에 섞지 않습니다.
- 실제 저장 schema와 API 구현은 후속 Issue에서 결정합니다.

---

## 7. 주요 사용 흐름

### 7.1 링크만 있는 경우

```txt
사용자가 외부 링크 저장
→ discovery link 생성
→ 상태: inbox
→ 사용자가 원본/리포스트/권리 확인 여부 판단
→ 필요하면 제작 후보 또는 스크랩북으로 보냄
```

운영 기준:

- 링크 저장만으로 콘텐츠를 자동 다운로드하지 않습니다.
- 메타데이터 자동 수집은 나중에 별도 결정합니다.

### 7.2 파일만 있고 링크가 없는 경우

```txt
사용자가 로컬 파일 등록
→ local asset 생성
→ 상태: unlinked 또는 source_unknown
→ 사용자가 나중에 sourceUrl 연결
→ 권리 확인 상태 정리
```

운영 기준:

- 파일만 있다고 바로 제작 후보로 보지 않습니다.
- 출처 불명 상태를 명확히 표시합니다.

### 7.3 링크와 파일이 모두 있는 경우

```txt
discovery link 생성
→ local asset 생성
→ local asset.discoveryLinkId 연결
→ sourceUrl 또는 url 기준으로 출처 연결
→ 제작 후보로 보낼지 판단
```

운영 기준:

- 링크가 기준 출처입니다.
- 파일은 링크에서 파생된 참고 자산으로 봅니다.
- 링크와 파일의 연결은 사용자가 수정할 수 있어야 합니다.

### 7.4 YouTube 저장 영상과 연결하는 경우

```txt
저장된 YouTube video 존재
→ discovery link가 YouTube URL이면 linkedVideoId 연결 가능
→ videoUserRecords와 직접 섞지 않고 연결만 둠
```

운영 기준:

- YouTube 영상 원본 데이터는 `videos`가 기준입니다.
- discovery link는 출처/발견 경로 기록입니다.

### 7.5 제작 후보로 보내는 경우

```txt
discovery link 또는 local asset 검토
→ status 확인
→ rightsStatus 확인
→ production candidate 후보로 연결
```

운영 기준:

- 현재는 `production_candidates` 별도 저장소가 없으므로 바로 구현하지 않습니다.
- MVP에서는 스크랩북 또는 `videoUserRecords`와의 연결을 신중히 검토해야 합니다.

---

## 8. 안전 원칙

### 8.1 무단 크롤링 금지

이 모델은 링크와 메모를 저장하기 위한 것입니다.

하지 말아야 할 일:

- 인스타/외부 사이트를 자동 크롤링하기
- 권한 없이 영상/이미지를 자동 다운로드하기
- 로그인 우회나 비공개 콘텐츠 수집하기
- 외부 플랫폼 약관을 무시하는 자동 수집 만들기

가능한 방향:

- 사용자가 직접 붙여넣은 링크 저장
- 사용자가 직접 입력한 메모 저장
- 사용자가 직접 선택한 파일의 메타데이터 저장
- 메타데이터 자동 수집은 플랫폼 정책 검토 후 별도 결정

### 8.2 파일 본문 저장 금지

초기 모델에서 Cloud DB는 파일 본문을 저장하지 않습니다.

저장 후보:

- 파일명
- 설명
- 출처 링크
- 사용자가 지정한 상태
- 연결된 discovery link ID

저장하지 않는 것:

- 영상 파일 자체
- 이미지 파일 자체
- 로컬 전체 경로를 영구 기준으로 삼는 것

### 8.3 발견함 상태와 권리 상태를 분리해서 표시

제작 후보로 보내기 전에 발견함 메인 상태와 권리 상태를 따로 보여야 합니다.

- `status`: 받은 링크, 확인 중, 보관, 제작 후보, 제외
- `rightsStatus`: 권리 미확인, 확인 필요, 확인 완료, 사용 금지

원본 후보/리포스트 의심은 중요한 판단이지만, MVP에서는 메인 `status`에 섞지 않습니다. 필요하면 메모로 남기고, 나중에 `sourceStatus`를 별도 필드로 검토합니다.

---

## 9. 현재 데이터와의 관계

| 현재 데이터 | discovery links와의 관계 | local assets와의 관계 | 주의 |
|---|---|---|---|
| `videos` | YouTube URL이면 연결 가능. MVP 저장 후보도 같은 Cloud DB의 `docType: discovery_link` 방식 | 영상에서 파생된 파일이 있으면 연결 가능 | 저장 영상 조회 `/videos` 응답에 discovery link 문서가 섞이면 안 됨 |
| `videoUserRecords` | 사용자의 판단 기록과 연결 가능 | 제작 메모와 연결 가능 | 상태를 직접 섞으면 위험 |
| `scrapbook` | 좋은 링크를 보관함으로 보낼 수 있음 | 좋은 파일 메타데이터를 보관함과 연결 가능 | 현재 스크랩북은 영상 중심 |
| `production candidates` | 장기적으로 후보 출처가 될 수 있음 | 장기적으로 후보 자료가 될 수 있음 | 별도 저장소 없음 |

---

## 10. 지금 결정하지 말아야 할 것

아래 항목은 이 문서에서 결정하지 않습니다.

- 장기적으로 `discovery_links` 별도 DB container로 분리할지 여부
- `local_assets` DB container를 만들지 여부
- API endpoint 이름
- 실제 schema 확정
- 인스타 메타데이터 자동 수집 여부
- 로컬 파일을 브라우저에서 어떻게 참조할지
- 파일 업로드 기능을 만들지 여부
- `production_candidates` 별도 저장소 도입 여부
- `sourceStatus`를 별도 필드로 도입할지 여부

위 항목들은 데이터 구조와 사용자 작업 흐름에 큰 영향을 주므로 별도 선택지 보고 후 결정합니다.

---

## 11. 후속 확장 전 확인해야 할 질문

현재 확인된 기준:

1. 외부 링크 저장은 1차에 수동 입력 중심으로 시작합니다.
2. 인스타 링크는 1차에 메타데이터 없이 URL, 제목, 메모, 상태 중심으로 저장합니다.
3. 로컬 파일은 1차 구현에서 제외하고, 필요하면 2차에서 "파일 메모 카드"로 검토합니다.
4. discovery link는 스크랩북에 섞지 않고 `docType: discovery_link` 문서 타입으로 분리합니다.
5. `platform`은 자동 크롤링 결과가 아니라 사용자가 입력한 URL 문자열에서 추정한 표시/분류 보조값입니다.

후속 확장 전 남은 질문:

1. local assets를 파일 메모 카드로 시작할까요, 아니면 아직 보류할까요?
2. 발견 링크 후보를 별도 제작 프로젝트 모델로 분리할 때 `discovery_link.status` 기반으로 충분할까요, 별도 `production_candidates` 검토가 필요할까요?
3. 기존 discovery link 문서 중 `platform`이 없는 문서를 수동 복구/마이그레이션할 필요가 있을까요?

---

## 12. 권장 진행 순서

현재 단계에서 권장하는 순서입니다.

1. 이 문서를 기준으로 "외부 링크 수동 저장"의 최소 범위를 정합니다.
2. MVP 저장은 기존 Cloud DB 구조 안의 `docType: discovery_link` 방식으로 시작했습니다.
3. `/videos` 저장 영상 조회에 discovery link 문서가 섞이지 않도록 API 쿼리 경계를 먼저 확인합니다.
4. local assets는 바로 구현하지 않고, "파일 메모 카드" 수준으로 시작 가능한지 2차에서 검토합니다.
5. 별도 제작 프로젝트 모델로 확장하기 전에는 별도 `production_candidates` 모델이 필요한지 다시 판단합니다.

---

## 13. 최종 판정

`discovery_links`와 `local_assets`는 Creator OS v2.2에서 중요한 목표 영역입니다. 현재 repo에는 discovery links 1차 MVP가 들어갔고, local assets는 아직 목표 모델 단계입니다. 다음 확장은 모델과 경계를 유지하면서 작은 단위로 진행하는 것이 안전합니다.

현재 판정:

- 외부 링크 저장: 1차 MVP 부분 구현
- 인스타 링크 관리: 수동 링크 저장과 플랫폼 표시 MVP 부분 구현
- 로컬 파일 연결: 목표 설계 단계
- 자동 크롤링/다운로드: 구현 금지에 가까운 고위험 영역
- 별도 제작 프로젝트 연결: `production_candidates` 모델 결정 이후 검토

MVP 기준:

- 수동 링크 저장 중심으로 시작합니다.
- 새 `discovery_links` container는 바로 만들지 않습니다.
- 기존 Cloud DB 구조 안에서 `docType: discovery_link` 방식으로 저장합니다.
- `/videos` 조회에는 discovery link 문서가 섞이면 안 됩니다.
- 메인 상태는 `inbox`, `reviewing`, `saved`, `candidate`, `discarded`입니다.
- 권리 상태는 `rightsStatus`로 분리하고 `unknown`, `needs_check`, `cleared`, `do_not_use`를 우선 후보로 봅니다.
