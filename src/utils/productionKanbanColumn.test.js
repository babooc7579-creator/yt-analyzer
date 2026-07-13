import { describe, expect, it } from 'vitest';

import {
  getProductionKanbanColumnEmptyTitle,
  getProductionVideoCardProps,
} from './productionKanbanColumn';

describe('productionKanbanColumn utils', () => {
  const video = { videoId: 'video-1', title: 'Idea' };

  it('builds the empty column title fallback', () => {
    expect(getProductionKanbanColumnEmptyTitle({ emptyTitle: 'Ready' })).toBe('Ready');
    expect(getProductionKanbanColumnEmptyTitle({})).toBe('비어 있음');
  });

  it('uses draft records before saved user records and forwards card state', () => {
    const draftRecord = { memo: 'draft', uploadDate: 'today' };
    const savedRecord = { memo: 'saved' };
    const props = getProductionVideoCardProps({
      columnId: 'production_active',
      draftRecords: { 'video-1': draftRecord },
      getScheduleSignal: (record) => record.uploadDate || 'none',
      hasUnsavedChanges: (videoId) => videoId === 'video-1',
      moveStates: { 'video-1': 'saving' },
      onFocus: () => 'focus',
      onMove: () => 'move',
      onSave: () => 'save',
      onUpdateDraft: () => 'draft',
      saveStates: { 'video-1': 'idle' },
      video,
      videoUserRecords: { 'video-1': savedRecord },
    });

    expect(props).toMatchObject({
      columnId: 'production_active',
      isDirty: true,
      moveState: 'saving',
      onFocus: expect.any(Function),
      record: draftRecord,
      saveState: 'idle',
      scheduleSignal: 'today',
      video,
    });
  });

  it('falls back to saved records or an empty record when no draft exists', () => {
    const savedRecord = { memo: 'saved', uploadDate: 'later' };
    const baseProps = {
      columnId: 'production_candidate',
      draftRecords: {},
      getScheduleSignal: (record) => record.uploadDate || 'none',
      hasUnsavedChanges: () => false,
      moveStates: {},
      onMove: () => 'move',
      onSave: () => 'save',
      onUpdateDraft: () => 'draft',
      saveStates: {},
    };

    expect(getProductionVideoCardProps({
      ...baseProps,
      video,
      videoUserRecords: { 'video-1': savedRecord },
    })).toMatchObject({
      isDirty: false,
      record: savedRecord,
      scheduleSignal: 'later',
    });

    expect(getProductionVideoCardProps({
      ...baseProps,
      video: { videoId: 'missing' },
      videoUserRecords: {},
    })).toMatchObject({
      isDirty: false,
      record: {},
      scheduleSignal: 'none',
    });
  });

  it('builds safe card props when optional maps and handlers are missing', () => {
    expect(getProductionVideoCardProps({
      columnId: 'production_active',
      video: null,
    })).toMatchObject({
      columnId: 'production_active',
      isDirty: false,
      moveState: undefined,
      record: {},
      saveState: undefined,
      scheduleSignal: '',
      video: {},
    });

    expect(getProductionVideoCardProps({
      columnId: 'production_done',
      draftRecords: null,
      getScheduleSignal: (record) => record.targetPublishDate || 'none',
      hasUnsavedChanges: (videoId) => videoId === 'video-2',
      moveStates: null,
      saveStates: null,
      video: { videoId: 'video-2' },
      videoUserRecords: null,
    })).toMatchObject({
      columnId: 'production_done',
      isDirty: true,
      record: {},
      scheduleSignal: 'none',
      video: { videoId: 'video-2' },
    });
  });
});
