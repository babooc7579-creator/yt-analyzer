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
  });

  it('shows tteotteotto badge for either candidate signal and strong badge only for strong reaction', () => {
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
    }).filter(item => item.isVisible).map(item => item.icon)).toEqual(['tteotteotto', 'strong']);
  });
});
