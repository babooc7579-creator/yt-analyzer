import { describe, expect, it } from 'vitest';

import {
  getChannelList,
  getChannelListBodyProps,
  getChannelListExportPanelProps,
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
});
