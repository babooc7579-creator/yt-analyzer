import { describe, expect, it } from 'vitest';

import {
  getProductionKanbanContentProps,
  shouldShowProductionKanbanEmptyState,
} from './productionKanbanProps';

describe('productionKanbanProps utils', () => {
  it('detects empty kanban state from production summary and discovery links', () => {
    expect(shouldShowProductionKanbanEmptyState({
      discoveryLinkCandidates: [],
      productionSummary: { videoCount: 0 },
    })).toBe(true);

    expect(shouldShowProductionKanbanEmptyState({
      discoveryLinkCandidates: [{ id: 'link-1' }],
      productionSummary: { videoCount: 0 },
    })).toBe(false);

    expect(shouldShowProductionKanbanEmptyState({
      discoveryLinkCandidates: [],
      productionSummary: { videoCount: 1 },
    })).toBe(false);
  });

  it('builds kanban content props with summary video count and forwarded handlers', () => {
    const props = {
      discoveryLinkCandidates: [{ id: 'link-1' }],
      draftRecords: { video1: { memo: 'draft' } },
      groupedVideos: { production_candidate: [{ videoId: 'video1' }] },
      hasUnsavedChanges: () => false,
      linkMoveStates: { link1: 'saving' },
      moveDiscoveryLink: () => 'move link',
      moveStates: { video1: 'saving' },
      moveVideo: () => 'move video',
      onOpenDiscoveryLinks: () => 'open links',
      productionSummary: { videoCount: 1, activeCount: 1 },
      saveDraftRecord: () => 'save',
      saveStates: { video1: 'idle' },
      updateDraftRecord: () => 'update',
      videoUserRecords: { video1: { status: 'production_candidate' } },
    };

    expect(getProductionKanbanContentProps(props)).toMatchObject({
      discoveryLinkCandidates: [{ id: 'link-1' }],
      draftRecords: props.draftRecords,
      groupedVideos: props.groupedVideos,
      linkMoveStates: props.linkMoveStates,
      moveStates: props.moveStates,
      productionSummary: { videoCount: 1, activeCount: 1 },
      saveStates: props.saveStates,
      videoCount: 1,
      videoUserRecords: props.videoUserRecords,
    });
  });

  it('uses safe fallbacks for invalid summary and discovery link inputs', () => {
    const viewProps = getProductionKanbanContentProps({
      discoveryLinkCandidates: null,
      draftRecords: {},
      groupedVideos: {},
      hasUnsavedChanges: () => false,
      linkMoveStates: {},
      moveDiscoveryLink: () => 'move link',
      moveStates: {},
      moveVideo: () => 'move video',
      onOpenDiscoveryLinks: () => 'open links',
      productionSummary: null,
      saveDraftRecord: () => 'save',
      saveStates: {},
      updateDraftRecord: () => 'update',
      videoUserRecords: {},
    });

    expect(viewProps.discoveryLinkCandidates).toEqual([]);
    expect(viewProps.productionSummary).toEqual({});
    expect(viewProps.videoCount).toBe(0);
  });
});
