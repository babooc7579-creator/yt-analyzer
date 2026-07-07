export const DISCOVERY_LINK_SAVING_MESSAGES = {
  create: '새 발견 링크를 Cloud에 저장하는 중입니다.',
  update: '링크 변경 사항을 Cloud에 저장하는 중입니다.',
  update_status: '검토 상태를 Cloud에 저장하는 중입니다.',
  update_rights: '권리 상태 표시를 Cloud에 저장하는 중입니다.',
  update_text: '제목과 메모를 Cloud에 저장하는 중입니다.',
  delete: 'Cloud 발견함에서 링크 기록을 삭제하는 중입니다.',
};

export const getDiscoveryLinkSavingMessage = (saving, action) => (
  saving ? DISCOVERY_LINK_SAVING_MESSAGES[action] || '' : ''
);

export const getDiscoveryActionError = (error, fallbackMessage, actionLabel = '저장') => {
  const message = error?.message || fallbackMessage;
  return `${message} Cloud ${actionLabel} 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.`;
};
