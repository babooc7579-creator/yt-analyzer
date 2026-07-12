# Creator OS 개인용 접근 보호

작성일: 2026-07-12 KST

## 1. 결정

현재 개인용 Creator OS는 Azure Static Web Apps Standard와 Microsoft Entra ID 로그인을 사용해 보호한다.

- 앱과 API는 `creator_owner` 역할을 가진 사용자만 접근한다.
- 사용자는 Microsoft 계정과 기존 MFA로 로그인한다.
- 기존 Azure Function App을 Static Web Apps의 `/api` 경로에 연결한다.
- Function endpoint를 브라우저에서 직접 사용하는 현재 방식을 중단한다.
- DB schema, 기존 `userId`, localStorage key는 바꾸지 않는다.
- 다중 사용자 데이터 분리는 이번 범위에 포함하지 않는다.

## 2. 현재 구조와 변경 후 구조

변경 전:

```text
브라우저
  -> Azure Static Web Apps
  -> 별도 공개 Function App URL
  -> Cosmos DB
```

변경 후:

```text
브라우저
  -> Microsoft Entra ID 로그인
  -> Static Web Apps creator_owner 확인
  -> 같은 도메인의 /api
  -> 연결된 Azure Function App
  -> Cosmos DB
```

## 3. 코드 기준

### 배포 설정

`public/staticwebapp.config.json`에서 다음 경로를 보호한다.

- `/*`: `creator_owner`만 접근
- `/api/*`: `creator_owner`만 접근
- `/.auth/*`: 로그인과 로그아웃을 위해 공개
- `/access-denied.html`: 로그인했지만 역할이 없는 사용자에게 안내

### API 주소

운영 프론트는 절대 Function URL 대신 `/api`를 사용한다.

로컬 Vite 개발 서버는 `/api` 요청을 `http://127.0.0.1:7071`의 로컬 Azure Functions로 전달한다. 운영 Cloud Function의 직접 URL은 접근 보호 적용 후 로컬 개발용으로 사용하지 않는다.

### 사용자 표시

사이드바 하단에 다음을 표시한다.

- Microsoft 계정으로 보호됨
- 로그아웃

## 4. Azure 적용 순서

서비스 중단 시간을 줄이기 위해 다음 순서를 지킨다.

1. 프론트 코드와 테스트를 완료한다.
2. Static Web Apps를 Standard로 변경한다.
3. 기존 `yt-analyzer-func` Function App을 Production API로 연결한다.
4. 프론트 변경을 main에 배포한다.
5. 본인 Microsoft 계정에 `creator_owner` 역할을 부여한다.
6. 로그인 후 채널, 저장 영상, 스크랩북, 발견함 조회를 확인한다.
7. 직접 Function URL이 차단되는지 확인한다.

연결과 배포 사이에는 저장 데이터 조회가 잠시 실패할 수 있다. 데이터 삭제나 DB migration은 실행하지 않는다.

## 5. 비용 기준

- East Asia Static Web Apps Standard: 월 USD 9
- 12개월 기준: USD 108
- 월 100GB 대역폭 포함
- Azure Front Door 추가 기능은 사용하지 않는다.
- Microsoft Azure Sponsorship 크레딧에서 일반 Azure 사용량으로 차감한다.

## 6. 되돌리기

문제가 생기면 다음 순서로 되돌린다.

1. 프론트 API base를 기존 Function URL로 복구한다.
2. `staticwebapp.config.json`의 전체 접근 제한을 제거한다.
3. Static Web Apps에서 연결된 Function App을 해제한다.
4. 앱과 저장 영상 조회를 확인한다.
5. 필요할 때만 Standard를 Free로 되돌린다.

DB와 localStorage를 변경하지 않으므로 접근 보호 자체의 롤백에는 데이터 migration이 필요하지 않다.

## 7. 이번 범위에서 하지 않는 것

- `userId: default` 데이터 migration
- 다중 사용자별 Cosmos partition 재설계
- 별도 로그인 라이브러리 추가
- Microsoft Graph 자동 역할 할당
- Private Endpoint 또는 IP 제한
- Azure Front Door 추가 기능
- 비밀번호를 프론트 코드에 저장

## 8. 완료 기준

- 로그아웃 상태에서 앱 접속 시 Microsoft 로그인으로 이동
- `creator_owner` 계정은 앱 접속 가능
- 역할이 없는 계정은 접근 거부 안내 표시
- 같은 도메인의 `/api`로 채널과 저장 영상 조회 성공
- 저장, 수정, 삭제 기능이 기존과 동일하게 동작
- Function App 직접 URL의 익명 접근 차단
- 전체 프론트 테스트와 빌드 통과

