export const getSelectedVideosActionBarViewProps = ({
  copiedPrompt,
  promptCopyError,
  selectedCount = 0,
} = {}) => {
  if (selectedCount === 0) return null;

  const buttonLabel = promptCopyError
    ? '복사 실패 - 다시 시도'
    : copiedPrompt
      ? '복사 완료! AI에게 붙여넣으세요'
      : 'AI 요청문 복사';
  const helpText = promptCopyError
    ? '브라우저가 클립보드 복사를 막았습니다. 다시 누르거나 브라우저 권한을 확인해 주세요.'
    : 'AI API를 호출하지 않고, 선택 영상으로 만든 요청문만 클립보드에 복사합니다.';
  const iconName = promptCopyError ? 'alert' : copiedPrompt ? 'check' : 'copy';

  return {
    buttonLabel,
    helpText,
    iconName,
    selectedText: `${selectedCount}개 선택됨`,
    buttonProps: {
      'aria-label': `선택 영상 ${selectedCount}개: ${buttonLabel}`,
      title: 'AI API를 호출하지 않고 선택 영상 기반 요청문만 클립보드에 복사',
      type: 'button',
    },
  };
};
