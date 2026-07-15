import { describe, expect, it, vi } from 'vitest';

import { buildSettingsRouteProps, getSettingsDiagnostics } from './settingsRouteProps';

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
      apiKey: 'youtube-key',
      categories: ['랭킹형', '영화'],
      cloudOnlyTags: ['예능'],
      error: 'Cloud 요청 실패',
      savedChannels: [{ id: 'channel-1' }, { id: 'channel-2' }],
      setApiKey: vi.fn(),
      syncWarnings: ['판단 기록 임시 표시 중'],
    });

    expect(props.apiKey).toBe('youtube-key');
    expect(props.deploymentStatusUrl).toContain('/yt-analyzer/actions');
    expect(props.diagnostics).toEqual({
      apiKeyConfigured: true,
      runtimeError: 'Cloud 요청 실패',
      syncWarnings: ['판단 기록 임시 표시 중'],
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
    expect(props.diagnostics).toEqual({
      apiKeyConfigured: false,
      runtimeError: '',
      syncWarnings: [],
    });
    expect(props.categorySettingsProps.categories).toEqual([]);
    expect(props.categorySettingsProps.cloudOnlyTags).toEqual([]);
  });

  it('normalizes invalid diagnostic values without exposing an API key', () => {
    expect(getSettingsDiagnostics({
      apiKey: '   ',
      error: null,
      syncWarnings: ['Cloud 경고', '', null],
    })).toEqual({
      apiKeyConfigured: false,
      runtimeError: '',
      syncWarnings: ['Cloud 경고'],
    });
  });
});
