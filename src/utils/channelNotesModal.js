const toArray = (items) => (Array.isArray(items) ? items : []);

export const getChannelNotesModalViewProps = (modal) => {
  if (!modal.isOpen || !modal.channel) {
    return { shouldRender: false };
  }

  const channelTitle = modal.channel.title;
  const notes = toArray(modal.channel.notes);

  return {
    shouldRender: true,
    addButtonAriaLabel: `${channelTitle} 분석 기록 추가`,
    addButtonLabel: '기록 추가',
    addButtonTitle: '채널 분석 기록을 Cloud 채널 메모에 저장',
    channelTitle,
    closeButtonAriaLabel: `${channelTitle} 분석 기록 창 닫기`,
    closeButtonTitle: '분석 기록 창 닫기',
    emptyStateText: '아직 기록이 없어요. 위에서 첫 기록을 남겨보세요!',
    hasNotes: notes.length > 0,
    isAddDisabled: modal.saving || !modal.newNoteText.trim(),
    modalTitle: `${channelTitle} - 분석 기록`,
    notes,
    textareaAriaLabel: `${channelTitle} 채널 분석 기록 입력`,
    textareaPlaceholder: '예) 또 떡상함, 패턴인듯 / 시니어롱폼 소재로 쓰기 좋음 / 톤이 우리 채널이랑 비슷함...',
  };
};
