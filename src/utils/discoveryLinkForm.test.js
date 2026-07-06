import { describe, expect, it } from 'vitest';

import {
  getDiscoveryLinkDraftUpdates,
  getDiscoveryLinkUrlPreview,
  needsRiskyDiscoveryCandidateConfirmation,
  normalizeDiscoveryLinkUrl,
} from './discoveryLinkForm';

describe('discoveryLinkForm utils', () => {
  it('trims title and memo draft updates', () => {
    expect(getDiscoveryLinkDraftUpdates('  Short idea  ', '  check rights  ')).toEqual({
      title: 'Short idea',
      memo: 'check rights',
    });
  });

  it('normalizes valid URLs without changing source identity', () => {
    expect(normalizeDiscoveryLinkUrl(' HTTPS://www.Example.com/path/?b=2 ')).toBe('https://example.com/path?b=2');
  });

  it('falls back to trimmed lower-case text for invalid URLs', () => {
    expect(normalizeDiscoveryLinkUrl('  NOT A URL/  ')).toBe('not a url');
  });

  it('returns URL preview metadata for valid and invalid input', () => {
    expect(getDiscoveryLinkUrlPreview('https://www.instagram.com/reel/abc/')).toMatchObject({
      host: 'instagram.com',
      isValid: true,
    });

    expect(getDiscoveryLinkUrlPreview('not a url')).toEqual({
      host: '',
      label: '올바른 URL 형식이 아닙니다',
      isValid: false,
    });
  });

  it('requires confirmation only when do-not-use links are sent to candidate', () => {
    expect(needsRiskyDiscoveryCandidateConfirmation('candidate', 'do_not_use')).toBe(true);
    expect(needsRiskyDiscoveryCandidateConfirmation('candidate', 'needs_check')).toBe(false);
    expect(needsRiskyDiscoveryCandidateConfirmation('saved', 'do_not_use')).toBe(false);
  });
});
