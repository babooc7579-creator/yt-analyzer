import { describe, expect, it, vi } from 'vitest';

import { getLoadStoredVideosActionProps } from './loadStoredVideosActionProps';

describe('loadStoredVideosActionProps utils', () => {
  it('builds enabled DB lookup copy without YouTube API collection wording', () => {
    const onLoad = vi.fn();
    const props = getLoadStoredVideosActionProps({
      onLoad,
      selectedChannelCount: 3,
    });

    expect(props.hasSelectedChannels).toBe(true);
    expect(props.buttonDisabled).toBe(false);
    expect(props.actionDisabled).toBe(false);
    expect(props.buttonLabel).toBe('선택 채널 수집 영상 목록 불러오기 (3개)');
    expect(props.actionLabel).toBe('불러오기');
    expect(props.emptyStateLabel).toBe('수집 영상 목록 불러오기');
    expect(props.title).toContain('온라인 저장소(Azure DB) 조회');
    expect(props.title).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(props.actionAriaLabel).toContain('YouTube API 호출 없음');
    expect(props.helperDescription).toContain('온라인 저장소(Azure DB)');
    expect(props.onAction).toBe(onLoad);
    expect(onLoad).not.toHaveBeenCalled();
  });

  it('builds disabled channel-selection guidance', () => {
    const props = getLoadStoredVideosActionProps({
      selectedChannelCount: 0,
    });

    expect(props.hasSelectedChannels).toBe(false);
    expect(props.buttonDisabled).toBe(true);
    expect(props.actionDisabled).toBe(true);
    expect(props.buttonLabel).toBe('채널 선택 후 수집 영상 목록 불러오기');
    expect(props.actionLabel).toBe('채널 선택 필요');
    expect(props.emptyStateLabel).toBe('채널 선택 필요');
    expect(props.title).toContain('채널 목록');
    expect(props.title).toContain('온라인 저장소(Azure DB) 조회용');
    expect(props.helperDescription).toContain('새 영상 수집은 실행하지 않습니다');
  });

  it('keeps loading state explicit about 온라인 저장소(Azure DB) lookup', () => {
    const props = getLoadStoredVideosActionProps({
      loading: true,
      selectedChannelCount: 2,
    });

    expect(props.buttonDisabled).toBe(true);
    expect(props.buttonLabel).toBe('온라인 저장소(Azure DB)에서 수집 영상 불러오는 중');
    expect(props.buttonAriaLabel).toContain('온라인 저장소(Azure DB)');
    expect(props.buttonAriaLabel).toContain('YouTube API 호출 없음');
  });

  it('uses safe count fallbacks', () => {
    const props = getLoadStoredVideosActionProps({
      selectedChannelCount: 'bad',
    });

    expect(props.hasSelectedChannels).toBe(false);
    expect(props.buttonLabel).toBe('채널 선택 후 수집 영상 목록 불러오기');
  });
});
