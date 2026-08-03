import { describe, expect, it } from 'vitest';

import {
  PRODUCTION_STATUS,
  VIDEO_STATUS,
  VIDEO_STATUS_LABELS,
} from '../constants/status';
import {
  RADAR_TODAY_CANDIDATE_LIMIT,
  getRadarCandidateBadgesViewProps,
  getRadarCandidateCardViewProps,
  getRadarCandidateDataModel,
  getRadarCandidateMetricsViewProps,
  getRadarCandidatePrimaryActionsViewProps,
  getRadarCandidateScorePanelViewProps,
  getRadarCandidateStripViewProps,
  getRadarCandidateThumbnailViewProps,
  getRadarCandidateTitleLinkViewProps,
  getRadarDecisionBuckets,
  getRadarDecisionGroups,
  getRadarDecisionSummary,
  getRadarDecisionSummaryViewProps,
  getRadarPriorityLabel,
  getRadarQueueSummary,
  getRadarReasons,
  getRadarScore,
  getRadarTodayCandidates,
} from './radarCandidates';

describe('radarCandidates utils', () => {
  const radarVideo = {
    videoId: 'radar-1',
    title: 'Old idea returns',
    daysOld: 300,
    view_count: 1500000,
    like_ratio: 5,
    multiplier: 4,
    upload_date: '2025-09-16',
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
      similarTopicCount: 0,
    });
    expect(viewProps.decisionActionsProps).toMatchObject({
      isSaved: true,
      video: radarVideo,
      videoTitle: 'Old idea returns',
    });
    expect(viewProps.decisionActionsProps.onMarkVideoStatus).toBe(handlers.onMarkVideoStatus);
    expect(viewProps.decisionActionsProps.onPromoteToProduction).toBe(handlers.onPromoteToProduction);
    expect(viewProps.decisionActionsProps.onToggleScrap).toBe(handlers.onToggleScrap);
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

  it('builds radar card display copy helpers without changing candidate actions', () => {
    expect(getRadarCandidateBadgesViewProps({
      isStrong: true,
      isTtoTto: true,
    }).badges.map(badge => badge.label)).toEqual(['또터또', '강한 반응']);
    expect(getRadarCandidateMetricsViewProps(radarVideo).items).toEqual([
      { label: '대박 지수', value: '4.0x' },
      { label: '게시일 · 경과', value: '25.09.16, 300일' },
      { label: '참여율', value: '5%' },
    ]);
    expect(getRadarCandidatePrimaryActionsViewProps({
      videoTitle: 'Radar clip',
      videoUrl: 'https://youtube.com/watch?v=radar-1',
    })).toMatchObject({
      copyButtonProps: {
        copiedLabel: '복사 완료',
        label: 'URL 복사',
      },
      openButtonProps: {
        label: '1. 영상 열고 판단',
        title: 'YouTube에서 원본 영상 열기',
      },
    });
    expect(getRadarCandidateScorePanelViewProps({
      radarScore: 215,
      reasons: ['reason'],
    })).toMatchObject({
      reasonList: ['reason'],
      scoreText: 215,
      titleText: '후보 판단 점수',
    });
    expect(getRadarCandidateThumbnailViewProps({
      index: 1,
      priorityLabel: '우선 검토',
      video: radarVideo,
      videoTitle: 'Radar clip',
    })).toMatchObject({
      imageProps: {
        alt: 'Radar clip 썸네일',
      },
      rankText: '#2',
    });
    expect(getRadarCandidateTitleLinkViewProps({
      videoTitle: 'Radar clip',
      videoUrl: 'https://youtube.com/watch?v=radar-1',
    })).toMatchObject({
      title: 'Radar clip',
      videoTitle: 'Radar clip',
    });
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
      onOpenProductionCandidates: () => 'production view',
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
    expect(activeProps.completedStateProps.onOpenProductionCandidates).toBe(
      baseProps.onOpenProductionCandidates
    );
    expect(activeProps.gridProps.candidates).toEqual([radarVideo]);

    expect(getRadarCandidateStripViewProps({ ...baseProps, candidates: [] }).isCompleted).toBe(true);
    expect(getRadarCandidateStripViewProps({ ...baseProps, candidates: [], videos: [] }).isEmpty).toBe(true);
  });

  it('builds radar candidate data from videos and user records without API calls', () => {
    const candidateTwo = {
      videoId: 'candidate-2',
      title: 'Fresh strong clip',
      daysOld: 20,
      like_ratio: 2,
      multiplier: 4,
      view_count: 900000,
    };
    const reviewedVideo = { ...radarVideo, videoId: 'reviewed-1' };
    const productionVideo = { ...radarVideo, videoId: 'production-1' };
    const excludedVideo = { ...radarVideo, videoId: 'excluded-1' };
    const laterVideo = { ...radarVideo, videoId: 'later-1' };

    const model = getRadarCandidateDataModel({
      videoUserRecords: {
        'excluded-1': { status: VIDEO_STATUS.EXCLUDED },
        'later-1': { statusIds: [VIDEO_STATUS.WATCH_LATER] },
        'production-1': { statusIds: [PRODUCTION_STATUS.CANDIDATE] },
        'reviewed-1': { status: VIDEO_STATUS.REVIEWED },
      },
      videos: [
        candidateTwo,
        reviewedVideo,
        null,
        productionVideo,
        radarVideo,
        excludedVideo,
        laterVideo,
      ],
    });

    expect(model.candidates.map(video => video.videoId)).toEqual(['radar-1', 'candidate-2']);
    expect(model.decisionSummary).toEqual({
      excluded: 1,
      later: 1,
      production: 1,
      reviewed: 1,
    });
    expect(model.loadedDecisionCount).toBe(4);
    expect(model.allDecisionCount).toBe(4);
    expect(model.queueSummary).toMatchObject({
      candidateLimit: RADAR_TODAY_CANDIDATE_LIMIT,
      hiddenDecisionCount: 4,
      highPriorityCount: 1,
      shownCandidateCount: 2,
      visibleQueueCount: 2,
    });
    expect(model.decisionGroups.map(group => group.key)).toEqual([
      'reviewed',
      'later',
      'production',
      'excluded',
    ]);
  });

  it('keeps every production workflow status out of today radar candidates', () => {
    const productionStatuses = Object.values(PRODUCTION_STATUS);
    const videos = productionStatuses.map((status, index) => ({
      ...radarVideo,
      videoId: `production-${index}`,
    }));
    const videoUserRecords = Object.fromEntries(productionStatuses.map((status, index) => ([
      `production-${index}`,
      { status, statusIds: [status] },
    ])));

    const model = getRadarCandidateDataModel({ videoUserRecords, videos });

    expect(model.candidates).toEqual([]);
    expect(model.allDecisionCount).toBe(productionStatuses.length);
    expect(model.decisionSummary.production).toBe(1);
  });

  it('builds radar decision buckets, summaries, groups, and queue summaries safely', () => {
    const videoList = [
      { videoId: 'reviewed' },
      { videoId: 'candidate', daysOld: 300, multiplier: 4, like_ratio: 1 },
      { videoId: 'excluded' },
    ];
    const userRecordMap = {
      excluded: { status: VIDEO_STATUS.EXCLUDED },
      reviewed: { status: VIDEO_STATUS.REVIEWED },
    };
    const buckets = getRadarDecisionBuckets({ userRecordMap, videoList });
    const candidatePool = getRadarTodayCandidates(videoList);

    expect(buckets.reviewed.map(video => video.videoId)).toEqual(['reviewed']);
    expect(buckets.excluded.map(video => video.videoId)).toEqual(['excluded']);
    expect(getRadarDecisionSummary(buckets)).toMatchObject({
      excluded: 1,
      reviewed: 1,
    });
    expect(getRadarDecisionGroups(buckets)[0]).toMatchObject({
      key: 'reviewed',
      label: VIDEO_STATUS_LABELS[VIDEO_STATUS.REVIEWED],
    });
    expect(candidatePool).toHaveLength(3);
    expect(getRadarQueueSummary({
      allDecisionCount: 2,
      candidatePool,
      candidates: candidatePool.slice(0, 2),
    })).toMatchObject({
      hiddenDecisionCount: 2,
      shownCandidateCount: 2,
      visibleQueueCount: 3,
    });
  });

  it('builds radar decision summary card labels and safe counts', () => {
    expect(getRadarDecisionSummaryViewProps({
      excluded: 4,
      later: 2,
      production: 3,
      reviewed: 1,
    }).cards.map(card => [card.label, card.value])).toEqual([
      ['봤음', 1],
      ['나중에 보기', 2],
      ['제작 후보', 3],
      ['제외', 4],
    ]);
    expect(getRadarDecisionSummaryViewProps().cards.map(card => card.value)).toEqual([0, 0, 0, 0]);
  });
});
