export const BACKFILL_MAX_PAGES = 2;
export const BACKFILL_MAX_ITEMS = BACKFILL_MAX_PAGES * 50;

export const getBackfillConfirmMessage = (channelTitle) => [
  `'${channelTitle || '선택 채널'}'의 과거 영상을 더 채울까요?`,
  '',
  `이번 실행은 YouTube API로 업로드 목록을 최대 ${BACKFILL_MAX_ITEMS}개 확인합니다.`,
  '이미 Cloud에 저장된 영상은 중복 저장하지 않습니다.',
  '자동 반복이나 다른 채널 수집은 실행하지 않습니다.',
].join('\n');

export const getBackfillStartMessage = (channelTitle) => (
  `${channelTitle || '선택 채널'} 과거 영상 채우기 중입니다. `
  + `YouTube API로 최대 ${BACKFILL_MAX_ITEMS}개 항목을 확인합니다.`
);

export const getBackfillResultMessage = (result = {}) => {
  if (result.alreadyCompleted) {
    return '이 채널의 과거 업로드 목록은 이미 끝까지 확인했습니다. 추가 API 호출은 없었습니다.';
  }

  const saved = Number(result.savedVideosThisRun) || 0;
  const inspected = Number(result.inspectedVideos) || 0;
  const total = Number(result.savedVideosTotal) || 0;
  const remaining = Number(result.estimatedMissingVideos) || 0;

  if (result.completed) {
    return `과거 영상 채우기 완료: ${inspected}개를 확인해 새 영상 ${saved}개를 저장했습니다. `
      + `Cloud 저장 영상은 ${total}개이며 업로드 목록 끝까지 확인했습니다.`;
  }

  return `이번 과거 영상 채우기 완료: ${inspected}개를 확인해 새 영상 ${saved}개를 저장했습니다. `
    + `Cloud 저장 영상 ${total}개 · 추정 미저장 ${remaining}개입니다. 다음 묶음은 사용자가 다시 실행할 때만 확인합니다.`;
};

export const getBackfillErrorMessage = (error) => (
  `과거 영상 채우기에 실패했습니다: ${error?.message || '알 수 없는 오류'} `
  + '완료로 표시하지 않았습니다. 잠시 후 다시 시도해 주세요.'
);
