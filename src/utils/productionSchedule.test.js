import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getProductionScheduleSignal } from './productionSchedule';

describe('productionSchedule utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-07T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the unscheduled tone for missing publish dates', () => {
    expect(getProductionScheduleSignal({})).toMatchObject({
      tone: 'bg-slate-100 text-slate-500',
    });
  });

  it('returns the overdue tone for past publish dates', () => {
    const signal = getProductionScheduleSignal({ targetPublishDate: '2026-07-05' });

    expect(signal.tone).toBe('bg-rose-50 text-rose-600');
    expect(signal.label).toContain('2');
  });

  it('returns the today tone for a publish date due today', () => {
    expect(getProductionScheduleSignal({ targetPublishDate: '2026-07-07' })).toMatchObject({
      tone: 'bg-amber-100 text-amber-800',
    });
  });

  it('returns the soon tone for publish dates within three days', () => {
    const signal = getProductionScheduleSignal({ targetPublishDate: '2026-07-10' });

    expect(signal.tone).toBe('bg-amber-50 text-amber-700');
    expect(signal.label).toContain('3');
  });

  it('formats later publish dates with dot-separated dates', () => {
    expect(getProductionScheduleSignal({ targetPublishDate: '2026-07-20' })).toEqual({
      label: '2026.07.20',
      tone: 'bg-slate-100 text-slate-600',
    });
  });
});
