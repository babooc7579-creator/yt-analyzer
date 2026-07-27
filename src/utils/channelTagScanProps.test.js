import { describe, expect, it } from 'vitest';

import {
  getChannelTagScanNoticeProps,
  getChannelTagTabRowProps,
} from './channelTagScanProps';

describe('channelTagScanProps utils', () => {
  it('builds tag scan button copy as a YouTube API action for active channels only', () => {
    const props = getChannelTagTabRowProps({
      category: '해외',
      count: 10,
      scannableCount: 7,
    });

    expect(props.canScanTag).toBe(true);
    expect(props.listButtonTitle).toBe("'해외' 태그 채널 목록 보기 - 운영중 7개 / 전체 10개");
    expect(props.scanButtonTitle).toContain('운영중 채널 7개만 새 영상 수집');
    expect(props.scanButtonTitle).toContain('YouTube API 호출이 발생');
    expect(props.scanButtonTitle).toContain('수집 영상 목록 불러오기와 다른 작업');
    expect(props.scanButtonAriaLabel).toBe("'해외' 태그 새 영상 수집, YouTube API 호출");
  });

  it('blocks tag scan copy when there are no active channels', () => {
    const props = getChannelTagTabRowProps({
      category: '보류',
      count: 3,
      scannableCount: 0,
    });

    expect(props.canScanTag).toBe(false);
    expect(props.scanButtonTitle).toContain('운영중 채널이 없습니다');
    expect(props.scanButtonTitle).toContain('보류/제외 채널은 수집하지 않습니다');
    expect(props.scanButtonAriaLabel).toBe("'보류' 태그 새 영상 수집 불가, 운영중 채널 없음");
  });

  it('uses safe count fallbacks for invalid tag counts', () => {
    const props = getChannelTagTabRowProps({
      category: '기타',
      count: Number.NaN,
      scannableCount: -2,
    });

    expect(props.canScanTag).toBe(false);
    expect(props.listButtonTitle).toBe("'기타' 태그 채널 목록 보기 - 운영중 0개 / 전체 0개");
    expect(props.scanButtonTitle).toContain('운영중 채널이 없습니다');
  });

  it('builds the tag scan notice as an API-cost boundary', () => {
    const props = getChannelTagScanNoticeProps();

    expect(props.title).toBe('태그별 새 영상 수집');
    expect(props.description).toContain('운영중/전체 채널');
    expect(props.description).toContain('운영중 채널만 YouTube API로 확인');
  });
});
