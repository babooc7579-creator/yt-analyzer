import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  CHANNEL_GRADE,
  CHANNEL_STATUS,
} from '../constants/status';
import ChannelListItemMeta from './ChannelListItemMeta';

describe('ChannelListItemMeta', () => {
  it('renders grade and status badges with non-scanning guidance', () => {
    const html = renderToStaticMarkup(
      <ChannelListItemMeta
        channel={{
          language: 'EN',
          stats: {
            avgViewCount: 345678,
            subscriberCount: 12345,
            totalVideoCount: 98,
          },
        }}
        grade={CHANNEL_GRADE.S}
        status={CHANNEL_STATUS.ACTIVE}
      />,
    );

    expect(html).toContain('등급 S');
    expect(html).toContain('채널 중요도 등급 S입니다.');
    expect(html).toContain('활성');
    expect(html).toContain('새 영상 수집 대상 여부를 구분하는 표시');
    expect(html).toContain('이 배지만으로 YouTube API를 호출하지 않습니다.');
    expect(html).toContain('구독자 1.2만');
    expect(html).toContain('영상 98');
  });
});
