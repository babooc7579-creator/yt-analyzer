import { getChannelCloudOnlyTagsNoticeViewProps } from '../utils/channelCategorySettingsProps';

export default function ChannelCloudOnlyTagsNotice({ cloudOnlyTags = [] }) {
  const noticeProps = getChannelCloudOnlyTagsNoticeViewProps(cloudOnlyTags);

  if (!noticeProps) return null;

  return (
    <div className="mt-2 rounded-lg border border-amber-100 bg-amber-50 p-2 text-[10px] leading-relaxed text-amber-800">
      <p className="font-bold">{noticeProps.title}</p>
      <p className="mt-1 font-semibold">{noticeProps.tagSummary}</p>
      <p className="mt-1 text-amber-700">{noticeProps.description}</p>
    </div>
  );
}
