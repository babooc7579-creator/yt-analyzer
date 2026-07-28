import { describe, expect, it } from 'vitest';

import { getVideoListRowBadgeItems } from './videoListRowBadgesProps';

describe('videoListRowBadgesProps utils', () => {
  it('returns badge items in the configured order', () => {
    expect(getVideoListRowBadgeItems({}).map(item => item.icon)).toEqual([
      'saved',
      'candidate',
      'checked',
      'tteotteotto',
      'strong',
    ]);
  });

  it('marks saved, production candidate, and checked badges as visible', () => {
    const badges = getVideoListRowBadgeItems({
      isChecked: true,
      isProductionCandidate: true,
      isSaved: true,
      isStrongReaction: false,
      isTtoTto: false,
    });

    expect(badges.filter(item => item.isVisible).map(item => item.icon)).toEqual([
      'saved',
      'candidate',
      'checked',
    ]);
    expect(badges.find(item => item.icon === 'saved')).toMatchObject({
      label: '스크랩북 보관',
      title: '온라인 스크랩북(Azure DB)에 보관된 영상입니다. 제작 후보 여부와는 별도입니다.',
    });
    expect(badges.find(item => item.icon === 'candidate').title).toContain('제작 후보함');
  });

  it('keeps the tteotteotto and strong-reaction signals separate', () => {
    expect(getVideoListRowBadgeItems({
      isChecked: false,
      isProductionCandidate: false,
      isSaved: false,
      isStrongReaction: false,
      isTtoTto: true,
    }).filter(item => item.isVisible).map(item => item.icon)).toEqual(['tteotteotto']);

    expect(getVideoListRowBadgeItems({
      isChecked: false,
      isProductionCandidate: false,
      isSaved: false,
      isStrongReaction: true,
      isTtoTto: false,
    }).filter(item => item.isVisible).map(item => item.icon)).toEqual(['strong']);
    expect(getVideoListRowBadgeItems({
      isStrongReaction: false,
      isTtoTto: true,
    }).find(item => item.icon === 'tteotteotto').title).toContain('성공 예측이 아닙니다');
  });
});
