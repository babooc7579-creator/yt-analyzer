import { describe, expect, it } from 'vitest';

import {
  DISCOVERY_LINK_DELETE_ACTION_LABEL,
  DISCOVERY_LINK_DELETE_CLOUD_FAILED_MESSAGE,
  DISCOVERY_LINK_DELETE_FAILED_MESSAGE,
  DISCOVERY_LINK_LOAD_FAILED_MESSAGE,
  DISCOVERY_LINK_LOAD_UNAVAILABLE_MESSAGE,
  DISCOVERY_LINK_SAVE_ACTION_LABEL,
  DISCOVERY_LINK_SAVE_CLOUD_FAILED_MESSAGE,
  DISCOVERY_LINK_SAVE_FAILED_MESSAGE,
  DISCOVERY_LINK_SAVING_MESSAGES,
  DISCOVERY_LINK_STATUS_SAVE_FAILED_MESSAGE,
  DISCOVERY_LINK_UPDATE_ACTION_LABEL,
  DISCOVERY_LINK_UPDATE_CLOUD_FAILED_MESSAGE,
  getDiscoveryActionError,
  getDiscoveryLinkCreatedNotice,
  getDiscoveryLinkDeletedNotice,
  getDiscoveryLinkSavingMessage,
} from './discoveryLinkActionCopy';

describe('discoveryLinkActionCopy utils', () => {
  it('keeps discovery link action fallback copy centralized', () => {
    expect(DISCOVERY_LINK_LOAD_FAILED_MESSAGE).toBe('발견함 링크를 불러오지 못했습니다.');
    expect(DISCOVERY_LINK_LOAD_UNAVAILABLE_MESSAGE).toContain('Cloud 발견함 연결에 실패했습니다');
    expect(DISCOVERY_LINK_SAVE_FAILED_MESSAGE).toBe('링크를 저장하지 못했습니다.');
    expect(DISCOVERY_LINK_SAVE_CLOUD_FAILED_MESSAGE).toBe('Cloud에 링크를 저장하지 못했습니다.');
    expect(DISCOVERY_LINK_STATUS_SAVE_FAILED_MESSAGE).toBe('링크 상태를 저장하지 못했습니다.');
    expect(DISCOVERY_LINK_UPDATE_CLOUD_FAILED_MESSAGE).toBe('Cloud에 링크 변경 사항을 저장하지 못했습니다.');
    expect(DISCOVERY_LINK_DELETE_FAILED_MESSAGE).toBe('링크를 삭제하지 못했습니다.');
    expect(DISCOVERY_LINK_DELETE_CLOUD_FAILED_MESSAGE).toBe('Cloud에서 링크 기록을 삭제하지 못했습니다.');
    expect(DISCOVERY_LINK_SAVE_ACTION_LABEL).toBe('저장');
    expect(DISCOVERY_LINK_UPDATE_ACTION_LABEL).toBe('변경 저장');
    expect(DISCOVERY_LINK_DELETE_ACTION_LABEL).toBe('삭제');
  });

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

  it('builds Cloud discovery link notices from link names', () => {
    expect(getDiscoveryLinkCreatedNotice({ title: 'Clip' })).toBe(
      'Clip 링크를 Cloud 발견함에 저장했습니다.'
    );
    expect(getDiscoveryLinkDeletedNotice({ title: 'Clip' })).toBe(
      'Clip 링크 기록을 Cloud 발견함에서 삭제했습니다.'
    );
  });
});
