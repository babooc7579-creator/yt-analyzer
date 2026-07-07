import { describe, expect, it } from 'vitest';

import {
  STRONG_REACTION_MULTIPLIER,
  TTOTTO_MIN_DAYS_OLD,
  TTOTTO_MIN_MULTIPLIER,
  filterAndSortVideos,
  hasStrongReaction,
  isTtoTtoCandidate,
  mapCloudVideoToViewModel,
  parseDuration,
} from './video';

describe('video utils', () => {
  const videos = [
    {
      videoId: 'old-viral-short',
      title: 'Old viral cake idea',
      daysOld: 220,
      view_count: 9000,
      views_per_day: 41,
      like_ratio: 8,
      multiplier: 4,
      isShorts: true,
    },
    {
      videoId: 'new-long',
      title: 'New long documentary',
      daysOld: 7,
      view_count: 12000,
      views_per_day: 1714,
      like_ratio: 4,
      multiplier: 1.2,
      isShorts: false,
    },
    {
      videoId: 'old-steady-long',
      title: 'Old steady workshop',
      daysOld: 365,
      view_count: 5000,
      views_per_day: 14,
      like_ratio: 15,
      multiplier: 2,
      isShorts: false,
    },
  ];

  it('parses ISO durations and classifies shorts by total seconds', () => {
    expect(parseDuration('PT59S')).toEqual({
      isShorts: true,
      formatted: '00:59',
      totalSeconds: 59,
    });

    expect(parseDuration('PT1M02S')).toEqual({
      isShorts: false,
      formatted: '01:02',
      totalSeconds: 62,
    });

    expect(parseDuration('PT1H2M3S')).toEqual({
      isShorts: false,
      formatted: '1:02:03',
      totalSeconds: 3723,
    });

    expect(parseDuration('not-a-duration')).toEqual({
      isShorts: false,
      formatted: '00:00',
      totalSeconds: 0,
    });
  });

  it('maps Cloud video fields to dashboard view model fields', () => {
    expect(mapCloudVideoToViewModel({
      id: 'cloud-1',
      title: 'Cloud title',
      thumbnail: 'thumb.jpg',
      uploadDate: '2026-07-01',
      channelTitle: 'Channel title',
      channelId: 'channel-1',
      language: 'en',
      viewCount: '1000',
      likeCount: '120',
      likeRatio: '12.5',
      multiplier: '2.5',
      duration: '00:58',
      isShorts: true,
    }, 10)).toEqual({
      videoId: 'cloud-1',
      title: 'Cloud title',
      thumbnail: 'thumb.jpg',
      upload_date: '2026-07-01',
      channel_title: 'Channel title',
      channel_id: 'channel-1',
      language: 'en',
      daysOld: 10,
      view_count: 1000,
      like_count: 120,
      like_ratio: 12.5,
      duration: '00:58',
      isShorts: true,
      multiplier: 2.5,
      views_per_day: 100,
    });
  });

  it('detects tteotteotto and strong reaction candidates by thresholds', () => {
    expect(isTtoTtoCandidate({
      daysOld: TTOTTO_MIN_DAYS_OLD,
      multiplier: TTOTTO_MIN_MULTIPLIER,
    })).toBe(true);
    expect(isTtoTtoCandidate({
      daysOld: TTOTTO_MIN_DAYS_OLD - 1,
      multiplier: TTOTTO_MIN_MULTIPLIER,
    })).toBe(false);
    expect(isTtoTtoCandidate({
      daysOld: TTOTTO_MIN_DAYS_OLD,
      multiplier: TTOTTO_MIN_MULTIPLIER - 0.1,
    })).toBe(false);

    expect(hasStrongReaction({ multiplier: STRONG_REACTION_MULTIPLIER })).toBe(true);
    expect(hasStrongReaction({ multiplier: STRONG_REACTION_MULTIPLIER - 0.1 })).toBe(false);
  });

  it('filters by keyword, minimum views, length, and tteotteotto mode', () => {
    expect(filterAndSortVideos({
      videos,
      searchKeyword: 'old',
      viewFilter: 6000,
      lengthFilter: 'shorts',
      ttoTtoMode: true,
      sortType: 'views',
    }).map(video => video.videoId)).toEqual(['old-viral-short']);

    expect(filterAndSortVideos({
      videos,
      searchKeyword: '',
      viewFilter: 0,
      lengthFilter: 'long',
      ttoTtoMode: true,
      sortType: 'date',
    }).map(video => video.videoId)).toEqual(['old-steady-long']);
  });

  it('sorts videos by date, views, multiplier, viral speed, and like ratio', () => {
    expect(filterAndSortVideos({ videos, sortType: 'date' }).map(video => video.videoId)).toEqual([
      'new-long',
      'old-viral-short',
      'old-steady-long',
    ]);

    expect(filterAndSortVideos({ videos, sortType: 'views' }).map(video => video.videoId)).toEqual([
      'new-long',
      'old-viral-short',
      'old-steady-long',
    ]);

    expect(filterAndSortVideos({ videos, sortType: 'multiplier' }).map(video => video.videoId)).toEqual([
      'old-viral-short',
      'old-steady-long',
      'new-long',
    ]);

    expect(filterAndSortVideos({ videos, sortType: 'viral' }).map(video => video.videoId)).toEqual([
      'new-long',
      'old-viral-short',
      'old-steady-long',
    ]);

    expect(filterAndSortVideos({ videos, sortType: 'likes' }).map(video => video.videoId)).toEqual([
      'old-steady-long',
      'old-viral-short',
      'new-long',
    ]);
  });

  it('ignores invalid video entries and keeps unknown sort order stable', () => {
    expect(filterAndSortVideos({
      videos: [videos[0], null, 'bad', videos[1]],
      sortType: 'unknown',
    }).map(video => video.videoId)).toEqual(['old-viral-short', 'new-long']);
  });
});
