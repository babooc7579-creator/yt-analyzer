import { getChannelCategoryHelpText } from '../utils/channelCategorySettingsProps';

export default function ChannelCategoryHelpText() {
  return (
    <p className="text-[9px] text-slate-400 mt-1.5">
      {getChannelCategoryHelpText()}
    </p>
  );
}
