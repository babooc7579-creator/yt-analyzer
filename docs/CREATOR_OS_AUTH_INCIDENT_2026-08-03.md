# Creator OS Azure 기본 주소 인증 장애 기록

발생·점검일: 2026-08-03 KST
현재 상태: 사용자 지정 운영 주소로 정상화
기본 운영 주소: `https://creator.kaion.co.kr/`
Azure 자동 생성 복구 주소: `https://lively-dune-0af1d2a00.7.azurestaticapps.net/`

## 1. 증상

Azure 자동 생성 주소에서 Microsoft 로그인을 진행하면 `identity.7.azurestaticapps.net/.auth/login/done` 인증 완료 단계가 열리지 않았다.

- Edge, Chrome, Whale에서 같은 현상 확인
- 모바일에서도 같은 현상 확인
- 브라우저 화면에는 `ERR_BLOCKED_BY_CLIENT`가 표시됨
- 카이온 홈페이지 Static Web App의 Microsoft 인증은 정상 동작

따라서 특정 브라우저 확장 프로그램이나 Azure 전체 인증 장애로 단정하지 않았다.

## 2. 정상으로 확인한 항목

- `public/staticwebapp.config.json`의 `/.auth/*` 공개 경로와 `creator_owner` 보호 경로
- 운영 빌드 결과물의 `staticwebapp.config.json` 배치
- Static Web App `yt-analyzer` 상태와 Standard SKU
- 소유자 `hy.lee@kaion.co.kr`의 `aad` 공급자와 `creator_owner,anonymous,authenticated` 역할
- 앱 루트에서 `/.auth/login/aad`로 이동하는 서버 응답
- 앱 로그인 endpoint에서 `identity.7.azurestaticapps.net`으로 이동하는 서버 응답
- 비로그인 `/.auth/me`의 `200`과 `clientPrincipal: null` 응답
- DNS, Windows 프록시와 hosts 파일에 Azure Static Web Apps 차단 항목이 없음
- 점검 시점 Azure Service Health의 활성 장애 없음

서버 응답이 정상이라는 사실만으로 브라우저 로그인 왕복이 정상이라고 판단하지 않았다.

## 3. 확정하지 않은 원인

근본 원인은 확정하지 않았다. 확인된 범위에서는 Azure 자동 생성 호스트와 관리형 인증 완료 흐름의 조합에서만 문제가 재현됐다.

다음 항목은 가능성으로만 남긴다.

- 자동 생성 호스트에 대한 브라우저·보안 필터의 호스트별 판정
- Azure Static Web Apps 인증 stamp의 호스트별 상태 문제
- 사용자 단말과 Azure 인증 callback 사이의 부분적 호환 문제

증거 없이 ESET, 브라우저 확장, Microsoft 계정, 앱 코드 중 하나를 단독 원인으로 기록하지 않는다.

## 4. 정상화 작업

새 Azure 앱이나 유료 서비스를 만들지 않고 기존 자원을 재사용했다.

1. 아이네임즈/UHOST DNS에서 `creator.kaion.co.kr` CNAME을 생성했다.
2. 대상은 `lively-dune-0af1d2a00.7.azurestaticapps.net`으로 설정했다.
3. UHOST 권한 DNS 두 곳의 CNAME 응답을 확인했다.
4. 기존 Static Web App `yt-analyzer`에 사용자 지정 도메인을 추가했다.
5. Azure 사용자 지정 도메인 상태 `Ready`를 확인했다.
6. Edge에서 새 주소의 Microsoft 로그인을 완료했다.

## 5. 운영 검수 결과

- `https://creator.kaion.co.kr/`에서 Creator OS 진입 성공
- 사이드바의 Microsoft 계정 보호 안내와 로그아웃 표시
- 새로고침 후 로그인 세션 유지
- 온라인 저장소(Azure DB) 채널 17개 재조회
- 보관 소재 1개와 링크 후보 1개 재조회
- 새 영상 수집과 YouTube API 호출 없음
- 운영 데이터 저장·수정·삭제 없음
- 앱 코드 수정과 프런트 재배포 없음

보호된 앱 루트가 열렸다는 것은 `/*`에 필요한 `creator_owner` 역할이 적용됐다는 운영 증거로 사용했다.

### DNS 전파 주의

연결 직후 공용 Google DNS에서는 `creator.kaion.co.kr`이 Azure Static Web Apps까지 정상 해석됐고, 해당 호스트명으로 직접 확인한 HTTPS 응답도 Microsoft 로그인으로 이동하는 `302`였다. 같은 시각 점검 PC의 기본 DNS 서버는 이전 `이름 없음` 결과를 계속 반환했다. Edge의 실제 로그인은 성공했으므로 앱·Azure 연결 장애로 단정하지 않고 DNS 전파와 재귀 DNS 캐시 차이로 기록한다. 운영 중 같은 현상이 있으면 시스템 DNS를 바로 변경하지 말고 공용 DNS 응답, 브라우저 접속과 HTTPS 응답을 분리해 확인한다.

## 6. 운영 결정

- 사용자 안내, 북마크와 Smoke Check는 `https://creator.kaion.co.kr/`을 기준으로 한다.
- Azure 자동 생성 주소는 배포 연결 확인과 복구용으로 유지하며 삭제하지 않는다.
- 인증 endpoint는 상대 경로 `/.auth/*`를 유지해 현재 접속 호스트를 사용한다.
- 사용자 역할 삭제·재초대, 인증 개인정보 purge, Static Web App 재생성은 실행하지 않는다.
- 사용자 지정 주소도 실패할 때만 Azure 지원 요청과 인증 구조 변경을 검토한다.

## 7. 재발 시 점검 순서

1. 새 운영 주소와 Azure 자동 생성 주소의 증상을 각각 기록한다.
2. `/.auth/me`, `/.auth/login/aad`, 앱 루트 응답을 구분한다.
3. Azure 사용자 지정 도메인 상태가 `Ready`인지 확인한다.
4. 공용 DNS와 현재 단말의 기본 DNS 응답을 구분한다.
5. `creator_owner` 사용자 역할을 읽기 전용으로 확인한다.
6. 다른 카이온 Static Web App 인증과 비교해 전체 장애와 호스트별 문제를 분리한다.
7. 로그인 후 새로고침과 Azure DB 읽기까지 확인한다.
8. 사용자 지정 주소에서도 재현되면 증거를 첨부해 Azure 지원을 검토한다.

로그인 화면 표시만으로 완료 처리하지 않고 앱 진입, 역할 적용, 새로고침 유지와 실제 Cloud 조회를 각각 확인한다.
