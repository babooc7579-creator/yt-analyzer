import { formatDateWithDots } from './dates';

const formatProductionCount = (count = 0) => `${count}개`;

export const getProductionKanbanSummaryHeaderProps = ({
  discoveryLinkCandidateCount = 0,
  videoCount = 0,
} = {}) => ({
  eyebrow: '제작 칸반',
  title: '제작 후보를 실제 작업 순서로 정리합니다',
  description:
    '레이더와 발견함에서 제작 후보로 표시한 항목만 모아 오늘 무엇을 만들지 정리하는 화면입니다. 스크랩북 전체를 자동으로 끌어오지 않고, 저장된 데이터 기준이며 YouTube API를 새로 호출하지 않습니다.',
  metric: `영상 ${videoCount}개 관리 · 링크 ${discoveryLinkCandidateCount}개 후보`,
});

export const getProductionKanbanSummaryLegendItems = () => [
  {
    key: 'video-records',
    label: '영상 기준: Cloud 판단 기록의 제작 상태',
    className: 'bg-indigo-50 px-2.5 py-1 text-indigo-700',
  },
  {
    key: 'discovery-links',
    label: '링크 기준: Cloud 발견함에서 제작 후보로 표시한 링크',
    className: 'bg-amber-50 px-2.5 py-1 text-amber-700',
  },
  {
    key: 'no-youtube-api',
    label: 'YouTube API 호출 없음',
    className: 'bg-slate-100 px-2.5 py-1 text-slate-600',
  },
];

export const getProductionKanbanSummaryMetricCards = ({
  discoveryLinkCandidateCount = 0,
  productionSummary = {},
} = {}) => [
  {
    key: 'candidate',
    label: '제작 후보',
    labelClassName: 'text-indigo-500',
    value: formatProductionCount(productionSummary.candidateCount),
    valueClassName: 'text-lg text-indigo-900',
    wrapperClassName: 'border-indigo-100 bg-indigo-50',
    title: 'Cloud 판단 기록에서 제작 후보 상태로 표시된 저장 영상 수입니다. YouTube API를 새로 호출하지 않습니다.',
  },
  {
    key: 'active',
    label: '제작 중',
    labelClassName: 'text-emerald-600',
    value: formatProductionCount(productionSummary.activeCount),
    valueClassName: 'text-lg text-emerald-900',
    wrapperClassName: 'border-emerald-100 bg-emerald-50',
    title: 'Cloud 판단 기록에서 제작 중 상태로 관리 중인 저장 영상 수입니다.',
  },
  {
    key: 'uploaded',
    label: '업로드 완료',
    labelClassName: 'text-slate-500',
    value: formatProductionCount(productionSummary.uploadedCount),
    valueClassName: 'text-lg text-slate-900',
    wrapperClassName: 'border-slate-200 bg-slate-50',
    title: 'Cloud 판단 기록에서 업로드 완료 상태로 표시한 저장 영상 수입니다.',
  },
  {
    key: 'discovery-links',
    label: '링크 후보',
    labelClassName: 'inline-flex items-center gap-1 text-amber-700',
    value: formatProductionCount(discoveryLinkCandidateCount),
    valueClassName: 'text-lg text-amber-950',
    wrapperClassName: 'border-amber-100 bg-amber-50',
    showLinkIcon: true,
    title: 'Cloud 발견함에서 제작 후보로 표시한 링크 수입니다. 별도 제작 DB로 옮긴 값이 아닙니다.',
    warningText: productionSummary.discoveryRightsWarningCount > 0
      ? `권리 확인 필요 ${formatProductionCount(productionSummary.discoveryRightsWarningCount)}`
      : '',
  },
];

export const getProductionKanbanScheduleSummaryViewProps = ({
  productionSummary = {},
} = {}) => ({
  label: '다음 일정',
  nextScheduledText: productionSummary.nextScheduled
    ? formatDateWithDots(productionSummary.nextScheduled.date)
    : '일정 없음',
  nextScheduledTitle: productionSummary.nextScheduled?.video?.title || '',
  overdueText: productionSummary.overdueCount > 0
    ? `지난 일정 ${formatProductionCount(productionSummary.overdueCount)} 확인 필요`
    : '',
  activeWithoutDateText: productionSummary.activeWithoutDate > 0
    ? `제작 중 ${formatProductionCount(productionSummary.activeWithoutDate)} 일정 미정`
    : '',
});

export const getProductionKanbanPriorityGuideProps = ({
  discoveryLinkCandidateCount = 0,
  productionSummary = {},
} = {}) => {
  if (productionSummary.discoveryRightsWarningCount > 0) {
    return {
      badge: '권리 확인',
      title: '링크 후보의 권리 상태를 먼저 확인하세요',
      description: `권리 확인이 필요한 링크 후보 ${formatProductionCount(productionSummary.discoveryRightsWarningCount)}가 있습니다. 제작 후보로 보기 전에 원본과 출처를 확인하는 단계입니다.`,
      nextAction: '오늘 순서: 원본 링크 열기 → 출처/권리 확인 → 사용 가능 또는 제외로 정리',
      tone: 'warning',
    };
  }

  if (productionSummary.overdueCount > 0) {
    return {
      badge: '일정 확인',
      title: '지난 업로드 예정일을 먼저 정리하세요',
      description: `지난 일정 ${formatProductionCount(productionSummary.overdueCount)}가 있습니다. 완료 처리, 일정 변경, 후보 제외 중 하나로 정리하면 다음 작업이 선명해집니다.`,
      nextAction: '오늘 순서: 지난 일정 후보 확인 → 완료/일정 변경/후보 제외 중 하나 선택',
      tone: 'danger',
    };
  }

  if (productionSummary.activeWithoutDate > 0) {
    return {
      badge: '일정 미정',
      title: '제작 중인 후보에 업로드 예정일을 붙이세요',
      description: `제작 중이지만 일정이 없는 영상 ${formatProductionCount(productionSummary.activeWithoutDate)}가 있습니다. 날짜를 정하면 제작 순서를 잡기 쉬워집니다.`,
      nextAction: '오늘 순서: 제작 중 후보 하나 선택 → 업로드 예정일 입력 → 다음 작업으로 이동',
      tone: 'warning',
    };
  }

  if (productionSummary.activeCount > 0) {
    return {
      badge: '제작 진행',
      title: '제작 중 후보를 완성 쪽으로 밀어주세요',
      description: `현재 제작 중 영상 ${formatProductionCount(productionSummary.activeCount)}가 있습니다. 제목, 메모, 일정이 채워졌는지 확인하고 업로드 완료까지 이어가면 됩니다.`,
      nextAction: '오늘 순서: 제작 중 후보 하나 선택 → 부족한 준비 항목 채우기 → 업로드 완료로 이동',
      tone: 'ready',
    };
  }

  if (productionSummary.candidateCount > 0) {
    return {
      badge: '후보 선택',
      title: '영상 후보 중 오늘 만들 하나를 고르세요',
      description: `영상 후보 ${formatProductionCount(productionSummary.candidateCount)}가 있습니다. 가장 만들기 쉬운 후보를 제작 중으로 옮기면 됩니다.`,
      nextAction: '오늘 순서: 대박지수/메모/원본 링크 확인 → 하나만 제작 중으로 이동',
      tone: 'info',
    };
  }

  if (discoveryLinkCandidateCount > 0) {
    return {
      badge: '링크 검토',
      title: '발견 링크 후보를 영상 후보와 분리해서 검토하세요',
      description: `링크 후보 ${formatProductionCount(discoveryLinkCandidateCount)}가 있습니다. 원본 확인과 권리 상태를 본 뒤 제작에 쓸지 정리하세요.`,
      nextAction: '오늘 순서: 링크 후보 열기 → 권리 상태 확인 → 영상 후보와 따로 판단',
      tone: 'info',
    };
  }

  return {
    badge: '후보 없음',
    title: '오늘 레이더나 발견함에서 후보를 먼저 채우세요',
    description: '이 안내는 저장된 Cloud 후보 기록을 읽어 표시만 합니다. 새 YouTube API 호출, 외부 자동 수집, Cloud 저장은 실행하지 않습니다.',
    nextAction: '오늘 순서: 오늘 레이더에서 저장 영상 후보 확인 또는 발견함에 수동 링크 저장',
    tone: 'idle',
  };
};
