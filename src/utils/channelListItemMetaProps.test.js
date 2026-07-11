import { describe, expect, it } from 'vitest';

import {
  CHANNEL_GRADE,
  CHANNEL_STATUS,
} from '../constants/status';
import { getChannelListItemMetaViewProps } from './channelListItemMetaProps';

describe('channelListItemMetaProps utils', () => {
  it('builds grade, status, and language labels', () => {
    const props = getChannelListItemMetaViewProps({
      channel: {
        language: 'EN',
      },
      grade: CHANNEL_GRADE.S,
      status: CHANNEL_STATUS.ACTIVE,
    });

    expect(props.gradeBadgeProps).toMatchObject({
      label: '등급 S',
    });
    expect(props.gradeBadgeProps.title).toContain('채널 중요도 등급 S');
    expect(props.gradeBadgeProps.title).toContain('YouTube API를 호출하지 않습니다');
    expect(props.gradeBadgeProps.className).toContain('rose');
    expect(props.statusBadgeProps).toMatchObject({
      label: '활성',
    });
    expect(props.statusBadgeProps.title).toContain('새 영상 수집 대상 여부');
    expect(props.statusBadgeProps.title).toContain('YouTube API를 호출하지 않습니다');
    expect(props.statusBadgeProps.className).toContain('emerald');
    expect(props.languageLabel).toBe('EN');
  });

  it('formats subscriber, video, and average view stats for display', () => {
    const props = getChannelListItemMetaViewProps({
      channel: {
        language: 'KR',
        stats: {
          subscriberCount: 123456,
          totalVideoCount: 3000,
          avgViewCount: 987654321,
        },
      },
      grade: CHANNEL_GRADE.A,
      status: CHANNEL_STATUS.PAUSED,
    });

    expect(props.stats).toEqual([
      {
        label: '구독자 수',
        text: '구독자 12.3만',
      },
      {
        label: '전체 영상 수',
        text: '영상 3,000',
      },
      {
        label: '평균 조회수',
        text: '평균 9.9억',
      },
    ]);
    expect(props.statusBadgeProps.label).toBe('보류');
    expect(props.statusBadgeProps.className).toContain('amber');
  });

  it('returns empty stats and language label when optional metadata is missing', () => {
    const props = getChannelListItemMetaViewProps({
      channel: {
        language: 'UNKNOWN',
      },
      grade: CHANNEL_GRADE.UNCLASSIFIED,
      status: CHANNEL_STATUS.DISCARDED,
    });

    expect(props.languageLabel).toBe('');
    expect(props.stats).toEqual([]);
    expect(props.gradeBadgeProps.label).toBe('등급 미분류');
    expect(props.statusBadgeProps.label).toBe('제외');
  });
});
