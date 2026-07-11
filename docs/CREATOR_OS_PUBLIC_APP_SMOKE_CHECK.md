# Creator OS 공개 앱 Smoke Check 절차

작성일: 2026-07-11

이 문서는 프론트엔드 변경을 main에 병합한 뒤 공개 앱이 최소한 정상 응답하는지 확인하는 절차입니다.

목적은 "배포가 됐다"와 "사용자가 앱 URL에 접속할 수 있다"를 구분하는 것입니다.

중요:

- 이 절차는 읽기 전용 확인입니다.
- 저장, 삭제, 새 영상 수집, YouTube API 호출 버튼은 누르지 않습니다.
- DB schema, endpoint, localStorage key, 배포 workflow를 변경하지 않습니다.

---

## 1. 확인 대상

현재 공개 앱 URL:

```txt
https://lively-dune-0af1d2a00.7.azurestaticapps.net/
```

현재 GitHub Actions 확인 대상:

```txt
Build
Azure Static Web Apps CI/CD
```

---

## 2. main 병합 후 GitHub Actions 확인

main 최신 커밋 기준으로 아래 두 workflow가 성공해야 합니다.

```powershell
gh run list --branch main --limit 6 --json databaseId,name,status,conclusion,createdAt,headSha,event,url
```

확인 기준:

- `Build`가 `completed / success`
- `Azure Static Web Apps CI/CD`가 `completed / success`

주의:

- `github_id_token` warning은 현재 알려진 비차단 경고입니다.
- 경고 제거는 배포 설정 변경이므로 별도 선택지 검토 후 진행합니다.

---

## 3. 공개 앱 루트 응답 확인

PowerShell에서 아래 명령을 실행합니다.

```powershell
$url = 'https://lively-dune-0af1d2a00.7.azurestaticapps.net/?verify=' + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$response = Invoke-WebRequest -Uri $url -Headers @{ 'Cache-Control' = 'no-cache'; 'Pragma' = 'no-cache' } -UseBasicParsing
[pscustomobject]@{
  StatusCode = $response.StatusCode
  Length = $response.Content.Length
  HasRoot = $response.Content.Contains('<div id="root">')
} | ConvertTo-Json
```

통과 기준:

```json
{
  "StatusCode": 200,
  "HasRoot": true
}
```

`Length`는 배포 결과에 따라 달라질 수 있으므로 고정값으로 보지 않습니다.

---

## 4. 정적 번들 문구 확인이 필요한 경우

특정 화면 문구가 실제 배포 번들에 들어갔는지 확인해야 할 때만 사용합니다.

```powershell
$base = 'https://lively-dune-0af1d2a00.7.azurestaticapps.net/'
$url = $base + '?verify=' + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$response = Invoke-WebRequest -Uri $url -Headers @{ 'Cache-Control' = 'no-cache'; 'Pragma' = 'no-cache' } -UseBasicParsing
$asset = [regex]::Matches($response.Content, 'assets/index-[^"'' ]+\.js')[-1].Value
$bundle = (Invoke-WebRequest -Uri ($base + $asset + '?verify=' + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()) -Headers @{ 'Cache-Control' = 'no-cache'; 'Pragma' = 'no-cache' } -UseBasicParsing).Content
$bundle.Contains('확인할 문구')
```

이 확인은 화면 클릭 테스트가 아니라 배포 파일 기준 확인입니다.

---

## 5. 하지 않는 것

아래 작업은 이 smoke check에 포함하지 않습니다.

- 새 영상 수집 실행
- 채널 삭제
- 발견 링크 저장/수정/삭제
- 스크랩북 저장/삭제
- 판단 기록 초기화
- localStorage 삭제 또는 마이그레이션
- Azure workflow 설정 변경
- backend Function App 배포 확인

backend Function App 배포 확인과 Azure Sponsorship 비용 반영 확인은 별도 운영 항목입니다.

---

## 6. 결과 기록 방식

작업 보고에는 아래만 짧게 기록합니다.

```txt
- Build: 성공/실패
- Azure Static Web Apps CI/CD: 성공/실패
- 공개 앱 루트: 200 OK / 실패
- 알려진 경고: github_id_token warning 유지 여부
- 데이터 변경 버튼 클릭 여부: 없음
```

---

## 한 줄 기준

프론트엔드 안정화 작업의 기본 smoke check는 "main Build 성공, Azure Static Web Apps 배포 성공, 공개 앱 루트 200 OK"까지입니다.
