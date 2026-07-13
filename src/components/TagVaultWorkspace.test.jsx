import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import TagVaultWorkspace from './TagVaultWorkspace';

describe('TagVaultWorkspace', () => {
  it('shows the tag-first stored-video workflow', () => {
    const html = renderToStaticMarkup(
      <TagVaultWorkspace
        channels={[{ id: 'c1', tags: ['공예'] }]}
        checkedVideos={[]}
        onLoadStoredVideos={vi.fn()}
        onOpenChannels={vi.fn()}
        onSelectTagChannels={vi.fn()}
        selectedChannelIds={[]}
        videos={[]}
      />,
    );

    expect(html).toContain('태그별 금고');
    expect(html).toContain('태그 채널 선택');
    expect(html).toContain('YouTube API를 호출하지 않습니다');
  });
});
