const toArray = (items) => (Array.isArray(items) ? items : []);

// Keep the old workspace prop names only at this route boundary.
export function buildLegacyWorkspaceRouteProps(props = {}) {
  return {
    ...props,
    totalVideoCount: toArray(props.videos).length,
    updateDiscoveryLink: props.changeDiscoveryLink,
  };
}
