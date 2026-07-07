import { describe, expect, it } from 'vitest';

import * as legacyWorkspaceProps from './legacyWorkspaceProps';
import { getLegacyAsideProps } from './legacyAsideProps';
import { getLegacyChannelPanelProps } from './legacyChannelPanelProps';
import { getLegacyMainPanelProps } from './legacyMainPanelProps';

describe('legacyWorkspaceProps barrel exports', () => {
  it('exposes the legacy workspace prop builders', () => {
    expect(Object.keys(legacyWorkspaceProps).sort()).toEqual([
      'getLegacyAsideProps',
      'getLegacyChannelPanelProps',
      'getLegacyMainPanelProps',
    ]);
  });

  it('re-exports the same helper functions from their source modules', () => {
    expect(legacyWorkspaceProps.getLegacyAsideProps).toBe(getLegacyAsideProps);
    expect(legacyWorkspaceProps.getLegacyChannelPanelProps).toBe(getLegacyChannelPanelProps);
    expect(legacyWorkspaceProps.getLegacyMainPanelProps).toBe(getLegacyMainPanelProps);
  });
});
