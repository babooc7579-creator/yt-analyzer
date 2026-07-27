import { describe, expect, it } from 'vitest';

import { SYNC_WARNING_BANNER_COPY } from '../constants/syncWarnings';
import { getSyncWarningBannerViewProps } from './syncWarningBannerProps';

describe('syncWarningBannerProps utils', () => {
  it('hides the banner when there are no warning messages', () => {
    expect(getSyncWarningBannerViewProps()).toMatchObject({
      isVisible: false,
      messages: [],
    });
  });

  it('uses a single legacy message when no message list is provided', () => {
    expect(getSyncWarningBannerViewProps({
      message: 'Cloud 연결 실패로 임시 기록을 표시 중입니다.',
    })).toMatchObject({
      isVisible: true,
      messages: ['Cloud 연결 실패로 임시 기록을 표시 중입니다.'],
    });
  });

  it('prefers the explicit message list over the legacy single message', () => {
    expect(getSyncWarningBannerViewProps({
      message: 'old single warning',
      messages: ['video warning', 'scrapbook warning'],
    }).messages).toEqual(['video warning', 'scrapbook warning']);
  });

  it('keeps the online-storage-first help copy attached to every visible banner', () => {
    const props = getSyncWarningBannerViewProps({ messages: ['fallback warning'] });

    expect(props.title).toBe(SYNC_WARNING_BANNER_COPY.title);
    expect(props.helpText).toContain('해당 응답만 기준');
    expect(props.helpText).toContain('자동 병합하거나 자동 업로드하지 않습니다');
  });
});
