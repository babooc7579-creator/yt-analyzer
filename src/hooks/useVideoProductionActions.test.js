import { describe, expect, it, vi } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import { useVideoProductionActions } from './useVideoProductionActions';

describe('useVideoProductionActions', () => {
  it('checks production candidate state from Cloud video user records', () => {
    const { isProductionCandidate } = useVideoProductionActions({
      ensureProductionVideoSource: vi.fn(),
      markVideoStatus: vi.fn(),
      videoUserRecords: {
        'video-1': { statusIds: [PRODUCTION_STATUS.CANDIDATE] },
        'video-2': { statusIds: [PRODUCTION_STATUS.ACTIVE] },
      },
    });

    expect(isProductionCandidate('video-1')).toBe(true);
    expect(isProductionCandidate('video-2')).toBe(false);
    expect(isProductionCandidate('missing')).toBe(false);
  });

  it('keeps a production source before marking the video as a candidate', async () => {
    const ensureProductionVideoSource = vi.fn(() => Promise.resolve(true));
    const markVideoStatus = vi.fn(() => Promise.resolve(true));
    const video = { videoId: 'video-1', title: 'Clip' };

    const { promoteVideoToProduction } = useVideoProductionActions({
      ensureProductionVideoSource,
      markVideoStatus,
      videoUserRecords: {},
    });

    await expect(promoteVideoToProduction(video)).resolves.toBe(true);

    expect(ensureProductionVideoSource).toHaveBeenCalledWith(video);
    expect(markVideoStatus).toHaveBeenCalledWith('video-1', PRODUCTION_STATUS.CANDIDATE);
  });

  it('marks a video only after its production source is ready', async () => {
    const ensureProductionVideoSource = vi.fn(() => Promise.resolve(true));
    const markVideoStatus = vi.fn(() => Promise.resolve(true));
    const video = { videoId: 'video-2', title: 'Unsaved clip' };

    const { promoteVideoToProduction } = useVideoProductionActions({
      ensureProductionVideoSource,
      markVideoStatus,
      videoUserRecords: {},
    });

    await expect(promoteVideoToProduction(video)).resolves.toBe(true);

    expect(ensureProductionVideoSource).toHaveBeenCalledWith(video);
    expect(markVideoStatus).toHaveBeenCalledWith('video-2', PRODUCTION_STATUS.CANDIDATE);
  });

  it('does not mark production candidate status when source storage fails', async () => {
    const ensureProductionVideoSource = vi.fn(() => Promise.resolve(false));
    const markVideoStatus = vi.fn();
    const video = { videoId: 'video-3', title: 'Failed clip' };

    const { promoteVideoToProduction } = useVideoProductionActions({
      ensureProductionVideoSource,
      markVideoStatus,
      videoUserRecords: {},
    });

    await expect(promoteVideoToProduction(video)).resolves.toBe(false);

    expect(ensureProductionVideoSource).toHaveBeenCalledWith(video);
    expect(markVideoStatus).not.toHaveBeenCalled();
  });

  it('reports failure without removing the prepared source when candidate status storage fails', async () => {
    const ensureProductionVideoSource = vi.fn(() => Promise.resolve(true));
    const markVideoStatus = vi.fn(() => Promise.resolve(false));
    const video = { videoId: 'video-4', title: 'Retryable clip' };

    const { promoteVideoToProduction } = useVideoProductionActions({
      ensureProductionVideoSource,
      markVideoStatus,
      videoUserRecords: {},
    });

    await expect(promoteVideoToProduction(video)).resolves.toBe(false);
    expect(ensureProductionVideoSource).toHaveBeenCalledWith(video);
    expect(markVideoStatus).toHaveBeenCalledWith('video-4', PRODUCTION_STATUS.CANDIDATE);
  });
});
