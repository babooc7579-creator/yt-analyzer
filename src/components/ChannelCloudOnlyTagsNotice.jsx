export default function ChannelCloudOnlyTagsNotice({ cloudOnlyTags = [] }) {
  if (cloudOnlyTags.length === 0) return null;

  return (
    <div className="mt-2 rounded-lg border border-amber-100 bg-amber-50 p-2 text-[10px] leading-relaxed text-amber-800">
      <p className="font-bold">Cloud에는 있지만 화면 목록에는 없는 태그가 있습니다.</p>
      <p className="mt-1 font-semibold">{cloudOnlyTags.slice(0, 4).join(', ')}{cloudOnlyTags.length > 4 ? ` 외 ${cloudOnlyTags.length - 4}개` : ''}</p>
      <p className="mt-1 text-amber-700">카테고리를 지워도 Cloud 채널 태그는 삭제되지 않습니다. 다시 보려면 같은 이름으로 카테고리를 추가하세요.</p>
    </div>
  );
}
