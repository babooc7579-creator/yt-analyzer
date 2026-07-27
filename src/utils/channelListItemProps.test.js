import { describe, expect, it, vi } from 'vitest';

import {
  CHANNEL_GRADE,
  CHANNEL_STATUS,
} from '../constants/status';
import { getChannelListItemViewProps } from './channelListItemProps';

const baseChannel = {
  id: 'channel-1',
  title: 'Peak Viral Shorts',
  category: '해외',
  thumbnail: 'https://example.com/channel.jpg',
  grade: CHANNEL_GRADE.S,
  status: CHANNEL_STATUS.ACTIVE,
};

describe('channelListItemProps utils', () => {
  it('builds selected channel props and toggles selection by channel id', () => {
    const onToggleSelection = vi.fn();
    const onOpenNotes = vi.fn();
    const onUpdateMetadata = vi.fn();
    const onDelete = vi.fn();
    const scanDisplay = { scannedText: '방금 전' };

    const props = getChannelListItemViewProps({
      channel: baseChannel,
      isSelected: true,
      scanDisplay,
      onToggleSelection,
      onOpenNotes,
      onUpdateMetadata,
      isUpdating: false,
      onDelete,
    });

    expect(props.containerClassName).toContain('border-indigo-500');
    expect(props.selectionButtonProps.title).toContain('선택 해제');
    expect(props.selectionButtonProps.title).toContain('YouTube API를 호출하지 않습니다');
    expect(props.selectionButtonProps.disabled).toBe(false);
    expect(props.selectionButtonProps['aria-label']).toBe(props.selectionButtonProps.title);
    expect(props.selectionButtonProps.type).toBe('button');

    props.selectionButtonProps.onClick();

    expect(onToggleSelection).toHaveBeenCalledWith('channel-1');
    expect(props.actionsProps).toMatchObject({
      channel: baseChannel,
      onDelete,
      onOpenNotes,
    });
    expect(props.scanSummaryProps.scanDisplay).toBe(scanDisplay);
  });

  it('builds unselected channel props with safe lookup guidance', () => {
    const props = getChannelListItemViewProps({
      channel: baseChannel,
      isSelected: false,
      scanDisplay: {},
      onToggleSelection: vi.fn(),
      onOpenNotes: vi.fn(),
      onUpdateMetadata: vi.fn(),
      isUpdating: true,
      onDelete: vi.fn(),
    });

    expect(props.containerClassName).toContain('border-slate-100');
    expect(props.containerClassName).toContain('hover:border-slate-300');
    expect(props.selectionButtonProps.title).toContain('선택 - 수집 영상 조회와 새 영상 수집 범위를 정합니다');
    expect(props.selectionButtonProps.title).toContain('선택만으로 YouTube API를 호출하지 않습니다');
    expect(props.thumbnailProps).toMatchObject({
      alt: '',
      src: baseChannel.thumbnail,
    });
    expect(props.titleProps.title).toBe(baseChannel.title);
  });

  it('normalizes invalid channel grade and status for child props', () => {
    const channel = {
      ...baseChannel,
      grade: 'VIP',
      status: 'sleeping',
    };

    const props = getChannelListItemViewProps({
      channel,
      isSelected: false,
      scanDisplay: {},
      onToggleSelection: vi.fn(),
      onOpenNotes: vi.fn(),
      onUpdateMetadata: vi.fn(),
      isUpdating: true,
      onDelete: vi.fn(),
    });

    expect(props.metaProps).toMatchObject({
      channel,
      grade: CHANNEL_GRADE.UNCLASSIFIED,
      status: CHANNEL_STATUS.ACTIVE,
    });
    expect(props.metadataControlsProps).toMatchObject({
      channel,
      grade: CHANNEL_GRADE.UNCLASSIFIED,
      isUpdating: true,
      status: CHANNEL_STATUS.ACTIVE,
    });
  });

  it('disables selection when the channel id or toggle handler is missing', () => {
    const onToggleSelection = vi.fn();
    const props = getChannelListItemViewProps({
      channel: { title: 'No ID Channel' },
      isSelected: false,
      scanDisplay: {},
      onToggleSelection,
      onOpenNotes: vi.fn(),
      onUpdateMetadata: vi.fn(),
      isUpdating: false,
      onDelete: vi.fn(),
    });

    expect(props.selectionButtonProps).toMatchObject({
      disabled: true,
      title: 'No ID Channel 선택 비활성화 - 채널 ID가 없어 선택 상태를 바꾸지 않습니다.',
      'aria-label': 'No ID Channel 선택 - 수집 영상 조회와 새 영상 수집 범위를 정합니다. 선택만으로 YouTube API를 호출하지 않습니다.',
      type: 'button',
    });

    props.selectionButtonProps.onClick();

    expect(onToggleSelection).not.toHaveBeenCalled();

    const missingHandlerProps = getChannelListItemViewProps({
      channel: baseChannel,
      isSelected: false,
      scanDisplay: {},
      onOpenNotes: vi.fn(),
      onUpdateMetadata: vi.fn(),
      isUpdating: false,
      onDelete: vi.fn(),
    });

    expect(missingHandlerProps.selectionButtonProps.disabled).toBe(true);
    missingHandlerProps.selectionButtonProps.onClick();
  });
});
