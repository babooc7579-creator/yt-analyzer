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

    const props = getLegacyVaultTabViewProps({
      fetchTopComments,
      markRadarVideoStatus,
      openCreatorView,
      toggleScrapVideo,
      updateDiscoveryLink,
      updateVideoUserRecord,
    });

    expect(props.scrapbookWorkspaceProps.onFetchComments).toBe(fetchTopComments);
    expect(props.scrapbookWorkspaceProps.onMoveVideo).toBe(markRadarVideoStatus);
    expect(props.scrapbookWorkspaceProps.onRemoveScrap).toBe(toggleScrapVideo);
    expect(props.scrapbookWorkspaceProps.onUpdateDiscoveryLink).toBe(updateDiscoveryLink);
    expect(props.scrapbookWorkspaceProps.onUpdateVideoRecord).toBe(updateVideoUserRecord);

    props.scrapbookWorkspaceProps.onOpenHome();
    props.scrapbookWorkspaceProps.onOpenDiscoveryLinks();
    props.scrapbookWorkspaceProps.onOpenProductionCandidates({
      title: '후보 영상',
      videoId: 'video-1',
    });
    props.scrapbookWorkspaceProps.onOpenReferenceVault();
    props.scrapbookWorkspaceProps.onOpenUploadCalendar();

    expect(openedViews).toEqual([
      { id: 'home' },
      { id: 'vault-sources' },
      {
        id: 'studio-candidates',
        intent: {
          searchQuery: '후보 영상',
          source: 'scrapbook',
          targetVideoId: 'video-1',
        },
      },
      { id: 'vault-all' },
      { id: 'studio-calendar' },
    ]);
  });
});
