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
      removeDiscoveryLink: () => 'remove',
    };

    expect(buildDiscoveryLinksRouteProps(props)).toEqual(props);
  });
});
