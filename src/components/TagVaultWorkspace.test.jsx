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
    expect(html).toContain('상단의 저장 영상 불러오기');
    expect(html).toContain('YouTube API를 호출하지 않습니다');
  });

  it('disables duplicate stored-video lookup while Cloud data is loading', () => {
    const html = renderToStaticMarkup(
      <TagVaultWorkspace
        channels={[{ id: 'c1', tags: ['공예'] }]}
        checkedVideos={[]}
        loading
        onLoadStoredVideos={vi.fn()}
        onOpenChannels={vi.fn()}
        onSelectTagChannels={vi.fn()}
        selectedChannelIds={['c1']}
        videos={[]}
      />,
    );

    expect(html).toContain('저장 영상 불러오는 중...');
    expect(html).toContain('disabled');
  });

  it('offers safe next actions when a successful Cloud lookup returns zero videos', () => {
    const html = renderToStaticMarkup(
      <TagVaultWorkspace
        channels={[{ id: 'c1', tags: ['공예'] }]}
        checkedVideos={[]}
        loadResult={{ success: true, videoCount: 0 }}
        onLoadStoredVideos={vi.fn()}
        onOpenChannelWatchlist={vi.fn()}
        onOpenChannels={vi.fn()}
        onOpenSelectedScan={vi.fn()}
        onSelectTagChannels={vi.fn()}
        selectedChannelIds={['c1']}
        videos={[]}
      />,
    );

    expect(html).toContain('조회는 정상 완료됐지만 저장된 영상이 없습니다');
    expect(html).toContain('다른 채널 고르기');
    expect(html).toContain('새 영상 수집 준비');
    expect(html).toContain('이동만으로 YouTube API를 호출하지 않습니다');
  });
});
