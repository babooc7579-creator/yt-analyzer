export const BACKFILL_MAX_PAGES = 10;
export const BACKFILL_MAX_ITEMS = BACKFILL_MAX_PAGES * 50;

export const getBackfillConfirmMessage = (channelTitle) => [
  `'${channelTitle || '선택 채널'}'의 공개 업로드 목록을 끝까지 이어서 수집할까요?`,
  '',
  `이번 실행은 YouTube API를 사용해 선택한 채널 하나에서 최대 ${BACKFILL_MAX_ITEMS}개를 확인합니다.`,
  '목록 끝에 도달하면 완료하고, 더 많으면 현재 위치를 저장해 다음 실행에서 이어갑니다.',
  'Cloud에 없는 영상만 새로 저장하므로 신규 저장 수는 확인 수보다 적을 수 있습니다.',
  '자동 반복이나 다른 채널 수집은 실행하지 않습니다.',
].join('\n');

export const getBackfillStartMessage = (channelTitle) => (
  `${channelTitle || '선택 채널'}의 공개 업로드 목록을 끝까지 확인하고 있습니다. `
  + `이번 실행은 최대 ${BACKFILL_MAX_ITEMS}개까지 진행하며 Cloud에 없는 영상만 저장합니다.`
);

export const getBackfillResultMessage = (result = {}) => {
  if (result.alreadyCompleted) {
    return '이 채널의 과거 업로드 목록은 이미 끝까지 확인했습니다. 추가 API 호출은 없었습니다.';
  }

  const saved = Number(result.savedVideosThisRun) || 0;
  const inspected = Number(result.inspectedVideos) || 0;
  const existing = Math.max(0, inspected - saved);
  const total = Number(result.savedVideosTotal) || 0;
  const remaining = Number(result.estimatedMissingVideos) || 0;
  const inspectionProgressRate = Number(result.inspectionProgressRate);
  const progress = Number.isFinite(inspectionProgressRate)
    ? `${inspectionProgressRate}%`
    : '계산 중';

  if (result.completed) {
    return `전체 과거 영상 확인 완료: 이번 확인 ${inspected}개 · 신규 저장 ${saved}개 · 이미 저장됨 ${existing}개. `
      + `업로드 목록 확인 100% · Cloud 저장 영상 ${total}개입니다.`;
  }

  return `이번 실행 안전 범위 도달: 확인 ${inspected}개 · 신규 저장 ${saved}개 · 이미 저장됨 ${existing}개. `
    + `목록 확인 ${progress} · Cloud 저장 ${total}개 · 추정 미저장 ${remaining}개입니다. 다시 실행하면 현재 위치부터 이어갑니다.`;
};

export const getBackfillErrorMessage = (error) => (
  `과거 영상 확인에 실패했습니다: ${error?.message || '알 수 없는 오류'} `
  + '완료로 표시하지 않았습니다. 잠시 후 다시 시도해 주세요.'
);
