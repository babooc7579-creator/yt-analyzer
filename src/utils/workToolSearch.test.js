import { describe, expect, it } from 'vitest';

import { countWorkTools, filterWorkToolGroups } from './workToolSearch';

const groups = [
  {
    id: 'keyword-research',
    title: '키워드와 관심도 조사',
    description: '외부 검색 관심도를 확인합니다.',
    tools: [
      {
        id: 'google-trends',
        label: 'Google Trends',
        description: '검색 관심도 비교',
        href: 'https://trends.google.com/',
        badge: '키워드 자동 전달',
      },
      {
        id: 'naver-datalab',
        label: '네이버 DataLab',
        description: '네이버 검색어 트렌드',
        href: 'https://datalab.naver.com/',
        badge: '키워드 붙여넣기',
      },
    ],
  },
  {
    id: 'personal',
    title: '나의 업무 도구',
    description: '직접 추가한 도구',
    tools: [
      {
        id: 'custom-1',
        label: '매일 보는 분석표',
        description: '성과 검토',
        href: 'https://example.com/',
        badge: '개인 도구',
      },
    ],
  },
];

describe('workToolSearch', () => {
  it('counts tools across safe group values', () => {
    expect(countWorkTools(groups)).toBe(3);
    expect(countWorkTools([{ tools: null }, null])).toBe(0);
  });

  it('filters by tool, group, description, and URL without changing source groups', () => {
    expect(filterWorkToolGroups(groups, 'NAVER')[0].tools.map((tool) => tool.id)).toEqual(['naver-datalab']);
    expect(filterWorkToolGroups(groups, '개인 도구')[0].tools.map((tool) => tool.id)).toEqual(['custom-1']);
    expect(filterWorkToolGroups(groups, '관심도')[0].tools).toHaveLength(2);
    expect(filterWorkToolGroups(groups, 'example.com')[0].tools.map((tool) => tool.id)).toEqual(['custom-1']);
    expect(groups[0].tools).toHaveLength(2);
  });

  it('returns all groups for an empty query and no groups for no matches', () => {
    expect(filterWorkToolGroups(groups, '  ')).toBe(groups);
    expect(filterWorkToolGroups(groups, '없는 도구')).toEqual([]);
  });
});
