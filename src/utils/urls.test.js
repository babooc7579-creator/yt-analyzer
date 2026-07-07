import { describe, expect, it } from 'vitest';

import {
  formatNumberedUrlList,
  getYouTubeChannelUrl,
  getYouTubeVideoUrl,
} from './urls';

describe('urls utils', () => {
  it('builds encoded YouTube video URLs', () => {
    expect(getYouTubeVideoUrl('abc 123')).toBe('https://youtube.com/watch?v=abc%20123');
    expect(getYouTubeVideoUrl('')).toBe('');
  });

  it('uses explicit channel URL before fallback fields', () => {
    expect(getYouTubeChannelUrl({
      id: 'UC123',
      handle: 'peakviral',
      url: 'https://youtube.com/@custom',
    })).toBe('https://youtube.com/@custom');
  });

  it('builds channel URLs from handles, custom URLs, and usernames', () => {
    expect(getYouTubeChannelUrl({
      handle: 'peakviral',
    })).toBe('https://youtube.com/@peakviral');
    expect(getYouTubeChannelUrl({
      customUrl: '@already',
    })).toBe('https://youtube.com/@already');
    expect(getYouTubeChannelUrl({
      username: 'https://youtube.com/@absolute',
    })).toBe('https://youtube.com/@absolute');
  });

  it('falls back to encoded channel id when no handle exists', () => {
    expect(getYouTubeChannelUrl({
      id: 'UC 123',
    })).toBe('https://www.youtube.com/channel/UC%20123');
    expect(getYouTubeChannelUrl(null)).toBe('');
  });

  it('formats numbered URL lists and removes empty rows', () => {
    expect(formatNumberedUrlList([
      ['First video', ' https://youtube.com/watch?v=1 '],
      '',
      [' ', null],
      'https://youtube.com/watch?v=2',
      ['Title only', '', 'https://youtube.com/watch?v=3'],
    ])).toBe([
      '1. First video\nhttps://youtube.com/watch?v=1',
      '2. https://youtube.com/watch?v=2',
      '3. Title only\nhttps://youtube.com/watch?v=3',
    ].join('\n\n'));
    expect(formatNumberedUrlList(null)).toBe('');
  });
});
