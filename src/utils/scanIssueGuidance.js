const toNonNegativeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
};

const getCoverageSummary = (record = {}) => {
  const savedVideosTotal = toNonNegativeNumber(record.savedVideosTotal);
  const channelTotalVideos = toNonNegativeNumber(record.channelTotalVideos);
  const estimatedMissingVideos = toNonNegativeNumber(record.estimatedMissingVideos);
  const coverageRate = Number(record.coverageRate);
  const hasCoverageRate = record.coverageRate !== null
    && record.coverageRate !== undefined
    && record.coverageRate !== ''
    && Number.isFinite(coverageRate)
    && coverageRate >= 0;

  if (channelTotalVideos > 0) {
    const rateText = hasCoverageRate ? ` · 약 ${coverageRate}%` : '';
    return `Cloud 저장 ${savedVideosTotal.toLocaleString('ko-KR')}개 / 채널 전체 ${channelTotalVideos.toLocaleString('ko-KR')}개${rateText}`;
  }

  if (estimatedMissingVideos > 0) {
    return `과거 영상 약 ${estimatedMissingVideos.toLocaleString('ko-KR')}개가 아직 저장 범위 밖에 있습니다.`;
  }

  return '수집은 끝났지만 채널 전체 영상과 Cloud 저장 범위가 아직 일치하지 않습니다.';
};

const getFailedGuidance = (error = '') => {
  const normalizedError = String(error).toLowerCase();

  if (/quota|daily limit|rate limit|too many requests|\b429\b/.test(normalizedError)) {
    return {
      cause: 'YouTube API 사용 한도 또는 요청 제한에 걸렸을 가능성이 큽니다.',
      nextAction: '반복 실행하지 말고 API 한도가 회복된 뒤 이 채널만 다시 수집해 보세요.',
    };
  }

  if (/timeout|timed out|network|failed to fetch|fetch failed|econn|socket/.test(normalizedError)) {
    return {
      cause: '수집 중 네트워크 또는 서버 연결이 끊겼습니다.',
      nextAction: '잠시 뒤 이 채널만 다시 수집해 보세요. 같은 오류가 반복되면 서버 상태를 확인해야 합니다.',
    };
  }

  if (/channel not found|not found|\b404\b/.test(normalizedError)) {
    return {
      cause: '저장된 채널 정보를 YouTube에서 찾지 못했습니다.',
      nextAction: '채널 관리에서 채널 링크와 운영 상태를 확인한 뒤 다시 시도하세요.',
    };
  }

  if (/forbidden|unauthorized|permission|\b401\b|\b403\b/.test(normalizedError)) {
    return {
      cause: 'YouTube 요청 권한 또는 연결 설정을 확인해야 합니다.',
      nextAction: '반복 실행하지 말고 API 키와 서버 연결 설정을 먼저 확인하세요.',
    };
  }

  return {
    cause: error
      ? '수집 도중 처리하지 못한 오류가 발생했습니다.'
      : '수집을 완료하지 못했지만 저장된 오류 설명이 없습니다.',
    nextAction: '기술 상세를 확인한 뒤 이 채널만 다시 시도하세요. 같은 오류가 반복되면 서버 점검이 필요합니다.',
  };
};

export const getScanIssueGuidance = (record = {}) => {
  const status = String(record.status || '').toLowerCase();

  if (status === 'partial') {
    const estimatedMissingVideos = toNonNegativeNumber(record.estimatedMissingVideos);
    const missingText = estimatedMissingVideos > 0
      ? ` 과거 영상 약 ${estimatedMissingVideos.toLocaleString('ko-KR')}개가 아직 저장되지 않은 것으로 추정됩니다.`
      : '';

    return {
      cause: `${getCoverageSummary(record)}${missingText}`,
      nextAction: '현재 저장된 영상은 바로 탐색할 수 있습니다. 전체 과거 범위가 필요하면 이 채널의 과거 영상 수집을 직접 시작하세요. 이미 진행 중이면 저장된 위치에서 이어집니다.',
      title: '최신 수집은 완료됐지만 과거 영상 저장 범위가 아직 부족합니다',
      tone: 'partial',
    };
  }

  if (status === 'failed') {
    return {
      ...getFailedGuidance(record.error),
      title: '이번 수집을 완료하지 못했습니다',
      tone: 'failed',
    };
  }

  return null;
};

export const getScanRetryLabel = (status) => {
  if (status === 'never') return '첫 새 영상 수집 준비';
  if (status === 'failed') return '다시 새 영상 수집 준비';
  if (status === 'partial') return '최신 영상 수집 준비';
  return '새 영상 수집 준비';
};
