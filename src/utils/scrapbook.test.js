import { describe, expect, it, vi } from 'vitest';

import { PRODUCTION_STATUS, VIDEO_STATUS } from '../constants/status';
import {
  SCRAPBOOK_DELETE_FAILED_MESSAGE,
  SCRAPBOOK_LOAD_FAILED_MESSAGE,
  SCRAPBOOK_SAVE_FAILED_MESSAGE,
  getCloudScrapbookVideos,
  getNextScrapbookVideos,
  getProductionScopedVideos,
  getScrapbookEmptyStateActions,
  getScrapbookVideoCardViewProps,
  getScrapbookVideoFooterStatsViewProps,
  getScrapbookVideoInfoViewProps,
  getScrapbookVideoThumbnailViewProps,
  getScrapbookVideoUrlList,
  getScrapbookWorkspaceViewProps,
  hasScrapbookVideo,
  removeScrapbookVideo,
  upsertScrapbookVideo,
} from './scrapbook';

describe('scrapbook utils', () => {
  const savedVideo = {
    videoId: 'video-1',
    title: 'Saved video',
  };

  const secondVideo = {
    videoId: 'video-2',
    title: 'Second video',
  };

  it('keeps Cloud scrapbook fallback copy centralized', () => {
    expect(SCRAPBOOK_LOAD_FAILED_MESSAGE).toBe('소재 보관함을 불러오지 못했습니다.');
    expect(SCRAPBOOK_DELETE_FAILED_MESSAGE).toBe('소재 보관함에서 해제하지 못했습니다.');
    expect(SCRAPBOOK_SAVE_FAILED_MESSAGE).toBe('소재 보관함에 저장하지 못했습니다.');
  });

  it('keeps only object videos in the Cloud scrapbook list', () => {
    expect(getCloudScrapbookVideos([savedVideo, null, 'bad', secondVideo])).toEqual([
      savedVideo,
      secondVideo,
    ]);
    expect(getCloudScrapbookVideos(null)).toEqual([]);
  });

  it('checks, upserts, and removes scrapbook videos by videoId', () => {
    expect(hasScrapbookVideo([savedVideo], 'video-1')).toBe(true);
    expect(hasScrapbookVideo([savedVideo], 'missing')).toBe(false);

    expect(upsertScrapbookVideo([savedVideo], { ...savedVideo, title: 'Updated' })).toEqual([
      { ...savedVideo, title: 'Updated' },
    ]);
    expect(upsertScrapbookVideo([savedVideo], secondVideo)).toEqual([
      savedVideo,
      secondVideo,
    ]);
    expect(upsertScrapbookVideo([savedVideo], { title: 'No id' })).toEqual([savedVideo]);
    expect(removeScrapbookVideo([savedVideo, secondVideo], 'video-1')).toEqual([secondVideo]);
  });

  it('keeps scrapbook mutations scoped to valid Cloud video objects', () => {
    expect(removeScrapbookVideo([savedVideo, null, 'bad', secondVideo], 'video-2')).toEqual([
      savedVideo,
    ]);

    expect(upsertScrapbookVideo([savedVideo, null, 'bad'], secondVideo)).toEqual([
      savedVideo,
      secondVideo,
    ]);
  });

  it('builds the next scrapbook list for saved and unsaved videos', () => {
    expect(getNextScrapbookVideos([savedVideo, secondVideo], savedVideo, true)).toEqual([
      secondVideo,
    ]);

    expect(getNextScrapbookVideos([savedVideo], secondVideo, false)).toEqual([
      savedVideo,
      secondVideo,
    ]);

    expect(getNextScrapbookVideos([savedVideo], { title: 'No id' }, false)).toEqual([
      savedVideo,
    ]);
  });

  it('builds URL list text and production scoped video lists', () => {
    expect(getScrapbookVideoUrlList([savedVideo, { title: 'No id' }])).toBe(
      '1. Saved video\nhttps://youtube.com/watch?v=video-1'
    );

    expect(getProductionScopedVideos([savedVideo, secondVideo], {
      'video-1': { statusIds: [PRODUCTION_STATUS.CANDIDATE] },
      'video-2': { status: VIDEO_STATUS.REVIEWED },
    })).toEqual([savedVideo]);

    expect(getProductionScopedVideos([savedVideo, secondVideo], {
      'video-2': { status: PRODUCTION_STATUS.ACTIVE },
    })).toEqual([secondVideo]);
  });

  it('builds scrapbook video card, thumbnail, info, and footer stats copy', () => {
    const richVideo = {
      ...savedVideo,
      channel_title: 'Saved Channel',
      duration: '12:34',
      isShorts: true,
      like_ratio: 5,
      view_count: 123456,
    };
    const cardProps = getScrapbookVideoCardViewProps(richVideo);
    const thumbnailProps = getScrapbookVideoThumbnailViewProps({
      video: richVideo,
      videoTitle: cardProps.videoTitle,
    });
    const infoProps = getScrapbookVideoInfoViewProps({
      video: richVideo,
      videoUrl: cardProps.videoUrl,
    });
    const statsProps = getScrapbookVideoFooterStatsViewProps(richVideo);

    expect(cardProps).toEqual({
      videoTitle: 'Saved video',
      videoUrl: 'https://youtube.com/watch?v=video-1',
    });
    expect(thumbnailProps).toMatchObject({
      durationText: '12:34',
      imageProps: {
        alt: 'Saved video 썸네일',
        src: 'https://i.ytimg.com/vi/video-1/hqdefault.jpg',
      },
      shortsLabel: 'Shorts',
      showShortsLabel: true,
    });
    expect(infoProps).toMatchObject({
      channelTitle: 'Saved Channel',
      title: 'Saved video',
    });
    expect(infoProps.titleLinkProps['aria-label']).toContain('YouTube 원본 영상 열기');
    expect(statsProps).toEqual({
      label: '조회수 / 참여율',
      likeRatioText: '(5%)',
      viewCountText: '123,456',
    });
    expect(getScrapbookVideoCardViewProps({}).videoTitle).toBe('이 영상');
  });

  it('builds scrapbook workspace props for scrapbook and production views', () => {
    const handlers = {
      onCopyPrompt: () => 'copy',
      onFetchComments: () => 'comments',
      onMoveVideo: vi.fn(),
      onOpenDiscoveryLinks: () => 'open links',
      onOpenHome: () => 'open home',
      onOpenProductionCandidates: () => 'open candidates',
      onOpenReferenceVault: () => 'open vault',
      onOpenScriptBoard: () => 'open script',
      onOpenUploadCalendar: () => 'open calendar',
      onRemoveScrap: () => 'remove',
      onUpdateDiscoveryLink: () => 'update link',
      onUpdateVideoRecord: () => 'update video',
      onUnsavedDraftsChange: () => 'unsaved',
    };

    const productionProps = getScrapbookWorkspaceViewProps({
      ...handlers,
      copiedPrompt: 'copied',
      creatorView: 'studio-candidates',
      creatorViewIntent: { searchQuery: '예약 영상', source: 'upload-calendar', targetVideoId: 'video-1' },
      discoveryLinks: [{ id: 'link-1' }],
      promptCopyError: '',
      savedVideos: [savedVideo, secondVideo],
      videoUserRecords: {
        'video-1': { statusIds: [PRODUCTION_STATUS.ACTIVE] },
      },
    });

    expect(productionProps.isProductionView).toBe(true);
    expect(productionProps.isScrapbookEmpty).toBe(false);
    expect(productionProps.headerProps).toMatchObject({
      copiedPrompt: 'copied',
      savedVideoCount: 1,
      variant: 'production',
    });
    expect(productionProps.headerProps.videoUrlList).toContain('video-1');
    expect(productionProps.headerProps.videoUrlList).not.toContain('video-2');
    expect(productionProps.productionKanbanProps).toMatchObject({
      discoveryLinks: [{ id: 'link-1' }],
      videos: [savedVideo, secondVideo],
      videoUserRecords: {
        'video-1': { statusIds: [PRODUCTION_STATUS.ACTIVE] },
      },
      onOpenHome: handlers.onOpenHome,
      onOpenScriptBoard: handlers.onOpenScriptBoard,
      onOpenUploadCalendar: handlers.onOpenUploadCalendar,
      onUnsavedDraftsChange: handlers.onUnsavedDraftsChange,
      initialSearchQuery: '예약 영상',
      initialSearchSource: 'upload-calendar',
      initialTargetDiscoveryLinkId: '',
      initialTargetVideoId: 'video-1',
    });
    const savedCardProps = productionProps.getScrapbookVideoCardProps(savedVideo);
    const secondCardProps = productionProps.getScrapbookVideoCardProps(secondVideo);

    expect(savedCardProps).toMatchObject({
      video: savedVideo,
      isProductionCandidate: true,
      onFetchComments: handlers.onFetchComments,
      onOpenProductionCandidates: handlers.onOpenProductionCandidates,
      onPromoteToProduction: expect.any(Function),
      onRemoveScrap: handlers.onRemoveScrap,
    });
    expect(secondCardProps).toMatchObject({
      video: secondVideo,
      isProductionCandidate: false,
      onPromoteToProduction: expect.any(Function),
    });

    secondCardProps.onPromoteToProduction();
    expect(handlers.onMoveVideo).toHaveBeenCalledWith(
      'video-2',
      PRODUCTION_STATUS.CANDIDATE
    );

    const scrapbookProps = getScrapbookWorkspaceViewProps({
      ...handlers,
      copiedPrompt: '',
      creatorView: 'studio-scrapbook',
      discoveryLinks: [],
      promptCopyError: '',
      savedVideos: [],
      videoUserRecords: {},
    });

    expect(scrapbookProps.isProductionView).toBe(false);
    expect(scrapbookProps.isScrapbookEmpty).toBe(true);
    expect(scrapbookProps.headerProps).toMatchObject({
      savedVideoCount: 0,
      variant: 'scrapbook',
    });
    expect(scrapbookProps.scrapbookEmptyStateProps).toEqual({
      onOpenHome: handlers.onOpenHome,
      onOpenReferenceVault: handlers.onOpenReferenceVault,
    });
  });

  it('builds scrapbook empty state actions as navigation-only shortcuts', () => {
    const onOpenHome = () => 'open home';
    const onOpenReferenceVault = () => 'open vault';

    const actions = getScrapbookEmptyStateActions({
      onOpenHome,
      onOpenReferenceVault,
    });

    expect(actions.map((action) => action.key)).toEqual([
      'home',
      'reference-vault',
    ]);
    expect(actions[0]).toMatchObject({
      iconKey: 'home',
      label: '오늘 레이더로',
      onClick: onOpenHome,
      variant: 'secondary',
    });
    expect(actions[0].title).toContain('화면 이동만');
    expect(actions[0].ariaLabel).toContain('YouTube API 호출 없음');
    expect(actions[1]).toMatchObject({
      iconKey: 'referenceVault',
      label: '수집 영상 목록',
      onClick: onOpenReferenceVault,
      variant: 'indigo',
    });
    expect(actions[1].title).toContain('온라인 저장소(Azure DB)');
    expect(actions[1].title).toContain('YouTube API를 새로 호출하지 않습니다');
  });

  it('omits scrapbook empty state actions without handlers', () => {
    expect(getScrapbookEmptyStateActions({
      onOpenReferenceVault: () => 'open vault',
    }).map((action) => action.key)).toEqual(['reference-vault']);
  });
});
