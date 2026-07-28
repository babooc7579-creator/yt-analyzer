export const CREATOR_OS_PRODUCT_MAP = [
  {
    title: '디스커버리 탐색',
    description: '발굴: 오늘 볼 만한 소재 신호를 찾습니다.',
    items: [
      { id: 'home', label: '오늘의 레이더', status: 'live', summary: '오늘 무엇을 보면 되는지 한 화면에서 확인합니다.' },
      { id: 'discovery-trends', label: '트렌드 스캐너', status: 'soon', summary: '외부 트렌드와 급상승 신호를 연결할 예정입니다.' },
      { id: 'discovery-ttotto', label: '또터또 탐색', status: 'live', summary: '6개월 이상 지났고 채널 평균보다 강하게 반응한 수집 영상을 전용 화면에서 검토합니다.' },
      { id: 'discovery-keywords', label: '키워드 탐색', status: 'live', summary: '온라인 저장소(Azure DB)에 보관된 수집 영상의 제목과 채널명을 검색하고 판단 작업으로 연결합니다.' },
      { id: 'discovery-watchlist', label: '오늘 볼 채널', status: 'live', summary: '운영중 채널을 등급과 마지막 수집일 기준으로 정렬하고 오늘 확인할 범위를 고릅니다.' },
    ],
  },
  {
    title: '레퍼런스 금고',
    description: '보관: 영상과 발견 링크를 자산처럼 쌓습니다.',
    items: [
      { id: 'vault-videos', label: '수집 영상 목록', status: 'live', summary: '수집된 영상 정보와 영상 보드를 확인합니다.' },
      { id: 'vault-tags', label: '태그별 금고', status: 'live', summary: '기존 채널 태그별로 채널을 선택하고 온라인 저장소(Azure DB)의 수집 영상을 묶어 봅니다.' },
      { id: 'vault-sources', label: '발견 링크 저장', status: 'live', summary: '외부에서 발견한 링크를 온라인 발견함(Azure DB)에 수동 저장하고 검토 상태를 관리합니다.' },
    ],
  },
  {
    title: '제작 스튜디오',
    description: '제작: 후보로 표시한 소재를 제작 흐름으로 정리합니다.',
    items: [
      { id: 'studio-candidates', label: '제작 후보함', status: 'live', summary: '제작 후보로 표시한 영상과 발견함 링크를 함께 봅니다.' },
      { id: 'studio-scrapbook', label: '제작/스크랩북', status: 'live', summary: '별표로 보관한 영상과 제작 후보를 구분해 봅니다.' },
      { id: 'studio-script', label: '대본 보드', status: 'live', summary: '제작 후보의 제목, 구성 메모, 업로드 예정일을 온라인 저장소(Azure DB)에 정리합니다.' },
      { id: 'studio-calendar', label: '업로드 캘린더', status: 'live', summary: '제작 후보함에 온라인 저장소(Azure DB)에 저장된 목표 업로드 날짜를 달력으로 확인합니다.' },
      { id: 'studio-status', label: '제작 상태판', status: 'soon', summary: '미검토, 분석중, 대본화, 제작완료 상태를 관리할 예정입니다.' },
    ],
  },
  {
    title: 'AI 공방',
    description: '분석: 소재를 제목, 대본, 작전으로 바꿉니다.',
    items: [
      { id: 'ai-hook', label: '후킹 분석', status: 'soon', summary: '영상이 터진 첫 끌림 요소를 분석할 예정입니다.' },
      { id: 'ai-structure', label: '기승전결 분석', status: 'soon', summary: '원본 영상의 전개 구조를 분해할 예정입니다.' },
      { id: 'ai-wow', label: '와우포인트 분석', status: 'soon', summary: '시청자가 멈춰 보는 놀람 지점을 찾을 예정입니다.' },
      { id: 'ai-shorts-script', label: '쇼츠 대본 생성', status: 'soon', summary: '레퍼런스를 쇼츠용 대본 초안으로 바꿀 예정입니다.' },
      { id: 'ai-title-thumb', label: '제목/썸네일 문구 생성', status: 'soon', summary: '클릭을 부르는 제목과 썸네일 문구를 제안할 예정입니다.' },
      { id: 'ai-remix', label: '우라까이 재구성 도우미', status: 'soon', summary: '복제가 아니라 안전한 재구성 방향을 잡을 예정입니다.' },
      { id: 'ai-risk', label: '복사 위험 체크', status: 'soon', summary: '원본과 너무 가까운 표현 위험을 점검할 예정입니다.' },
    ],
  },
  {
    title: '오퍼레이션 관제',
    description: '수집: 채널, 선택 수집, 운영 상태를 통제합니다.',
    items: [
      { id: 'ops-channels', label: '채널 운영실', status: 'live', summary: '채널 관리, 새 채널 등록, 수집 영상 확인과 새 영상 수집을 단계별로 진행합니다.' },
      { id: 'ops-scan-log', label: '최근 수집 상태', status: 'live', summary: '채널별 마지막 수집 결과와 실패·미수집 상태를 한곳에서 확인합니다.' },
      { id: 'ops-api', label: 'API 사용량', status: 'soon', summary: 'YouTube API 호출량과 비용 위험을 볼 수 있게 할 예정입니다.' },
      { id: 'ops-settings', label: '설정', status: 'live', summary: '채널 분야와 데이터 연결 기준을 한곳에서 확인하고 관리합니다.' },
    ],
  },
  {
    title: '업무 도구',
    description: '바로가기: 소재 조사와 운영에 자주 쓰는 외부 도구를 엽니다.',
    items: [
      { id: 'tools-bookmarks', label: '업무 도구함', status: 'live', summary: '키워드 조사와 채널 운영에 필요한 공식 외부 도구를 한곳에서 엽니다.' },
    ],
  },
  {
    title: '인사이트 / 학습',
    description: '축적: 성과와 패턴을 다음 판단으로 남깁니다.',
    items: [
      { id: 'insight-report', label: '성과 리포트', status: 'soon', summary: '채널과 소재 성과를 리포트로 볼 예정입니다.' },
      { id: 'insight-patterns', label: '터진 패턴 학습', status: 'soon', summary: '반복되는 성공 패턴을 정리할 예정입니다.' },
      { id: 'insight-notes', label: '운영 노트', status: 'soon', summary: '운영자가 남긴 판단 기록을 모아볼 예정입니다.' },
      { id: 'insight-benchmark', label: '벤치마크 리포트', status: 'soon', summary: '채널별 벤치마크 분석을 준비 중입니다.' },
    ],
  },
];

const CREATOR_OS_VISIBLE_ITEMS = CREATOR_OS_PRODUCT_MAP.flatMap((section) => (
  section.items.map((item) => ({ ...item, sectionTitle: section.title }))
));

// Duplicate legacy views remain addressable, but are hidden from the sidebar.
export const LEGACY_REFERENCE_ITEMS = [
  { id: 'vault-all', label: '올인원 보관함', status: 'live', summary: '수집 영상 목록 화면과 같은 기존 영상 보드입니다.', sectionTitle: '레퍼런스 금고' },
  { id: 'vault-channels', label: '저장한 채널', status: 'live', summary: '채널 운영실로 통합하기 전의 기존 채널 목록입니다.', sectionTitle: '레퍼런스 금고' },
];

// Older shortcuts keep resolving while the sidebar exposes one unified channel workspace.
export const LEGACY_CHANNEL_OPERATION_ITEMS = [
  { id: 'ops-add-channel', label: '새 채널 등록', status: 'live', summary: '채널 운영실의 새 채널 등록 단계로 이동합니다.', sectionTitle: '오퍼레이션 관제' },
  { id: 'ops-selected-scan', label: '선택 채널 새 영상 수집', status: 'live', summary: '채널 운영실의 YouTube API 수집 단계로 이동합니다.', sectionTitle: '오퍼레이션 관제' },
];

export const CREATOR_OS_ITEMS = [
  ...CREATOR_OS_VISIBLE_ITEMS,
  ...LEGACY_REFERENCE_ITEMS,
  ...LEGACY_CHANNEL_OPERATION_ITEMS,
];

export const READY_CREATOR_VIEWS = [
  'vault-all',
  'vault-videos',
  'vault-channels',
  'studio-candidates',
  'studio-scrapbook',
  'ops-channels',
  'ops-add-channel',
  'ops-selected-scan',
];

export const CHANNEL_CREATOR_VIEWS = [
  'vault-channels',
  'ops-channels',
  'ops-add-channel',
  'ops-selected-scan',
];

export const SCRAPBOOK_CREATOR_VIEWS = [
  'studio-candidates',
  'studio-scrapbook',
  'studio-script',
  'studio-calendar',
];

export const REFERENCE_VAULT_VIEWS = [
  'vault-all',
  'vault-videos',
];

export const getCreatorOsItem = (itemId) => {
  return CREATOR_OS_ITEMS.find((item) => item.id === itemId) || CREATOR_OS_ITEMS[0];
};
