export const VIDEO_RECORDS_SYNC_WARNINGS = {
  loadFallback: '온라인 저장소(Azure DB) 연결 실패로 이 브라우저에 남아 있던 영상 판단 임시 기록을 표시 중입니다. 이 기록은 온라인 저장소(Azure DB) 기준 데이터가 아닙니다.',
  saveFailed: '영상 판단 기록이 온라인 저장소(Azure DB)에 저장되지 않았습니다. 방금 시도한 변경은 화면에서도 되돌렸습니다. 연결을 확인한 뒤 다시 저장해 주세요.',
  clearFailed: '판단 기록 초기화가 온라인 저장소(Azure DB)에 반영되지 않았습니다. 기존 판단 기록을 화면에 다시 표시했습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
};

export const VIDEO_RECORDS_CLEAR_CONFIRM_MESSAGE = '온라인 저장소(Azure DB)의 영상 판단 기록을 전체 초기화할까요?\n\n봤음, 나중에 보기, 제외, 제작 후보 같은 판단 기록이 지워지고 숨겨졌던 후보가 다시 보일 수 있습니다.';

export const SCRAPBOOK_SYNC_WARNINGS = {
  loadFallback: '온라인 저장소(Azure DB) 연결 실패로 이 브라우저에 남아 있던 소재 보관함 임시 기록을 표시 중입니다. 이 목록은 온라인 저장소(Azure DB) 기준 데이터가 아닙니다.',
  saveFailed: '소재 보관함 변경이 온라인 저장소(Azure DB)에 저장되지 않았습니다. 브라우저 임시 기록으로 저장 완료 처리하지 않습니다.',
  cloudRequired: '온라인 저장소(Azure DB)의 소재 보관함을 확인하지 못해 지금은 보관 상태를 바꿀 수 없습니다. 잠시 뒤 새로고침 후 다시 시도해 주세요.',
};

export const SYNC_WARNING_BANNER_COPY = {
  title: '온라인 저장소(Azure DB) 연결 확인 필요',
  helpText: '온라인 저장소(Azure DB) 조회가 성공하면 해당 응답만 기준으로 사용합니다. 브라우저 임시 기록은 연결 실패 때만 표시합니다. 온라인 데이터와 자동 병합하거나 자동 업로드하지 않습니다.',
};
