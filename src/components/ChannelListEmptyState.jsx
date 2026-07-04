import { FolderOpen } from 'lucide-react';

export default function ChannelListEmptyState() {
  return (
    <div className="text-center py-5 px-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
      <FolderOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
      <p className="text-sm font-bold text-slate-600">저장된 채널이 없습니다.</p>
      <p className="text-[11px] text-slate-500 mt-1">먼저 위에서 채널을 미리보기한 뒤 저장해 주세요.</p>
    </div>
  );
}
