import { describe, expect, it } from 'vitest';

import {
  getRadarCandidateCardViewProps,
  getRadarCandidateStripViewProps,
  getRadarPriorityLabel,
  getRadarReasons,
  getRadarScore,
} from './radarCandidates';

describe('radarCandidates utils', () => {
  const radarVideo = {
    videoId: 'radar-1',
    title: 'Old idea returns',
    daysOld: 300,
    view_count: 1500000,
    like_ratio: 5,
    multiplier: 4,
  };

  it('calculates radar score, reasons, and priority labels from video signals', () => {
    expect(getRadarScore(radarVideo)).toBe(215);
    expect(getRadarReasons(radarVideo)).toHaveLength(4);
    expect(getRadarReasons({})).toHaveLength(1);
    expect(getRadarPriorityLabel(180)).not.toBe(getRadarPriorityLabel(120));
    expect(getRadarPriorityLabel(120)).not.toBe(getRadarPriorityLabel(119));
  });

  it('builds radar candidate card props with score, badges, actions, and video links', () => {
    const handlers = {
      onMarkVideoStatus: () => 'status',
      onPromoteToProduction: () => 'production',
      onToggleScrap: () => 'scrap',
    };
    const viewProps = getRadarCandidateCardViewProps({
      ...handlers,
      index: 2,
      isSaved: true,
      video: radarVideo,
    });

    expect(viewProps.badgesProps).toEqual({
      isStrong: true,
      isTtoTto: true,
    });
    expect(viewProps.decisionActionsProps).toMatchObject({
      isSaved: true,
      video: radarVideo,
      videoTitle: 'Old idea returns',
    });
    expect(viewProps.primaryActionsProps).toEqual({
      videoTitle: 'Old idea returns',
      videoUrl: 'https://youtube.com/watch?v=radar-1',
    });
    expect(viewProps.scorePanelProps).toMatchObject({
      radarScore: 215,
    });
    expect(viewProps.thumbnailProps).toMatchObject({
      index: 2,
      video: radarVideo,
      videoTitle: 'Old idea returns',
    });
    expect(viewProps.titleLinkProps.videoUrl).toBe('https://youtube.com/watch?v=radar-1');
  });

  it('builds radar strip props for active, completed, and empty states', () => {
    const baseProps = {
      allDecisionCount: 3,
      decisionGroups: { reviewed: [] },
      decisionSummary: { done: 1 },
      isVideoSaved: () => false,
      loadedDecisionCount: 1,
      onClearDecisions: () => 'clear',
      onMarkVideoStatus: () => 'status',
      onOpenScrapbook: () => 'scrapbook',
      onOpenVault: () => 'vault',
      onPromoteToProduction: () => 'production',
      onRestoreVideo: () => 'restore',
      onToggleScrap: () => 'scrap',
      queueSummary: { open: 1 },
      savedVideos: [{ videoId: 'saved-1' }],
      videos: [radarVideo],
    };

    const activeProps = getRadarCandidateStripViewProps({
      ...baseProps,
      candidates: [radarVideo],
    });
    expect(activeProps.isCompleted).toBe(false);
    expect(activeProps.isEmpty).toBe(false);
    expect(activeProps.headerProps).toMatchObject({
      allDecisionCount: 3,
      savedVideoCount: 1,
      queueSummary: { open: 1 },
    });
    expect(activeProps.gridProps.candidates).toEqual([radarVideo]);

    expect(getRadarCandidateStripViewProps({ ...baseProps, candidates: [] }).isCompleted).toBe(true);
    expect(getRadarCandidateStripViewProps({ ...baseProps, candidates: [], videos: [] }).isEmpty).toBe(true);
  });
});
