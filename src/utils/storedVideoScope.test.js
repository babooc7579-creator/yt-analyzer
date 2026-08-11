import { describe, expect, it } from 'vitest';

import { getConfirmedStoredVideos } from './storedVideoScope';

describe('getConfirmedStoredVideos', () => {
  const videos = [{ videoId: 'video-1' }, null, 'invalid'];

  it('returns only valid videos for a successful matching channel scope', () => {
    expect(getConfirmedStoredVideos({
      selectedChannelKey: 'channel-1|channel-2',
      storedVideoLoadResult: {
        success: true,
        selectionKey: 'channel-1|channel-2',
      },
      videos,
    })).toEqual([{ videoId: 'video-1' }]);
  });

  it('keeps the original array reference when every video is valid', () => {
    const validVideos = [{ videoId: 'video-1' }];

    expect(getConfirmedStoredVideos({
      selectedChannelKey: 'channel-1',
      storedVideoLoadResult: { success: true, selectionKey: 'channel-1' },
      videos: validVideos,
    })).toBe(validVideos);
  });

  it.each([
    ['no selected channels', '', { success: true, selectionKey: '' }],
    ['lookup not started', 'channel-1', null],
    ['failed lookup', 'channel-1', { success: false, selectionKey: 'channel-1' }],
    ['different lookup scope', 'channel-2', { success: true, selectionKey: 'channel-1' }],
  ])('hides previous videos when there is %s', (_label, selectedChannelKey, storedVideoLoadResult) => {
    expect(getConfirmedStoredVideos({
      selectedChannelKey,
      storedVideoLoadResult,
      videos,
    })).toEqual([]);
  });
});
