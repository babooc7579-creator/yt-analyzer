import { describe, expect, it } from 'vitest';

import { buildAIRemakePrompt } from './prompts';

describe('prompts utils', () => {
  it('returns an empty prompt when there are no target videos', () => {
    expect(buildAIRemakePrompt()).toBe('');
    expect(buildAIRemakePrompt([])).toBe('');
    expect(buildAIRemakePrompt(null)).toBe('');
  });

  it('builds an AI remake prompt with numbered video metadata', () => {
    const prompt = buildAIRemakePrompt([
      {
        language: 'EN',
        title: 'Unusual Table Trick',
        view_count: 1234567,
        like_ratio: 87.5,
        isShorts: true,
      },
      {
        language: 'KR',
        title: 'Old Story Returns',
        view_count: 10000,
        like_ratio: 12,
        isShorts: false,
      },
    ]);

    expect(prompt).toContain('1. [EN]');
    expect(prompt).toContain('Unusual Table Trick');
    expect(prompt).toContain('1,234,567');
    expect(prompt).toContain('87.5%');
    expect(prompt).toContain('2. [KR]');
    expect(prompt).toContain('Old Story Returns');
    expect(prompt).toContain('10,000');
    expect(prompt).toContain('12%');
    expect(prompt).toContain('[요청 사항]');
  });
});
