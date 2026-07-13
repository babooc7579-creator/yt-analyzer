import { describe, expect, it } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import {
  filterUploadCalendarItems,
  getUploadCalendarEmptyState,
  getUploadCalendarFilterEmptyState,
  getUploadCalendarGridDays,
  getUploadCalendarItems,
  getUploadCalendarSummary,
  shiftCalendarMonth,
} from './uploadCalendar';

const records = {
  v1: { videoId: 'v1', status: PRODUCTION_STATUS.ACTIVE, statusIds: [PRODUCTION_STATUS.ACTIVE], targetPublishDate: '2026-07-14', draftTitle: '내 제목' },
  v2: { videoId: 'v2', status: PRODUCTION_STATUS.CANDIDATE, statusIds: [PRODUCTION_STATUS.CANDIDATE], targetPublishDate: '2026-07-20' },
  v3: { videoId: 'v3', status: PRODUCTION_STATUS.DONE, statusIds: [PRODUCTION_STATUS.DONE], targetPublishDate: '2026-07-01' },
  v4: { videoId: 'v4', status: PRODUCTION_STATUS.CANDIDATE, statusIds: [PRODUCTION_STATUS.CANDIDATE] },
};

const videos = [
  { videoId: 'v1', title: 'Source one', thumbnail: 'one.jpg' },
  { videoId: 'v2', title: 'Source two' },
];

describe('uploadCalendar utils', () => {
  it('builds scheduled items from existing production records', () => {
    const items = getUploadCalendarItems({ videoUserRecords: records, videos });
    expect(items).toHaveLength(3);
    expect(items[0]).toMatchObject({ sourceLoaded: false, statusGroup: 'done', videoId: 'v3' });
    expect(items[1]).toMatchObject({ sourceLoaded: true, statusGroup: 'active', title: '내 제목', videoId: 'v1' });
    expect(items[2]).toMatchObject({ sourceLoaded: true, statusGroup: 'candidate', videoId: 'v2' });
  });

  it('filters status groups and handles month movement', () => {
    const items = getUploadCalendarItems({ videoUserRecords: records, videos });
    expect(filterUploadCalendarItems(items, 'done').map((item) => item.videoId)).toEqual(['v3']);
    expect(shiftCalendarMonth('2026-12', 1)).toBe('2027-01');
    expect(shiftCalendarMonth('2026-01', -1)).toBe('2025-12');
  });

  it('creates a stable six-week grid and groups items by date', () => {
    const items = getUploadCalendarItems({ videoUserRecords: records, videos });
    const days = getUploadCalendarGridDays({ items, monthKey: '2026-07', todayKey: '2026-07-14' });
    expect(days).toHaveLength(42);
    expect(days.find((day) => day.dateKey === '2026-07-14')).toMatchObject({ isToday: true, items: [expect.objectContaining({ videoId: 'v1' })] });
  });

  it('summarizes scheduled, overdue, upcoming, and unscheduled work', () => {
    const items = getUploadCalendarItems({ videoUserRecords: records, videos });
    expect(getUploadCalendarSummary({ items, monthKey: '2026-07', todayKey: '2026-07-14', videoUserRecords: records })).toEqual({
      monthCount: 3,
      overdueCount: 0,
      scheduledCount: 3,
      todayCount: 1,
      unscheduledCount: 1,
      upcomingCount: 1,
    });
  });

  it('explains both missing candidates and missing schedule dates', () => {
    expect(getUploadCalendarEmptyState({ productionRecordCount: 0 })).toMatchObject({ title: '아직 제작 후보가 없습니다' });
    expect(getUploadCalendarEmptyState({ productionRecordCount: 3, scheduledCount: 0 })).toMatchObject({ title: '날짜가 정해진 제작 후보가 없습니다' });
  });

  it('explains a status filter with no matching schedules without changing data', () => {
    expect(getUploadCalendarFilterEmptyState({ statusFilter: 'active', visibleCount: 0 })).toMatchObject({
      actionLabel: '전체 제작 상태 보기',
      title: '선택한 상태의 일정이 없습니다',
    });
    expect(getUploadCalendarFilterEmptyState({ statusFilter: 'all', visibleCount: 0 })).toBeNull();
    expect(getUploadCalendarFilterEmptyState({ statusFilter: 'active', visibleCount: 1 })).toBeNull();
  });
});
