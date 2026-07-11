import { Loader2 } from 'lucide-react';

import { getChannelListLoadingStateViewProps } from '../utils/channelListProps';

export default function ChannelListLoadingState() {
  const { label } = getChannelListLoadingStateViewProps();

  return (
    <p role="status" aria-live="polite" className="text-sm text-slate-400 text-center py-4 flex items-center justify-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin" /> {label}
    </p>
  );
}
