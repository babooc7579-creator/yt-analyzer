import { getChannelPreviewSaveNoticeText } from '../utils/channelAddCopy';

export default function ChannelPreviewSaveNotice() {
  return (
    <p className="text-[10px] text-slate-500">{getChannelPreviewSaveNoticeText()}</p>
  );
}
