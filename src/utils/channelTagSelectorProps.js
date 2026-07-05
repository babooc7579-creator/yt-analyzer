export const getChannelTagSelectorButtonProps = ({
  category,
  isSelected,
  toggleTag,
}) => {
  const actionLabel = isSelected ? '선택 해제' : '선택';

  return {
    className: `px-2 py-1 rounded-full text-[11px] font-semibold border transition-colors ${isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`,
    onClick: () => toggleTag(category),
    title: `${category} 태그 ${actionLabel}`,
    'aria-label': `${category} 태그 ${actionLabel}`,
    type: 'button',
  };
};

export const getChannelTagSelectorViewProps = ({
  categories,
  selectedTags,
  toggleTag,
}) => ({
  tagButtons: categories.map((category) => ({
    category,
    buttonProps: getChannelTagSelectorButtonProps({
      category,
      isSelected: selectedTags.includes(category),
      toggleTag,
    }),
  })),
});
