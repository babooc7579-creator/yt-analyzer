export const getScrapbookHeaderViewProps = ({ variant = 'scrapbook' } = {}) => {
  const isProductionMode = variant === 'production';

  return {
    description: isProductionMode
      ? '제작 후보로 표시한 영상과 발견함 링크를 제작 흐름으로 정리합니다. 메모와 업로드 일정은 Cloud 판단 기록에 저장됩니다.'
      : '별표로 모아둔 소재 보관함입니다. Cloud 기준으로 보관하고, 연결 실패 시에만 브라우저 임시 기록을 안내합니다.',
    iconClassName: isProductionMode
      ? 'w-6 h-6 text-indigo-600'
      : 'w-6 h-6 text-yellow-500 fill-yellow-500',
    iconName: isProductionMode ? 'rocket' : 'bookmark',
    isProductionMode,
    title: isProductionMode ? '제작 후보함' : '영구 보관 스크랩북',
  };
};
