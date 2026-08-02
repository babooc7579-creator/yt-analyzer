import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./functionApiClient', () => ({ getJson: vi.fn() }));

import { getJson } from './functionApiClient';
import { searchYoutubeChannels, searchYoutubeVideos } from './youtubeSearchApi';

describe('youtubeSearchApi', () => {
  beforeEach(() => getJson.mockReset());

  it('sends only explicit search options to the protected backend', async () => {
    getJson.mockResolvedValue({ success: true, items: [] });
    await searchYoutubeVideos({ q: '바이브 코딩', maxResults: 25, regionCode: 'KR', pageToken: '' });
    expect(getJson).toHaveBeenCalledWith('/youtube-search?q=%EB%B0%94%EC%9D%B4%EB%B8%8C+%EC%BD%94%EB%94%A9&maxResults=25&regionCode=KR');
  });

  it('uses a separate channel search endpoint without saving results', async () => {
    getJson.mockResolvedValue({ success: true, items: [], saved: false });
    await searchYoutubeChannels({ q: '경제', maxResults: 12, regionCode: 'KR', pageToken: '' });
    expect(getJson).toHaveBeenCalledWith('/youtube-channel-search?q=%EA%B2%BD%EC%A0%9C&maxResults=12&regionCode=KR');
  });
});
