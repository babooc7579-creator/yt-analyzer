# Creator OS 배포 Workflow 경고 선택지

작성일: 2026-07-03

이 문서는 GitHub Actions와 Azure Static Web Apps 배포 경고를 바로 수정하기 전에, 현재 상황과 선택지를 정리하기 위한 문서입니다.

중요: 이 문서는 코드나 배포 설정을 변경하지 않습니다. `.github/workflows` 수정은 배포 설정 변경이므로 사용자 결정 후 별도 Issue로 진행합니다.

---

## 1. 현재 확인된 사실

- `main` 브랜치의 Build workflow는 성공합니다.
- Azure Static Web Apps CI/CD workflow도 성공하며 실제 배포가 완료됩니다.
- Azure workflow 성공 후 아래 경고가 반복됩니다.

```text
Unexpected input(s) 'github_id_token'
```

- 현재 Azure workflow는 `.github/workflows/azure-static-web-apps-lively-dune-0af1d2a00.yml`에 있습니다.
- 해당 workflow는 `Azure/static-web-apps-deploy@v1`에 `github_id_token`을 넘깁니다.
- workflow 안에는 OIDC token을 얻기 위한 별도 단계도 있습니다.
  - `permissions: id-token: write`
  - `npm install @actions/core@1.6.0 @actions/http-client`
  - `actions/github-script@v8`로 ID token 생성
- 동시에 `azure_static_web_apps_api_token` secret도 사용합니다.
- 즉, 현재 배포는 성공하지만 인증 방식과 action 입력이 다소 섞여 있고, 경고가 노출됩니다.
- 2026-07-03에 선택지 B를 작은 PR로 실제 적용해 보았지만, main 배포에서 실패했습니다.
  - 실패 메시지: `No matching Static Web App was found or the api key was invalid.`
  - 뜻: 현재 `azure_static_web_apps_api_token`만으로는 배포가 되지 않고, 기존 OIDC token 흐름이 실제 배포 성공에 필요합니다.
  - 따라서 우선 기존 OIDC 흐름으로 복구하고, 경고 제거는 Azure token/인증 설정을 다시 확인한 뒤 진행해야 합니다.
- 2026-07-11 후속 안정화에서는 선택지 B처럼 OIDC 단계를 모두 제거하지 않고, `Azure/static-web-apps-deploy@v1`이 지원하지 않는 `github_id_token` 입력 1줄만 제거하는 최소 정리로 범위를 줄였습니다.
  - `azure_static_web_apps_api_token` secret은 유지합니다.
  - `Get Id Token` 단계와 `id-token: write` 권한은 이번 작업에서 제거하지 않습니다.
  - 목적은 배포 인증 방식을 바꾸는 것이 아니라, action이 무시하던 잘못된 입력으로 생기는 warning을 먼저 없애는 것입니다.

---

## 2. 현재 영향

### 실제 앱 영향

현재까지 확인된 영향은 없습니다.

- 배포 성공
- 사이트 갱신 성공
- 앱 build 성공

### 운영상 영향

경고가 계속 보이면 아래 문제가 생길 수 있습니다.

- 실제 위험한 경고와 단순 경고를 구분하기 어려워집니다.
- 배포 실패가 아닌데도 사용자가 불안하게 느낄 수 있습니다.
- GitHub Actions 설정을 나중에 고칠 때 현재 구조가 헷갈릴 수 있습니다.

---

## 3. 선택지 A: 지금은 그대로 둔다

현재 workflow를 수정하지 않습니다.

### 장점

- 가장 빠르고 안전합니다.
- 지금 배포가 성공하므로 앱 사용에는 영향이 없습니다.
- 배포 설정을 건드리지 않아 실수로 배포가 끊길 위험이 없습니다.

### 단점

- 경고가 계속 남습니다.
- 나중에 실제 배포 문제가 생겼을 때 경고를 구분하기 어렵습니다.

### 비용/속도/확장성/유지보수 영향

- 비용: 없음
- 속도: 즉시 가능
- 확장성: 낮음
- 유지보수: 경고가 계속 쌓여 좋지 않음

### Codex 판단

당장 기능 개발을 계속해야 하면 임시로 허용 가능합니다.

---

## 4. 선택지 B: 배포 token 방식으로 단순화한다

`azure_static_web_apps_api_token` secret을 기준으로 배포하고, OIDC 관련 단계와 `github_id_token` 입력을 제거합니다.

예상 변경 범위:

- `permissions.id-token: write` 제거 검토
- `Install OIDC Client from Core Package` 단계 제거
- `Get Id Token` 단계 제거
- `github_id_token` 입력 제거
- 기존 `azure_static_web_apps_api_token`은 유지

### 장점

- workflow가 단순해집니다.
- 현재 배포 성공 방식인 Azure Static Web Apps deployment token 흐름에 맞춰 정리됩니다.
- 경고가 사라질 가능성이 높습니다.
- 불필요한 npm install과 token 생성 단계가 없어져 배포 로그가 짧아집니다.

### 단점

- 배포 설정 변경입니다.
- 만약 현재 Azure 쪽 설정이 OIDC 흐름에 의존하고 있다면 배포 테스트가 필요합니다.
- token 방식은 secret을 유지해야 합니다.

### 비용/속도/확장성/유지보수 영향

- 비용: 없음
- 속도: 빠름
- 확장성: 보통
- 유지보수: 좋아짐

### 2026-07-03 실제 검증 결과

이 선택지는 현재 repo 설정에서는 실패했습니다.

- Build workflow는 통과했습니다.
- Azure 배포 workflow는 실패했습니다.
- 실패 이유는 deployment token만으로 Static Web App을 찾거나 인증하지 못했기 때문입니다.

### Codex 판단

현재 상태에서는 OIDC 단계를 모두 제거하는 전체 단순화는 더 이상 추천하지 않습니다. 이 선택지를 다시 시도하려면 먼저 Azure Static Web Apps deployment token secret을 재발급하거나, Azure Portal의 배포 인증 설정을 확인해야 합니다.

다만 2026-07-11에는 전체 단순화가 아니라 `github_id_token` unsupported input만 제거하는 최소 정리를 별도 후속 작업으로 진행했습니다. 이 방식은 deployment token/OIDC 인증 구조를 크게 바꾸지 않는 범위입니다.

---

## 5. 선택지 C: OIDC 방식으로 명확히 정리한다

배포 token 방식이 아니라 OIDC 인증을 기준으로 workflow를 정리합니다.

### 장점

- 장기적으로 secret 의존을 줄일 수 있습니다.
- 조직/서비스 계정/보안 기준이 커질 때 더 명확할 수 있습니다.

### 단점

- Azure Portal 쪽 설정 확인이 필요할 수 있습니다.
- 현재 개인용 MVP에는 과한 작업입니다.
- 잘못 설정하면 배포가 끊길 수 있습니다.

### 비용/속도/확장성/유지보수 영향

- 비용: 없음
- 속도: 느림
- 확장성: 높음
- 유지보수: 보안 구조를 정확히 알 때 좋음

### Codex 판단

지금 단계에서는 추천하지 않습니다. 유료 서비스화, 권한/조직 관리, 보안 기준을 본격적으로 잡을 때 다시 검토하는 편이 좋습니다.

---

## 6. 선택지 D: Build workflow Node 버전도 함께 점검한다

별도 Build workflow는 현재 Node.js 20으로 앱을 빌드합니다.

이 작업은 Azure 배포 경고와 직접 같은 문제는 아닙니다. 다만 GitHub Actions 런타임 경고가 같이 보일 수 있으므로 별도 점검 대상으로 분리합니다.

### 장점

- CI 환경을 최신 Node LTS 또는 프로젝트 기준에 맞게 정리할 수 있습니다.
- 나중에 의존성 업데이트 때 혼란이 줄어듭니다.

### 단점

- Node 버전 변경은 빌드 결과나 의존성 설치 동작에 영향을 줄 수 있습니다.
- Azure workflow 경고와 한 PR에 섞으면 원인 파악이 어려워집니다.

### 비용/속도/확장성/유지보수 영향

- 비용: 없음
- 속도: 빠름
- 확장성: 보통
- 유지보수: 좋아질 수 있음

### Codex 판단

Azure `github_id_token` 경고와 분리해서 다루는 것이 좋습니다.

---

## 7. Codex 추천

추천 순서:

1. 우선 기존 OIDC 흐름으로 복구해 배포 성공 상태를 되돌립니다.
2. Azure Portal 또는 GitHub secret에서 deployment token이 올바른지 확인합니다.
3. token을 재발급하거나 인증 방식을 확정한 뒤 다시 선택지 B 또는 C를 검토합니다.
4. `github_id_token` unsupported input warning은 입력값 1줄 제거로 먼저 정리합니다.
5. Node 버전 경고가 남아 있으면 선택지 D를 별도 PR로 검토합니다.

추천 이유:

- 현재 앱은 개인용 실사용 안정화 단계입니다.
- 배포 성공이 경고 제거보다 우선입니다.
- 선택지 B처럼 OIDC 단계를 모두 제거하는 방식은 실제 배포에서 실패했으므로, 성공하는 흐름을 유지합니다.
- 다만 action이 지원하지 않는 `github_id_token` 입력은 배포 성공에 쓰이지 않는 warning 원인이므로, 최소 제거 대상으로 분리할 수 있습니다.
- OIDC를 깔끔하게 정리하는 것은 Azure 설정 확인 이후에 다시 판단합니다.

---

## 8. 결정이 필요한 질문

배포 workflow 경고 정리를 다시 진행할까요?

현재 추천 결정:

- **OIDC 흐름은 유지하고, unsupported input만 최소 제거**

진행한다면 Codex는 아래 원칙으로 작업합니다.

- 앱 코드 수정 없음
- API/DB/localStorage 수정 없음
- Azure workflow의 `github_id_token` unsupported input만 최소 수정
- PR에서 배포 성공 확인
- OIDC 단계 제거나 deployment token 단독 전환은 Azure 인증 설정을 확인한 뒤 별도 Issue로 진행

---

## 9. 지금 하지 말아야 할 것

- OIDC와 deployment token을 동시에 크게 재구성
- Azure Portal 설정을 추측으로 변경
- GitHub secret 삭제
- 배포 workflow와 앱 기능 코드를 한 PR에 섞기
- Node 버전 변경과 Azure `github_id_token` 경고 수정을 한 PR에 섞기
