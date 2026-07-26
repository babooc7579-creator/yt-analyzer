import { describe, expect, it } from 'vitest';

import { WORK_TOOL_GROUPS, getWorkToolUrl } from './workTools';

describe('workTools constants', () => {
  it('keeps the first tool collection small and work-focused', () => {
    const tools = WORK_TOOL_GROUPS.flatMap((group) => group.tools);

    expect(tools.map((tool) => tool.id)).toEqual([
      'google-trends',
      'naver-datalab',
      'naver-search-ad',
      'youtube-search',
      'youtube-studio',
    ]);
    expect(tools.every((tool) => tool.href.startsWith('https://'))).toBe(true);
  });

  it('passes the selected keyword only to tools that support direct search URLs', () => {
    const tools = Object.fromEntries(
      WORK_TOOL_GROUPS.flatMap((group) => group.tools).map((tool) => [tool.id, tool])
    );

    expect(getWorkToolUrl(tools['google-trends'], '고양이 행동')).toContain(
      'q=%EA%B3%A0%EC%96%91%EC%9D%B4%20%ED%96%89%EB%8F%99'
    );
    expect(getWorkToolUrl(tools['youtube-search'], '고양이 행동')).toContain(
      'search_query=%EA%B3%A0%EC%96%91%EC%9D%B4%20%ED%96%89%EB%8F%99'
    );
    expect(getWorkToolUrl(tools['naver-datalab'], '고양이 행동')).toBe(
      'https://datalab.naver.com/keyword/trendSearch.naver'
    );
  });
});
