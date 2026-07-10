import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react', () => ({
  useMemo: (factory) => factory(),
}));

vi.mock('../utils/creatorOsMetrics', () => ({
  getCreatorOsMetricsModel: vi.fn(() => ({ kind: 'creator-os-metrics' })),
}));

vi.mock('../utils/radarCandidates', () => ({
  getRadarCandidateDataModel: vi.fn(() => ({ kind: 'radar-candidate-data' })),
}));

vi.mock('../utils/productionKanbanData', () => ({
  getProductionKanbanDataModel: vi.fn(() => ({ kind: 'production-kanban-data' })),
}));

import { getCreatorOsMetricsModel } from '../utils/creatorOsMetrics';
import { getProductionKanbanDataModel } from '../utils/productionKanbanData';
import { getRadarCandidateDataModel } from '../utils/radarCandidates';
import { useCreatorOsMetrics } from './useCreatorOsMetrics';
import { useProductionKanbanData } from './useProductionKanbanData';
import { useRadarCandidateData } from './useRadarCandidateData';

describe('data model hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('passes Creator OS metric inputs to the metrics model with an empty discovery link default', () => {
    const props = {
      categories: [{ id: 'shorts' }],
      savedChannels: [{ id: 'channel-1' }],
      savedVideos: [{ videoId: 'video-1' }],
      selectedChannelIds: ['channel-1'],
      videoUserRecords: { 'video-1': { status: 'saved' } },
      videos: [{ videoId: 'video-1' }],
    };

    expect(useCreatorOsMetrics(props)).toEqual({ kind: 'creator-os-metrics' });
    expect(getCreatorOsMetricsModel).toHaveBeenCalledWith({
      ...props,
      discoveryLinks: [],
    });
  });

  it('passes radar candidate inputs to the radar data model', () => {
    const props = {
      videoUserRecords: { 'video-1': { statusIds: ['production_candidate'] } },
      videos: [{ videoId: 'video-1' }],
    };

    expect(useRadarCandidateData(props)).toEqual({ kind: 'radar-candidate-data' });
    expect(getRadarCandidateDataModel).toHaveBeenCalledWith(props);
  });

  it('passes production kanban inputs to the kanban data model', () => {
    const props = {
      discoveryLinks: [{ id: 'link-1', status: 'candidate' }],
      draftRecords: { 'video-1': { stage: 'draft' } },
      videoUserRecords: { 'video-1': { statusIds: ['production_candidate'] } },
      videos: [{ videoId: 'video-1' }],
    };

    expect(useProductionKanbanData(props)).toEqual({ kind: 'production-kanban-data' });
    expect(getProductionKanbanDataModel).toHaveBeenCalledWith(props);
  });
});
