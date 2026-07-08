import { describe, expect, it } from 'vitest';

import {
  DISCOVERY_RIGHTS_TONES,
  getDiscoveryLinkStatusLabel,
  getDiscoveryRightsStatusLabel,
} from '../constants/discoveryLinks';
import {
  DISCOVERY_LINK_DELETE_CONFIRM_MESSAGE,
  countDiscoveryLinksByRightsStatus,
  countDiscoveryLinksByStatus,
  filterDiscoveryLinksByRightsStatus,
  filterDiscoveryLinksBySearchQuery,
  filterDiscoveryLinksByStatus,
  getDiscoveryLinkRowMeta,
  getDiscoveryLinkRowViewProps,
  getDiscoveryLinkUrlListItems,
  getProductionDiscoveryLinkTitle,
  getSearchableDiscoveryLinkText,
} from './discoveryLinks';

describe('discoveryLinks utils', () => {
  const instagramLink = {
    id: 'ig-1',
    title: 'Cake Idea',
    url: 'https://www.instagram.com/reel/abc',
    memo: 'Army table reference',
    status: 'candidate',
    rightsStatus: 'needs_check',
  };

  const youtubeLink = {
    id: 'yt-1',
    title: 'Study Clip',
    url: 'https://youtu.be/xyz',
    memo: 'Safe reference',
    status: 'saved',
    rightsStatus: 'cleared',
  };

  it('keeps destructive discovery link confirmation copy explicit', () => {
    expect(DISCOVERY_LINK_DELETE_CONFIRM_MESSAGE).toContain('Cloud 발견함에서 삭제');
    expect(DISCOVERY_LINK_DELETE_CONFIRM_MESSAGE).toContain('외부 링크 자체는 삭제되지 않습니다');
    expect(DISCOVERY_LINK_DELETE_CONFIRM_MESSAGE).toContain('Creator OS 안의 발견함 기록만 삭제');
  });

  it('builds searchable text from title, url, memo, platform, and host', () => {
    const searchableText = getSearchableDiscoveryLinkText(instagramLink);

    expect(searchableText).toContain('cake idea');
    expect(searchableText).toContain('army table reference');
    expect(searchableText).toContain('instagram');
    expect(searchableText).toContain('instagram.com');
    expect(getSearchableDiscoveryLinkText(null)).toContain('unknown');
  });

  it('counts discovery links by status and rights status with fallback values', () => {
    const links = [instagramLink, youtubeLink, {}, null, 'bad'];

    expect(countDiscoveryLinksByStatus(links)).toEqual({
      candidate: 1,
      inbox: 1,
      saved: 1,
    });
    expect(countDiscoveryLinksByRightsStatus(links)).toEqual({
      cleared: 1,
      needs_check: 1,
      unknown: 1,
    });
  });

  it('filters links by status, rights status, and search query', () => {
    const links = [instagramLink, youtubeLink];

    expect(filterDiscoveryLinksByStatus(links, 'candidate', 'all').map(link => link.id)).toEqual(['ig-1']);
    expect(filterDiscoveryLinksByStatus(links, 'all', 'all')).toEqual(links);
    expect(filterDiscoveryLinksByRightsStatus(links, 'cleared', 'all').map(link => link.id)).toEqual(['yt-1']);
    expect(filterDiscoveryLinksByRightsStatus(links, 'all', 'all')).toEqual(links);
    expect(filterDiscoveryLinksBySearchQuery(links, 'army').map(link => link.id)).toEqual(['ig-1']);
    expect(filterDiscoveryLinksBySearchQuery(links, '')).toEqual(links);
  });

  it('creates URL list items with status and rights labels', () => {
    const [item, emptyItem] = getDiscoveryLinkUrlListItems([
      instagramLink,
      { id: 'empty', title: 'Empty link' },
    ]);

    expect(item[0]).toBe('Cake Idea');
    expect(item[1]).toBe('https://www.instagram.com/reel/abc');
    expect(item[2]).toContain(getDiscoveryLinkStatusLabel('candidate'));
    expect(item[2]).toContain(getDiscoveryRightsStatusLabel('needs_check'));
    expect(emptyItem).toBeNull();
  });

  it('builds row meta with platform, host, title fallback, and rights tone', () => {
    expect(getDiscoveryLinkRowMeta(instagramLink)).toMatchObject({
      currentRightsStatus: 'needs_check',
      currentStatus: 'candidate',
      platformLabel: 'Instagram',
      rightsTone: DISCOVERY_RIGHTS_TONES.needs_check,
      sourceHost: 'instagram.com',
      title: 'Cake Idea',
    });

    expect(getDiscoveryLinkRowMeta({ url: 'https://example.com/path' })).toMatchObject({
      currentRightsStatus: 'unknown',
      currentStatus: 'inbox',
      platformLabel: 'Web',
      rightsTone: DISCOVERY_RIGHTS_TONES.unknown,
      sourceHost: 'example.com',
      title: 'example.com',
    });
  });

  it('builds production discovery link titles with host and empty-link fallback', () => {
    expect(getProductionDiscoveryLinkTitle(instagramLink)).toBe('Cake Idea');
    expect(getProductionDiscoveryLinkTitle({
      url: 'https://www.instagram.com/reel/no-title',
    })).toBe('instagram.com');
    expect(getProductionDiscoveryLinkTitle({})).toBe('발견 링크');
    expect(getProductionDiscoveryLinkTitle(null)).toBe('발견 링크');
  });

  it('builds row view props and switches edit toggle handlers by state', () => {
    const cancelEdit = () => 'cancel';
    const openEdit = () => 'open';
    const baseProps = {
      cancelEdit,
      currentRightsStatus: 'needs_check',
      currentStatus: 'candidate',
      draftMemo: 'memo',
      draftTitle: 'title',
      handleDelete: () => 'delete',
      handleRightsStatusChange: () => 'rights',
      handleSaveEdit: () => 'save',
      handleSendToCandidate: () => 'candidate',
      handleStatusChange: () => 'status',
      link: instagramLink,
      openEdit,
      platformLabel: 'Instagram',
      rightsTone: DISCOVERY_RIGHTS_TONES.needs_check,
      saving: false,
      setDraftMemo: () => 'set memo',
      setDraftTitle: () => 'set title',
      sourceHost: 'instagram.com',
      title: 'Cake Idea',
    };

    const viewProps = getDiscoveryLinkRowViewProps({ ...baseProps, isEditing: false });
    expect(viewProps.cardClassName).toContain(DISCOVERY_RIGHTS_TONES.needs_check.card);
    expect(viewProps.actionsProps.onToggleEdit).toBe(openEdit);
    expect(viewProps.rowContentProps).toMatchObject({
      currentRightsStatus: 'needs_check',
      currentStatus: 'candidate',
      isEditing: false,
      link: instagramLink,
      platformLabel: 'Instagram',
      sourceHost: 'instagram.com',
      title: 'Cake Idea',
    });

    expect(getDiscoveryLinkRowViewProps({ ...baseProps, isEditing: true }).actionsProps.onToggleEdit).toBe(cancelEdit);
  });
});
