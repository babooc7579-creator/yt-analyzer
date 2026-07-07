import { describe, expect, it } from 'vitest';

import { getLegacyAsideProps } from './legacyAsideProps';

describe('legacyAsideProps utils', () => {
  it('builds aside counts from selected channels and video lists', () => {
    expect(getLegacyAsideProps({
      checkedVideos: [{ videoId: 'video1' }, { videoId: 'video2' }],
      savedVideos: [{ videoId: 'saved1' }],
      selectedChannelIds: ['channel1', 'channel2', 'channel3'],
      totalVideoCount: 10,
    })).toEqual({
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
});
