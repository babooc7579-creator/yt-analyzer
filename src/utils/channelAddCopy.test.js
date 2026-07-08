import { describe, expect, it } from 'vitest';

import {
  CHANNEL_BULK_INPUT_PLACEHOLDER,
  CHANNEL_INPUT_PLACEHOLDER,
  getChannelBulkInputCopy,
  getChannelBulkSubmitButtonCopy,
  getChannelPreviewActionsCopy,
  getChannelPreviewInputCopy,
  getChannelPreviewSaveNoticeText,
} from './channelAddCopy';

describe('channelAddCopy utils', () => {
  it('builds single-channel preview copy as YouTube lookup only', () => {
    const copy = getChannelPreviewInputCopy();

    expect(copy.inputPlaceholder).toBe(CHANNEL_INPUT_PLACEHOLDER);
    expect(copy.previewButtonTitle).toContain('YouTube에서 채널 정보만 확인');
    expect(copy.previewButtonTitle).toContain('Cloud 저장과 영상 수집은 하지 않습니다');
    expect(copy.helperText).toContain('아직 Cloud에 저장하지 않고');
    expect(copy.helperText).toContain('영상 수집은 하지 않습니다');
  });

  it('builds bulk input and submit copy as Cloud channel storage without video collection', () => {
    const inputCopy = getChannelBulkInputCopy(3);
    const idleButtonCopy = getChannelBulkSubmitButtonCopy({ bulkLoading: false });
    const loadingButtonCopy = getChannelBulkSubmitButtonCopy({ bulkLoading: true });

    expect(inputCopy.placeholder).toBe(CHANNEL_BULK_INPUT_PLACEHOLDER);
    expect(inputCopy.helperText).toBe(
      '3개 줄 인식됨. YouTube에서 채널 정보만 확인한 뒤 Cloud 목록에 저장합니다. 영상 수집은 하지 않습니다.'
    );
    expect(idleButtonCopy.title).toContain('Cloud 채널 목록에 저장');
    expect(idleButtonCopy.title).toContain('영상 수집은 하지 않습니다');
    expect(idleButtonCopy.label).toBe('YouTube 확인 후 일괄 저장');
    expect(loadingButtonCopy.label).toBe('YouTube 확인 후 Cloud 저장 중');
  });

  it('builds preview save action copy as Cloud storage only', () => {
    const copy = getChannelPreviewActionsCopy();
    const noticeText = getChannelPreviewSaveNoticeText();

    expect(copy.cancelButtonLabel).toBe('취소');
    expect(copy.saveButtonTitle).toContain('Cloud 목록에 저장');
    expect(copy.saveButtonTitle).toContain('새 영상 수집은 하지 않습니다');
    expect(noticeText).toContain('Cloud 목록에 저장');
    expect(noticeText).toContain('선택 채널 새 영상 수집 버튼');
  });
});
