import { describe, expect, it, vi } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import { getProductionKanbanDataModel } from './productionKanbanData';
import { getScrapbookWorkspaceViewProps } from './scrapbook';
import { getUploadCalendarItems, getUploadCalendarSummary } from './uploadCalendar';

const video = {
  videoId: 'video-1',
  title: '다시 볼 만한 소재',
  channel_title: 'Reference Channel',
  multiplier: 12.4,
};

const createWorkspaceProps = ({ onMoveVideo, videoUserRecords = {} } = {}) => (
  getScrapbookWorkspaceViewProps({
    creatorView: 'studio-scrapbook',
    creatorViewIntent: null,
    discoveryLinks: [],
    copiedPrompt: '',
    promptCopyError: '',
    savedVideos: [video],
    videoUserRecords,
    onMoveVideo,
  })
);

describe('Creator OS workflow contract', () => {
  it('keeps one video connected from scrapbook promotion through focus and upload scheduling', () => {
    const onMoveVideo = vi.fn();
    const scrapbook = createWorkspaceProps({ onMoveVideo });

    scrapbook.getScrapbookVideoCardProps(video).onPromoteToProduction();
    expect(onMoveVideo).toHaveBeenCalledWith(
      video.videoId,
      PRODUCTION_STATUS.CANDIDATE,
    );

    const candidateRecord = {
      videoId: video.videoId,
      status: PRODUCTION_STATUS.CANDIDATE,
      statusIds: [PRODUCTION_STATUS.CANDIDATE],
    };
    const candidateModel = getProductionKanbanDataModel({
      discoveryLinks: [],
      videoUserRecords: { [video.videoId]: candidateRecord },
      videos: [video],
    });

    expect(candidateModel.productionSummary).toMatchObject({
      candidateCount: 1,
      focusCount: 0,
      videoCount: 1,
    });
    expect(candidateModel.groupedVideos[PRODUCTION_STATUS.CANDIDATE]).toEqual([video]);

    const focusedRecord = {
      ...candidateRecord,
      focusPinnedAt: '2026-07-20T09:00:00.000Z',
    };
    const focusedModel = getProductionKanbanDataModel({
      discoveryLinks: [],
      videoUserRecords: { [video.videoId]: focusedRecord },
      videos: [video],
    });

    expect(focusedModel.focusVideos).toEqual([video]);
    expect(focusedModel.groupedVideos[PRODUCTION_STATUS.CANDIDATE]).toEqual([]);
    expect(focusedModel.productionSummary).toMatchObject({
      candidateCount: 1,
      focusCount: 1,
      videoCount: 1,
    });

    const scheduledRecord = {
      ...focusedRecord,
      targetPublishDate: '2026-07-24',
    };
    const calendarItems = getUploadCalendarItems({
      videoUserRecords: { [video.videoId]: scheduledRecord },
      videos: [video],
    });

    expect(calendarItems).toEqual([
      expect.objectContaining({
        date: '2026-07-24',
        sourceLoaded: true,
        statusGroup: 'candidate',
        title: video.title,
        videoId: video.videoId,
      }),
    ]);
    expect(getUploadCalendarSummary({
      items: calendarItems,
      monthKey: '2026-07',
      todayKey: '2026-07-20',
      videoUserRecords: { [video.videoId]: scheduledRecord },
    })).toMatchObject({
      scheduledCount: 1,
      unscheduledCount: 0,
      upcomingCount: 1,
    });
  });

  it('shows discovery-link candidates beside video candidates without mixing their storage models', () => {
    const videoRecord = {
      videoId: video.videoId,
      status: PRODUCTION_STATUS.CANDIDATE,
      statusIds: [PRODUCTION_STATUS.CANDIDATE],
    };
    const discoveryLinks = [
      {
        id: 'link-1',
        docType: 'discovery_link',
        status: 'candidate',
        rightsStatus: 'needs_check',
        title: '외부 발견 링크',
        url: 'https://example.com/reference',
        updatedAt: '2026-07-20T08:00:00.000Z',
      },
    ];
    const model = getProductionKanbanDataModel({
      discoveryLinks,
      videoUserRecords: { [video.videoId]: videoRecord },
      videos: [video],
    });

    expect(model.groupedVideos[PRODUCTION_STATUS.CANDIDATE]).toEqual([video]);
    expect(model.discoveryLinkCandidates).toEqual(discoveryLinks);
    expect(model.productionSummary).toMatchObject({
      candidateCount: 1,
      discoveryRightsWarningCount: 1,
      videoCount: 1,
    });
  });

  it('keeps legacy status-only production records visible in the same workflow', () => {
    const legacyRecord = {
      videoId: video.videoId,
      status: PRODUCTION_STATUS.CANDIDATE,
    };
    const model = getProductionKanbanDataModel({
      discoveryLinks: [],
      videoUserRecords: { [video.videoId]: legacyRecord },
      videos: [video],
    });
    const scrapbook = createWorkspaceProps({
      onMoveVideo: vi.fn(),
      videoUserRecords: { [video.videoId]: legacyRecord },
    });

    expect(model.groupedVideos[PRODUCTION_STATUS.CANDIDATE]).toEqual([video]);
    expect(model.productionSummary.candidateCount).toBe(1);
    expect(scrapbook.getScrapbookVideoCardProps(video).isProductionCandidate).toBe(true);
  });
});
