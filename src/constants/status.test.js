import { describe, expect, it } from 'vitest';

import {
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
});
