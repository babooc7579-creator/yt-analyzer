import { describe, expect, it } from 'vitest';

import {
  DISCOVERY_LINK_SAVING_MESSAGES,
  getDiscoveryActionError,
  getDiscoveryLinkSavingMessage,
} from './discoveryLinkActionCopy';

describe('discoveryLinkActionCopy utils', () => {
  it('defines saving messages for every discovery link action branch', () => {
    expect(Object.keys(DISCOVERY_LINK_SAVING_MESSAGES).sort()).toEqual([
      'create',
      'delete',
      'update',
      'update_rights',
      'update_status',
      'update_text',
    ]);
  });

  it('returns a saving message only while a known action is running', () => {
    expect(getDiscoveryLinkSavingMessage(true, 'create')).toBe(
      DISCOVERY_LINK_SAVING_MESSAGES.create
    );
    expect(getDiscoveryLinkSavingMessage(true, 'missing')).toBe('');
    expect(getDiscoveryLinkSavingMessage(false, 'create')).toBe('');
  });

  it('uses the thrown error message when building a Cloud action error', () => {
    const message = getDiscoveryActionError(
      new Error('Network failed'),
      'Fallback failed',
      'save'
    );

    expect(message).toContain('Network failed');
    expect(message).toContain('Cloud');
    expect(message).toContain('save');
  });

  it('falls back to the provided message when the error has no message', () => {
    const message = getDiscoveryActionError({}, 'Fallback failed', 'delete');

    expect(message).toContain('Fallback failed');
    expect(message).toContain('Cloud');
    expect(message).toContain('delete');
  });
});
