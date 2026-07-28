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

export const IMPROVEMENT_LOG_LAST_UPDATED = '2026-07-28';

export const CREATOR_OS_IMPROVEMENT_AREAS = [
  {
    id: 'script-workspace',
    title: '대본 작업실',
    section: '제작 스튜디오',
    status: IMPROVEMENT_CHECKPOINT_STATUS.IN_PROGRESS,
    priority: 'P1',
    lastReviewedAt: '2026-07-28',
    currentSummary: '제작 후보 영상의 제목, 영상 분석, 구성안, 대본 본문, 대본 진행 단계, 기존 통합 작업 메모와 업로드 예정일을 기존 온라인 저장소(Azure DB)의 videoUserRecords에 명시적으로 저장합니다. 제작 후보함·대본 작업실·업로드 캘린더의 이동, 모바일 배치와 미저장 이탈 경고를 실제 화면에서 확인했습니다.',
    targetSummary: '제작 후보의 원본을 분석하고, 구성안을 만든 뒤, 대본을 작성·수정하고 최종본을 확정하는 독립 작업 공간으로 발전시킵니다.',
    nextAction: '별도 승인 후 테스트용 제작 후보에서 저장 → 새로고침 → 재조회 유지 여부를 실제 검수합니다.',
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
        status: IMPROVEMENT_CHECKPOINT_STATUS.PLANNED,
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
    status: IMPROVEMENT_CHECKPOINT_STATUS.IN_PROGRESS,
    priority: 'P1',
    lastReviewedAt: '2026-07-28',
    currentSummary: '사용자 화면의 레퍼런스 금고 표현을 수집 영상·링크 구역과 수집 영상 목록으로 정리했습니다. 제작 흐름, 최근 수집 상태, 오늘의 레이더, 수집 영상 목록, 소재 보관함과 발견함의 실제 이동을 검수하고 탭 내용과 상단 화면명이 함께 바뀌도록 보완했습니다.',
    targetSummary: '버튼 이름만 보고도 이동·조회·저장·YouTube API 수집 여부를 이해할 수 있도록 모든 화면의 용어를 통일합니다.',
    nextAction: '설정과 업무 도구함의 주요 버튼을 실제 결과 위치까지 대조하고, 완료된 화면은 정기 회귀 검수 대상으로 전환합니다.',
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
        status: IMPROVEMENT_CHECKPOINT_STATUS.IN_PROGRESS,
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
    ],
  },
  {
    id: 'discovery-consolidation',
    title: '수집 영상 탐색 통합',
    section: '디스커버리·레퍼런스',
    status: IMPROVEMENT_CHECKPOINT_STATUS.DECISION_REQUIRED,
    priority: 'P2',
    lastReviewedAt: '2026-07-28',
    currentSummary: '수집 영상 목록, 태그별 금고, 또터또 탐색이 각각 독립 화면으로 제공됩니다.',
    targetSummary: '목적이 겹치는 화면은 필터와 보기 방식으로 통합하고, 또터또처럼 판단 목적이 뚜렷한 화면만 독립적으로 유지합니다.',
    nextAction: '태그별 금고를 수집 영상 목록의 태그 필터로 통합할지 결정합니다.',
    decisions: [
      '또터또 탐색은 오래된 고성과 영상을 찾는 판단 목적이 명확하므로 독립 화면을 유지하는 방향을 권장합니다.',
    ],
    checkpoints: [
      {
        id: 'tag-vault-overlap',
        label: '태그별 금고와 수집 영상 목록의 중복 역할 확인',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'tag-filter-decision',
        label: '태그별 금고를 수집 영상 목록의 필터로 통합',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DECISION_REQUIRED,
      },
      {
        id: 'ttotto-purpose',
        label: '또터또 탐색의 독립 판단 화면 역할 유지',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
    ],
  },
  {
    id: 'data-safety',
    title: '데이터·API 안전 검수',
    section: '전체 데이터 흐름',
    status: IMPROVEMENT_CHECKPOINT_STATUS.IN_PROGRESS,
    priority: 'P1',
    lastReviewedAt: '2026-07-28',
    currentSummary: '온라인 저장소(Azure DB) 조회와 YouTube 새 영상 수집을 분리하고, 중요한 저장 버튼에는 데이터 변경 여부를 안내합니다.',
    targetSummary: '화면 표시, 이동, DB 조회, DB 저장, YouTube API 수집을 모든 핵심 흐름에서 실제 결과까지 확인하고 기록합니다.',
    nextAction: '별도 승인 후 실제 저장 → 새로고침 → 재조회 유지 여부를 기능별로 검수합니다.',
    decisions: [
      'YouTube 새 영상 수집과 Azure DB 쓰기는 화면 이동 검수와 분리합니다.',
      '실제 저장 왕복 검수는 테스트 데이터를 정한 뒤 별도로 승인받아 실행합니다.',
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
        status: IMPROVEMENT_CHECKPOINT_STATUS.IN_PROGRESS,
      },
      {
        id: 'cloud-round-trip',
        label: 'Azure DB 실제 저장 후 새로고침·재조회 유지 검수',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DECISION_REQUIRED,
      },
    ],
  },
];
