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

    expect(html).toContain('태그로 수집 영상 좁히기');
    expect(html).toContain('수집 영상·링크');
    expect(html).toContain('별도 보관 장소가 아니며');
    expect(html).toContain('이 태그 채널로 조회 준비');
    expect(html).toContain('태그 채널로 조회 준비 → 상단의 수집 영상 목록 불러오기(Azure DB)');
    expect(html).toContain('상단의 수집 영상 목록 불러오기');
    expect(html).toContain('수집 영상 목록에서 현재 화면 필터를 확인해 검토');
    expect(html).toContain('수집 영상 목록 화면으로 이동');
    expect(html).toContain('현재 목록 필터 유지 가능');
    expect(html).toContain('YouTube API를 호출하지 않습니다');
    expect(html).toContain('채널 목록 화면으로 이동, 온라인 저장소(Azure DB) 조회 및 YouTube API 호출 없음');
  });

  it('shows one Azure DB load action after tag channels are selected', () => {
    const html = renderToStaticMarkup(
      <TagVaultWorkspace
        channels={[{ id: 'c1', tags: ['공예'] }]}
        checkedVideos={[]}
        onLoadStoredVideos={vi.fn()}
        onOpenChannels={vi.fn()}
        onSelectTagChannels={vi.fn()}
        selectedChannelIds={['c1']}
        videos={[]}
      />,
    );

    expect(html.match(/선택 채널 1개 수집 영상 목록 불러오기/g)).toHaveLength(1);
    expect(html).toContain('상단의 ‘수집 영상 목록 불러오기’ 버튼');
  });

  it('disables the single stored-video lookup while Azure DB data is loading', () => {
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

    expect(html).toContain('수집 영상 불러오는 중...');
    expect(html).toContain('disabled');
    expect(html).toContain('온라인 저장소(Azure DB)에서 수집 영상 불러오는 중, YouTube API 호출 없음');
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

    expect(html).toContain('조회는 정상 완료됐지만 수집된 영상 정보가 없습니다');
    expect(html).toContain('다른 채널 고르기');
    expect(html).toContain('새 영상 수집 화면 열기');
    expect(html).toContain('이동만으로 YouTube API를 호출하지 않습니다');
  });

  it('keeps a failed Cloud lookup retryable without showing partial tag results', () => {
    const html = renderToStaticMarkup(
      <TagVaultWorkspace
        channels={[{ id: 'c1', tags: ['공예'] }]}
        checkedVideos={[]}
        loadResult={{ success: false, videoCount: 0 }}
        onLoadStoredVideos={vi.fn()}
        onOpenChannels={vi.fn()}
        onSelectTagChannels={vi.fn()}
        selectedChannelIds={['c1']}
        videos={[]}
      />,
    );

    expect(html).toContain('온라인 저장소(Azure DB)의 수집 영상 정보를 불러오지 못했습니다');
    expect(html).toContain('온라인 저장소(Azure DB)의 수집 영상 정보 다시 불러오기');
    expect(html).not.toContain('공예 수집 영상');
  });
});
