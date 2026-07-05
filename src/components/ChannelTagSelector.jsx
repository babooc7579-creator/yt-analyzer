import { getChannelTagSelectorViewProps } from '../utils/channelTagSelectorProps';

export default function ChannelTagSelector({
  categories,
  label,
  selectedTags,
  toggleTag,
}) {
  const { tagButtons } = getChannelTagSelectorViewProps({
    categories,
    selectedTags,
    toggleTag,
  });

  return (
    <div>
      <p className="text-[10px] text-slate-500 mb-1">{label}</p>
      <div className="flex flex-wrap gap-1">
        {tagButtons.map(({ buttonProps, category }) => (
          <button key={category} {...buttonProps}>
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
