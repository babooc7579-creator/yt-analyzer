const toArray = (items) => (Array.isArray(items) ? items : []);

export function buildLegacyWorkspaceRouteProps(props = {}) {
  return {
    ...props,
    totalVideoCount: toArray(props.videos).length,
    updateDiscoveryLink: props.changeDiscoveryLink,
  };
}
