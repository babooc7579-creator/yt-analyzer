import { describe, expect, it, vi } from 'vitest';

import { getChannelListItemActionsViewProps } from './channelListItemActionsProps';

const baseChannel = {
  id: 'UC123',
  title: 'Peak Viral Shorts',
  category: '해외',
  handle: 'peakviral',
  notes: ['check hook', 'good pacing'],
};

describe('channelListItemActionsProps utils', () => {
  it('builds copy URL button props without API or save wording', () => {
    const props = getChannelListItemActionsViewProps({
      channel: {
        ...baseChannel,
        url: 'https://youtube.com/@peakviral',
      },
      onDelete: vi.fn(),
      onOpenNotes: vi.fn(),
    });

    expect(props.copyUrlButtonProps).toMatchObject({
      ariaLabel: 'Peak Viral Shorts YouTube 채널 URL 복사',
      copiedLabel: '복사됨',
      label: '채널 URL 복사',
      showLabel: false,
      title: 'YouTube 채널 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다.',
      url: 'https://youtube.com/@peakviral',
    });
  });

  it('falls back to a YouTube handle URL when explicit channel URL is missing', () => {
    const props = getChannelListItemActionsViewProps({
      channel: baseChannel,
      onDelete: vi.fn(),
      onOpenNotes: vi.fn(),
    });

    expect(props.copyUrlButtonProps.url).toBe('https://youtube.com/@peakviral');
  });

  it('builds notes and delete button props with safe deletion guidance', () => {
    const onDelete = vi.fn();
    const onOpenNotes = vi.fn();

    const props = getChannelListItemActionsViewProps({
      channel: baseChannel,
      onDelete,
      onOpenNotes,
    });

    expect(props.noteCount).toBe(2);
    expect(props.notesButtonProps).toMatchObject({
      disabled: false,
      title: '분석/기록 남기기',
      'aria-label': 'Peak Viral Shorts 분석/기록 남기기',
      type: 'button',
    });

    props.notesButtonProps.onClick();

    expect(onOpenNotes).toHaveBeenCalledWith(baseChannel);

    expect(props.deleteButtonProps.title).toContain('Cloud 채널 목록에서 삭제합니다');
    expect(props.deleteButtonProps.title).toContain('이미 수집된 영상 정보는 삭제하지 않습니다');
    expect(props.deleteButtonProps.disabled).toBe(false);
    expect(props.deleteButtonProps['aria-label']).toContain('수집 영상 정보는 삭제하지 않음');
    expect(props.deleteButtonProps.type).toBe('button');

    props.deleteButtonProps.onClick();

    expect(onDelete).toHaveBeenCalledWith('UC123', '해외', 'Peak Viral Shorts');
  });

  it('disables note and delete actions when the channel id or handlers are missing', () => {
    const onDelete = vi.fn();
    const onOpenNotes = vi.fn();
    const props = getChannelListItemActionsViewProps({
      channel: { title: 'No ID Channel' },
      onDelete,
      onOpenNotes,
    });

    expect(props.noteCount).toBe(0);
    expect(props.copyUrlButtonProps).toMatchObject({
      ariaLabel: 'No ID Channel YouTube 채널 URL 복사',
      url: '',
    });
    expect(props.notesButtonProps).toMatchObject({
      disabled: true,
      title: '분석/기록을 열 채널 ID가 없습니다.',
      'aria-label': 'No ID Channel 분석/기록 비활성화 - 채널 ID 없음',
    });
    expect(props.deleteButtonProps).toMatchObject({
      disabled: true,
      title: '삭제할 채널 ID가 없어 Cloud 삭제를 실행하지 않습니다.',
      'aria-label': 'No ID Channel 삭제 비활성화 - 채널 ID 없음',
    });

    props.notesButtonProps.onClick();
    props.deleteButtonProps.onClick();

    expect(onOpenNotes).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('uses inert fallback actions when handlers are missing', () => {
    const props = getChannelListItemActionsViewProps({
      channel: baseChannel,
    });

    expect(props.notesButtonProps.disabled).toBe(true);
    expect(props.deleteButtonProps.disabled).toBe(true);

    props.notesButtonProps.onClick();
    props.deleteButtonProps.onClick();
  });
});
