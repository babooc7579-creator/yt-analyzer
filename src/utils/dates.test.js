import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  formatDateWithDots,
  formatCompactPublishedDate,
  formatElapsedTime,
  formatKoreanDateTime,
  formatKoreanPublishedDateTime,
  formatPublishedDateTimeWithAge,
  formatPublishedAge,
  formatShortKoreanDate,
  getDateDistanceFromToday,
  getDaysDiff,
  getIsoTodayDate,
  isOlderThanDays,
} from './dates';

describe('dates utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-07T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calculates day differences with a minimum of one day', () => {
    expect(getDaysDiff('2026-07-07T12:00:00.000Z')).toBe(1);
    expect(getDaysDiff('2026-07-06T12:00:00.000Z')).toBe(1);
    expect(getDaysDiff('2026-07-05T12:00:00.000Z')).toBe(2);
    expect(getDaysDiff('bad-date')).toBe(1);
  });

  it('checks whether a date is older than a threshold', () => {
    expect(isOlderThanDays('2026-07-05T12:00:00.000Z', 2)).toBe(true);
    expect(isOlderThanDays('2026-07-06T12:00:00.000Z', 2)).toBe(false);
  });

  it('formats current and simple date strings', () => {
    expect(getIsoTodayDate()).toBe('2026-07-07');
    expect(formatDateWithDots('2026-07-07')).toBe('2026.07.07');
    expect(formatDateWithDots('')).toBe('');
  });

  it('formats Korean date time with fallback for missing or invalid values', () => {
    const value = '2026-07-07T12:30:00.000Z';
    const expected = new Intl.DateTimeFormat('ko-KR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(value));

    expect(formatKoreanDateTime(value, '기록 없음')).toBe(expected);
    expect(formatKoreanDateTime('', '기록 없음')).toBe('기록 없음');
    expect(formatKoreanDateTime('bad-date', '기록 없음')).toBe('기록 없음');
  });

  it('formats YouTube publish time in Korea time with elapsed time', () => {
    const value = '2026-07-07T09:30:00.000Z';

    expect(formatKoreanPublishedDateTime(value)).toBe('2026. 7. 7. 오후 6:30');
    expect(formatElapsedTime(value, new Date('2026-07-07T12:00:00.000Z'))).toBe('2시간 전');
    expect(formatElapsedTime('2026-07-07T11:45:00.000Z', new Date('2026-07-07T12:00:00.000Z'))).toBe('15분 전');
    expect(formatElapsedTime('2026-07-05T12:00:00.000Z', new Date('2026-07-07T12:00:00.000Z'))).toBe('2일 전');
    expect(formatPublishedDateTimeWithAge(value, new Date('2026-07-07T12:00:00.000Z')))
      .toBe('2026. 7. 7. 오후 6:30 · 2시간 전');
    expect(formatPublishedDateTimeWithAge('bad-date')).toBe('게시 시각 미상');
  });

  it('formats compact Korean publish dates without changing the source date', () => {
    expect(formatShortKoreanDate('2026-04-01')).toBe('26년 4월 1일');
    expect(formatShortKoreanDate('2026-04-01T23:30:00.000Z')).toBe('26년 4월 1일');
    expect(formatShortKoreanDate('', '게시일 없음')).toBe('게시일 없음');
    expect(formatShortKoreanDate('bad-date', '게시일 없음')).toBe('게시일 없음');
  });

  it('formats the shared compact publish date and elapsed-day label', () => {
    expect(formatCompactPublishedDate('2026-07-13')).toBe('26.07.13');
    expect(formatPublishedAge('2026-07-13', 78)).toBe('26.07.13, 78일');
    expect(formatPublishedAge('', 78)).toBe('게시일 미상, 78일');
  });

  it('calculates date distance from today using date-only values', () => {
    expect(getDateDistanceFromToday('2026-07-07')).toBe(0);
    expect(getDateDistanceFromToday('2026-07-10')).toBe(3);
    expect(getDateDistanceFromToday('2026-07-05')).toBe(-2);
    expect(getDateDistanceFromToday()).toBeNull();
  });
});
