# Creator OS Azure Subscription Migration Check

검토일: 2026-07-08 KST

업데이트: 2026-07-13 KST

## 결론

Creator OS의 프론트엔드/백엔드/DB 핵심 리소스는 잘못 연결된 청구 구독에서 Microsoft Azure Sponsorship 구독으로 이동했다.

이동 직후 앱 접속과 저장 영상 불러오기는 정상 확인되었다. 따라서 프론트엔드, 백엔드 API, Cosmos DB 조회 흐름은 1차 정상으로 판단한다.

2026-07-11 기준으로 `yt-analyzer` 프론트엔드 main 브랜치 배포도 여러 차례 성공했다. 따라서 Static Web Apps 배포 token/OIDC 흐름은 현재 프론트엔드 운영에 문제 없는 것으로 판단한다.

2026-07-13 기준으로 Sponsorship 구독 안에 백엔드 배포 전용 관리 ID를 새로 만들고, GitHub Actions OIDC와 최소 RBAC 권한을 연결했다. 새 인증 경로로 `yt-analyzer-functions` Function App 배포가 실제 성공했으므로 프론트엔드와 백엔드의 자동 배포 경로가 모두 Sponsorship 구독 기준으로 전환되었다.

## 이동 결과 요약

| 항목 | 결과 |
| --- | --- |
| 원본 구독 | MCPP Subscription |
| 대상 구독 | Microsoft Azure 스폰서십 |
| 대상 리소스 그룹 | yt-analyzer-rg |
| 이동 성공 리소스 수 | 7 |
| 새로 생성한 배포 리소스 | yt-analyzer-github-oidc |
| 이동 제외 후 삭제한 리소스 | oidc-msi-8ae4 |
| 제외 이유 | Microsoft.ManagedIdentity/userAssignedIdentities는 리소스 이동 미지원 |
| 앱 접속 | 정상 확인 |
| 저장 영상 불러오기 | 정상 확인 |
| 프론트엔드 GitHub Actions 배포 | 정상 확인 |
| 백엔드 GitHub Actions 배포 | 새 Sponsorship OIDC 경로로 정상 확인 |
| MCPP 비용 증가 중단 | 2026-07-08~12 추가 비용 없음 |
| 이전 MCPP 정리 | 관리 ID와 빈 yt-analyzer-rg 삭제 완료 |
| 남은 운영 확인 | Sponsorship 크레딧 반영 모니터링 |

## 이동 완료 리소스

```text
Application Insights Smart Detection
ASP-ytanalyzerrg-b241
yt-analyzer
yt-analyzer-db
yt-analyzer-func
yt-analyzer-func Application Insights
ytanalyzerrga05b
```

## 이동 제외 후 정리 완료한 리소스

```text
oidc-msi-8ae4
```

Azure Portal 유효성 검사에서 아래 사유로 이동 대상에서 제외했다.

```text
Microsoft.ManagedIdentity/userAssignedIdentities 리소스 이동 미지원
```

이전 관리 ID는 백엔드 GitHub Actions 인증 경로에서 새 Sponsorship 관리 ID로 교체했고, 역할 할당이 없는 것을 확인했다. 새 OIDC로 실제 백엔드 배포가 성공하고 MCPP 비용 증가가 멈춘 것도 확인한 뒤 2026-07-13에 삭제했다. 이어서 비어 있는 MCPP의 `yt-analyzer-rg` 리소스 그룹도 삭제했다.

## 이동 후 확인 완료

- Azure Sponsorship 구독에 `yt-analyzer-rg` 리소스 그룹 생성 확인
- 핵심 7개 리소스가 Sponsorship 구독 아래로 이동된 것 확인
- Creator OS 앱 URL 접속 정상 확인
- 저장 영상 불러오기 정상 확인
- 프론트엔드에서 백엔드 API와 Cosmos DB 조회 흐름이 동작하는 것 확인
- `yt-analyzer` main 브랜치 GitHub Actions `Build` workflow 성공 확인
- `yt-analyzer` main 브랜치 GitHub Actions `Azure Static Web Apps CI/CD` workflow 성공 확인
- PR #845, #846, #847, #848 병합 후 공개 앱 루트 `200 OK` 확인
- Sponsorship 구독에 백엔드 배포 전용 관리 ID `yt-analyzer-github-oidc` 생성 확인
- GitHub main 브랜치용 federated credential `github-main-yt-analyzer-functions` 생성 확인
- 새 관리 ID에 Function App 단일 리소스 범위의 `Website Contributor` 역할만 부여한 것 확인
- 백엔드 GitHub Actions의 client ID와 subscription ID를 Sponsorship 기준으로 교체한 것 확인
- `yt-analyzer-functions` workflow run [#29199000797](https://github.com/babooc7579-creator/yt-analyzer-functions/actions/runs/29199000797)에서 Azure 로그인과 Function App 배포 성공 확인
- Function App `yt-analyzer-func`가 `Running`, HTTPS 전용 상태인 것 확인
- 무로그인 직접 Function API 접근은 `401 Unauthorized`, Static Web Apps API 접근은 Entra ID 로그인으로 `302 Redirect`되는 것 확인
- 2026-07-13 Cost Management 조회에서 MCPP `yt-analyzer-rg` 비용은 7월 7일까지만 발생하고 7월 8~12일 추가 비용이 없는 것 확인
- 이전 MCPP 관리 ID `oidc-msi-8ae4` 삭제 완료
- 비어 있는 MCPP `yt-analyzer-rg` 리소스 그룹 삭제 완료
- 삭제 후 MCPP 관련 리소스 0개, Sponsorship 운영/배포 리소스 8개, Function App `Running` 상태 재확인

## 비용 반영 확인

2026-07-13 KST에 두 구독의 2026-07-07~12 비용을 일별로 조회했다.

| 구독 | 조회 결과 | 판단 |
| --- | --- | --- |
| MCPP Subscription | `yt-analyzer-rg`는 7월 7일 14.359467044원, 7월 8~12일 추가 비용 없음 | 운영 리소스 비용 증가가 중단됨 |
| Microsoft Azure Sponsorship | 일반 Cost Management Query 결과 행 없음 | Sponsorship 전용 잔액 화면에서 별도 반영 확인 필요 |

Azure Cost Management 데이터는 구독 유형과 서비스에 따라 늦게 반영될 수 있다. Microsoft 공식 문서는 일반적으로 8~24시간, 일부 종량제 구독은 최대 72시간 지연될 수 있다고 안내한다. 이번 확인은 이동 후 72시간 이상 지난 구간을 포함한다.

- [Understand Cost Management data](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data)
- [Microsoft Entra licensing - Managed identities](https://learn.microsoft.com/en-us/entra/fundamentals/licensing#managed-identities)

관리 ID는 별도 라이선스나 추가 비용 없이 사용할 수 있는 인증 리소스다. 따라서 이전 `oidc-msi-8ae4`를 잠시 보존한 것이 13원, 17원 수준의 운영 비용 원인은 아니다.

## 이동 후 남은 확인

1. Sponsorship 전용 잔액 화면에 새 리소스 사용량이 반영되는지 주기적으로 확인

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

### Backend OIDC 전환 결과

Sponsorship 구독에 이동할 수 없었던 이전 관리 ID를 복제하지 않고, 백엔드 배포만 담당하는 새 관리 ID를 만들었다.

```text
Managed identity: yt-analyzer-github-oidc
Federated credential: github-main-yt-analyzer-functions
GitHub subject: repo:babooc7579-creator/yt-analyzer-functions:ref:refs/heads/main
Role: Website Contributor
Role scope: Function App yt-analyzer-func 단일 리소스
```

기존 GitHub secret 이름은 유지하고 값만 새 관리 ID와 Sponsorship 구독 기준으로 교체했다. 따라서 workflow 파일과 배포 명령은 바꾸지 않고 인증 대상만 안전하게 전환했다.

검증 결과:

```text
GitHub Actions run: 29199000797
Build: success
Azure login: success
Function App deploy: success
```

이전 MCPP 관리 ID `oidc-msi-8ae4`는 역할 할당이 없고 새 배포 경로에서도 사용하지 않는 것을 확인한 뒤 삭제했다. 현재 backend 배포 인증은 Sponsorship의 `yt-analyzer-github-oidc`만 사용한다.

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
8. 프론트엔드 main 브랜치 Build workflow 성공 확인
9. 프론트엔드 Azure Static Web Apps CI/CD workflow 성공 확인
10. 공개 앱 루트 `200 OK` 확인
11. Sponsorship 구독에 새 backend OIDC 관리 ID 생성
12. GitHub main 브랜치용 federated credential 생성
13. Function App 단일 범위 `Website Contributor` 권한 연결
14. backend GitHub Actions secret을 Sponsorship 기준으로 교체
15. 새 OIDC 경로로 backend Build/Azure login/Function App 배포 성공 확인
16. Function App 실행 상태와 무로그인 접근 보호 확인
17. MCPP Subscription의 7월 8~12일 추가 운영 비용이 없는 것 확인
18. 이전 MCPP 관리 ID `oidc-msi-8ae4` 삭제
19. 비어 있는 MCPP `yt-analyzer-rg` 리소스 그룹 삭제
20. MCPP 관련 리소스 0개와 Sponsorship 운영/배포 리소스 정상 상태 재확인

## 남은 진행 순서

1. Sponsorship 전용 잔액 화면에서 크레딧 차감 반영을 주기적으로 확인

## 위험도 판단

| 항목 | 위험도 | 이유 |
| --- | --- | --- |
| Static Web Apps 이동 | 낮음~중간 | 이동 자체보다 GitHub deployment token 확인이 중요 |
| Function App 이동 | 중간 | App Service plan, storage, Application Insights와 함께 움직여야 함 |
| Cosmos DB 이동 | 중간 | 데이터 원장이므로 이동 전 백업/연결 문자열 확인 필요 |
| GitHub Actions | 낮음 | frontend와 backend 모두 새 구독 기준 실제 배포 성공 확인됨 |
| 이전 관리 ID 정리 | 완료 | 새 OIDC 배포 성공, 역할 범위, MCPP 비용 증가 중단 확인 후 삭제 완료 |
| Custom domain | 낮음 | 현재 Creator OS에서 별도 커스텀 도메인 흔적은 확인되지 않음 |
| 비용 | 중간 | Sponsorship 크레딧 소진/만료 시 서비스 중단 위험 |

## 최종 판단

현재 구조 기준으로 Microsoft Azure Sponsorship 구독 이동과 이전 MCPP 리소스 정리는 완료되었으며, 치명적인 앱 동작 문제는 발견되지 않았다.

프론트엔드 앱 접속, 저장 영상 조회, main 브랜치 Build, Azure Static Web Apps CI/CD 배포, backend GitHub OIDC 로그인, Function App 배포는 모두 정상 확인됐다.

Function App은 `Running` 및 HTTPS 전용 상태이며, 무로그인 접근은 의도대로 차단된다. 따라서 구독 이동으로 인한 앱 실행 또는 자동 배포의 치명적인 문제는 현재 발견되지 않았다.

다만 다음 조건은 계속 운영 확인 대상으로 남긴다.

```text
Sponsorship 크레딧/만료/지출 제한을 모니터링한다.
Sponsorship 전용 잔액 화면의 사용량 반영을 확인한다.
```
