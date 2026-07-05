import { Loader2 } from 'lucide-react';

export default function ChannelListLoadingState() {
  return (
    <p className="text-sm text-slate-400 text-center py-4 flex items-center justify-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin" /> Cloud에서 채널 불러오는 중...
    </p>
  );
}
