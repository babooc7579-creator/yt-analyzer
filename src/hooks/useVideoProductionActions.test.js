import { describe, expect, it, vi } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import { useVideoProductionActions } from './useVideoProductionActions';

describe('useVideoProductionActions', () => {
  it('checks production candidate state from Cloud video user records', () => {
    const { isProductionCandidate } = useVideoProductionActions({
      isVideoSaved: vi.fn(),
      markVideoStatus: vi.fn(),
      toggleScrapVideo: vi.fn(),
      videoUserRecords: {
        'video-1': { statusIds: [PRODUCTION_STATUS.CANDIDATE] },
        'video-2': { statusIds: [PRODUCTION_STATUS.ACTIVE] },
      },
    });

    expect(isProductionCandidate('video-1')).toBe(true);
    expect(isProductionCandidate('video-2')).toBe(false);
    expect(isProductionCandidate('missing')).toBe(false);
  });

  it('marks an already saved video as a production candidate without changing scrapbook state', async () => {
    const isVideoSaved = vi.fn(() => true);
    const toggleScrapVideo = vi.fn();
    const markVideoStatus = vi.fn(() => Promise.resolve(true));
    const video = { videoId: 'video-1', title: 'Clip' };

    const { promoteVideoToProduction } = useVideoProductionActions({
      isVideoSaved,
      markVideoStatus,
      toggleScrapVideo,
      videoUserRecords: {},
    });

    await expect(promoteVideoToProduction(video)).resolves.toBe(true);

    expect(isVideoSaved).toHaveBeenCalledWith('video-1');
    expect(toggleScrapVideo).not.toHaveBeenCalled();
    expect(markVideoStatus).toHaveBeenCalledWith('video-1', PRODUCTION_STATUS.CANDIDATE);
  });

  it('stores an unsaved video in the scrapbook before marking it as a production candidate', async () => {
    const isVideoSaved = vi.fn(() => false);
    const toggleScrapVideo = vi.fn(() => Promise.resolve(true));
    const markVideoStatus = vi.fn(() => Promise.resolve(true));
    const video = { videoId: 'video-2', title: 'Unsaved clip' };

    const { promoteVideoToProduction } = useVideoProductionActions({
      isVideoSaved,
      markVideoStatus,
      toggleScrapVideo,
      videoUserRecords: {},
    });

    await expect(promoteVideoToProduction(video)).resolves.toBe(true);

    expect(toggleScrapVideo).toHaveBeenCalledWith(video);
    expect(markVideoStatus).toHaveBeenCalledWith('video-2', PRODUCTION_STATUS.CANDIDATE);
  });

  it('does not mark production candidate status when scrapbook storage fails', async () => {
    const isVideoSaved = vi.fn(() => false);
    const toggleScrapVideo = vi.fn(() => Promise.resolve(false));
    const markVideoStatus = vi.fn();
    const video = { videoId: 'video-3', title: 'Failed clip' };

    const { promoteVideoToProduction } = useVideoProductionActions({
      isVideoSaved,
      markVideoStatus,
      toggleScrapVideo,
      videoUserRecords: {},
    });

    await expect(promoteVideoToProduction(video)).resolves.toBe(false);

    expect(toggleScrapVideo).toHaveBeenCalledWith(video);
    expect(markVideoStatus).not.toHaveBeenCalled();
  });
});
