import { describe, expect, it } from 'vitest';

import { getLegacyAsideProps } from './legacyAsideProps';

describe('legacyAsideProps utils', () => {
  it('builds aside counts from selected channels and video lists', () => {
    expect(getLegacyAsideProps({
      checkedVideos: [{ videoId: 'video1' }, { videoId: 'video2' }],
      savedVideos: [{ videoId: 'saved1' }],
      selectedChannelIds: ['channel1', 'channel2', 'channel3'],
      totalVideoCount: 10,
    })).toMatchObject({
      checkedVideoCount: 2,
      savedVideoCount: 1,
      selectedChannelCount: 3,
      videoCount: 10,
    });
  });

  it('uses safe zero counts for invalid list inputs', () => {
    expect(getLegacyAsideProps({
      checkedVideos: null,
      savedVideos: 'bad',
      selectedChannelIds: {},
    })).toMatchObject({
      checkedVideoCount: 0,
      savedVideoCount: 0,
      selectedChannelCount: 0,
    });
  });

  it('preserves the provided total video count value', () => {
    expect(getLegacyAsideProps({ totalVideoCount: 0 }).videoCount).toBe(0);
    expect(getLegacyAsideProps({ totalVideoCount: undefined }).videoCount).toBeUndefined();
  });

  it('provides legacy aside copy that separates collection from lookup', () => {
    const props = getLegacyAsideProps();

    expect(props.copy.nextActionTitle).toBe('오늘의 다음 행동');
    expect(props.copy.statusLabels).toMatchObject({
      checkedVideoCount: '선택 영상',
      savedVideoCount: '스크랩',
      selectedChannelCount: '선택 채널',
      videoCount: '불러온 영상',
    });
    expect(props.copy.collectionLookupLines[0].accentText).toBe('선택 채널 새 영상 수집');
    expect(props.copy.collectionLookupWarning).toContain('API 호출');
    expect(props.copy.ttoTtoCriteria).toHaveLength(3);
  });
});
