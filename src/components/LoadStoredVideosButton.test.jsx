import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import LoadStoredVideosButton from './LoadStoredVideosButton';

describe('LoadStoredVideosButton', () => {
  it('renders enabled Cloud DB lookup copy without YouTube API wording confusion', () => {
    const html = renderToStaticMarkup(
      <LoadStoredVideosButton
        loading={false}
        selectedChannelCount={3}
        onLoad={() => 'load stored videos'}
      />,
    );

    expect(html).toContain('선택 채널 저장 영상 불러오기 (3개)');
    expect(html).toContain('title="DB 조회: 선택 채널 3개의 저장된 영상을 불러옵니다. YouTube API를 새로 호출하지 않습니다."');
    expect(html).toContain('aria-label="선택 채널 3개 저장 영상 불러오기, DB 조회이며 YouTube API 호출 없음"');
    expect(html).toContain('이미 Cloud DB에 저장된 영상만 조회합니다');
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
    expect(html).toContain('채널 선택 후 저장 영상 불러오기');
    expect(html).toContain('채널 선택 필요');
    expect(html).toContain('새 영상 수집은 실행하지 않습니다');
  });

  it('keeps loading state explicit about Cloud DB lookup', () => {
    const html = renderToStaticMarkup(
      <LoadStoredVideosButton
        loading
        selectedChannelCount={2}
      />,
    );

    expect(html).toContain('disabled=""');
    expect(html).toContain('Cloud DB에서 저장 영상 불러오는 중');
    expect(html).toContain('aria-label="Cloud DB에서 저장 영상 불러오는 중, YouTube API 호출 없음"');
  });
});
