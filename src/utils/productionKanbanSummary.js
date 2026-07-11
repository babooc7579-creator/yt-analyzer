import { formatDateWithDots } from './dates';

const formatProductionCount = (count = 0) => `${count}개`;

export const getProductionKanbanSummaryHeaderProps = ({
  discoveryLinkCandidateCount = 0,
  videoCount = 0,
} = {}) => ({
  eyebrow: '제작 칸반',
  title: '제작 후보만 다음 행동으로 정리합니다',
  description:
    '스크랩북 전체가 아니라, 레이더와 발견함에서 제작 후보로 표시한 항목만 보여줍니다. 저장된 데이터 기준이며 YouTube API를 새로 호출하지 않습니다.',
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
