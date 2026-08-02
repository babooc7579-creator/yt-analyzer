export const VIDEO_RECORDS_SYNC_WARNINGS = {
  loadFallback: '온라인 저장소(Azure DB) 연결 실패로 이 브라우저에 남아 있던 영상 판단 임시 기록을 표시 중입니다. 이 기록은 온라인 저장소(Azure DB) 기준 데이터가 아닙니다.',
  saveFailed: '영상 판단 기록이 온라인 저장소(Azure DB)에 저장되지 않았습니다. 방금 시도한 변경은 화면에서도 되돌렸습니다. 연결을 확인한 뒤 다시 저장해 주세요.',
  clearFailed: '판단 기록 초기화가 온라인 저장소(Azure DB)에 반영되지 않았습니다. 기존 판단 기록을 화면에 다시 표시했습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
};

export const VIDEO_RECORDS_CLEAR_CONFIRM_MESSAGE = '온라인 저장소(Azure DB)의 영상별 전체 작업 기록을 삭제할까요?\n\n판단만이 아니라 제작 후보 상태, 대본, 업로드 일정도 함께 삭제될 수 있어 현재 사용자 화면에서는 제공하지 않습니다.';

export const VIDEO_RECORDS_FULL_CLEAR_SAFETY_PROPS = {
  'aria-label': '제작 후보, 대본, 업로드 일정 보호를 위해 전체 판단 초기화 사용 불가',
  label: '판단 초기화',
  show: false,
  title: '제작 후보, 대본, 업로드 일정이 같은 기록에 함께 저장되어 전체 초기화는 현재 사용할 수 없습니다.',
};

export const SCRAPBOOK_SYNC_WARNINGS = {
  loadFallback: '온라인 저장소(Azure DB) 연결 실패로 이 브라우저에 남아 있던 소재 보관함 임시 기록을 표시 중입니다. 이 목록은 온라인 저장소(Azure DB) 기준 데이터가 아닙니다.',
  saveFailed: '소재 보관함 변경이 온라인 저장소(Azure DB)에 저장되지 않았습니다. 브라우저 임시 기록으로 저장 완료 처리하지 않습니다.',
  cloudRequired: '온라인 저장소(Azure DB)의 소재 보관함을 확인하지 못해 지금은 보관 상태를 바꿀 수 없습니다. 잠시 뒤 새로고침 후 다시 시도해 주세요.',
  productionSourceCleanupFailed: '제작 후보 표시는 저장되지 않았고, 방금 만든 제작 전용 원본도 자동으로 정리하지 못했습니다. 기존 소재 보관 기록은 삭제하지 않았습니다. 온라인 저장소(Azure DB)의 소재 보관함을 다시 확인해 주세요.',
};

export const SYNC_WARNING_BANNER_COPY = {
  title: '일부 온라인 저장 기능 확인 필요',
  helpText: '아래에 표시된 기능만 연결을 확인해 주세요. 채널 목록이나 수집 영상처럼 다른 온라인 저장소(Azure DB) 조회가 성공했다면 해당 데이터는 정상입니다. 브라우저 임시 기록은 자동 병합하거나 자동 업로드하지 않습니다.',
};
