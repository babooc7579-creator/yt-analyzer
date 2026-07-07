import { describe, expect, it } from 'vitest';

import { getProductionVideoCardViewProps } from './productionVideoCard';

describe('productionVideoCard utils', () => {
  const video = {
    videoId: 'video-1',
    title: 'Production idea',
    daysOld: 300,
    view_count: 1500000,
    like_ratio: 5,
    multiplier: 4,
  };

  it('builds production video card props with radar and action state', () => {
    const handlers = {
      onMove: () => 'move',
      onSave: () => 'save',
      onUpdateDraft: () => 'draft',
    };
    const record = { memo: 'draft memo' };
    const viewProps = getProductionVideoCardViewProps({
      ...handlers,
      columnId: 'production_active',
      isDirty: true,
      moveState: 'saving',
      record,
      saveState: 'saving',
      scheduleSignal: 'today',
      video,
    });

    expect(viewProps.videoTitle).toBe('Production idea');
    expect(viewProps.videoUrl).toBe('https://youtube.com/watch?v=video-1');
    expect(viewProps.candidateReasonsProps).toMatchObject({
      radarScore: 215,
    });
    expect(viewProps.draftFormProps).toMatchObject({
      isDirty: true,
      isSaving: true,
      record,
      saveState: 'saving',
      video,
      videoTitle: 'Production idea',
    });
    expect(viewProps.metaBadgesProps).toEqual({
      columnId: 'production_active',
      scheduleSignal: 'today',
      video,
    });
    expect(viewProps.statusActionsProps).toMatchObject({
      columnId: 'production_active',
      isMoving: true,
      moveState: 'saving',
      record,
      video,
      videoTitle: 'Production idea',
      videoUrl: 'https://youtube.com/watch?v=video-1',
    });
  });

  it('uses fallback title and idle flags when optional state is missing', () => {
    const viewProps = getProductionVideoCardViewProps({
      columnId: 'production_candidate',
      isDirty: false,
      moveState: '',
      record: {},
      saveState: '',
      video: { videoId: 'missing-title' },
    });

    expect(viewProps.videoTitle).not.toBe('');
    expect(viewProps.videoUrl).toBe('https://youtube.com/watch?v=missing-title');
    expect(viewProps.draftFormProps.isSaving).toBe(false);
    expect(viewProps.statusActionsProps.isMoving).toBe(false);
  });
});
