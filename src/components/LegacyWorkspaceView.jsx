import HiddenLegacyAside from './HiddenLegacyAside';
import LegacyChannelPanel from './LegacyChannelPanel';
import LegacyWorkspaceMainPanel from './LegacyWorkspaceMainPanel';
import ChannelOperationsNavigator from './ChannelOperationsNavigator';

export default function LegacyWorkspaceView({
  asideProps,
  channelPanelProps,
  mainPanelProps,
  operationsNavProps,
  showWorkPanel,
}) {
  return (
    <div data-testid="creator-route-legacy-workspace" className={`w-full mx-auto grid grid-cols-1 gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 ${showWorkPanel ? 'max-w-[2400px] xl:grid-cols-[340px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(0,1fr)]' : 'max-w-[2400px]'}`}>
      {operationsNavProps ? (
        <div className="xl:col-span-2">
          <ChannelOperationsNavigator {...operationsNavProps} />
        </div>
      ) : null}

      <LegacyChannelPanel {...channelPanelProps} />

      <LegacyWorkspaceMainPanel {...mainPanelProps} />

      <HiddenLegacyAside {...asideProps} />
    </div>
  );
}
