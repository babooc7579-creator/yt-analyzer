import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import SettingsWorkspace from './SettingsWorkspace';

describe('SettingsWorkspace', () => {
  it('explains category, Cloud, and API boundaries in one settings screen', () => {
    const html = renderToStaticMarkup(
      <SettingsWorkspace
        categorySettingsProps={{
          categories: ['랭킹형', '영화'],
          cloudOnlyTags: ['예능'],
          newCategoryName: '',
          setCategories: vi.fn(),
          setNewCategoryName: vi.fn(),
        }}
        functionApiBase="/api"
        savedChannelCount={10}
      />,
    );

    expect(html).toContain('data-testid="creator-route-settings"');
    expect(html).toContain('분야 목록 추가·숨김·이름 변경');
    expect(html).toContain('Cloud 채널 10개');
    expect(html).toContain('레이더의 분야 필터는 실제 Cloud 채널에 붙은 태그를 자동 집계합니다');
    expect(html).toContain('화면 분야 목록은 브라우저 설정입니다');
    expect(html).toContain('저장 영상 불러오기');
    expect(html).toContain('YouTube API 호출 없음');
    expect(html).toContain('/api');
  });
});
