# Creator OS Azure Subscription Migration Check

검토일: 2026-07-08 KST

## 결론

Creator OS의 프론트엔드/백엔드/DB 핵심 리소스는 잘못 연결된 청구 구독에서 Microsoft Azure Sponsorship 구독으로 이동했다.

이동 직후 앱 접속과 저장 영상 불러오기는 정상 확인되었다. 따라서 프론트엔드, 백엔드 API, Cosmos DB 조회 흐름은 1차 정상으로 판단한다.

다만 다음 GitHub Actions 배포가 성공하는지 아직 별도로 확인해야 한다. 이동 대상에서 제외된 사용자 할당 관리 ID가 배포 인증 또는 OIDC 구성에 영향을 줄 수 있기 때문이다.

## 이동 결과 요약

| 항목 | 결과 |
| --- | --- |
| 원본 구독 | MCPP Subscription |
| 대상 구독 | Microsoft Azure 스폰서십 |
| 대상 리소스 그룹 | yt-analyzer-rg |
| 이동 성공 리소스 수 | 7 |
| 이동 제외 리소스 | oidc-msi-8ae4 |
| 제외 이유 | Microsoft.ManagedIdentity/userAssignedIdentities는 리소스 이동 미지원 |
| 앱 접속 | 정상 확인 |
| 저장 영상 불러오기 | 정상 확인 |
| 남은 핵심 확인 | 다음 GitHub Actions 배포 성공 여부 |

## 이동 완료 리소스

```text
Application Insights Smart Detection
ASP-ytanalyzer-rg-b241
yt-analyzer
yt-analyzer-db
yt-analyzer-func
yt-analyzer-func Application Insights
ytanalyzerrga05b
```

## 이동 제외 리소스

```text
oidc-msi-8ae4
```

Azure Portal 유효성 검사에서 아래 사유로 이동 대상에서 제외했다.

```text
Microsoft.ManagedIdentity/userAssignedIdentities 리소스 이동 미지원
```

이 리소스는 삭제하지 않고, 다음 배포 성공 여부를 확인한 뒤 정리 여부를 판단한다.

## 이동 후 확인 완료

- Azure Sponsorship 구독에 `yt-analyzer-rg` 리소스 그룹 생성 확인
- 핵심 7개 리소스가 Sponsorship 구독 아래로 이동된 것 확인
- Creator OS 앱 URL 접속 정상 확인
- 저장 영상 불러오기 정상 확인
- 프론트엔드에서 백엔드 API와 Cosmos DB 조회 흐름이 동작하는 것 확인

## 이동 후 남은 확인

1. `main` 브랜치 push 또는 PR merge 후 Static Web Apps 배포 성공 여부
2. GitHub Actions `Azure Static Web Apps CI/CD` 워크플로 성공 여부
3. 배포 실패 시 Static Web Apps deployment token 또는 OIDC/RBAC 설정 재확인
4. 하루 정도 지난 뒤 MCPP Subscription 비용 증가가 멈추는지 확인
5. Sponsorship 사용량에 새 리소스 비용이 반영되는지 확인

## 구조 메모

Creator OS는 프론트엔드 Static Web Apps만 있는 단순 앱이 아니라 아래 리소스가 함께 동작한다.

```text
GitHub repo: yt-analyzer
  -> Azure Static Web Apps
  -> GitHub Actions deployment token

GitHub repo: yt-analyzer-functions
  -> Azure Function App
  -> Cosmos DB
  -> Function App 환경 변수
  -> GitHub Actions OIDC / Azure login secret
```

따라서 구독을 옮길 때는 Azure Portal에서 실제 리소스 그룹 안의 리소스를 먼저 확인하고, 가능하면 리소스 그룹 단위로 함께 이동한다.

## 현재 로컬 설정에서 확인된 배포 정보

### Frontend

Repo:

```text
babooc7579-creator/yt-analyzer
```

Workflow:

```text
.github/workflows/azure-static-web-apps-lively-dune-0af1d2a00.yml
```

GitHub secret:

```text
AZURE_STATIC_WEB_APPS_API_TOKEN_LIVELY_DUNE_0AF1D2A00
```

빌드 설정:

```text
app_location: /
api_location:
output_location: dist
```

### Backend

Repo:

```text
yt-analyzer-functions
```

Function App:

```text
yt-analyzer-func
```

Frontend API base:

```text
https://yt-analyzer-func-hyd8hxbwb8gkephg.koreacentral-01.azurewebsites.net/api
```

Workflow:

```text
.github/workflows/main_yt-analyzer-func.yml
```

GitHub secrets used by Azure login:

```text
AZUREAPPSERVICE_CLIENTID_079665AAE1D64EDF8882A4742229CE57
AZUREAPPSERVICE_TENANTID_106C6E88AE5643279A92B64A57E72EB9
AZUREAPPSERVICE_SUBSCRIPTIONID_6066B5E459774B328AF5C4880650D0FC
```

Function App 환경 변수:

```text
COSMOS_CONNECTION_STRING
YOUTUBE_API_KEY
```

Cosmos DB 사용 기준:

```text
Database: ytdb
Containers: videos, channels
```

## 이동 전 확인 기준

1. 대상 Microsoft Azure Sponsorship 구독이 같은 Entra ID 테넌트에 있는지 확인한다.
2. 현재 리소스 그룹 안에 있는 모든 리소스를 목록으로 확인한다.
3. 최소한 아래 리소스가 같이 이동 대상에 들어가는지 확인한다.

```text
Azure Static Web App
Function App
App Service plan
Function App storage account
Application Insights
Log Analytics workspace
Cosmos DB account
```

4. Azure Portal의 리소스 이동 검증에서 실패 항목이 없는지 확인한다.
5. 이동 직전 Function App 환경 변수 값을 백업한다.
6. Cosmos DB 데이터가 중요한 경우 내보내기 또는 백업 상태를 확인한다.

## 이동 후 반드시 확인할 항목

### 1. GitHub Actions

Frontend workflow:

```text
yt-analyzer/.github/workflows/azure-static-web-apps-lively-dune-0af1d2a00.yml
```

확인:

```text
main push 또는 workflow 재실행 시 Static Web Apps 배포 성공
```

실패하면 Azure Static Web Apps deployment token을 Azure Portal에서 다시 생성한 뒤 GitHub secret을 교체한다.

```text
AZURE_STATIC_WEB_APPS_API_TOKEN_LIVELY_DUNE_0AF1D2A00
```

Backend workflow:

```text
yt-analyzer-functions/.github/workflows/main_yt-analyzer-func.yml
```

확인:

```text
workflow_dispatch 또는 main push 시 Function App 배포 성공
```

대상 구독이 바뀌면 최소한 아래 secret 값은 새 구독 ID로 교체해야 한다.

```text
AZUREAPPSERVICE_SUBSCRIPTIONID_6066B5E459774B328AF5C4880650D0FC
```

같은 App Registration을 계속 쓸 경우 새 구독 또는 이동된 리소스 그룹에 RBAC 권한이 있어야 한다.

### 2. Function App 환경 변수

Azure Portal > Function App > Environment variables에서 아래 값이 유지되었는지 확인한다.

```text
COSMOS_CONNECTION_STRING
YOUTUBE_API_KEY
```

리소스 이동이 아니라 재생성 방식으로 진행했다면 두 값은 반드시 다시 입력해야 한다.

### 3. API 동작

브라우저 또는 앱에서 아래 기능을 확인한다.

```text
/api/channels
/api/videos
/api/scan
/api/scrapbook
/api/discovery-links
/api/video-records
```

최소 확인:

- 채널 목록 불러오기
- 저장 영상 불러오기
- 발견 링크 저장/조회
- 제작 후보 또는 스크랩북 저장/조회
- 수동 스캔 실행

### 4. 비용/크레딧

Sponsorship 구독은 크레딧 기반이므로 아래를 확인한다.

- 남은 크레딧
- 크레딧 만료일
- Spending limit
- 예산 알림
- Cosmos DB RU/서버리스 설정
- Function App plan 과금 방식

## 완료된 진행 순서

1. Azure Portal에서 현재 리소스 그룹의 리소스 목록 확인
2. 대상 Sponsorship 구독 확인
3. 리소스 그룹 단위 이동 검증 실행
4. 이동 미지원 관리 ID를 이동 목록에서 제외
5. 나머지 핵심 7개 리소스 이동 실행
6. 앱 URL 접속 확인
7. 저장 영상 불러오기 확인

## 남은 진행 순서

1. GitHub Actions frontend 배포 확인
2. 필요 시 backend 배포 확인
3. Cost Management에서 Sponsorship 크레딧 차감 확인
4. MCPP Subscription 비용 증가가 멈추는지 확인
5. 이동 제외 관리 ID 정리 여부 판단

## 위험도 판단

| 항목 | 위험도 | 이유 |
| --- | --- | --- |
| Static Web Apps 이동 | 낮음~중간 | 이동 자체보다 GitHub deployment token 확인이 중요 |
| Function App 이동 | 중간 | App Service plan, storage, Application Insights와 함께 움직여야 함 |
| Cosmos DB 이동 | 중간 | 데이터 원장이므로 이동 전 백업/연결 문자열 확인 필요 |
| GitHub Actions | 중간 | backend는 subscription-id/RBAC 영향 가능 |
| Custom domain | 낮음 | 현재 Creator OS에서 별도 커스텀 도메인 흔적은 확인되지 않음 |
| 비용 | 중간 | Sponsorship 크레딧 소진/만료 시 서비스 중단 위험 |

## 최종 판단

현재 구조 기준으로는 Microsoft Azure Sponsorship 구독 이동 후 치명적인 앱 동작 문제는 발견되지 않았다.

다만 다음 조건까지 확인해야 이동 후 운영 상태를 최종 정상으로 판단할 수 있다.

```text
GitHub Actions secret과 RBAC를 이동 후 검증한다.
Sponsorship 크레딧/만료/지출 제한을 모니터링한다.
```
