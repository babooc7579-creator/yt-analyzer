import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ChannelListItemActions from './ChannelListItemActions';
import ChannelTagSelector from './ChannelTagSelector';

const noop = () => {};

describe('Channel safety controls', () => {
  it('renders channel actions as notes, local URL copy, and safe Cloud deletion', () => {
    const html = renderToStaticMarkup(
      <ChannelListItemActions
        channel={{
          category: '해외',
          channelId: 'UC123',
          id: 'channel-1',
          notes: [{ id: 'note-1' }],
          title: '좋은 채널',
        }}
        onDelete={noop}
        onOpenNotes={noop}
      />,
    );

    expect(html).toContain('좋은 채널 분석/기록 남기기');
    expect(html).toContain('YouTube 채널 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다.');
    expect(html).toContain('Cloud 채널 목록에서 삭제합니다. 조회/수집 대상에서 빠지지만 YouTube 원본이나 이미 저장된 영상 데이터는 삭제하지 않습니다.');
  });

  it('renders tag selection as a local selection with no Cloud save or YouTube API call', () => {
    const html = renderToStaticMarkup(
      <ChannelTagSelector
        categories={['해외', '예능']}
        label="카테고리"
        selectedTags={['해외']}
        toggleTag={noop}
      />,
    );

    expect(html).toContain('카테고리');
    expect(html).toContain('해외 태그 선택 해제 - 이 태그 선택만으로 YouTube API 호출이나 Cloud 저장은 실행되지 않습니다.');
    expect(html).toContain('예능 태그 선택 - 이 태그 선택만으로 YouTube API 호출이나 Cloud 저장은 실행되지 않습니다.');
  });
});
