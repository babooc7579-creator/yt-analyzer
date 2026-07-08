import { describe, expect, it } from 'vitest';

import { getScrapbookHeaderActionsViewProps } from './scrapbookHeaderActions';

describe('scrapbookHeaderActions utils', () => {
  it('enables URL and prompt copy actions when scrapbook videos exist', () => {
    const onCopyPrompt = () => 'copy prompt';
    const viewProps = getScrapbookHeaderActionsViewProps({
      copiedPrompt: '',
      onCopyPrompt,
      promptCopyError: '',
      savedVideoCount: 2,
      videoUrlList: '1. Video\nhttps://youtube.com/watch?v=video-1',
    });

    expect(viewProps.copyUrlButtonProps).toMatchObject({
      disabled: false,
      url: '1. Video\nhttps://youtube.com/watch?v=video-1',
    });
    expect(viewProps.copyUrlButtonProps.className).toContain('bg-white');
    expect(viewProps.copyUrlButtonProps.ariaLabel).toContain('2');
    expect(viewProps.promptButtonProps).toMatchObject({
      disabled: false,
      onClick: onCopyPrompt,
      type: 'button',
    });
    expect(viewProps.promptButtonProps.className).toContain('from-yellow-500');
    expect(viewProps.promptButtonProps['aria-label']).toContain('2');
    expect(viewProps.promptIconName).toBe('lightbulb');
  });

  it('disables copy actions when the scrapbook has no saved videos or URL list', () => {
    const viewProps = getScrapbookHeaderActionsViewProps({
      copiedPrompt: '',
      onCopyPrompt: () => 'copy prompt',
      promptCopyError: '',
      savedVideoCount: 0,
      videoUrlList: '',
    });

    expect(viewProps.copyUrlButtonProps.disabled).toBe(true);
    expect(viewProps.copyUrlButtonProps.className).toContain('cursor-not-allowed');
    expect(viewProps.promptButtonProps.disabled).toBe(true);
    expect(viewProps.promptButtonProps.className).toContain('cursor-not-allowed');
    expect(viewProps.promptIconName).toBe('lightbulb');
  });

  it('disables URL copy when the URL list is whitespace-only', () => {
    const viewProps = getScrapbookHeaderActionsViewProps({
      copiedPrompt: '',
      onCopyPrompt: () => 'copy prompt',
      promptCopyError: '',
      savedVideoCount: 1,
      videoUrlList: '   ',
    });

    expect(viewProps.copyUrlButtonProps.disabled).toBe(true);
    expect(viewProps.promptButtonProps.disabled).toBe(false);
  });

  it('switches prompt copy feedback between copied and error states', () => {
    const copiedProps = getScrapbookHeaderActionsViewProps({
      copiedPrompt: 'copied',
      onCopyPrompt: () => 'copy prompt',
      promptCopyError: '',
      savedVideoCount: 1,
      videoUrlList: '1. Video\nhttps://youtube.com/watch?v=video-1',
    });
    const errorProps = getScrapbookHeaderActionsViewProps({
      copiedPrompt: '',
      onCopyPrompt: () => 'copy prompt',
      promptCopyError: 'denied',
      savedVideoCount: 1,
      videoUrlList: '1. Video\nhttps://youtube.com/watch?v=video-1',
    });

    expect(copiedProps.promptIconName).toBe('check');
    expect(errorProps.promptIconName).toBe('alert');
    expect(copiedProps.promptButtonLabel).not.toBe(errorProps.promptButtonLabel);
    expect(errorProps.promptHelpText).not.toBe(copiedProps.promptHelpText);
  });
});
