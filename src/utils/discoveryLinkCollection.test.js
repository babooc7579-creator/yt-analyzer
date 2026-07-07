import { describe, expect, it } from 'vitest';

import {
  getDiscoveryLinkById,
  getDiscoveryLinkFromResponse,
  getDiscoveryLinkSavingAction,
  getDiscoveryLinkUpdateNotice,
  getDiscoveryLinksFromResponse,
  removeDiscoveryLinkById,
  replaceDiscoveryLink,
  sortDiscoveryLinksByRecentUpdate,
  upsertDiscoveryLink,
} from './discoveryLinkCollection';

describe('discoveryLinkCollection utils', () => {
  const oldLink = { id: 'old', title: 'Old', updatedAt: '2026-07-01T00:00:00.000Z' };
  const newLink = { id: 'new', title: 'New', updatedAt: '2026-07-02T00:00:00.000Z' };

  it('reads discovery links from supported response shapes', () => {
    expect(getDiscoveryLinksFromResponse({ links: [oldLink] })).toEqual([oldLink]);
    expect(getDiscoveryLinksFromResponse({ items: [newLink] })).toEqual([newLink]);
    expect(getDiscoveryLinksFromResponse({})).toEqual([]);

    expect(getDiscoveryLinkFromResponse({ link: oldLink })).toBe(oldLink);
    expect(getDiscoveryLinkFromResponse({ item: newLink })).toBe(newLink);
    expect(getDiscoveryLinkFromResponse({ discoveryLink: newLink })).toBe(newLink);
  });

  it('sorts links by latest update first', () => {
    expect(sortDiscoveryLinksByRecentUpdate([oldLink, newLink]).map(link => link.id)).toEqual(['new', 'old']);
  });

  it('upserts, replaces, and removes links by id', () => {
    const upserted = upsertDiscoveryLink([oldLink], newLink);
    expect(upserted.map(link => link.id)).toEqual(['new', 'old']);

    const replaced = replaceDiscoveryLink(upserted, { ...oldLink, title: 'Updated Old' });
    expect(replaced.find(link => link.id === 'old')).toMatchObject({ title: 'Updated Old' });

    expect(removeDiscoveryLinkById(replaced, 'new').map(link => link.id)).toEqual(['old']);
  });

  it('keeps collection mutations scoped to valid Cloud link objects', () => {
    const mixedLinks = [oldLink, null, 'bad', newLink];

    expect(sortDiscoveryLinksByRecentUpdate(mixedLinks).map(link => link.id)).toEqual(['new', 'old']);
    expect(getDiscoveryLinkById(mixedLinks, 'new')).toBe(newLink);
    expect(upsertDiscoveryLink(mixedLinks, { title: 'No id' })).toEqual([oldLink, newLink]);
    expect(replaceDiscoveryLink(mixedLinks, { title: 'No id' })).toEqual([oldLink, newLink]);
    expect(removeDiscoveryLinkById(mixedLinks, 'old')).toEqual([newLink]);
  });

  it('classifies saving actions by changed fields', () => {
    expect(getDiscoveryLinkSavingAction({ status: 'candidate' })).toBe('update_status');
    expect(getDiscoveryLinkSavingAction({ rightsStatus: 'needs_check' })).toBe('update_rights');
    expect(getDiscoveryLinkSavingAction({ title: 'A', memo: 'B' })).toBe('update_text');
    expect(getDiscoveryLinkSavingAction({ status: 'candidate', memo: 'B' })).toBe('update');
  });

  it('keeps user notices aligned with Cloud state changes', () => {
    expect(getDiscoveryLinkUpdateNotice({ status: 'candidate' }, { title: 'Clip' })).toBe(
      "Clip의 검토 상태를 '제작 후보'로 저장했습니다."
    );
    expect(getDiscoveryLinkUpdateNotice({ rightsStatus: 'do_not_use' }, { title: 'Clip' })).toBe(
      "Clip의 권리 상태 표시를 '사용 금지'로 저장했습니다."
    );
    expect(getDiscoveryLinkUpdateNotice({ title: 'New clip', memo: 'memo' }, { title: 'Clip' })).toBe(
      'Clip의 제목과 메모를 Cloud에 저장했습니다.'
    );
  });
});
