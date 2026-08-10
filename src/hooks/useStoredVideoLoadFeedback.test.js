import { describe, expect, it } from 'vitest';

import { getEffectiveStoredVideoLoadResult } from './useStoredVideoLoadFeedback';

describe('getEffectiveStoredVideoLoadResult', () => {
  it('keeps a successful Azure DB lookup visible after moving to another screen', () => {
    const sharedLoadResult = {
      success: true,
      videoCount: 95,
      selectionKey: 'tech-by-tosh',
    };

    expect(getEffectiveStoredVideoLoadResult({
      loadResult: null,
      selectionKey: 'tech-by-tosh',
      sharedLoadResult,
    })).toBe(sharedLoadResult);
  });

  it('does not reuse a lookup result after the selected channel scope changes', () => {
    expect(getEffectiveStoredVideoLoadResult({
      loadResult: null,
      selectionKey: 'david-fortin',
      sharedLoadResult: {
        success: true,
        videoCount: 95,
        selectionKey: 'tech-by-tosh',
      },
    })).toBeNull();
  });

  it('prefers the current screen result over an older shared result', () => {
    const loadResult = { success: false, videoCount: 0 };

    expect(getEffectiveStoredVideoLoadResult({
      loadResult,
      selectionKey: 'tech-by-tosh',
      sharedLoadResult: {
        success: true,
        videoCount: 95,
        selectionKey: 'tech-by-tosh',
      },
    })).toBe(loadResult);
  });
});
