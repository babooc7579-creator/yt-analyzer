import { getYouTubeVideoUrl } from './urls';

const toArray = (items) => (Array.isArray(items) ? items : []);

const toObject = (item) => (item && typeof item === 'object' ? item : {});

const getVideoTitle = (video) => toObject(video).title || '제목 없는 영상';

export const getRadarCandidateStripHeaderViewProps = ({
  allDecisionCount,
  queueSummary = {},
  savedVideoCount = 0,
} = {}) => {
  const {
    candidateLimit = 6,
    hiddenDecisionCount = allDecisionCount,
    highPriorityCount = 0,
    shownCandidateCount = 0,
    visibleQueueCount = 0,
  } = toObject(queueSummary);

  return {
    clearButtonProps: {
      'aria-label': 'Cloud에 저장된 오늘 레이더 판단 기록 초기화',
      label: '판단 초기화',
      show: allDecisionCount > 0,
      title: 'Cloud에 저장된 오늘 판단 기록을 초기화합니다',
    },
    description: '저장된 영상 중 아직 판단하지 않은 항목을 점수순으로 정렬하고, 상위 후보를 오늘 검토 목록으로 보여줍니다. 새 YouTube 스캔이 아니라 이미 불러온 데이터 기준입니다.',
    scrapbookButtonProps: {
      'aria-label': `Cloud 스크랩북 화면으로 이동, 스크랩 ${savedVideoCount}개`,
      label: `스크랩 ${savedVideoCount}개`,
      title: 'Cloud 스크랩북 화면으로 이동',
    },
    summaryItems: [
      { label: '대기 후보', value: `${visibleQueueCount}개` },
      { label: '오늘 표시', value: `${shownCandidateCount}/${candidateLimit}` },
      { label: '우선 검토', value: `${highPriorityCount}개` },
      { label: '숨긴 기록', value: `${hiddenDecisionCount}개` },
    ],
    title: '오늘 볼 후보',
  };
};

export const getRadarDecisionListsViewProps = ({
  groups,
  loadedDecisionCount = 0,
} = {}) => {
  if (loadedDecisionCount === 0) return null;

  return {
    description: '현재 불러온 영상에서 이미 판단한 항목입니다. 실수한 항목은 다시 레이더로 돌릴 수 있습니다.',
    groups: toArray(groups).map((group, groupIndex) => {
      const safeGroup = toObject(group);
      const groupKey = safeGroup.key || groupIndex;

      return {
        groupKey,
        label: safeGroup.label,
        overflowText: toArray(safeGroup.videos).length > 3
          ? `외 ${toArray(safeGroup.videos).length - 3}개`
          : '',
        videos: toArray(safeGroup.videos).slice(0, 3).map((video) => {
          const sourceVideo = toObject(video);
          const videoTitle = getVideoTitle(sourceVideo);

          return {
            restoreButtonProps: {
              'aria-label': `${videoTitle} 레이더로 되돌리기`,
              label: '레이더로 되돌리기',
              title: '이 영상을 오늘 레이더 후보로 다시 표시',
            },
            video: sourceVideo,
            videoTitle,
            videoUrl: getYouTubeVideoUrl(sourceVideo.videoId),
          };
        }),
      };
    }),
    title: '처리 기록',
  };
};
