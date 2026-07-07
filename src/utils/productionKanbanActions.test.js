import { describe, expect, it } from 'vitest';

import {
  getProductionDiscoveryLinkMoveUpdates,
  getNextDraftRecords,
  getProductionDraftUpdates,
  hasProductionDraftChanges,
} from './productionKanbanActions';

describe('productionKanbanActions utils', () => {
  it('updates an existing draft record without losing draft fields', () => {
    const nextDrafts = getNextDraftRecords(
      {
        video1: {
          videoId: 'video1',
          draftTitle: 'Old draft',
          note: 'Keep this note',
        },
      },
      {
        video1: {
          videoId: 'video1',
          draftTitle: 'Saved title',
          targetPublishDate: '2026-07-15',
        },
      },
      'video1',
      { draftTitle: 'New draft' },
    );

    expect(nextDrafts.video1).toEqual({
      videoId: 'video1',
      draftTitle: 'New draft',
      note: 'Keep this note',
    });
  });

  it('uses the saved record as the base when a draft does not exist yet', () => {
    expect(getNextDraftRecords(
      {},
      {
        video1: {
          videoId: 'video1',
          draftTitle: 'Saved title',
          targetPublishDate: '2026-07-15',
        },
      },
      'video1',
      { note: 'Add a note' },
    ).video1).toEqual({
      videoId: 'video1',
      draftTitle: 'Saved title',
      targetPublishDate: '2026-07-15',
      note: 'Add a note',
    });
  });

  it('returns safe draft maps for missing ids or invalid record inputs', () => {
    const draftRecords = { video1: { draftTitle: 'Draft' } };

    expect(getNextDraftRecords(draftRecords, {}, '', { note: 'Ignored' })).toBe(draftRecords);
    expect(getNextDraftRecords(null, null, 'video1', null)).toEqual({
      video1: { videoId: 'video1' },
    });
  });

  it('detects production draft changes across title, note, and publish date', () => {
    const saved = {
      draftTitle: 'Title',
      note: 'Note',
      targetPublishDate: '2026-07-15',
    };

    expect(hasProductionDraftChanges(saved, saved)).toBe(false);
    expect(hasProductionDraftChanges(saved, { ...saved, draftTitle: 'New title' })).toBe(true);
    expect(hasProductionDraftChanges(saved, { ...saved, note: 'New note' })).toBe(true);
    expect(hasProductionDraftChanges(saved, { ...saved, targetPublishDate: '2026-07-16' })).toBe(true);
    expect(hasProductionDraftChanges(null, null)).toBe(false);
  });

  it('builds normalized draft updates for Cloud save payloads', () => {
    expect(getProductionDraftUpdates({
      draftTitle: 'Title',
      note: 'Note',
      targetPublishDate: '2026-07-15',
      ignored: 'not saved',
    })).toEqual({
      draftTitle: 'Title',
      note: 'Note',
      targetPublishDate: '2026-07-15',
    });

    expect(getProductionDraftUpdates(null)).toEqual({
      draftTitle: '',
      note: '',
      targetPublishDate: '',
    });
  });

  it('builds discovery link move updates with status only', () => {
    expect(getProductionDiscoveryLinkMoveUpdates('saved')).toEqual({
      status: 'saved',
    });
    expect(Object.keys(getProductionDiscoveryLinkMoveUpdates('candidate'))).toEqual(['status']);
  });
});
