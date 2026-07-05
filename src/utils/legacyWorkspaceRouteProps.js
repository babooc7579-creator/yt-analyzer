export function buildLegacyWorkspaceRouteProps(props) {
  return {
    ...props,
    totalVideoCount: props.videos.length,
    updateDiscoveryLink: props.changeDiscoveryLink,
  };
}
