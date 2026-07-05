export const VIDEO_RECORDS_SYNC_WARNINGS = {
  loadFallback: 'Cloud 연결 실패로 이 브라우저에 남아 있던 영상 판단 기록을 임시로 표시 중입니다. 이 기록은 Cloud 기준 데이터가 아닙니다.',
  saveFailed: '영상 판단 기록이 Cloud에 저장되지 않았습니다. 방금 시도한 변경은 화면에서도 되돌렸습니다. 연결을 확인한 뒤 다시 저장해주세요.',
  clearFailed: '판단 기록 초기화가 Cloud에 반영되지 않았습니다. 기존 판단 기록을 화면에 다시 표시했습니다. 연결을 확인한 뒤 다시 시도해주세요.',
};

export const VIDEO_RECORDS_CLEAR_CONFIRM_MESSAGE = 'Cloud 영상 판단 기록을 전체 초기화할까요?\n\n봤음, 나중에 보기, 제외, 제작 후보 같은 판단 기록이 지워지고 숨겨졌던 후보가 다시 보일 수 있습니다.';

export const SCRAPBOOK_SYNC_WARNINGS = {
  loadFallback: 'Cloud 연결 실패로 이 브라우저에 남아 있던 스크랩북을 임시로 표시 중입니다. 이 목록은 Cloud 기준 데이터가 아닙니다.',
  saveFailed: '스크랩북 변경이 Cloud에 저장되지 않았습니다. 브라우저 임시 기록으로 저장 완료 처리하지 않습니다.',
  cloudRequired: 'Cloud 스크랩북을 확인하지 못해 지금은 보관 상태를 바꿀 수 없습니다. 잠시 뒤 새로고침 후 다시 시도해주세요.',
};

export const SYNC_WARNING_BANNER_COPY = {
  title: 'Cloud 연결/저장 확인 필요',
  helpText: 'Cloud 조회가 성공하면 Cloud 응답만 기준으로 사용합니다. 브라우저 기록은 연결 실패 때만 임시로 표시하며, Cloud와 자동 병합하지 않습니다.',
};
