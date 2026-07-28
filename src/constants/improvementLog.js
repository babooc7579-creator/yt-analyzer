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
    currentSummary: '제작 후보 영상의 제목, 통합 작업 메모, 업로드 예정일을 기존 온라인 저장소(Azure DB)의 videoUserRecords에 명시적으로 저장합니다.',
    targetSummary: '제작 후보의 원본을 분석하고, 구성안을 만든 뒤, 대본을 작성·수정하고 최종본을 확정하는 독립 작업 공간으로 발전시킵니다.',
    nextAction: '분석·구성·대본·수정 상태를 위한 새 저장 필드와 백엔드 보존 계약을 먼저 승인합니다.',
    decisions: [
      '제작 후보함과 통합하지 않고 별도 작업실로 유지합니다.',
      'AI 자동 분석과 대본 생성은 수동 작성 구조가 안정된 뒤 검토합니다.',
      '새 필드는 현재 백엔드가 보존하지 않으므로 프론트만 먼저 추가하지 않습니다.',
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
        label: '현재는 제목·통합 메모·업로드 예정일만 저장한다는 범위 표시',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'backend-contract',
        label: '백엔드가 현재 draftTitle, note, targetPublishDate만 대본 관련 필드로 보존함을 확인',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DONE,
      },
      {
        id: 'script-fields',
        label: '분석·구성·대본 본문·수정 메모·대본 상태의 저장 구조 결정',
        status: IMPROVEMENT_CHECKPOINT_STATUS.DECISION_REQUIRED,
      },
      {
        id: 'writing-flow',
        label: '분석 → 구성 → 초안 → 수정 → 최종본 작업 흐름 구현',
        status: IMPROVEMENT_CHECKPOINT_STATUS.PLANNED,
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
    currentSummary: '수집 영상, 온라인 저장소(Azure DB), 화면 이동, 새 영상 수집을 구분하고 있으나 일부 이전 용어가 남아 있습니다.',
    targetSummary: '버튼 이름만 보고도 이동·조회·저장·YouTube API 수집 여부를 이해할 수 있도록 모든 화면의 용어를 통일합니다.',
    nextAction: '오늘의 레이더 등에 남아 있는 레퍼런스 금고 표현을 수집 영상 목록으로 통일합니다.',
    decisions: [
      '영상 파일 자체가 아니라 영상 정보를 다루므로 수집 영상 목록이라는 표현을 사용합니다.',
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
        label: '화면에 남아 있는 레퍼런스 금고 표현 제거',
        status: IMPROVEMENT_CHECKPOINT_STATUS.PLANNED,
      },
      {
        id: 'button-destination-audit',
        label: '모든 주요 버튼의 이름과 실제 결과 위치 대조 검수',
        status: IMPROVEMENT_CHECKPOINT_STATUS.IN_PROGRESS,
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
