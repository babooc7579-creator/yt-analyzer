export const VIDEO_RECORDS_SYNC_WARNINGS = {
  loadFallback: 'Cloud 연결 실패로 이 브라우저에 남아 있던 영상 판단 기록을 임시로 표시 중입니다. 이 기록은 Cloud 기준 데이터가 아닙니다.',
  saveFailed: '영상 판단 기록이 Cloud에 저장되지 않았습니다. 화면에는 임시로 반영됐지만 Cloud 동기화가 필요합니다.',
  clearFailed: '판단 기록 초기화가 Cloud에 반영되지 않았습니다. 화면에는 임시로 초기화됐지만 새로고침 후 다시 나타날 수 있습니다.',
};

export const VIDEO_RECORDS_CLEAR_CONFIRM_MESSAGE = 'Cloud 영상 판단 기록을 전체 초기화할까요?\n\n봤음, 나중에 보기, 제외, 제작 후보 같은 판단 기록이 지워지고 숨겨졌던 후보가 다시 보일 수 있습니다.';

export const SCRAPBOOK_SYNC_WARNINGS = {
  loadFallback: 'Cloud 연결 실패로 이 브라우저에 남아 있던 스크랩북을 임시로 표시 중입니다. 이 목록은 Cloud 기준 데이터가 아닙니다.',
  saveFailed: '스크랩북 변경이 Cloud에 저장되지 않았습니다. 브라우저 임시 기록으로 저장 완료 처리하지 않습니다.',
  cloudRequired: 'Cloud 스크랩북을 확인하지 못해 지금은 보관 상태를 바꿀 수 없습니다. 잠시 뒤 새로고침 후 다시 시도해 주세요.',
};

export const SYNC_WARNING_BANNER_COPY = {
  title: 'Cloud 연결/저장 확인 필요',
  helpText: '중요한 변경은 잠시 뒤 다시 저장하거나 새로고침 후 남아 있는지 확인해 주세요.',
};
