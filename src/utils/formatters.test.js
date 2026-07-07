import { describe, expect, it } from 'vitest';

import {
  formatCompactKo,
  formatCoverageRate,
  formatOptionalNumber,
  formatPercent,
} from './formatters';

describe('formatters utils', () => {
  it('formats compact Korean numbers for raw, ten-thousand, and hundred-million ranges', () => {
    expect(formatCompactKo(0)).toBe('0');
    expect(formatCompactKo(9999)).toBe('9,999');
    expect(formatCompactKo(10000)).toBe(`1${'\uB9CC'}`);
    expect(formatCompactKo(123456)).toBe(`12.3${'\uB9CC'}`);
    expect(formatCompactKo(100000000)).toBe(`1${'\uC5B5'}`);
    expect(formatCompactKo(987654321)).toBe(`9.9${'\uC5B5'}`);
    expect(formatCompactKo('bad')).toBe('0');
  });

  it('formats optional numbers with fallback for invalid values', () => {
    expect(formatOptionalNumber(1234567)).toBe('1,234,567');
    expect(formatOptionalNumber('1234')).toBe('1,234');
    expect(formatOptionalNumber('bad')).toBe('-');
    expect(formatOptionalNumber(undefined)).toBe('-');
  });

  it('formats coverage rates from fractions or percentages', () => {
    expect(formatCoverageRate(0.875)).toBe('87.5%');
    expect(formatCoverageRate(1)).toBe('100%');
    expect(formatCoverageRate(87.5)).toBe('87.5%');
    expect(formatCoverageRate('bad')).toBeNull();
  });

  it('formats percentages with configurable digits', () => {
    expect(formatPercent(12)).toBe('12%');
    expect(formatPercent(12.345)).toBe('12.3%');
    expect(formatPercent(12.345, 2)).toBe('12.35%');
    expect(formatPercent('bad')).toBe('0%');
  });
});
