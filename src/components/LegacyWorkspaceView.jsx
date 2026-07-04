import HiddenLegacyAside from './HiddenLegacyAside';
import LegacyChannelPanel from './LegacyChannelPanel';
import LegacyWorkspaceMainPanel from './LegacyWorkspaceMainPanel';

export default function LegacyWorkspaceView({
  asideProps,
  channelPanelProps,
  mainPanelProps,
  showWorkPanel,
}) {
  return (
    <div className={`w-full mx-auto grid grid-cols-1 gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 ${showWorkPanel ? 'max-w-[2400px] xl:grid-cols-[340px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(0,1fr)]' : 'max-w-[2400px]'}`}>
      <LegacyChannelPanel {...channelPanelProps} />

      <LegacyWorkspaceMainPanel {...mainPanelProps} />

      <HiddenLegacyAside {...asideProps} />
    </div>
  );
}
