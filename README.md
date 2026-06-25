# 타임머신 CRM - 유튜브 소재 발굴 도구

유튜브 채널을 모니터링하고, '또터또(터진 건 또 터진다)' 영상을 발굴하는 개인용 도구입니다.

## 로컬에서 실행해보기 (선택사항)

```bash
npm install
npm run dev
```

## Azure Static Web Apps로 배포하기

1. 이 폴더 전체를 GitHub 저장소(repository)에 업로드합니다.
2. Azure Portal에서 "Static Web App" 리소스를 만들 때, 이 GitHub 저장소를 연결합니다.
3. 빌드 설정값은 다음과 같이 입력합니다.
   - **빌드 프리셋(Build Presets)**: Vite (목록에 있으면 선택, 없으면 Custom)
   - **앱 위치(App location)**: `/`
   - **출력 위치(Output location)**: `dist`
4. 연결하면 Azure가 자동으로 빌드 + 배포까지 진행하고, 끝나면 URL이 생성됩니다.

## 사용 방법

1. 앱 접속 후 YouTube Data API v3 키를 입력합니다. (API 키는 서버에 저장되지 않고, 브라우저에서만 사용됩니다.)
2. 모니터링할 채널을 카테고리별로 등록합니다.
3. 채널을 선택하고 [분석]을 눌러 데이터를 수집합니다.
4. [또터또 발굴 모드]로 6개월 이상 된 떡상 영상을 찾아냅니다.
