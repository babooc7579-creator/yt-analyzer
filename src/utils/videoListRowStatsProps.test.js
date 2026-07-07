import { describe, expect, it } from 'vitest';

import { getVideoListRowStatsViewProps } from './videoListRowStatsProps';

describe('videoListRowStatsProps utils', () => {
  const video = {
    daysOld: 200,
    like_count: 12345,
    like_ratio: 4.5,
    multiplier: 3.2,
    upload_date: '2026-01-01',
    view_count: 987654,
  };

  it('builds highlighted stats for strong reaction videos', () => {
    const props = getVideoListRowStatsViewProps({
      isStrongReaction: true,
      video,
    });

    expect(props.daysOldCellProps.className).toContain('bg-orange-50');
    expect(props.daysOldText).toContain('200');
    expect(props.engagementTextClassName).toContain('text-rose-600');
    expect(props.engagementText).toBe('4.5%');
    expect(props.likeCountText).toContain('12,345');
    expect(props.multiplierCellProps.className).toContain('bg-rose-600');
    expect(props.multiplierCellProps.labelClassName).toContain('text-rose-100');
    expect(props.multiplierText).toBe('3.2x');
    expect(props.showTrendingIcon).toBe(true);
    expect(props.uploadDateText).toBe('(2026-01-01)');
    expect(props.viewCountText).toBe('987,654');
  });

  it('uses tteotteotto multiplier styling when reaction is not strong', () => {
    const props = getVideoListRowStatsViewProps({
      isStrongReaction: false,
      video: {
        ...video,
        multiplier: 1.5,
      },
    });

    expect(props.multiplierCellProps.className).toContain('bg-indigo-50');
    expect(props.multiplierCellProps.labelClassName).toContain('text-slate-400');
    expect(props.showTrendingIcon).toBe(false);
  });

  it('uses neutral styles for lower age, multiplier, and engagement values', () => {
    const props = getVideoListRowStatsViewProps({
      isStrongReaction: false,
      video: {
        ...video,
        daysOld: 20,
        like_ratio: 1.2,
        multiplier: 1.1,
      },
    });

    expect(props.daysOldCellProps.className).toContain('bg-white/80');
    expect(props.engagementTextClassName).toContain('text-slate-700');
    expect(props.multiplierCellProps.className).toContain('bg-white/80');
  });
});
