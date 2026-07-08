export const getProductionKanbanSummaryHeaderProps = ({
  discoveryLinkCandidateCount = 0,
  videoCount = 0,
} = {}) => ({
  eyebrow: '제작 칸반',
  title: '제작 후보만 다음 행동으로 넘깁니다',
  description:
    '스크랩북 전체가 아니라, 레이더와 발견함에서 제작 후보로 지정한 항목만 보여줍니다. 저장된 데이터 기준이며 YouTube API를 새로 호출하지 않습니다.',
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
