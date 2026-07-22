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
      creatorViewIntent: {
        searchQuery: 'Reference',
        source: 'studio-candidates',
        targetDiscoveryLinkId: 'link-1',
      },
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
      creatorViewIntent: props.creatorViewIntent,
      loadDiscoveryLinks: props.loadDiscoveryLinks,
      removeDiscoveryLink: props.removeDiscoveryLink,
    });
    expect(routeProps.onOpenProductionCandidates).toEqual(expect.any(Function));
  });

  it('opens the production candidates view from discovery links without changing data', () => {
    const openedViews = [];
    const routeProps = buildDiscoveryLinksRouteProps({
      openCreatorView: (item) => openedViews.push(item),
    });

    routeProps.onOpenProductionCandidates();
    routeProps.onOpenProductionCandidates({
      id: 'link-1',
      title: '참고할 오프닝',
      url: 'https://example.com/link-1',
    });

    expect(openedViews).toEqual([
      { id: 'studio-candidates', intent: undefined },
      {
        id: 'studio-candidates',
        intent: {
          searchQuery: '참고할 오프닝',
          source: 'discovery-links',
          targetDiscoveryLinkId: 'link-1',
        },
      },
    ]);
  });
});
