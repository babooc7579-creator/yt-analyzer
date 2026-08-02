export const IMPROVEMENT_CHECKPOINT_STATUS = {
  DONE: 'done',
  IN_PROGRESS: 'in_progress',
  DECISION_REQUIRED: 'decision_required',
  PLANNED: 'planned',
  LATER: 'later',
};

export const IMPROVEMENT_STATUS_META = {
  [IMPROVEMENT_CHECKPOINT_STATUS.DONE]: {
    label: '확인 완료',
    tone: 'emerald',
  },
  [IMPROVEMENT_CHECKPOINT_STATUS.IN_PROGRESS]: {
    label: '진행 중',
    tone: 'cyan',
  },
  [IMPROVEMENT_CHECKPOINT_STATUS.DECISION_REQUIRED]: {
    label: '결정 필요',
    tone: 'amber',
  },
  [IMPROVEMENT_CHECKPOINT_STATUS.PLANNED]: {
    label: '진행 예정',
    tone: 'indigo',
  },
  [IMPROVEMENT_CHECKPOINT_STATUS.LATER]: {
    label: '나중에',
    tone: 'slate',
  },
};

export const IMPROVEMENT_LOG_LAST_UPDATED = '2026-08-03';

export const CREATOR_OS_MENU_ROLE_AUDIT = [
  { section: '디스커버리 탐색', menu: '오늘의 레이더', role: '오늘 볼 채널과 수집 영상에서 만들 소재를 결정', dataBoundary: 'Azure DB 조회·판단 기록 저장', verification: '운영 클릭 확인' },
  { section: '디스커버리 탐색', menu: '또터또 탐색', role: '오래된 고성과 영상 후보를 별도 기준으로 탐색', dataBoundary: '불러온 수집 영상 정보 분석', verification: '운영 클릭 확인' },
  { section: '디스커버리 탐색', menu: '키워드 탐색', role: '기존 수집 영상 검색과 YouTube의 새 영상·채널 후보 발굴', dataBoundary: 'Azure DB 조회 탭·명시적 YouTube API 검색 탭 분리', verification: '영상 운영 검수 완료·채널 운영 검수 예정' },
  { section: '디스커버리 탐색', menu: '오늘 볼 채널', role: '오늘 조회할 채널 범위를 선택', dataBoundary: '화면 선택·Azure DB 채널 조회', verification: '운영 클릭 확인' },
  { section: '수집 영상·링크', menu: '수집 영상 목록', role: 'Azure DB에 보관된 수집 영상 정보를 검색·검토', dataBoundary: 'Azure DB 조회·YouTube API 없음', verification: '운영 클릭 확인' },
  { section: '수집 영상·링크', menu: '채널 태그별 보기', role: '수집 영상 목록을 채널 태그 기준으로 좁혀 탐색', dataBoundary: 'Azure DB 조회 결과의 전용 필터·별도 저장 없음', verification: '운영 클릭 확인' },
  { section: '수집 영상·링크', menu: '발견 링크함', role: '외부에서 발견한 링크를 저장·검색·검토하고 상태 관리', dataBoundary: '온라인 발견함(Azure DB) 조회·저장', verification: '운영 클릭 확인' },
  { section: '제작 스튜디오', menu: '제작 후보함', role: '무엇을 만들지 후보와 우선순위를 결정', dataBoundary: '제작 기록 Azure DB 조회·저장', verification: '운영 클릭 확인' },
  { section: '제작 스튜디오', menu: '소재 보관함', role: '나중에 다시 볼 수집 영상 소재를 보관', dataBoundary: '소재 보관함 Azure DB 조회·저장', verification: '운영 클릭 확인' },
  { section: '제작 스튜디오', menu: '대본 작업실', role: '선택한 제작 후보의 분석·구성·대본을 작성', dataBoundary: '대본 기록 Azure DB 조회·저장', verification: '운영 클릭 확인' },
  { section: '제작 스튜디오', menu: '업로드 캘린더', role: '제작 후보의 예정일과 준비 상태를 확인', dataBoundary: '제작 기록 Azure DB 조회·저장', verification: '운영 클릭 확인' },
  { section: '오퍼레이션 관제', menu: '채널 운영실', role: '채널 관리·등록·기존 영상 조회·신규 수집 통제', dataBoundary: '화면 이동·Azure DB·YouTube API를 단계별 분리', verification: '운영·로컬 클릭 확인' },
  { section: '오퍼레이션 관제', menu: '최근 수집 상태', role: '최근 수집 결과와 실패 후속 행동 확인', dataBoundary: 'Azure DB 수집 기록 조회·YouTube API 없음', verification: '운영 클릭 확인' },
  { section: '오퍼레이션 관제', menu: '설정', role: '분야·연결 상태·업무 도구 설정 관리', dataBoundary: '브라우저 표시 설정과 Azure DB 저장 분리', verification: '운영 클릭 확인' },
  { section: '업무 도구', menu: '업무 도구함', role: '공식 외부 조사 도구와 개인 링크를 실행', dataBoundary: '외부 링크·Creator OS 자동 저장 없음', verification: '운영 클릭 확인' },
  { section: '인사이트 / 학습', menu: '개선 기록', role: '현재 상태·검수·결정·다음 작업을 추적', dataBoundary: 'Git 기반 읽기 전용 기록', verification: '운영 클릭 확인' },
];

export const CREATOR_OS_IMPROVEMENT_AREAS = [
  {
    id: 'script-workspace',
    title: '대본 작업실',
    section: '제작 스튜디오',
    status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
    priority: 'P1',
    lastReviewedAt: '2026-07-29',
    currentSummary: '제작 후보 영상과 발견 링크 후보를 원본으로 제목, 분석, 구성안, 대본 본문, 진행 단계, 기존 통합 작업 메모와 업로드 예정일을 기존 온라인 저장소(Azure DB)의 videoUserRecords에 저장합니다. 운영에서 입력 유지와 저장·새로고침·재조회·원상복구까지 확인했습니다.',
    targetSummary: '제작 후보의 원본을 분석하고, 구성안을 만든 뒤, 대본을 작성·수정하고 최종본을 확정하는 독립 작업 공간으로 발전시킵니다.',
    nextAction: '현재 수동 작성 흐름은 정기 회귀 검수로 유지하고, 수정 이력과 AI 보조는 개인용 MVP 안정화 이후 별도 결정합니다.',
    decisions: [
      '제작 후보함과 통합하지 않고 별도 작업실로 유지합니다.',
      'AI 자동 분석과 대본 생성은 수동 작성 구조가 안정된 뒤 검토합니다.',
      '새 endpoint나 container 없이 기존 videoUserRecords 문서에 구조화 필드를 추가합니다.',
      '수정 이력과 이전 버전 비교는 개인용 MVP 이후에 검토합니다.',
    ],
    checkpoints: [
      {
        id: 'role-definition',
        label: '제작 후보함은 무엇을 만들지, 대본 작업실은 어떻게 만들지 담당하도록 역할 정의',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'workspace-name',
        label: '메뉴와 화면 이름을 대본 작업실로 통일',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'current-scope',
        label: '제목·분석·구성안·본문·진행 단계·기존 통합 메모·업로드 예정일의 현재 범위 표시',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'backend-contract',
        label: '백엔드가 기존 필드와 새 구조화 대본 필드를 함께 보존하도록 계약 확장',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'script-fields',
        label: '영상 분석·구성안·대본 본문·대본 진행 단계의 저장 구조 결정',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'writing-flow',
        label: '분석 → 구성 → 초안 → 수정 → 최종본 작업 흐름 구현',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'production-script-calendar-navigation',
        label: '제작 후보함 → 대본 작업실 → 업로드 캘린더 왕복 이동 검수',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'script-mobile-layout',
        label: '390×844 모바일에서 대본 입력 항목과 가로 넘침 검수',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'script-unsaved-navigation',
        label: '대본 수정 후 다른 메뉴 이동 시 미저장 경고 표시 검수',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'discovery-link-source',
        label: '발견 링크 제작 후보도 대본 작업의 원본으로 연결',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'revision-history',
        label: '대본 수정 이력과 이전 버전 비교',
        status: IMPROVEMENT_CHECKPOINT_STATUS.LATER,
      },
      {
        id: 'ai-assistance',
        label: '후킹·구조 분석과 대본 초안 AI 보조',
        status: IMPROVEMENT_CHECKPOINT_STATUS.LATER,
      },
    ],
  },
  {
    id: 'navigation-terms',
    title: '메뉴·용어 정리',
    section: '전체 화면',
    status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
    priority: 'P1',
    lastReviewedAt: '2026-07-28',
    currentSummary: '사용자 화면의 레퍼런스 금고 표현을 수집 영상·링크 구역과 수집 영상 목록으로 정리했습니다. 태그별 금고는 별도 보관 장소로 오해되지 않도록 채널 태그별 보기로 바꾸고 전체 수집 영상 목록으로 돌아가는 버튼을 연결했습니다.',
    targetSummary: '버튼 이름만 보고도 이동·조회·저장·YouTube API 수집 여부를 이해할 수 있도록 모든 화면의 용어를 통일합니다.',
    nextAction: '향후 메뉴 변경 시 채널 태그별 보기가 별도 저장 장소로 오해되지 않는지 정기 회귀 검수합니다.',
    decisions: [
      '영상 파일 자체가 아니라 영상 정보를 다루므로 수집 영상 목록이라는 표현을 사용합니다.',
      '수집 영상 정보와 발견 링크를 함께 묶는 사이드바 구역명은 수집 영상·링크로 표시합니다.',
      'Cloud라는 단독 표현 대신 온라인 저장소(Azure DB)처럼 실제 위치를 함께 표시합니다.',
    ],
    checkpoints: [
      {
        id: 'collected-video-term',
        label: '저장 영상 표현을 수집 영상 목록 중심으로 변경',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'storage-term',
        label: '온라인 저장소와 Azure DB의 의미를 사용자 안내에 함께 표시',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'remaining-reference-vault',
        label: '화면에 남아 있던 레퍼런스 금고 표현을 실제 기능명으로 정리',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'radar-collected-video-destination',
        label: '오늘의 레이더 이동 버튼을 수집 영상 목록이라는 실제 도착 화면명으로 통일',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'button-destination-audit',
        label: '모든 주요 버튼의 이름과 실제 결과 위치 대조 검수',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'channel-collection-stage-term',
        label: '채널 운영실의 온라인 저장소 조회와 YouTube 새 영상 수집 단계 이름 구분',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'production-script-calendar-route',
        label: '제작 후보함·대본 작업실·업로드 캘린더의 버튼명과 실제 도착 위치 대조',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'recent-scan-channel-route',
        label: '최근 수집 상태에서 선택한 채널의 관리·수집 단계와 분류 탭 연결',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'radar-vault-discovery-route',
        label: '오늘의 레이더·수집 영상 목록·소재 보관함·발견함의 이동과 빈 결과 복구 대조',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'settings-tools-channel-route',
        label: '설정·업무 도구함 왕복과 채널 등록 입력·결과 안내 대조',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
    ],
  },
  {
    id: 'discovery-consolidation',
    title: '수집 영상 탐색 통합',
    section: '디스커버리·레퍼런스',
    status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
    priority: 'P2',
    lastReviewedAt: '2026-07-28',
    currentSummary: '수집 영상 목록은 전체 검색·검토, 채널 태그별 보기는 같은 수집 영상 정보를 채널 태그 기준으로 좁히는 전용 보기, 또터또 탐색은 오래된 고성과 후보 판단을 담당합니다.',
    targetSummary: '메뉴 이름과 화면 안내만으로 전체 목록·전용 필터·독립 판단 화면의 차이를 이해할 수 있게 유지합니다.',
    nextAction: '수집 영상 목록과 채널 태그별 보기의 역할 설명 및 왕복 이동을 정기 회귀 검수합니다.',
    decisions: [
      '또터또 탐색은 오래된 고성과 영상을 찾는 판단 목적이 명확하므로 독립 화면을 유지하는 방향을 권장합니다.',
      '채널 태그별 보기는 새 보관함이 아니라 수집 영상 목록의 태그 전용 보기로 유지하며, 별도 저장소나 자동 수집을 추가하지 않습니다.',
    ],
    checkpoints: [
      {
        id: 'tag-vault-overlap',
        label: '태그별 금고와 수집 영상 목록의 중복 역할 확인',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'tag-filter-decision',
        label: '채널 태그별 보기를 수집 영상 목록의 전용 필터 화면으로 역할 정리',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'ttotto-purpose',
        label: '또터또 탐색의 독립 판단 화면 역할 유지',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
    ],
  },
  {
    id: 'youtube-keyword-discovery',
    title: 'YouTube 키워드 영상 찾기',
    section: '디스커버리 탐색',
    status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
    priority: 'P0',
    lastReviewedAt: '2026-08-03',
    currentSummary: '수집 영상 검색과 명시적 YouTube 검색을 분리했고, YouTube 검색 안에서 영상 찾기와 채널 찾기·비교를 다시 구분했습니다. 채널 검색은 현재 구독자·영상 수·누적 조회수·영상당 평균을 임시 결과로 보여주며 최대 4개를 비교할 수 있습니다. 채널 검색뿐 아니라 영상 검색 결과에도 채널 등록 상태와 `이 채널 등록 검토`를 표시해, 좋은 영상을 발견한 자리에서 해당 채널을 기존 채널 운영실 등록 단계로 이어갑니다. 영상의 발견 링크 저장과 채널 등록 검토는 독립된 선택입니다. 등록 검토는 입력칸만 채우고 이동하며 실제 YouTube 확인과 Azure DB 저장은 기존 등록 단계에서 별도로 실행합니다. 운영에서 바이브 코딩 채널 검색 1회로 12개 결과, 영상 검색 1회로 25개 결과와 투쏠ㅣAI 에이전트 채널 주소 전달을 확인했습니다. 이 검수 중 다른 화면에 다녀오면 임시 결과가 사라지는 문제를 발견해, 영상·채널 검색 조건과 결과를 앱 메모리에 유지하고 새로고침 때만 초기화하도록 보완했습니다. 배포 후 같은 흐름을 다시 검수해 검색 버튼을 다시 누르지 않고 YouTube 탭·검색어·25개 결과·첫 영상 카드가 복원되는 것을 확인했습니다. `국가`는 제작 국가 제한이 아니라 YouTube의 시청 가능 지역이고 `언어`는 완전 제한이 아니라 관련 결과 우선 조건임을 화면에 명시했습니다. 주요 검색 지역 11개와 우선 언어 10개를 선택할 수 있고, 결과에는 현재 선택값이 아니라 마지막 API 검색에 실제 적용된 조건을 따로 표시합니다. PR #1048 배포 뒤 운영에서 `copilot`·대한민국·한국어 우선·최근 30일 검색을 한 번 실행해 25개 결과와 `대한민국에서 시청 가능 · 한국어 우선 · 최근 30일 · 영상 길이 전체 · 관련도순` 표시를 확인했습니다. 채널 정보 확인·Azure DB 저장은 실행하지 않았고 등록 채널 수는 12개 그대로였습니다. PR #1050 배포 뒤 `바이브 코딩`·대한민국·한국어 우선 채널 검색을 한 번 실행해 12개 결과와 채널 설정 국가를 확인했습니다. 영상당 평균순 변경은 새 API 호출 없이 첫 결과를 `바이브코딩 레인 RaiN`으로 바꿨고, 언어 조건 변경 시 재검색 안내가 나타났다 원래 조건으로 복구하면 사라졌습니다.',
    targetSummary: '키워드만 입력해도 새 영상 후보를 비교하고 필요한 항목만 아이디어 창고와 제작 흐름으로 안전하게 이어갈 수 있게 합니다.',
    nextAction: '무결정 다음 작업은 7번 모바일 검색 결과의 필터·정렬·작업 버튼 밀도와 가로 넘침 검수입니다. 이어서 8번 화면 왕복 상태 유지까지 확인하고, 엄격한 언어 제한과 검색 후보 온라인 저장은 9~10번 결정 항목으로 멈춰 논의합니다.',
    decisions: [
      '기존 수집 영상 검색과 YouTube 신규 검색은 같은 작업 공간의 별도 탭으로 유지합니다.',
      '검색 결과 전체는 자동 저장하지 않고 사용자가 선택한 영상만 발견 링크함에 저장합니다.',
      '자동 입력 검색은 사용하지 않으며 검색과 다음 페이지는 명시적 YouTube API 작업으로 표시합니다.',
      '대박 비율과 하루 평균 조회수는 공식 지표가 아니라 앱 계산 추정값으로 표시합니다.',
      '새 Azure 자원·Cosmos DB container·유료 서비스를 추가하지 않고 기존 자원을 재사용합니다.',
      '채널 검색 결과는 현재 시점의 누적 통계이며 실제 최근 성장률이나 추세로 표시하지 않습니다.',
      '채널 검색 결과에서 자동 등록하지 않고 기존 채널 등록의 확인·저장 단계를 유지합니다.',
      '영상 검색 결과에서도 영상 후보 저장과 출처 채널 등록 검토를 분리해 둘 다 선택할 수 있게 합니다.',
      '검색 지역은 해당 국가에서 시청 가능한 결과, 우선 언어는 관련 결과의 우선순위라는 YouTube API 의미를 그대로 안내하며 제작 국가·엄격한 언어 제한으로 표현하지 않습니다.',
      '대한민국·한국어 우선 빠른 설정은 선택값만 바꾸며 검색 버튼을 누르기 전에는 YouTube API를 호출하지 않습니다.',
      '채널 결과 정렬은 이미 받은 결과에만 적용하며 정렬 변경으로 YouTube API를 다시 호출하지 않습니다.',
      '채널 설정 국가는 채널 운영자가 YouTube에 등록한 값만 표시하고 미등록 값을 추정하지 않습니다.',
      '등록 상태·채널 국가 유무·비교 선택 필터는 이미 받은 결과만 화면에서 좁히며 YouTube API나 Azure DB를 호출하지 않습니다.',
    ],
    checkpoints: [
      {
        id: 'keyword-source-separation',
        label: '수집 영상에서 찾기와 YouTube에서 새로 찾기의 데이터 출처·API 사용 구분',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'youtube-search-backend-contract',
        label: 'API 키를 서버에 유지하는 수동 영상 검색·상세 통계 결합 endpoint와 자동 테스트',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'youtube-search-filters-results',
        label: '검색 지역·우선 언어·기간·길이·조회수·정렬 조건과 실제 적용 조건·임시 결과 표시',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'youtube-search-discovery-handoff',
        label: '선택한 영상만 발견 링크함에 저장하고 이미 저장된 영상의 중복 선택 차단',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'youtube-search-live-round-trip',
        label: '운영 검색 1회·결과 표시·발견 링크 1건 저장·재조회·원상복구',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'youtube-channel-search',
        label: '키워드 기반 채널 검색·비교·채널 등록 연결',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'youtube-video-channel-handoff',
        label: '키워드 영상 검색 결과의 중요 채널을 기존 채널 등록 검토로 연결',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'youtube-search-navigation-session',
        label: '채널 등록 검토 후 돌아와도 재검색 없이 영상·채널 임시 결과와 조건 유지',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'youtube-search-convenience-controls',
        label: '대한민국·한국어 빠른 설정과 검색 조건 변경 시 재검색 필요 안내',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'youtube-channel-result-local-sort',
        label: '채널 결과의 화면 정렬과 채널 설정 국가 표시',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'youtube-channel-result-view-filters',
        label: '1~2. 등록 상태·채널 국가 유무·비교 선택만 보기와 화면 필터 초기화',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'youtube-channel-comparison-summary',
        label: '3. 비교 선택 채널의 핵심 수치·등록·국가 상태 요약 보강',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'youtube-channel-comparison-clear',
        label: '4. 비교 선택 전체 해제와 최대 4개 안내 보강',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'youtube-video-channel-registration-filter',
        label: '5. 영상 검색 결과를 출처 채널 등록 여부로 화면 필터',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'youtube-video-action-hierarchy',
        label: '6. 영상 후보 저장과 출처 채널 등록 검토의 버튼 우선순위 정돈',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'youtube-search-mobile-controls',
        label: '7. 모바일 검색 결과 필터·정렬·작업 버튼 밀도 점검',
        status: IMPROVEMENT_CHECKPOINT_STATUS.PLANNED,
      },
      {
        id: 'youtube-search-session-regression',
        label: '8. 화면 왕복 시 검색 조건·결과·화면 필터 유지 회귀 검수',
        status: IMPROVEMENT_CHECKPOINT_STATUS.PLANNED,
      },
      {
        id: 'youtube-strict-language-filter-decision',
        label: '9. 언어 정보가 비어 있는 결과 처리와 엄격한 언어 전용 필터',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DECISION_REQUIRED,
      },
      {
        id: 'youtube-search-candidate-storage-decision',
        label: '10. 검색 후보 전체 또는 채널 후보의 온라인 저장 범위와 보존 기간',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DECISION_REQUIRED,
      },
      {
        id: 'youtube-trend-history',
        label: '시간별 통계 기록을 바탕으로 실제 조회 증가량과 추세 비교',
        status: IMPROVEMENT_CHECKPOINT_STATUS.LATER,
      },
    ],
  },
  {
    id: 'data-safety',
    title: '데이터·API 안전 검수',
    section: '전체 데이터 흐름',
    status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
    priority: 'P1',
    lastReviewedAt: '2026-07-29',
    currentSummary: '온라인 저장소(Azure DB) 조회와 YouTube 새 영상 수집을 분리하고, 중요한 저장 버튼에는 데이터 변경 여부를 안내합니다. 제작 기록 1건의 저장 왕복과 Jinxy 단일 채널 수집을 검수했으며, 수집 실행 화면의 완료 카드·최근 수집 상태 이동·새로고침 후 Azure DB 재조회까지 운영에서 확인했습니다.',
    targetSummary: '화면 표시, 이동, DB 조회, DB 저장, YouTube API 수집을 모든 핵심 흐름에서 실제 결과까지 확인하고 기록합니다.',
    nextAction: '향후 수집 화면이나 백엔드 계약을 변경할 때만 1개 채널·1회 원칙으로 완료 카드와 최근 수집 상태를 회귀 검수합니다.',
    decisions: [
      'YouTube 새 영상 수집과 Azure DB 쓰기는 화면 이동 검수와 분리합니다.',
      '실제 저장 왕복 검수는 기존 제작 기록의 원문을 먼저 보존한 뒤 검수하고 즉시 원상복구합니다.',
      'YouTube 실제 수집 검수는 명시적으로 선택한 채널 1개를 한 번만 실행하고, 반복 실행 없이 최근 수집 상태와 Azure DB 재조회로 결과를 확인합니다.',
    ],
    checkpoints: [
      {
        id: 'lookup-vs-collection',
        label: 'Azure DB 조회와 YouTube 신규 수집 구분',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'button-safety-copy',
        label: '주요 저장·수집 버튼에 데이터 출처와 변경 여부 표시',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'cloud-round-trip',
        label: 'Azure DB 실제 저장 후 새로고침·재조회 유지 검수',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'single-channel-youtube-collection',
        label: '명시적으로 선택한 채널 1개의 YouTube 신규 수집 1회와 Azure DB 결과 재조회',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'collection-result-feedback',
        label: '수집 실행 화면에서 채널별 신규 수·통계 갱신 수·최근 수집 상태 위치를 즉시 안내',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
    ],
  },
  {
    id: 'operational-regression',
    title: '업무 시스템 정기 회귀 검수',
    section: '전체 핵심 화면',
    status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
    priority: 'P1',
    lastReviewedAt: '2026-08-02',
    currentSummary: '핵심 화면을 화면 표시, 실제 클릭, 보이는 변화, 결과 위치, 데이터 영향, 오류 복구, 모바일 순서로 점검합니다. Azure DB 제작 기록·업로드 일정 저장 왕복과 Jinxy 단일 채널 YouTube 신규 수집 1회 및 최근 수집 결과 재조회를 완료했습니다. 레이더 전체 작업 기록 삭제 경로를 차단했고, 소재 보관과 제작 후보 원본 용도를 분리했습니다. 현재 불러온 수집 영상 정보가 있으면 소재·제작 화면에 최신 표시 정보를 우선 반영합니다. 제작 기록 저장은 변경 필드만 전송하고 누락 필드를 보존합니다. 모든 제작 진행 기록은 오늘의 레이더에서 숨기고 제작 후보함에서 계속 확인합니다. 제작 후보 상태 저장이 실패하면 이 작업이 방금 만든 제작 전용 원본만 자동 정리하며 기존 소재 기록은 삭제하지 않습니다. 제작 원본 목록이 상위 라우팅 관문과 작업 화면 조립 관문을 모두 지나 후보함·대본 작업실·업로드 캘린더에 전달되도록 복구했고, 운영 제작 후보함에서 영상 1개·링크 1개·작업 항목 2개와 Jinxy 원본 표시를 확인했습니다. 저장·검색·검토·상태 관리를 함께 하는 링크 화면은 단일 저장 동작처럼 보이지 않도록 발견 링크함으로 정리했습니다. 백엔드는 Pull Request에서 Node.js 24 잠금 파일 설치와 전체 테스트만 실행하고 main에서만 기존 Azure Function App을 배포합니다. 프론트 CI는 Azure Static Web Apps 실제 Oryx 빌드와 같은 Node.js 22 계열로 검수합니다.',
    targetSummary: '배포마다 핵심 업무 흐름의 이름·버튼·결과·데이터 경계를 같은 기준으로 빠짐없이 재확인합니다.',
    nextAction: '배포마다 제작 원본 수와 후보함·대본 작업실·업로드 캘린더의 표시 수가 같은지 읽기 전용 회귀 검수합니다. 운영 발견 링크함에 남은 2026-07-20 임시 검증 링크 삭제 여부, 실제 부분 실패를 강제로 만드는 Azure DB 쓰기·삭제 검수와 다중 브라우저 동시 변경 보호는 별도 결정 뒤 진행합니다.',
    decisions: [
      '버튼 존재와 자동 테스트 통과만으로 운영 확인 완료라고 표시하지 않습니다.',
      'Azure DB 실제 쓰기는 원문 보존과 원상복구가 가능한 대상을 정해 실행하고, YouTube API 신규 수집은 별도 승인 후 실행합니다.',
      '모바일 기준 화면은 390×844이며 페이지 전체 가로 넘침이 없어야 합니다.',
      'Azure 배포의 github_id_token 경고는 입력 제거 시 실제 배포가 실패한 이력이 있어 Azure 인증 방식 결정 전까지 비차단 경고로 유지합니다.',
    ],
    checkpoints: [
      {
        id: 'radar-collection-regression',
        label: '오늘 볼 채널 → 수집 영상 목록 불러오기 → 오늘의 레이더 복귀',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'collection-vault-discovery-regression',
        label: '수집 영상 목록·소재 보관함·발견함 이동과 빈 결과 복구',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'production-regression',
        label: '제작 후보함 → 대본 작업실 → 업로드 캘린더 왕복',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'settings-tools-regression',
        label: '설정 ↔ 업무 도구함 왕복, 미저장 경고와 데이터 영향 안내',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'channel-add-regression',
        label: '채널 등록 빈 입력 차단, 중복 저장 차단, 오류 후 재시도',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'mobile-regression',
        label: '설정·업무 도구함·채널 등록 포함 핵심 화면 390×844 가로 넘침',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'stale-route-recovery',
        label: '배포 후 오래 열린 탭의 화면 파일 로딩 실패 시 새로고침 안내',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'write-round-trip-regression',
        label: 'Azure DB 실제 저장 후 새로고침·재조회 유지',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'schedule-round-trip-regression',
        label: '업로드 예정일 저장 → 캘린더 재조회 → 날짜 미정 원상복구',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'discovery-tools-regression',
        label: '또터또 빈 결과 복구와 키워드 추천어 선택 후 수집 영상 결과 표시',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'recent-operations-route-regression',
        label: '최근 수집 상태의 채널 카드 → 해당 채널이 선택된 채널 운영실 연결',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'discovery-operations-mobile-regression',
        label: '또터또·키워드·최근 수집 상태·채널 운영실 390×844 가로 넘침',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'recent-scan-filter-history-regression',
        label: '최근 수집 상태 검색·조합 필터·정렬·과거 실행 상세 펼치기',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'explicit-channel-scan-safety',
        label: '채널을 선택하지 않으면 YouTube 새 영상 수집을 실행할 수 없도록 차단',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'single-channel-live-scan-regression',
        label: '선택 채널 1개 YouTube 신규 수집 1회 → 최근 수집 상태 → 새로고침 후 Azure DB 재조회',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'production-script-calendar-regression',
        label: '제작 후보 → 대본 작업실 → 업로드 캘린더 → 대본 이어쓰기 왕복',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'collected-video-selection-regression',
        label: '수집 영상 카드·리스트 보기와 다중 선택 후 AI 요청문 작업 막대 표시',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'partial-storage-warning-scope',
        label: '일부 Azure DB 기능 연결 실패가 다른 정상 조회까지 실패한 것처럼 보이지 않도록 경고 범위 표시',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'selected-video-copy-clear-regression',
        label: 'AI 요청문 실제 클립보드 내용·복사 완료 안내·전체 선택 해제',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'mobile-list-guidance',
        label: '390×844 리스트 보기의 제목·조회수·대박 지수·게시일 중심 간결 목록',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'daily-three-minute-regression',
        label: '저장·삭제·YouTube 신규 수집 없는 매일 3분 핵심 회귀 순서',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'daily-readonly-test-command',
        label: '매일 핵심 안전 계약을 한 번에 확인하는 npm run test:daily 자동 검수 명령',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'visible-filter-selection-state',
        label: '적용 필터 수·화면 선택 수 표시와 선택을 유지하는 필터 초기화',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'feature-specific-storage-retry',
        label: '영상 판단 기록·소재 보관함 오류별 Azure DB 읽기 전용 다시 확인',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'storage-retry-pending-state',
        label: 'Azure DB 읽기 재확인 처리 중 표시와 중복 클릭 방지',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'storage-retry-result-feedback',
        label: '영상 판단 기록·소재 보관함별 재확인 성공·실패 결과 안내',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'video-search-quick-clear',
        label: '영상 선택을 유지하는 수집 영상 검색어 빠른 지우기',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'mobile-long-title-actions',
        label: '390×844 긴 제목과 소재 보관·제작 후보 버튼 배치 보완',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'daily-readonly-github-check',
        label: 'PR과 main 반영 때 GitHub에서 별도 이름으로 보이는 핵심 읽기 전용 자동 검수',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'deployment-warning-decision-boundary',
        label: 'github_id_token 경고와 실제 배포 성공의 분리 및 변경 보류 기준',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'radar-full-record-clear-protection',
        label: '판단 초기화가 제작 후보·대본·업로드 일정을 포함한 전체 작업 기록을 삭제하지 못하도록 화면 실행 경로 차단',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'scrapbook-production-source-separation',
        label: '소재 보관 해제와 제작 후보 원본 보존을 분리하고 후보함·대본 작업실·업로드 캘린더 연결 유지',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'scrapbook-current-metadata-overlay',
        label: '현재 불러온 수집 영상의 최신 표시 정보를 소재·제작 원본에 비파괴적으로 병합',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'production-record-partial-update-safety',
        label: '대본·일정·제작 상태의 변경 필드만 저장하고 누락 필드는 백엔드에서 보존',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'legacy-production-radar-visibility',
        label: '과거 호환 제작 상태를 포함한 모든 제작 진행 영상을 오늘의 레이더에서 숨기고 제작 후보함에서 계속 확인',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'production-source-failure-rollback',
        label: '제작 후보 상태 저장 실패 시 방금 만든 제작 전용 원본만 자동 정리하고 기존 소재 기록 보호',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'production-source-route-continuity',
        label: '소재 보관함·제작 후보함·대본 작업실·업로드 캘린더의 제작 원본 목록 전달 경로와 후보 수 일치',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'discovery-link-workspace-naming',
        label: '발견 링크 저장·검색·검토·상태 관리를 포함하는 화면 이름을 발견 링크함으로 통일',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'discovery-smoke-link-cleanup-decision',
        label: '운영 발견 링크함의 Codex 임시 흐름 검증 2026-07-20 기록 삭제 여부',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DECISION_REQUIRED,
      },
      {
        id: 'backend-pr-validation',
        label: '백엔드 Pull Request 사전 테스트와 main 전용 Azure Function 배포 분리',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'frontend-ci-runtime-alignment',
        label: '프론트 Pull Request 검사와 Azure Static Web Apps 실제 빌드의 Node.js 22 계열 일치',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'compatibility-facade-audit',
        label: 'functionApi·라우팅 호환 관문을 실제 중복 로직과 구분하고 신규 코드의 도메인 모듈 직접 사용 기준 기록',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
    ],
  },
];
