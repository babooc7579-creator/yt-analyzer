import { describe, expect, it } from 'vitest';

import {
  CHANNEL_BULK_INPUT_PLACEHOLDER,
  CHANNEL_INPUT_PLACEHOLDER,
  getChannelBulkInputCopy,
  getChannelBulkResultPanelViewProps,
  getChannelBulkSubmitButtonCopy,
  getChannelBulkTagSelectorLabel,
  getChannelAddFormHeaderCopy,
  getChannelLanguageSelectCopy,
  getChannelPreviewActionsCopy,
  getChannelPreviewInputCopy,
  getChannelPreviewNoteFieldCopy,
  getChannelPreviewSaveNoticeText,
  getChannelPreviewSummaryViewProps,
  getChannelPreviewTagSelectorLabel,
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

  it('builds channel add header mode and category copy', () => {
    const copy = getChannelAddFormHeaderCopy();

    expect(copy.label).toBe('새 채널 모니터링 추가');
    expect(copy.modeButtons.map(button => button.mode)).toEqual(['single', 'bulk']);
    expect(copy.modeButtons[0]).toMatchObject({
      ariaLabel: '단일 채널 추가 모드',
      label: '단일',
      title: '채널을 하나씩 확인하고 추가',
    });
    expect(copy.modeButtons[1].title).toContain('여러 채널');
    expect(copy.categoryButtonProps).toMatchObject({
      ariaLabel: '카테고리 설정 열기',
      label: '카테고리 설정',
    });
    expect(copy.categoryButtonProps.title).toContain('Cloud 태그');
  });

  it('builds bulk result panel copy with safe result fallback', () => {
    const props = getChannelBulkResultPanelViewProps({
      added: 2,
      results: [
        { handle: '@ok', success: true },
        { error: 'Not found', handle: '@missing', success: false },
      ],
      total: 3,
    });

    expect(props.summaryText).toBe('총 3개 중 2개 성공');
    expect(props.failedResults).toEqual([
      { error: 'Not found', handle: '@missing', success: false },
    ]);
    expect(props.failedResultMessages).toEqual([
      '실패: @missing - Not found',
    ]);
    expect(props.closeButtonProps).toMatchObject({
      label: '닫기',
      title: '일괄 저장 결과 닫기',
    });

    expect(getChannelBulkResultPanelViewProps(null).summaryText).toBe('총 0개 중 0개 성공');
  });

  it('builds channel tag selector and language selector copy', () => {
    expect(getChannelBulkTagSelectorLabel()).toBe('태그 선택 (전체 일괄 적용, 여러 개 가능)');
    expect(getChannelPreviewTagSelectorLabel()).toBe('태그 선택 (여러 개 가능, 안 골라도 OK)');
    expect(getChannelLanguageSelectCopy()).toEqual({
      ariaLabel: '채널 기본 언어 선택',
      title: '채널 기본 언어 선택',
    });
  });

  it('builds channel preview note and summary copy', () => {
    expect(getChannelPreviewNoteFieldCopy()).toEqual({
      ariaLabel: '새 채널 첫 기록 메모',
      placeholder: '첫 기록 메모 (선택) - 예) 시니어롱폼 소재용, 톤 비슷함',
    });

    expect(getChannelPreviewSummaryViewProps()).toEqual({
      closeButtonProps: {
        ariaLabel: '채널 확인 결과 닫기',
        title: '채널 확인 결과 닫기',
      },
      statusLabel: '채널 확인 완료',
    });
  });
});
