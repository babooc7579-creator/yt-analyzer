import { describe, expect, it } from 'vitest';

import {
  PRODUCTION_STATUS,
  PRODUCTION_STATUS_LABELS,
  VIDEO_STATUS,
  VIDEO_STATUS_LABELS,
  isProductionStatus,
  isRadarHiddenRecord,
  isVideoReviewStatus,
  normalizeVideoUserRecord,
} from './status';

describe('status compatibility policy', () => {
  it('preserves an unknown legacy new status without treating it as a current workflow state', () => {
    const record = normalizeVideoUserRecord({ status: 'new' });

    expect(record).toMatchObject({
      status: 'new',
      statusIds: ['new'],
    });
    expect(isVideoReviewStatus('new')).toBe(false);
    expect(isProductionStatus('new')).toBe(false);
    expect(isRadarHiddenRecord(record)).toBe(false);
  });

  it('keeps review and production labels distinct across app surfaces', () => {
    expect(VIDEO_STATUS_LABELS[VIDEO_STATUS.REVIEWED]).toBe('봤음');
    expect(VIDEO_STATUS_LABELS[VIDEO_STATUS.WATCH_LATER]).toBe('나중에 보기');
    expect(VIDEO_STATUS_LABELS[VIDEO_STATUS.LEGACY_LATER]).toBe('나중에 보기');
    expect(VIDEO_STATUS_LABELS[VIDEO_STATUS.PRODUCTION_CANDIDATE]).toBe('제작 후보');
    expect(PRODUCTION_STATUS_LABELS[PRODUCTION_STATUS.CANDIDATE]).toBe('제작 후보');
    expect(VIDEO_STATUS_LABELS[VIDEO_STATUS.USED]).toBe('사용함');
    expect(PRODUCTION_STATUS_LABELS[PRODUCTION_STATUS.DONE]).toBe('업로드 완료');
    expect(VIDEO_STATUS_LABELS[VIDEO_STATUS.USED]).not.toBe(
      PRODUCTION_STATUS_LABELS[PRODUCTION_STATUS.DONE]
    );
  });
});
