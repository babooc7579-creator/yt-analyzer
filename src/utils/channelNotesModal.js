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
    channelTitle,
    closeButtonAriaLabel: `${channelTitle} 분석 기록 창 닫기`,
    hasNotes: notes.length > 0,
    isAddDisabled: modal.saving || !modal.newNoteText.trim(),
    notes,
    textareaAriaLabel: `${channelTitle} 채널 분석 기록 입력`,
  };
};
