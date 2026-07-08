import { describe, expect, it } from 'vitest';

import { getCopyUrlButtonDefaults, hasCopyableUrlValue } from './copyUrlButtonProps';

describe('copyUrlButtonProps utils', () => {
  it('detects copyable URL values and rejects empty strings or lists', () => {
    expect(hasCopyableUrlValue('https://example.com')).toBe(true);
    expect(hasCopyableUrlValue([['Clip', 'https://example.com']])).toBe(true);
    expect(hasCopyableUrlValue('')).toBe(false);
    expect(hasCopyableUrlValue([])).toBe(false);
    expect(hasCopyableUrlValue(null)).toBe(false);
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
