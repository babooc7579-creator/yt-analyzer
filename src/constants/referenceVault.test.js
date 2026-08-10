import { describe, expect, it } from 'vitest';

import {
  REFERENCE_VAULT_GUIDE_CARDS,
  REFERENCE_VAULT_HEADER,
  REFERENCE_VAULT_SUMMARY_CARDS,
  REFERENCE_VAULT_SUMMARY_TONES,
} from './referenceVault';

describe('referenceVault constants', () => {
  it('distinguishes the page name from the video review task', () => {
    expect(REFERENCE_VAULT_HEADER).toMatchObject({
      eyebrow: '현재 작업',
      title: '영상 검토 보드',
    });
    expect(REFERENCE_VAULT_HEADER.description).toContain('온라인 저장소(Azure DB)');
    expect(REFERENCE_VAULT_HEADER.description).toContain('제작 후보로 표시할 항목');
    expect(REFERENCE_VAULT_HEADER.description).not.toContain('제작에 활용할 후보');
  });

  it('keeps only task-specific summary cards in the review board', () => {
    expect(REFERENCE_VAULT_SUMMARY_CARDS.map((card) => card.key)).toEqual([
      'videoCount',
      'visibleScrapCount',
      'ttoTtoCount',
    ]);
    expect(REFERENCE_VAULT_SUMMARY_TONES).toHaveProperty('rose');
  });

  it('keeps guide cards explicit about DB lookup and production flow', () => {
    const cardsByKey = Object.fromEntries(
      REFERENCE_VAULT_GUIDE_CARDS.map((card) => [card.key, card])
    );

    expect(cardsByKey['load-saved-videos'].description).toContain('DB에 수집된 영상 정보만');
    expect(cardsByKey['load-saved-videos'].description).toContain('새 YouTube API 호출은 없습니다');
    expect(cardsByKey['save-reference'].description).toContain('소재 보관함');
    expect(cardsByKey['promote-production'].title).toBe('3. 제작 후보로 표시');
    expect(cardsByKey['promote-production'].description).toContain('온라인 저장소(Azure DB)의 판단 기록');
    expect(cardsByKey['promote-production'].description).toContain('제작 칸반');
    expect(cardsByKey['promote-production'].description).toContain('새 YouTube API 호출은 없습니다');
    expect(cardsByKey['promote-production'].description).not.toContain('제작 후보로 보내');
  });
});
