import { FolderOpen } from 'lucide-react';

import { getChannelListEmptyStateViewProps } from '../utils/channelListProps';

export default function ChannelListEmptyState({
  selectedCategory,
  totalChannelCount = 0,
}) {
  const {
    description,
    title,
  } = getChannelListEmptyStateViewProps({
    selectedCategory,
    totalChannelCount,
  });

  return (
    <div className="text-center py-5 px-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
      <FolderOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
      <p className="text-sm font-bold text-slate-600">
        {title}
      </p>
      <p className="text-[11px] text-slate-500 mt-1">
        {description}
      </p>
    </div>
  );
}
