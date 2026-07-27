import { describe, expect, it } from 'vitest';

import {
  CHANNEL_CREATOR_VIEWS,
  CREATOR_OS_ITEMS,
  CREATOR_OS_PRODUCT_MAP,
  LEGACY_REFERENCE_ITEMS,
  READY_CREATOR_VIEWS,
  SCRAPBOOK_CREATOR_VIEWS,
  getCreatorOsItem,
} from './creatorOs';

const itemsById = Object.fromEntries(
  CREATOR_OS_ITEMS.map((item) => [item.id, item])
);

describe('creatorOs constants', () => {
  it('flattens product map items with their section title', () => {
    expect(CREATOR_OS_PRODUCT_MAP.length).toBeGreaterThan(0);
    expect(CREATOR_OS_ITEMS.length).toBeGreaterThan(CREATOR_OS_PRODUCT_MAP.length);
    expect(itemsById.home.sectionTitle).toBe('디스커버리 탐색');
    expect(itemsById['ops-selected-scan'].sectionTitle).toBe('오퍼레이션 관제');
  });

  it('hides duplicate legacy vault menus while keeping old view ids compatible', () => {
    const visibleIds = CREATOR_OS_PRODUCT_MAP.flatMap((section) => section.items.map((item) => item.id));

    expect(visibleIds).not.toContain('vault-all');
    expect(visibleIds).not.toContain('vault-channels');
    expect(LEGACY_REFERENCE_ITEMS.map((item) => item.id)).toEqual(['vault-all', 'vault-channels']);
    expect(itemsById['vault-all']).toBeDefined();
    expect(itemsById['vault-channels']).toBeDefined();
  });

  it('keeps scrapbook storage separate from production candidate meaning', () => {
    const studioSection = CREATOR_OS_PRODUCT_MAP.find(section => section.title === '제작 스튜디오');

    expect(studioSection.description).toContain('후보로 표시한 소재');
    expect(studioSection.description).not.toContain('저장한 소재를 제작 후보로 전환');
    expect(itemsById['studio-candidates'].summary).toContain('제작 후보');
    expect(itemsById['studio-candidates'].summary).toContain('표시한 영상');
    expect(itemsById['studio-candidates'].summary).toContain('발견함 링크');
    expect(itemsById['studio-candidates'].summary).not.toContain('스크랩 영상');
    expect(itemsById['studio-scrapbook'].summary).toContain('보관한 영상');
    expect(itemsById['studio-scrapbook'].summary).toContain('제작 후보를 구분');
    expect(itemsById['studio-scrapbook'].summary).not.toContain('영상을 제작 후보로 봅니다');
  });

  it('keeps scan and stored-vault menu copy distinct', () => {
    expect(itemsById['ops-selected-scan'].summary).toContain('YouTube API');
    expect(itemsById['vault-videos'].label).toBe('수집 영상 목록');
    expect(itemsById['vault-videos'].summary).toContain('수집된 영상 정보');
    expect(itemsById['vault-videos'].summary).not.toContain('YouTube API');
  });

  it('exposes tteotteotto exploration as a live stored-video workflow', () => {
    expect(itemsById['discovery-ttotto']).toMatchObject({
      status: 'live',
    });
    expect(itemsById['discovery-ttotto'].summary).toContain('수집 영상');
    expect(itemsById['discovery-ttotto'].summary).toContain('6개월');
  });

  it('exposes today channel watchlist as a live selection workflow', () => {
    expect(itemsById['discovery-watchlist']).toMatchObject({ status: 'live' });
    expect(itemsById['discovery-watchlist'].summary).toContain('등급');
    expect(itemsById['discovery-watchlist'].summary).toContain('오늘 확인할 범위');
  });

  it('exposes keyword, tag vault, and upload calendar as live online-storage workflows', () => {
    expect(itemsById['discovery-keywords']).toMatchObject({ status: 'live' });
    expect(itemsById['discovery-keywords'].summary).toContain('온라인 저장소(Azure DB)');
    expect(itemsById['vault-tags']).toMatchObject({ status: 'live' });
    expect(itemsById['vault-tags'].summary).toContain('채널 태그');
    expect(itemsById['studio-calendar']).toMatchObject({ status: 'live' });
    expect(itemsById['studio-calendar'].summary).toContain('목표 업로드 날짜');
    expect(itemsById['studio-script']).toMatchObject({ status: 'live' });
    expect(itemsById['studio-script'].summary).toContain('Cloud');
  });

  it('exposes settings as a live operations workspace', () => {
    expect(itemsById['ops-settings']).toMatchObject({
      label: '설정',
      status: 'live',
    });
    expect(itemsById['ops-settings'].summary).toContain('채널 분야');
    expect(itemsById['ops-settings'].summary).toContain('데이터 연결');
  });

  it('exposes the external work tool hub without implying automatic collection', () => {
    expect(itemsById['tools-bookmarks']).toMatchObject({
      label: '업무 도구함',
      status: 'live',
    });
    expect(itemsById['tools-bookmarks'].summary).toContain('외부 도구');
  });

  it('keeps live view groups aligned with channel and scrapbook workflows', () => {
    expect(READY_CREATOR_VIEWS).toEqual(expect.arrayContaining([
      'vault-videos',
      'studio-candidates',
      'studio-scrapbook',
      'ops-selected-scan',
    ]));
    expect(CHANNEL_CREATOR_VIEWS).toEqual(expect.arrayContaining([
      'vault-channels',
      'ops-selected-scan',
    ]));
    expect(SCRAPBOOK_CREATOR_VIEWS).toEqual(expect.arrayContaining([
      'studio-candidates',
      'studio-scrapbook',
      'studio-script',
      'studio-calendar',
    ]));
  });

  it('falls back to the first creator OS item for unknown views', () => {
    expect(getCreatorOsItem('studio-candidates')).toMatchObject({
      id: 'studio-candidates',
      sectionTitle: '제작 스튜디오',
    });
    expect(getCreatorOsItem('missing-view')).toBe(CREATOR_OS_ITEMS[0]);
  });
});
