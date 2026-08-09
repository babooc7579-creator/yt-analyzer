export const REFERENCE_VAULT_EMPTY_STATE = {
  title: '불러온 수집 영상 정보가 없습니다',
  description: '영상 파일을 저장하는 화면이 아닙니다. 오늘 볼 채널을 선택한 뒤, 온라인 저장소(Azure DB)에 기록된 영상 정보를 불러와 검토하며 새 영상 수집은 필요할 때만 따로 실행합니다.',
  steps: [
    {
      title: '1. 오늘 볼 채널 선택',
      description: '등록된 채널 중 오늘 확인할 채널을 선택합니다. 선택만으로 영상 조회나 새 영상 수집은 실행되지 않습니다.',
    },
    {
      title: '2. 수집 영상 목록 불러오기',
      description: '온라인 저장소(Azure DB)에 이미 보관된 수집 영상 정보를 먼저 조회합니다. 새 YouTube API 호출은 없습니다.',
    },
    {
      title: '3. 필요할 때 새 영상 수집',
      description: '새 데이터가 필요할 때만 선택 채널을 수집합니다. 이 단계는 YouTube API를 호출할 수 있습니다.',
    },
  ],
  homeButton: {
    label: '오늘 레이더로',
    title: '오늘 레이더로 이동합니다. 화면 이동만으로 YouTube API를 새로 호출하지 않습니다.',
    ariaLabel: '오늘 레이더 화면 열기, 이동만으로 YouTube API 호출 없음',
  },
  channelWatchlistButton: {
    label: '오늘 볼 채널 선택',
    title: '오늘 볼 채널 화면으로 이동합니다. 이동만으로 조회, 저장, 새 영상 수집 또는 YouTube API 호출은 실행하지 않습니다.',
    ariaLabel: '오늘 볼 채널 화면 열기, 이동만으로 조회나 저장 또는 YouTube API 호출 없음',
  },
};

export const SCRAPBOOK_EMPTY_STATE = {
  title: '스크랩된 영상이 없습니다',
  description: '소재 보관함은 나중에 다시 볼 수집 영상을 모아두는 곳입니다. 별표로 보관한 영상만 이곳에 표시되며, 제작 후보와는 별도로 관리합니다.',
  steps: [
    {
      title: '1. 채널 저장',
      description: '소재를 모을 채널을 온라인 저장소(Azure DB)의 채널 목록에 저장합니다. 영상 수집은 별도 버튼에서 실행합니다.',
    },
    {
      title: '2. 수집 영상 목록 불러오기',
      description: '온라인 저장소(Azure DB)에 보관된 수집 영상 정보만 조회합니다. 새 YouTube API 호출은 없습니다.',
    },
    {
      title: '3. 별표 저장',
      description: '다시 볼 영상에 별표를 눌러 온라인 저장소(Azure DB)의 소재 보관함에 보관합니다.',
    },
  ],
  homeButton: {
    label: '오늘 레이더로',
    title: '오늘 레이더로 이동합니다. 화면 이동만으로 YouTube API를 새로 호출하지 않습니다.',
    ariaLabel: '오늘 레이더 화면 열기, 이동만으로 YouTube API 호출 없음',
  },
  referenceVaultButton: {
    label: '수집 영상 목록',
    title: '수집 영상 목록 화면을 엽니다. 온라인 저장소(Azure DB)에 보관된 수집 영상 정보 조회 흐름이며 YouTube API를 새로 호출하지 않습니다.',
    ariaLabel: '수집 영상 목록 화면 열기, 온라인 저장소(Azure DB) 조회 흐름이며 YouTube API 호출 없음',
  },
};

export const DISCOVERY_LINKS_EMPTY_STATE = {
  title: '아직 저장된 발견 링크가 없습니다.',
  description: '왼쪽 입력창에 외부에서 본 URL을 직접 저장하면 온라인 발견함(Azure DB)에 검토 목록이 생깁니다.',
  steps: [
    {
      title: '1. URL 붙여넣기',
      description: '인스타, 유튜브, 웹 링크를 수동으로 기록합니다.',
    },
    {
      title: '2. 상태 정리',
      description: '받은 링크, 확인 중, 보관, 제작 후보, 제외로 나눕니다.',
    },
    {
      title: '3. 안전 기준',
      description: '외부 사이트 자동 수집이나 파일 다운로드는 실행하지 않습니다.',
    },
  ],
};

export const PRODUCTION_KANBAN_EMPTY_STATE = {
  title: '아직 제작 후보가 없습니다',
  description: '제작 후보함은 오늘 무엇을 만들지 고르는 작업 공간입니다. 소재 보관함의 모든 영상이 자동으로 제작 후보가 되지는 않습니다. 오늘의 레이더, 수집 영상 목록, 발견 링크함에서 만들 만한 항목만 제작 후보로 표시하면 이곳에 보입니다.',
  steps: [
    {
      title: '1. 오늘 레이더에서 고르기',
      description: '수집 영상을 불러온 뒤 오늘 볼 후보에서 제작 후보로 표시할 영상을 고릅니다.',
    },
    {
      title: '2. 수집 영상에서 고르기',
      description: '온라인 저장소(Azure DB)에 보관된 수집 영상 정보만 훑고 제작 후보로 표시합니다. 새 YouTube API 호출은 없습니다.',
    },
    {
      title: '3. 발견 링크에서 표시하기',
      description: '외부에서 본 링크를 온라인 발견함(Azure DB)에 저장하고 상태를 제작 후보로 표시합니다.',
    },
  ],
  referenceVaultButton: {
    label: '수집 영상 목록',
    title: '수집 영상 목록 화면을 엽니다. 온라인 저장소(Azure DB) 조회이며 YouTube API를 새로 호출하지 않습니다.',
    ariaLabel: '수집 영상 목록 화면 열기, 온라인 저장소(Azure DB) 조회이며 YouTube API 호출 없음',
  },
  discoveryLinksButton: {
    label: '발견 링크함',
    title: '발견 링크함을 엽니다. 외부 사이트 자동 수집이나 다운로드는 실행하지 않습니다.',
    ariaLabel: '발견 링크함 화면 열기, 외부 자동 수집이나 다운로드 없음',
  },
};

export const VIDEO_FILTER_EMPTY_STATE = {
  title: '필터 조건에 맞는 영상이 없습니다',
  description: '검색어나 필터를 낮춰 보세요. 새 데이터가 필요할 때만 “선택 채널 새 영상 수집”을 실행합니다. 이 작업은 YouTube API를 호출할 수 있습니다.',
  resetButton: {
    label: '필터 초기화',
    title: '검색어와 필터 조건만 기본값으로 돌립니다. 저장, 수집, YouTube API 호출은 실행하지 않습니다.',
    ariaLabel: '검색어와 필터 조건 초기화, 저장이나 수집 또는 YouTube API 호출 없음',
  },
};
