export const CREATOR_OS_PRODUCT_MAP = [
  {
    title: '디스커버리 탐색',
    description: '발굴: 오늘 볼 만한 소재 신호를 찾습니다.',
    items: [
      { id: 'home', label: '오늘의 레이더', status: 'live', summary: '오늘 무엇을 보면 되는지 한 화면에서 확인합니다.' },
      { id: 'discovery-trends', label: '트렌드 스캐너', status: 'soon', summary: '외부 트렌드와 급상승 신호를 연결할 예정입니다.' },
      { id: 'discovery-ttotto', label: '터또터 탐색', status: 'soon', summary: '시간이 지나 노출이 멈춘 검증된 후보를 전용 화면으로 분리할 예정입니다.' },
      { id: 'discovery-keywords', label: '키워드 탐색', status: 'soon', summary: '키워드별 소재 흐름을 모아볼 예정입니다.' },
      { id: 'discovery-watchlist', label: '오늘 볼 채널', status: 'soon', summary: '오늘 다시 확인할 채널 묶음을 준비 중입니다.' },
    ],
  },
  {
    title: '레퍼런스 금고',
    description: '보관: 영상과 채널을 자산처럼 쌓습니다.',
    items: [
      { id: 'vault-all', label: '올인원 보관함', status: 'live', summary: '기존 영상 보드와 카드/리스트 보기를 사용합니다.' },
      { id: 'vault-videos', label: '저장한 영상', status: 'live', summary: '저장된 영상 데이터와 영상 보드를 확인합니다.' },
      { id: 'vault-channels', label: '저장한 채널', status: 'live', summary: '기존 채널 목록과 수집 상태를 확인합니다.' },
      { id: 'vault-tags', label: '태그별 금고', status: 'soon', summary: '채널의 결과 태그별 보관함을 분리할 예정입니다.' },
      { id: 'vault-sources', label: '발견함 / 링크 수집', status: 'live', summary: '외부에서 발견한 링크를 수동 저장하고 검토 상태를 관리합니다.' },
    ],
  },
  {
    title: '제작 스튜디오',
    description: '제작: 저장한 소재를 제작 후보로 전환합니다.',
    items: [
      { id: 'studio-candidates', label: '제작 후보함', status: 'live', summary: '스크랩 영상과 발견함 링크를 제작 후보로 모아봅니다.' },
      { id: 'studio-scrapbook', label: '제작/스크랩북', status: 'live', summary: '별표로 모은 영상을 제작 후보로 봅니다.' },
      { id: 'studio-script', label: '대본 보드', status: 'soon', summary: '제목, 인트로, 대본 초안을 관리할 예정입니다.' },
      { id: 'studio-calendar', label: '업로드 캘린더', status: 'soon', summary: '제작 일정과 업로드 후보를 연결할 예정입니다.' },
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
      { id: 'ops-channels', label: '채널 목록', status: 'live', summary: '기존 채널 목록과 마지막 수집 상태를 사용합니다.' },
      { id: 'ops-add-channel', label: '새 채널 등록', status: 'live', summary: '기존 채널 미리보기와 저장 영역을 사용합니다.' },
      { id: 'ops-selected-scan', label: '선택 채널 수집', status: 'live', summary: '체크한 채널만 새 영상 수집을 실행할 수 있습니다.' },
      { id: 'ops-scan-log', label: '수집 로그', status: 'soon', summary: '수집 이력과 실패 원인을 모아볼 예정입니다.' },
      { id: 'ops-api', label: 'API 사용량', status: 'soon', summary: 'YouTube API 호출량과 비용 위험을 볼 수 있게 할 예정입니다.' },
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

export const CREATOR_OS_ITEMS = CREATOR_OS_PRODUCT_MAP.flatMap((section) => (
  section.items.map((item) => ({ ...item, sectionTitle: section.title }))
));

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
];

export const REFERENCE_VAULT_VIEWS = [
  'vault-all',
  'vault-videos',
];

export const getCreatorOsItem = (itemId) => {
  return CREATOR_OS_ITEMS.find((item) => item.id === itemId) || CREATOR_OS_ITEMS[0];
};
