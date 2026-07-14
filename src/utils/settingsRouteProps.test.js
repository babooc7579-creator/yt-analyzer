import { describe, expect, it, vi } from 'vitest';

import { buildSettingsRouteProps } from './settingsRouteProps';

describe('settingsRouteProps', () => {
  it('connects existing category controls without changing their storage boundary', () => {
    const handlers = {
      cancelRenameCategory: vi.fn(),
      confirmRenameCategory: vi.fn(),
      setCategories: vi.fn(),
      setNewCategoryName: vi.fn(),
      setRenameValue: vi.fn(),
      startRenameCategory: vi.fn(),
    };
    const props = buildSettingsRouteProps({
      ...handlers,
      categories: ['랭킹형', '영화'],
      cloudOnlyTags: ['예능'],
      savedChannels: [{ id: 'channel-1' }, { id: 'channel-2' }],
    });

    expect(props.functionApiBase).toBe('/api');
    expect(props.savedChannelCount).toBe(2);
    expect(props.categorySettingsProps).toMatchObject({
      ...handlers,
      categories: ['랭킹형', '영화'],
      cloudOnlyTags: ['예능'],
    });
  });

  it('uses safe empty lists when settings data is missing', () => {
    const props = buildSettingsRouteProps();

    expect(props.savedChannelCount).toBe(0);
    expect(props.categorySettingsProps.categories).toEqual([]);
    expect(props.categorySettingsProps.cloudOnlyTags).toEqual([]);
  });
});
