import { describe, expect, it, vi } from 'vitest';

import { buildSettingsRouteProps, getSettingsDiagnostics, getSettingsErrorGuidance } from './settingsRouteProps';

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
    const loadChannelsFromCloud = vi.fn();
    const openCreatorView = vi.fn();
    const setError = vi.fn();
    const setHasUnsavedWorkToolSettings = vi.fn();
    const props = buildSettingsRouteProps({
      ...handlers,
      apiKey: 'youtube-key',
      categories: ['랭킹형', '영화'],
      cloudOnlyTags: ['예능'],
      error: 'Cloud 요청 실패',
      loadChannelsFromCloud,
      openCreatorView,
      savedChannels: [{ id: 'channel-1' }, { id: 'channel-2' }],
      setApiKey: vi.fn(),
      setError,
      setHasUnsavedWorkToolSettings,
      syncWarnings: ['판단 기록 임시 표시 중'],
    });

    expect(props.apiKey).toBe('youtube-key');
    expect(props.deploymentStatusUrl).toContain('/yt-analyzer/actions');
    expect(props.diagnostics).toEqual({
      apiKeyConfigured: true,
      errorGuidance: {
        title: '현재 오류를 확인한 뒤 다시 시도해 주세요',
        description: expect.stringContaining('온라인 저장소(Azure DB)의 채널 다시 불러오기'),
      },
      runtimeError: 'Cloud 요청 실패',
      syncWarnings: ['판단 기록 임시 표시 중'],
    });
    expect(props.onRefreshChannels).toBe(loadChannelsFromCloud);
    props.onClearError();
    expect(setError).toHaveBeenCalledWith('');
    expect(props.refreshingChannels).toBe(false);
    expect(props.functionApiBase).toBe('/api');
    expect(props.savedChannelCount).toBe(2);
    expect(props.workToolSettingsProps.onDirtyChange).toBe(setHasUnsavedWorkToolSettings);
    props.workToolSettingsProps.onOpenWorkTools();
    expect(openCreatorView).toHaveBeenCalledWith({ id: 'tools-bookmarks' });
    expect(props.categorySettingsProps).toMatchObject({
      ...handlers,
      categories: ['랭킹형', '영화'],
      cloudOnlyTags: ['예능'],
      restorableCategories: expect.arrayContaining(['해짜', '예능']),
    });
  });

  it('uses safe empty lists when settings data is missing', () => {
    const props = buildSettingsRouteProps();

    expect(props.savedChannelCount).toBe(0);
    expect(props.diagnostics).toEqual({
      apiKeyConfigured: false,
      errorGuidance: null,
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
      errorGuidance: null,
      runtimeError: '',
      syncWarnings: ['Cloud 경고'],
    });
  });

  it('gives specific retry guidance without claiming an uncertain root cause', () => {
    expect(getSettingsErrorGuidance('401 Unauthorized').title).toContain('로그인');
    expect(getSettingsErrorGuidance('Failed to fetch due to CORS').title).toContain('연결');
    expect(getSettingsErrorGuidance('온라인 저장 API(Azure) failed (500)').title).toContain('온라인 저장 API(Azure)');
    expect(getSettingsErrorGuidance('')).toBeNull();
  });
});
