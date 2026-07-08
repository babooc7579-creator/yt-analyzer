import { describe, expect, it } from 'vitest';

import {
  getChannelList,
  getChannelListBodyProps,
  getChannelListBodyVisibleChannels,
  getChannelListExportPanelProps,
  getChannelListEmptyStateViewProps,
  getChannelListItemsProps,
  getChannelListLoadingStateViewProps,
  getChannelListUrlExportPanelViewProps,
  getVisibleChannelUrlList,
  getVisibleChannels,
  hasChannelTag,
} from './channelListProps';

describe('channelListProps utils', () => {
  const overseasChannel = {
    id: 'channel-1',
    title: 'Peak Viral Shorts',
    tags: ['해외', '쇼츠'],
    handle: '@peakviral',
  };

  const entertainmentChannel = {
    id: 'channel-2',
    title: '',
    tags: ['예능'],
    url: 'https://www.youtube.com/@funny',
  };

  it('normalizes channels and filters visible channels by selected tag', () => {
    const channels = [overseasChannel, null, 'bad', entertainmentChannel];

    expect(getChannelList(channels)).toEqual([overseasChannel, entertainmentChannel]);
    expect(getChannelList(null)).toEqual([]);
    expect(hasChannelTag(overseasChannel, '해외')).toBe(true);
    expect(hasChannelTag(overseasChannel, '예능')).toBe(false);
    expect(getVisibleChannels(channels, '해외')).toEqual([overseasChannel]);
  });

  it('builds numbered YouTube channel URLs for export without calling scan APIs', () => {
    expect(getVisibleChannelUrlList([overseasChannel, entertainmentChannel])).toContain(
      '1. Peak Viral Shorts'
    );
    expect(getVisibleChannelUrlList([overseasChannel, entertainmentChannel])).toContain(
      'https://youtube.com/@peakviral'
    );
    expect(getVisibleChannelUrlList([entertainmentChannel])).toContain('제목 없는 채널');
    expect(getVisibleChannelUrlList([{ title: 'No route' }])).toBe('');
  });

  it('builds export and body props with visible channels and total channel count', () => {
    const visibleChannels = [overseasChannel];
    const visibleChannelUrlList = '1. Peak Viral Shorts\nhttps://www.youtube.com/@peakviral';
    const exportProps = getChannelListExportPanelProps({
      selectedCategory: '해외',
      visibleChannelUrlList,
      visibleChannels,
    });

    expect(exportProps).toEqual({
      selectedCategory: '해외',
      visibleChannelUrlList,
      visibleChannels,
    });

    const bodyProps = getChannelListBodyProps({
      channelList: [overseasChannel, null, entertainmentChannel],
      channelsLoading: false,
      getScanDisplay: () => 'scan',
      onDelete: () => 'delete',
      onOpenNotes: () => 'notes',
      onToggleSelection: () => 'toggle',
      onUpdateMetadata: () => 'metadata',
      selectedChannelIds: ['channel-1'],
      selectedCategory: '해외',
      updatingChannelId: 'channel-1',
      visibleChannels,
    });

    expect(bodyProps).toMatchObject({
      channelsLoading: false,
      selectedCategory: '해외',
      selectedChannelIds: ['channel-1'],
      totalChannelCount: 2,
      updatingChannelId: 'channel-1',
      visibleChannels,
    });
  });

  it('builds channel list body item props with safe visible channel fallback', () => {
    const visibleChannels = [overseasChannel];

    expect(getChannelListBodyVisibleChannels(visibleChannels)).toBe(visibleChannels);
    expect(getChannelListBodyVisibleChannels(null)).toEqual([]);

    const props = {
      getScanDisplay: () => 'scan',
      onDelete: () => 'delete',
      onOpenNotes: () => 'notes',
      onToggleSelection: () => 'toggle',
      onUpdateMetadata: () => 'metadata',
      selectedChannelIds: ['channel-1'],
      updatingChannelId: 'channel-1',
      visibleChannels,
    };

    expect(getChannelListItemsProps(props)).toEqual(props);
  });

  it('builds empty state copy for all-empty and selected-tag-empty states', () => {
    expect(getChannelListEmptyStateViewProps({
      selectedCategory: '해외',
      totalChannelCount: 0,
    })).toEqual({
      description: '먼저 위에서 채널을 미리보기한 뒤 Cloud 채널 목록에 저장해 주세요. 채널 저장만으로 새 영상 수집은 실행되지 않습니다.',
      hasChannelsInOtherTags: false,
      title: '저장된 채널이 없습니다.',
    });

    expect(getChannelListEmptyStateViewProps({
      selectedCategory: '해외',
      totalChannelCount: 3,
    })).toEqual({
      description: '다른 태그에는 저장된 채널이 있습니다. 이 태그로 보려면 채널 태그를 추가하거나 다른 태그를 선택해 주세요.',
      hasChannelsInOtherTags: true,
      title: '해외 태그에 채널이 없습니다.',
    });
  });

  it('builds URL export panel copy without implying scan or save work', () => {
    const visibleChannelUrlList = '1. Peak Viral Shorts\nhttps://youtube.com/@peakviral';
    const props = getChannelListUrlExportPanelViewProps({
      selectedCategory: '해외',
      visibleChannelUrlList,
      visibleChannels: [overseasChannel, null],
    });

    expect(props.title).toBe('현재 목록 1개');
    expect(props.description).toContain('저장이나 수집은 실행하지 않습니다');
    expect(props.copyButtonProps).toMatchObject({
      ariaLabel: '해외 채널 1개 URL 목록 복사',
      copiedLabel: '목록 복사 완료',
      disabled: false,
      label: '채널 URL 목록 복사',
      url: visibleChannelUrlList,
    });
    expect(props.copyButtonProps.title).toContain('YouTube API 호출이나 저장 작업은 없습니다');
    expect(getChannelListUrlExportPanelViewProps({ visibleChannels: [] })).toBeNull();
    expect(getChannelListUrlExportPanelViewProps({
      selectedCategory: '해외',
      visibleChannelUrlList: '',
      visibleChannels: [overseasChannel],
    }).copyButtonProps.disabled).toBe(true);
    expect(getChannelListUrlExportPanelViewProps({
      selectedCategory: '해외',
      visibleChannelUrlList: '   ',
      visibleChannels: [overseasChannel],
    }).copyButtonProps.disabled).toBe(true);
  });

  it('builds loading state copy for Cloud channel lookup', () => {
    expect(getChannelListLoadingStateViewProps()).toEqual({
      label: 'Cloud에서 채널 불러오는 중...',
    });
  });
});
