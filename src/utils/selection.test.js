import { describe, expect, it } from 'vitest';

import { toggleListValue } from './selection';

describe('selection utils', () => {
  it('adds a missing value without mutating the source list', () => {
    const source = ['one'];
    const next = toggleListValue(source, 'two');

    expect(next).toEqual(['one', 'two']);
    expect(source).toEqual(['one']);
  });

  it('removes an existing value from the list', () => {
    expect(toggleListValue(['one', 'two', 'three'], 'two')).toEqual(['one', 'three']);
  });

  it('uses an empty list fallback for non-array input', () => {
    expect(toggleListValue(null, 'one')).toEqual(['one']);
  });
});
