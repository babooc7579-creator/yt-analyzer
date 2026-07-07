import { describe, expect, it } from 'vitest';

import {
  getProductionKanbanColumnProps,
  getProductionKanbanColumns,
} from './productionKanbanBoard';

describe('productionKanbanBoard utils', () => {
  it('normalizes the column list for rendering', () => {
    const columns = [{ id: 'production_candidate' }];

    expect(getProductionKanbanColumns(columns)).toBe(columns);
    expect(getProductionKanbanColumns(null)).toEqual([]);
  });

  it('builds column props with the matching grouped videos and forwarded handlers', () => {
    const column = { id: 'production_active', title: '진행중' };
    const videos = [{ videoId: 'video-1' }];
    const props = {
      column,
      draftRecords: { 'video-1': { memo: 'draft' } },
      getScheduleSignal: () => 'today',
      groupedVideos: {
        production_active: videos,
      },
      hasUnsavedChanges: () => true,
      moveStates: { 'video-1': 'saving' },
      onMove: () => 'move',
      onSave: () => 'save',
      onUpdateDraft: () => 'draft',
      saveStates: { 'video-1': 'idle' },
      videoUserRecords: { 'video-1': { status: 'production_active' } },
    };

    expect(getProductionKanbanColumnProps(props)).toMatchObject({
      column,
      draftRecords: props.draftRecords,
      getScheduleSignal: props.getScheduleSignal,
      hasUnsavedChanges: props.hasUnsavedChanges,
      moveStates: props.moveStates,
      onMove: props.onMove,
      onSave: props.onSave,
      onUpdateDraft: props.onUpdateDraft,
      saveStates: props.saveStates,
      videoUserRecords: props.videoUserRecords,
      videos,
    });
  });

  it('keeps the existing undefined videos value when a column has no group', () => {
    expect(getProductionKanbanColumnProps({
      column: { id: 'production_done' },
      draftRecords: {},
      getScheduleSignal: () => 'none',
      groupedVideos: null,
      hasUnsavedChanges: () => false,
      moveStates: {},
      onMove: () => 'move',
      onSave: () => 'save',
      onUpdateDraft: () => 'draft',
      saveStates: {},
      videoUserRecords: {},
    }).videos).toBeUndefined();
  });
});
