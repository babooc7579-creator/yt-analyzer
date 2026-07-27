const toSafeCount = (count) => (
  Number.isFinite(Number(count)) ? Math.max(0, Number(count)) : 0
);

export const getLoadStoredVideosActionProps = ({
  loading = false,
  onLoad,
  selectedChannelCount = 0,
} = {}) => {
  const safeSelectedChannelCount = toSafeCount(selectedChannelCount);
  const hasSelectedChannels = safeSelectedChannelCount > 0;

  const enabledTitle = `온라인 저장소(Azure DB) 조회: 선택 채널 ${safeSelectedChannelCount}개의 수집 영상 정보를 불러옵니다. YouTube API를 새로 호출하지 않습니다.`;
  const disabledTitle = '왼쪽 채널 목록에서 볼 채널을 먼저 체크해야 수집 영상 정보를 불러올 수 있습니다. 이 버튼은 온라인 저장소(Azure DB) 조회용이며 YouTube API를 새로 호출하지 않습니다.';
  const title = hasSelectedChannels ? enabledTitle : disabledTitle;
  const ariaLabel = hasSelectedChannels
    ? `선택 채널 ${safeSelectedChannelCount}개 수집 영상 목록 불러오기, DB 조회이며 YouTube API 호출 없음`
    : '채널 선택 필요, 왼쪽 채널 목록에서 볼 채널을 먼저 체크하세요';

  return {
    actionAriaLabel: ariaLabel,
    actionDisabled: !hasSelectedChannels,
    actionLabel: hasSelectedChannels ? '불러오기' : '채널 선택 필요',
    actionTitle: title,
    buttonAriaLabel: loading
      ? '온라인 저장소(Azure DB)에서 수집 영상 불러오는 중, YouTube API 호출 없음'
      : ariaLabel,
    buttonDisabled: loading || !hasSelectedChannels,
    buttonLabel: loading
      ? '온라인 저장소(Azure DB)에서 수집 영상 불러오는 중'
      : hasSelectedChannels
        ? `선택 채널 수집 영상 목록 불러오기 (${safeSelectedChannelCount}개)`
        : '채널 선택 후 수집 영상 목록 불러오기',
    emptyStateLabel: hasSelectedChannels ? '수집 영상 목록 불러오기' : '채널 선택 필요',
    hasSelectedChannels,
    helperDescription: hasSelectedChannels
      ? '이미 온라인 저장소(Azure DB)에 보관된 수집 영상 정보만 조회합니다. YouTube API를 새로 호출하지 않습니다.'
      : '왼쪽 채널 목록에서 볼 채널을 체크하면 버튼이 활성화됩니다. 새 영상 수집은 실행하지 않습니다.',
    helperTitle: hasSelectedChannels
      ? '온라인 저장소(Azure DB) 조회: 선택 채널 수집 영상 목록 불러오기'
      : '채널 선택 필요',
    onAction: onLoad,
    title,
  };
};
