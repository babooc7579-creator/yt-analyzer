import { describe, expect, it } from 'vitest';

import { PRODUCTION_STATUS, VIDEO_STATUS } from '../constants/status';
import {
  getCloudScrapbookVideos,
  getProductionScopedVideos,
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

  it('builds URL list text and production scoped video lists', () => {
    expect(getScrapbookVideoUrlList([savedVideo, { title: 'No id' }])).toBe(
      '1. Saved video\nhttps://youtube.com/watch?v=video-1'
    );

    expect(getProductionScopedVideos([savedVideo, secondVideo], {
      'video-1': { statusIds: [PRODUCTION_STATUS.CANDIDATE] },
      'video-2': { status: VIDEO_STATUS.REVIEWED },
    })).toEqual([savedVideo]);
  });

  it('builds scrapbook workspace props for scrapbook and production views', () => {
    const handlers = {
      onCopyPrompt: () => 'copy',
      onFetchComments: () => 'comments',
      onMoveVideo: () => 'move',
      onOpenDiscoveryLinks: () => 'open links',
      onOpenReferenceVault: () => 'open vault',
      onRemoveScrap: () => 'remove',
      onUpdateDiscoveryLink: () => 'update link',
      onUpdateVideoRecord: () => 'update video',
    };

    const productionProps = getScrapbookWorkspaceViewProps({
      ...handlers,
      copiedPrompt: 'copied',
      creatorView: 'studio-candidates',
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
    });
    expect(productionProps.getScrapbookVideoCardProps(savedVideo)).toMatchObject({
      video: savedVideo,
      onFetchComments: handlers.onFetchComments,
      onRemoveScrap: handlers.onRemoveScrap,
    });

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
  });
});
