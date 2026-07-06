import { FolderOpen } from 'lucide-react';

export default function ChannelListEmptyState({
  selectedCategory,
  totalChannelCount = 0,
}) {
  const hasChannelsInOtherTags = totalChannelCount > 0;

  return (
    <div className="text-center py-5 px-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
      <FolderOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
      <p className="text-sm font-bold text-slate-600">
        {hasChannelsInOtherTags ? `${selectedCategory} 태그에 채널이 없습니다.` : '저장된 채널이 없습니다.'}
      </p>
      <p className="text-[11px] text-slate-500 mt-1">
        {hasChannelsInOtherTags
          ? '다른 태그에는 저장된 채널이 있습니다. 이 태그로 보려면 채널 태그를 추가하거나 다른 태그를 선택해 주세요.'
          : '먼저 위에서 채널을 미리보기한 뒤 Cloud 채널 목록에 저장해 주세요. 채널 저장만으로 새 영상 수집은 실행되지 않습니다.'}
      </p>
    </div>
  );
}
