import { describe, expect, it } from 'vitest';

import { buildDiscoveryLinksRouteProps } from './discoveryLinksRouteProps';

describe('discoveryLinksRouteProps utils', () => {
  it('forwards discovery links data, Cloud state, and actions to the route', () => {
    const props = {
      addDiscoveryLink: () => 'add',
      changeDiscoveryLink: () => 'change',
      discoveryLinks: [{ id: 'link-1' }],
      discoveryLinksError: 'Cloud error',
      discoveryLinksLoading: true,
      discoveryLinksNotice: 'Saved',
      discoveryLinksSaving: false,
      discoveryLinksSavingMessage: '',
      loadDiscoveryLinks: () => 'load',
      openCreatorView: () => 'open view',
      removeDiscoveryLink: () => 'remove',
    };

    const routeProps = buildDiscoveryLinksRouteProps(props);

    expect(routeProps).toMatchObject({
      addDiscoveryLink: props.addDiscoveryLink,
      changeDiscoveryLink: props.changeDiscoveryLink,
      discoveryLinks: props.discoveryLinks,
      discoveryLinksError: props.discoveryLinksError,
      discoveryLinksLoading: props.discoveryLinksLoading,
      discoveryLinksNotice: props.discoveryLinksNotice,
      discoveryLinksSaving: props.discoveryLinksSaving,
      discoveryLinksSavingMessage: props.discoveryLinksSavingMessage,
      loadDiscoveryLinks: props.loadDiscoveryLinks,
      removeDiscoveryLink: props.removeDiscoveryLink,
    });
    expect(routeProps.onOpenProductionCandidates).toEqual(expect.any(Function));
  });

  it('opens the production candidates view from discovery links without changing data', () => {
    const openedViews = [];
    const routeProps = buildDiscoveryLinksRouteProps({
      openCreatorView: (item) => openedViews.push(item.id),
    });

    routeProps.onOpenProductionCandidates();

    expect(openedViews).toEqual(['studio-candidates']);
  });
});
