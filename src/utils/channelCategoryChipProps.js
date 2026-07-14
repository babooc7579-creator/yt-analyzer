export const getChannelCategoryChipViewProps = ({
  cancelRenameCategory,
  category,
  confirmRenameCategory,
  hideCategoryFromLocalList,
  renameLoading,
  renameValue,
  setRenameValue,
  startRenameCategory,
}) => ({
  cancelButtonProps: {
    className: 'text-slate-400 hover:text-slate-600',
    onClick: cancelRenameCategory,
    title: '태그 이름 변경 취소',
    'aria-label': `${category} 태그 이름 변경 취소`,
    type: 'button',
  },
  confirmButtonProps: {
    className: 'text-emerald-600 hover:text-emerald-800',
    disabled: renameLoading,
    onClick: confirmRenameCategory,
    title: 'Cloud 태그 이름 변경 저장',
    'aria-label': `${category} Cloud 태그 이름 변경 저장`,
    type: 'button',
  },
  hideButtonProps: {
    className: 'text-red-400 hover:text-red-600',
    onClick: () => hideCategoryFromLocalList(category),
    title: '화면 목록에서만 숨깁니다. 이미 채널에 붙은 Cloud 태그는 삭제되지 않습니다.',
    'aria-label': `${category} 카테고리를 화면 목록에서만 숨기기`,
    type: 'button',
  },
  renameInputProps: {
    autoFocus: true,
    className: 'w-16 rounded border border-slate-200 bg-white px-1 py-0.5 text-[10px] text-slate-900 outline-none focus:border-indigo-400',
    onChange: (event) => setRenameValue(event.target.value),
    onKeyDown: (event) => {
      if (event.key === 'Enter') confirmRenameCategory();
      if (event.key === 'Escape') cancelRenameCategory();
    },
    title: '변경할 Cloud 태그 이름 입력',
    'aria-label': `${category} Cloud 태그 새 이름`,
    type: 'text',
    value: renameValue,
  },
  startRenameButtonProps: {
    className: 'text-indigo-400 hover:text-indigo-600',
    onClick: () => startRenameCategory(category),
    title: 'Cloud 태그 이름 변경 - 이 태그가 붙은 모든 채널에 일괄 반영됩니다',
    'aria-label': `${category} Cloud 태그 이름 변경`,
    type: 'button',
  },
});
