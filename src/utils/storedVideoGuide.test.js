import { describe, expect, it } from 'vitest';

import { getStoredVideoGuideCards } from './storedVideoGuide';

describe('storedVideoGuide utils', () => {
  it('separates YouTube API collection from stored Cloud DB lookup', () => {
    const cards = getStoredVideoGuideCards();
    const cardsByKey = Object.fromEntries(cards.map((card) => [card.key, card]));

    expect(cardsByKey.scan.title).toBe('선택 채널 새 영상 수집');
    expect(cardsByKey.scan.description).toContain('새 데이터가 필요할 때만');
    expect(cardsByKey.scan.description).toContain('YouTube API를 호출할 수 있고');
    expect(cardsByKey.scan.description).toContain('저장 영상 불러오기와 다른 작업');

    expect(cardsByKey.load.title).toBe('저장된 영상 불러오기');
    expect(cardsByKey.load.description).toContain('Cloud DB에 이미 저장된 영상만 조회');
    expect(cardsByKey.load.description).toContain('YouTube API를 새로 호출하지 않습니다');
  });
});
