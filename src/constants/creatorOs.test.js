import { describe, expect, it } from 'vitest';

import {
  CHANNEL_CREATOR_VIEWS,
  CREATOR_OS_ITEMS,
  CREATOR_OS_PRODUCT_MAP,
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
    expect(itemsById['vault-videos'].summary).toContain('저장된 영상 데이터');
    expect(itemsById['vault-videos'].summary).not.toContain('YouTube API');
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
