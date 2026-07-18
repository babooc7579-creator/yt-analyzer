# Creator OS 보호 앱 Smoke Check 절차

작성일: 2026-07-11

이 문서는 프론트엔드 변경을 main에 병합한 뒤 로그인으로 보호된 앱이 최소한 정상 응답하는지 확인하는 절차입니다.

목적은 "배포가 됐다"와 "사용자가 앱 URL에 접속할 수 있다"를 구분하는 것입니다.

중요:

- 이 절차는 읽기 전용 확인입니다.
- 저장, 삭제, 새 영상 수집, YouTube API 호출 버튼은 누르지 않습니다.
- DB schema, endpoint, localStorage key, 배포 workflow를 변경하지 않습니다.

---

## 1. 확인 대상

현재 운영 앱 URL:

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

## 3. 로그아웃 상태의 접근 보호 확인

PowerShell에서 아래 명령을 실행합니다.

```powershell
$url = 'https://lively-dune-0af1d2a00.7.azurestaticapps.net/?verify=' + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
try {
  $response = Invoke-WebRequest -Uri $url -Headers @{ 'Cache-Control' = 'no-cache'; 'Pragma' = 'no-cache' } -UseBasicParsing -MaximumRedirection 0 -ErrorAction Stop
} catch {
  $response = $_.Exception.Response
}
[pscustomobject]@{
  StatusCode = $response.StatusCode
  Location = $response.Headers.Location
} | ConvertTo-Json
```

통과 기준:

- 익명 루트 요청이 Microsoft 로그인으로 이동합니다.
- 익명 `/api/channels` 요청도 로그인으로 이동합니다.
- 앱 HTML이 익명 요청에 `200 OK`로 직접 노출되면 통과가 아닙니다.

PowerShell 버전에 따라 리디렉션 응답이 예외로 표시될 수 있습니다. 이 경우 상태 코드와 `Location` 헤더가 로그인 경로를 가리키는지 확인합니다.

---

## 4. 소유자 로그인 화면 확인

Microsoft Edge에서 운영 앱 URL을 엽니다.

통과 기준:

- `creator_owner` 역할이 있는 Microsoft 계정으로 앱 화면이 열립니다.
- 사이드바에 Microsoft 계정 보호 안내와 로그아웃 동작이 보입니다.
- 저장 영상 불러오기가 정상 동작합니다.
- 읽기 확인 중에는 새 영상 수집, 저장, 삭제 버튼을 누르지 않습니다.

Chrome에서는 Azure Static Web Apps 초대 동의 완료 주소가 확장 또는 보안 필터에 의해 차단된 이력이 있으므로, 현재 운영 확인은 정상 동작이 검증된 Edge를 우선 사용합니다.

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
- 익명 루트와 `/api`: Microsoft 로그인 이동 / 실패
- `creator_owner` 로그인: 앱 진입 성공 / 실패
- 저장 영상 DB 조회: 성공 / 미확인 / 실패
- 알려진 경고: github_id_token warning 유지 여부
- 데이터 변경 버튼 클릭 여부: 없음
```

---

## 7. 최근 읽기 전용 운영 확인

2026-07-18 로그인된 운영 앱에서 아래 항목을 확인했습니다.

- Microsoft 계정 로그인 후 앱 진입 성공
- Cloud 저장 채널 10개 표시
- 채널 1개 선택 후 저장 영상 262개 Cloud DB 조회 성공
- 오늘의 레이더가 262개 후보 풀 중 상위 6개를 우선 표시
- 영상 카드에 게시일과 경과일 함께 표시
- 채널 운영실의 단계 이동과 저장 영상 다음 행동 표시
- 설정 화면에서 Cloud DB, 브라우저 카테고리, YouTube 수집 역할 구분
- 390px 모바일 화면에서 가로 넘침 없음
- 새 영상 수집, 저장, 삭제 동작은 실행하지 않음

이 확인은 당시 배포본의 읽기 동작 점검입니다. 이후 프론트 변경은 main 빌드와 배포 성공을 다시 확인해야 합니다.

---

## 한 줄 기준

프론트엔드 안정화 작업의 기본 smoke check는 "main Build 성공, Azure Static Web Apps 배포 성공, 익명 접근은 로그인으로 이동, owner 로그인 후 앱 진입"까지입니다.
