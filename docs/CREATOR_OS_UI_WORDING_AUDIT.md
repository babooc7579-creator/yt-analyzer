# Creator OS UI 문구 감사

작성일: 2026-07-02

이 문서는 현재 화면 문구가 실제 동작과 맞는지 확인한 감사 문서입니다.

중요: 이 문서는 분석 문서입니다. 코드, API, DB schema, localStorage key는 변경하지 않습니다.

---

## 1. 감사 목적

사용자가 버튼을 누르기 전에 아래 내용을 알 수 있게 하는 것이 목적입니다.

- 저장된 DB를 조회하는 작업인지
- YouTube API를 호출하는 작업인지
- Cloud DB를 변경하는 작업인지
- localStorage 화면 설정만 바꾸는 작업인지
- 아직 준비중인 기능인지

---

## 2. 현재 잘 되어 있는 부분

### 2.1 저장 영상 불러오기

현재 문구는 전반적으로 좋습니다.

확인된 문구:

- `저장된 영상 불러오기`
- `이미 수집되어 저장된 영상만 조회합니다`
- `YouTube API를 새로 호출하지 않습니다`

근거 파일:

- `src/components/LoadStoredVideosButton.jsx`
- `src/components/HomeRadarSummary.jsx`
- `src/components/StoredVideoGuide.jsx`
- `src/components/ReferenceVaultSummary.jsx`
- `src/components/ReferenceVaultEmptyState.jsx`

판정:

- DB 조회라는 의미가 비교적 명확합니다.
- YouTube API 호출이 없다는 설명도 들어가 있습니다.

위험:

- 낮음.

### 2.2 새 영상 수집

현재 문구는 전반적으로 좋습니다.

확인된 문구:

- `새 영상 수집`
- `YouTube API 호출이 발생합니다`
- `운영중 채널만 YouTube API로 확인합니다`
- `보류/제외 채널은 수집하지 않습니다`

근거 파일:

- `src/components/VideoToolbar.jsx`
- `src/components/ChannelTagTabs.jsx`
- `src/components/HomeOperatingGuidelines.jsx`
- `src/components/StoredVideoGuide.jsx`
- `src/App.jsx`

판정:

- API 호출이 발생한다는 점이 잘 드러납니다.
- 선택 채널과 전체 운영중 채널의 차이도 설명되어 있습니다.

위험:

- 낮음.

### 2.3 댓글 Top 10 보기

현재 문구는 좋습니다.

확인된 문구:

- `YouTube API로 댓글 Top 10을 조회합니다`
- `댓글 Top 10 보기는 YouTube API로 댓글을 조회합니다`
- `저장된 영상 불러오기와는 별도 기능입니다`

근거 파일:

- `src/components/VideoCard.jsx`
- `src/components/VideoListTable.jsx`
- `src/components/ScrapbookVideoCard.jsx`
- `src/App.jsx`

판정:

- 저장 영상 조회와 별도 API 호출이라는 점이 비교적 명확합니다.

위험:

- 낮음.

---

## 3. 수정 후보

### 3.1 채널 저장 후 성공 메시지

현재 문구:

```txt
채널이 클라우드에 성공적으로 추가되었습니다! (최초 분석 시 영상 최대 250개를 수집합니다)
```

근거 파일:

- `src/App.jsx`

실제 백엔드 확인:

- `POST /channels`는 `fetchChannelInfo(handle)`로 채널 정보를 확인한 뒤 `channels` container에 저장합니다.
- 이 흐름에서 영상 250개를 바로 수집하지 않습니다.
- 영상 수집은 `POST /scan/selected`, `GET /scan`, `GET /scan?tag=...`의 scan 흐름에서 발생합니다.

문제:

- 사용자는 채널 저장만 했는데 영상도 같이 수집된다고 오해할 수 있습니다.
- 같은 화면의 다른 문구인 `영상 수집은 스캔 시 진행됩니다`와 충돌합니다.

추천 문구:

```txt
채널이 클라우드 목록에 추가되었습니다. 새 영상은 스캔 버튼을 눌렀을 때 수집됩니다.
```

위험도:

- 낮음.

사용자 판단 필요 여부:

- 필요 없음. 실제 동작을 더 정확히 설명하는 문구 수정입니다.

### 3.2 카테고리 삭제 아이콘

현재 동작:

- 카테고리 삭제 아이콘은 localStorage의 화면 카테고리 목록에서만 제거합니다.
- Cloud DB의 `channels.tags`는 삭제하지 않습니다.

근거 파일:

- `src/components/ChannelAddForm.jsx`
- `src/App.jsx`
- `docs/CREATOR_OS_CATEGORY_TAGS_AUDIT.md`

문제:

- 사용자는 카테고리 삭제가 Cloud 채널 태그 삭제라고 오해할 수 있습니다.
- 삭제 아이콘에 별도 설명이 부족합니다.

추천 문구:

```txt
화면 목록에서만 숨김
```

추천 tooltip:

```txt
이 카테고리를 화면 목록에서만 제거합니다. 이미 채널에 붙은 Cloud 태그는 삭제되지 않습니다.
```

위험도:

- 낮음.

사용자 판단 필요 여부:

- 필요 없음. 실제 동작 설명을 정확히 하는 문구 수정입니다.

### 3.3 카테고리 이름 변경 아이콘

현재 문구:

```txt
이름 변경 (이 태그가 붙은 모든 채널에 일괄 반영)
```

현재 보조 문구:

```txt
아이콘으로 이름 변경 시, 이 태그가 붙은 모든 채널에 클라우드에서 즉시 반영됩니다.
```

판정:

- 방향은 좋습니다.
- 다만 이 작업이 DB 변경이라는 점을 더 강하게 표시하면 좋습니다.

추천 문구:

```txt
Cloud 태그 이름 변경
```

추천 tooltip:

```txt
이 태그가 붙은 모든 채널의 Cloud 태그 이름을 변경합니다.
```

위험도:

- 낮음.

사용자 판단 필요 여부:

- 필요 없음. 동작 변경 없이 문구만 명확히 합니다.

### 3.4 채널 미리보기

현재 문구:

```txt
아직 저장하지 않고 채널 정보만 먼저 확인합니다.
```

실제 동작:

- `GET /channel-preview?handle=...`가 YouTube API로 채널 정보를 확인합니다.
- Cloud DB 저장은 하지 않습니다.

문제:

- 저장하지 않는다는 점은 좋지만, YouTube API 조회가 발생할 수 있다는 설명은 약합니다.

추천 문구:

```txt
아직 저장하지 않고 YouTube에서 채널 정보만 확인합니다.
```

또는:

```txt
Cloud 저장은 하지 않습니다. 채널 확인을 위해 YouTube API 조회가 발생할 수 있습니다.
```

위험도:

- 낮음.

사용자 판단 필요 여부:

- 필요 없음.

### 3.5 채널 일괄 등록

현재 문구:

```txt
일괄 등록 중...
채널 수에 따라 시간이 걸릴 수 있어요
```

실제 동작:

- 각 채널마다 YouTube API로 채널 정보를 확인하고 Cloud DB에 저장합니다.

문제:

- 시간이 걸린다는 설명은 있지만, YouTube API 조회와 Cloud 저장이 발생한다는 점이 약합니다.

추천 문구:

```txt
채널 정보를 YouTube에서 확인한 뒤 클라우드 목록에 저장합니다.
```

위험도:

- 낮음.

사용자 판단 필요 여부:

- 필요 없음.

---

## 4. 지금 수정하지 말아야 할 것

이번 audit 기준으로 바로 건드리면 안 되는 것:

- scan endpoint 동작 변경
- `/tags/rename` endpoint 방식 변경
- 카테고리 저장 구조 변경
- localStorage key 변경
- 채널 저장 시 자동 스캔 추가
- YouTube API 호출 횟수 증가
- UI 전체 재배치

---

## 5. 추천 작은 작업

다음 코드 작업으로는 아래 5개만 작게 수정하는 것을 추천합니다.

1. 채널 저장 성공 메시지에서 `최초 분석 시 영상 최대 250개 수집` 문구 제거
2. 카테고리 삭제 버튼 tooltip 추가
3. 카테고리 삭제 보조 문구에 `Cloud 태그는 삭제되지 않음` 표시
4. 카테고리 이름 변경 버튼 tooltip을 `Cloud 태그 이름 변경`으로 명확화
5. 채널 미리보기/일괄 등록 안내에 YouTube API 조회 가능성 표시

이 작업들은 데이터 구조를 바꾸지 않고, 사용자가 버튼 의미를 오해하지 않게 하는 안전한 문구 정리입니다.
