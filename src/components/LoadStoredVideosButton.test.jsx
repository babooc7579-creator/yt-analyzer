import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import LoadStoredVideosButton from './LoadStoredVideosButton';

describe('LoadStoredVideosButton', () => {
  it('renders enabled 온라인 저장소(Azure DB) lookup copy without YouTube API wording confusion', () => {
    const html = renderToStaticMarkup(
      <LoadStoredVideosButton
        loading={false}
        selectedChannelCount={3}
        onLoad={() => 'load stored videos'}
      />,
    );

    expect(html).toContain('선택 채널 수집 영상 목록 불러오기 (3개)');
    expect(html).toContain('title="온라인 저장소(Azure DB) 조회: 선택 채널 3개의 수집 영상 정보를 불러옵니다. YouTube API를 새로 호출하지 않습니다."');
    expect(html).toContain('aria-label="선택 채널 3개 수집 영상 목록 불러오기, DB 조회이며 YouTube API 호출 없음"');
    expect(html).toContain('이미 온라인 저장소(Azure DB)에 보관된 수집 영상 정보만 조회합니다');
    expect(html).not.toContain('disabled=""');
  });

  it('renders disabled channel-selection guidance', () => {
    const html = renderToStaticMarkup(
      <LoadStoredVideosButton
        loading={false}
        selectedChannelCount={0}
      />,
    );

    expect(html).toContain('disabled=""');
    expect(html).toContain('채널 선택 후 수집 영상 목록 불러오기');
    expect(html).toContain('채널 선택 필요');
    expect(html).toContain('새 영상 수집은 실행하지 않습니다');
  });

  it('keeps loading state explicit about 온라인 저장소(Azure DB) lookup', () => {
    const html = renderToStaticMarkup(
      <LoadStoredVideosButton
        loading
        selectedChannelCount={2}
      />,
    );

    expect(html).toContain('disabled=""');
    expect(html).toContain('온라인 저장소(Azure DB)에서 수집 영상 불러오는 중');
    expect(html).toContain('aria-label="온라인 저장소(Azure DB)에서 수집 영상 불러오는 중, YouTube API 호출 없음"');
  });
});
