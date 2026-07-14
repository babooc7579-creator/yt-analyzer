import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import YouTubeThumbnailImage from './YouTubeThumbnailImage';

describe('YouTubeThumbnailImage', () => {
  it('renders the high-resolution candidate first for large video cards', () => {
    const html = renderToStaticMarkup(
      <YouTubeThumbnailImage alt="영상 썸네일" src="stored.jpg" videoId="video-1" />,
    );

    expect(html).toContain('video-1/maxresdefault.jpg');
    expect(html).toContain('decoding="async"');
    expect(html).toContain('loading="lazy"');
  });

  it('starts from standard definition for compact list thumbnails', () => {
    const html = renderToStaticMarkup(
      <YouTubeThumbnailImage
        alt="영상 썸네일"
        preferredQuality="standard"
        src="stored.jpg"
        videoId="video-1"
      />,
    );

    expect(html).toContain('video-1/sddefault.jpg');
    expect(html).not.toContain('maxresdefault.jpg');
  });
});
