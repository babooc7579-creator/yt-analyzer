import { describe, expect, it } from 'vitest';

import {
  getProductionKanbanEmptyStateActions,
  getProductionKanbanContentChildProps,
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

  it('builds empty state actions for home, reference vault, and discovery links without data changes', () => {
    const onOpenDiscoveryLinks = () => 'open discovery';
    const onOpenHome = () => 'open home';
    const onOpenReferenceVault = () => 'open vault';

    const actions = getProductionKanbanEmptyStateActions({
      onOpenDiscoveryLinks,
      onOpenHome,
      onOpenReferenceVault,
    });

    expect(actions.map((action) => action.key)).toEqual([
      'home',
      'reference-vault',
      'discovery-links',
    ]);
    expect(actions[0]).toMatchObject({
      iconKey: 'home',
      label: '오늘 레이더로',
      onClick: onOpenHome,
      variant: 'rose',
    });
    expect(actions[0].title).toContain('YouTube API');
    expect(actions[0].title).toContain('호출하지 않습니다');
    expect(actions[0].ariaLabel).toContain('YouTube API 호출 없음');
    expect(actions[1].onClick).toBe(onOpenReferenceVault);
    expect(actions[1].title).toContain('Cloud DB 조회');
    expect(actions[1].ariaLabel).toContain('YouTube API 호출 없음');
    expect(actions[2].onClick).toBe(onOpenDiscoveryLinks);
    expect(actions[2].title).toContain('자동 수집이나 다운로드는 실행하지 않습니다');
    expect(actions[2].ariaLabel).toContain('자동 수집이나 다운로드 없음');
  });

  it('omits empty state actions that do not have handlers', () => {
    expect(getProductionKanbanEmptyStateActions({
      onOpenDiscoveryLinks: () => 'open discovery',
    }).map((action) => action.key)).toEqual(['discovery-links']);
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

  it('builds child component props for the production kanban content view', () => {
    const props = {
      discoveryLinkCandidates: [{ id: 'link-1' }],
      draftRecords: { video1: { memo: 'draft' } },
      groupedVideos: { production_candidate: [{ videoId: 'video1' }] },
      hasUnsavedChanges: () => true,
      linkMoveStates: { link1: 'saving' },
      moveDiscoveryLink: () => 'move link',
      moveStates: { video1: 'saving' },
      moveVideo: () => 'move video',
      onOpenDiscoveryLinks: () => 'open links',
      productionSummary: { videoCount: 1, activeCount: 1 },
      saveDraftRecord: () => 'save',
      saveStates: { video1: 'idle' },
      updateDraftRecord: () => 'update',
      videoCount: 1,
      videoUserRecords: { video1: { status: 'production_candidate' } },
    };

    const viewProps = getProductionKanbanContentChildProps(props);

    expect(viewProps.summaryProps).toEqual({
      discoveryLinkCandidateCount: 1,
      productionSummary: props.productionSummary,
      videoCount: 1,
    });
    expect(viewProps.discoveryLinksSectionProps).toEqual({
      linkMoveStates: props.linkMoveStates,
      links: props.discoveryLinkCandidates,
      onMoveLink: props.moveDiscoveryLink,
      onOpenDiscoveryLinks: props.onOpenDiscoveryLinks,
    });
    expect(viewProps.boardProps).toMatchObject({
      draftRecords: props.draftRecords,
      groupedVideos: props.groupedVideos,
      hasUnsavedChanges: props.hasUnsavedChanges,
      moveStates: props.moveStates,
      onMove: props.moveVideo,
      onSave: props.saveDraftRecord,
      onUpdateDraft: props.updateDraftRecord,
      saveStates: props.saveStates,
      videoUserRecords: props.videoUserRecords,
    });
    expect(viewProps.boardProps.columns.length).toBeGreaterThan(0);
    expect(viewProps.boardProps.columns[0].emptyDescription).toContain('스크랩북 전체가 자동으로 들어오지는 않습니다');
    expect(viewProps.boardProps.columns[0].emptyDescription).toContain('만들 만한 항목만 제작 후보');
    expect(typeof viewProps.boardProps.getScheduleSignal).toBe('function');
  });

  it('uses safe discovery link fallback for child component props', () => {
    const viewProps = getProductionKanbanContentChildProps({
      discoveryLinkCandidates: null,
      draftRecords: {},
      groupedVideos: {},
      hasUnsavedChanges: () => false,
      linkMoveStates: {},
      moveDiscoveryLink: () => 'move link',
      moveStates: {},
      moveVideo: () => 'move video',
      onOpenDiscoveryLinks: () => 'open links',
      productionSummary: {},
      saveDraftRecord: () => 'save',
      saveStates: {},
      updateDraftRecord: () => 'update',
      videoCount: 0,
      videoUserRecords: {},
    });

    expect(viewProps.summaryProps.discoveryLinkCandidateCount).toBe(0);
    expect(viewProps.discoveryLinksSectionProps.links).toEqual([]);
  });

  it('keeps video board items and discovery link candidate items in separate child props', () => {
    const groupedVideos = {
      production_candidate: [{ videoId: 'video-candidate' }],
      production_active: [{ videoId: 'video-active' }],
    };
    const discoveryLinkCandidates = [
      { id: 'link-candidate-1', status: 'candidate' },
      { id: 'link-candidate-2', status: 'candidate' },
    ];

    const viewProps = getProductionKanbanContentChildProps({
      discoveryLinkCandidates,
      draftRecords: {},
      groupedVideos,
      hasUnsavedChanges: () => false,
      linkMoveStates: {},
      moveDiscoveryLink: () => 'move link',
      moveStates: {},
      moveVideo: () => 'move video',
      onOpenDiscoveryLinks: () => 'open links',
      productionSummary: {
        candidateCount: 1,
        videoCount: 2,
      },
      saveDraftRecord: () => 'save',
      saveStates: {},
      updateDraftRecord: () => 'update',
      videoCount: 2,
      videoUserRecords: {},
    });

    expect(viewProps.boardProps.groupedVideos).toBe(groupedVideos);
    expect(viewProps.discoveryLinksSectionProps.links).toBe(discoveryLinkCandidates);
    expect(viewProps.summaryProps).toMatchObject({
      discoveryLinkCandidateCount: 2,
      productionSummary: {
        candidateCount: 1,
        videoCount: 2,
      },
      videoCount: 2,
    });
  });
});
