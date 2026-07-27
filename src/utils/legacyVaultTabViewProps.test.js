import { describe, expect, it } from 'vitest';

import { getLegacyVaultTabViewProps } from './legacyVaultTabViewProps';

describe('legacyVaultTabViewProps utils', () => {
  it('builds scrapbook workspace props with vault state', () => {
    const discoveryLinks = [{ id: 'link1' }];
    const savedVideos = [{ videoId: 'saved1' }, { videoId: 'saved2' }];
    const videoUserRecords = { saved1: { status: 'candidate' } };

    const props = getLegacyVaultTabViewProps({
      copiedPrompt: 'copied',
      creatorView: 'vault-all',
      discoveryLinks,
      promptCopyError: 'copy failed',
      savedVideos,
      videoUserRecords,
    });

    expect(props.scrapbookWorkspaceProps).toMatchObject({
      copiedPrompt: 'copied',
      creatorView: 'vault-all',
      discoveryLinks,
      promptCopyError: 'copy failed',
      savedVideos,
      videoUserRecords,
    });
  });

  it('copies the current saved video list with a safe fallback', () => {
    let copiedVideos = ['not called'];
    const copyPromptForVideos = (videos) => {
      copiedVideos = videos;
      return 'copy result';
    };

    const props = getLegacyVaultTabViewProps({
      copyPromptForVideos,
      savedVideos: null,
    });

    expect(props.scrapbookWorkspaceProps.onCopyPrompt()).toBe('copy result');
    expect(copiedVideos).toEqual([]);
    expect(props.scrapbookWorkspaceProps.savedVideos).toEqual([]);
  });

  it('forwards scrapbook actions and opens the expected vault views', () => {
    const openedViews = [];
    const fetchTopComments = () => 'comments';
    const markRadarVideoStatus = () => 'move';
    const openCreatorView = (view) => openedViews.push(view);
    const toggleScrapVideo = () => 'remove';
    const updateDiscoveryLink = () => 'link';
    const updateVideoUserRecord = () => 'record';
    const setHasUnsavedProductionDrafts = () => 'unsaved';

    const props = getLegacyVaultTabViewProps({
      fetchTopComments,
      markRadarVideoStatus,
      openCreatorView,
      setHasUnsavedProductionDrafts,
      toggleScrapVideo,
      updateDiscoveryLink,
      updateVideoUserRecord,
    });

    expect(props.scrapbookWorkspaceProps.onFetchComments).toBe(fetchTopComments);
    expect(props.scrapbookWorkspaceProps.onMoveVideo).toBe(markRadarVideoStatus);
    expect(props.scrapbookWorkspaceProps.onRemoveScrap).toBe(toggleScrapVideo);
    expect(props.scrapbookWorkspaceProps.onUpdateDiscoveryLink).toBe(updateDiscoveryLink);
    expect(props.scrapbookWorkspaceProps.onUpdateVideoRecord).toBe(updateVideoUserRecord);
    expect(props.scrapbookWorkspaceProps.onUnsavedDraftsChange).toBe(setHasUnsavedProductionDrafts);

    props.scrapbookWorkspaceProps.onOpenHome();
    props.scrapbookWorkspaceProps.onOpenDiscoveryLinks();
    props.scrapbookWorkspaceProps.onOpenDiscoveryLinks({
      id: 'link-1',
      title: '참고 링크',
      url: 'https://example.com/link-1',
    });
    props.scrapbookWorkspaceProps.onOpenProductionCandidates({
      title: '후보 영상',
      videoId: 'video-1',
    });
    props.scrapbookWorkspaceProps.onOpenReferenceVault();
    props.scrapbookWorkspaceProps.onOpenScriptBoard();
    props.scrapbookWorkspaceProps.onOpenUploadCalendar();

    expect(openedViews).toEqual([
      { id: 'home' },
      { id: 'vault-sources' },
      {
        id: 'vault-sources',
        intent: {
          searchQuery: '참고 링크',
          source: 'studio-candidates',
          targetDiscoveryLinkId: 'link-1',
        },
      },
      {
        id: 'studio-candidates',
        intent: {
          searchQuery: '후보 영상',
          source: 'scrapbook',
          targetVideoId: 'video-1',
        },
      },
      { id: 'vault-videos' },
      { id: 'studio-script' },
      { id: 'studio-calendar' },
    ]);
  });
});
