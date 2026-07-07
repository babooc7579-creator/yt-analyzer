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
      title: '분석/기록 남기기',
      'aria-label': 'Peak Viral Shorts 분석/기록 남기기',
      type: 'button',
    });

    props.notesButtonProps.onClick();

    expect(onOpenNotes).toHaveBeenCalledWith(baseChannel);

    expect(props.deleteButtonProps.title).toContain('Cloud 채널 목록에서 삭제합니다');
    expect(props.deleteButtonProps.title).toContain('이미 저장된 영상 데이터는 삭제하지 않습니다');
    expect(props.deleteButtonProps['aria-label']).toContain('저장 영상 데이터는 삭제하지 않음');
    expect(props.deleteButtonProps.type).toBe('button');

    props.deleteButtonProps.onClick();

    expect(onDelete).toHaveBeenCalledWith('UC123', '해외', 'Peak Viral Shorts');
  });
});
