import { describe, expect, it } from 'vitest';

import { getCopyableUrlText, getCopyUrlButtonDefaults, hasCopyableUrlValue } from './copyUrlButtonProps';

describe('copyUrlButtonProps utils', () => {
  it('detects copyable URL values and rejects empty strings or lists', () => {
    expect(hasCopyableUrlValue('https://example.com')).toBe(true);
    expect(hasCopyableUrlValue([['Clip', 'https://example.com']])).toBe(true);
    expect(hasCopyableUrlValue('')).toBe(false);
    expect(hasCopyableUrlValue('   ')).toBe(false);
    expect(hasCopyableUrlValue([])).toBe(false);
    expect(hasCopyableUrlValue([null])).toBe(false);
    expect(hasCopyableUrlValue(null)).toBe(false);
  });

  it('formats array URL values into copyable numbered text', () => {
    expect(getCopyableUrlText([
      ['First clip', 'https://example.com/one'],
      ['Second clip', 'https://example.com/two'],
    ])).toBe('1. First clip\nhttps://example.com/one\n\n2. Second clip\nhttps://example.com/two');
  });

  it('builds default copy button labels and safe title', () => {
    expect(getCopyUrlButtonDefaults()).toEqual({
      copiedLabel: '복사 완료',
      copyingLabel: '복사 중',
      errorLabel: '복사 실패',
      label: 'URL 복사',
      title: 'URL 복사 - 클립보드에 복사합니다. API 호출이나 저장 작업은 없습니다.',
    });
  });

  it('uses custom labels and preserves custom title', () => {
    expect(getCopyUrlButtonDefaults({
      label: '링크 복사',
      title: '직접 지정한 설명',
    })).toEqual({
      copiedLabel: '복사 완료',
      copyingLabel: '복사 중',
      errorLabel: '복사 실패',
      label: '링크 복사',
      title: '직접 지정한 설명',
    });
  });
});
