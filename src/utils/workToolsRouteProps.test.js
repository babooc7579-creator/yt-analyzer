import { describe, expect, it, vi } from 'vitest';

import { buildWorkToolsRouteProps } from './workToolsRouteProps';

describe('workToolsRouteProps', () => {
  it('applies hidden defaults, Cloud custom tools, and saved order', () => {
    const onReload = vi.fn();
    const props = buildWorkToolsRouteProps({
      loadWorkToolPreferences: onReload,
      workToolPreferences: {
        customTools: [{
          id: 'custom-1',
          label: '내 업무 도구',
          description: '직접 추가',
          href: 'https://example.com/',
          groupId: 'personal',
          badge: '개인 도구',
        }],
        hiddenDefaultToolIds: ['naver-search-ad'],
        toolOrder: ['custom-1', 'google-trends'],
      },
      workToolPreferencesError: '',
      workToolPreferencesLoading: false,
    });

    const tools = props.toolGroups.flatMap((group) => group.tools);
    expect(tools[0].id).toBe('custom-1');
    expect(tools.some((tool) => tool.id === 'naver-search-ad')).toBe(false);
    expect(props.onReload).toBe(onReload);
  });
});
