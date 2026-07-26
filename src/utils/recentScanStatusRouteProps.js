export const buildRecentScanStatusRouteProps = (props = {}) => ({
  channels: Array.isArray(props.savedChannels) ? props.savedChannels : [],
  onOpenChannelOperations: () => props.openCreatorView?.({
    id: 'ops-channels',
    intent: { operationStage: 'manage' },
  }),
  onOpenSelectedScan: () => props.openCreatorView?.({
    id: 'ops-channels',
    intent: { operationStage: 'scan' },
  }),
});
