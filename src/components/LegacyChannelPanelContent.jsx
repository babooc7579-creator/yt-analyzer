import ChannelAddForm from './ChannelAddForm';
import ChannelList from './ChannelList';
import ChannelTagTabs from './ChannelTagTabs';
import LegacyChannelPanelFooter from './LegacyChannelPanelFooter';
import LegacyWorkPanelIntro from './LegacyWorkPanelIntro';

export default function LegacyChannelPanelContent({
  channelAddFormProps,
  channelListProps,
  footerProps,
  introProps,
  showWorkPanel,
  tagTabsProps,
}) {
  return (
    <div className={`space-y-4 ${showWorkPanel ? '' : 'hidden'}`}>
      <div className="bg-slate-100 rounded-xl shadow-sm border border-slate-300 p-4">
        <LegacyWorkPanelIntro {...introProps} />

        <ChannelTagTabs {...tagTabsProps} />

        <ChannelList {...channelListProps} />

        <hr className="my-5 border-slate-200" />

        <ChannelAddForm {...channelAddFormProps} />

        <LegacyChannelPanelFooter {...footerProps} />
      </div>
    </div>
  );
}
