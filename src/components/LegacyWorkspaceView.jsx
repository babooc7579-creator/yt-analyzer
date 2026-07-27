import HiddenLegacyAside from './HiddenLegacyAside';
import LegacyChannelPanel from './LegacyChannelPanel';
import LegacyWorkspaceMainPanel from './LegacyWorkspaceMainPanel';
import ChannelOperationsNavigator from './ChannelOperationsNavigator';

export default function LegacyWorkspaceView({
  activeOperationStage,
  asideProps,
  channelPanelProps,
  mainPanelProps,
  operationsNavProps,
  showWorkPanel,
}) {
  const isFocusedOperationsView = Boolean(activeOperationStage);
  const showMainPanel = !isFocusedOperationsView || activeOperationStage === 'scan';
  const workspaceGridClass = showWorkPanel && showMainPanel
    ? 'max-w-[2400px] xl:grid-cols-[340px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(0,1fr)]'
    : 'max-w-[1400px]';

  return (
    <div data-testid="creator-route-legacy-workspace" className={`w-full mx-auto grid grid-cols-1 gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 ${workspaceGridClass}`}>
      {operationsNavProps ? (
        <div className={showMainPanel ? 'xl:col-span-2' : ''}>
          <ChannelOperationsNavigator {...operationsNavProps} />
        </div>
      ) : null}

      <LegacyChannelPanel {...channelPanelProps} operationStage={activeOperationStage} />

      {showMainPanel ? (
        <LegacyWorkspaceMainPanel {...mainPanelProps} operationStage={activeOperationStage} />
      ) : null}

      <HiddenLegacyAside {...asideProps} />
    </div>
  );
}
