import { describe, expect, it } from 'vitest';

import {
  getNextThumbnailCandidateIndex,
  getYouTubeThumbnailCandidates,
} from './youtubeThumbnails';

describe('youtubeThumbnails', () => {
  it('prefers max resolution and keeps progressively safer fallbacks', () => {
    expect(getYouTubeThumbnailCandidates({
      src: 'https://i.ytimg.com/vi/video-1/mqdefault.jpg',
      videoId: 'video-1',
    })).toEqual([
      'https://i.ytimg.com/vi/video-1/maxresdefault.jpg',
      'https://i.ytimg.com/vi/video-1/sddefault.jpg',
      'https://i.ytimg.com/vi/video-1/hqdefault.jpg',
      'https://i.ytimg.com/vi/video-1/mqdefault.jpg',
    ]);
  });

  it('uses standard quality for compact thumbnails to avoid oversized downloads', () => {
    expect(getYouTubeThumbnailCandidates({
      preferredQuality: 'standard',
      src: 'stored.jpg',
      videoId: 'video-1',
    })).toEqual([
      'https://i.ytimg.com/vi/video-1/sddefault.jpg',
      'https://i.ytimg.com/vi/video-1/hqdefault.jpg',
      'stored.jpg',
    ]);
  });

  it('does not advance beyond the final fallback', () => {
    expect(getNextThumbnailCandidateIndex({ candidateCount: 4, currentIndex: 1 })).toBe(2);
    expect(getNextThumbnailCandidateIndex({ candidateCount: 4, currentIndex: 3 })).toBe(3);
  });
});
