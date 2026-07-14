import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import StoredVideoGuide from './StoredVideoGuide';
import VideoToolbarTtoTtoButton from './VideoToolbarTtoTtoButton';

describe('legacy workspace action clarity', () => {
  it('keeps the inactive tto-tto control visibly orange and clickable', () => {
    const markup = renderToStaticMarkup(
      <VideoToolbarTtoTtoButton setTtoTtoMode={vi.fn()} ttoTtoMode={false} />,
    );

    expect(markup).toContain('bg-orange-100');
    expect(markup).toContain('text-orange-800');
    expect(markup).toContain('aria-pressed="false"');
    expect(markup).not.toContain('disabled');
  });

  it('marks the tto-tto control as active when the filter is on', () => {
    const markup = renderToStaticMarkup(
      <VideoToolbarTtoTtoButton setTtoTtoMode={vi.fn()} ttoTtoMode />,
    );

    expect(markup).toContain('from-rose-500');
    expect(markup).toContain('to-orange-500');
    expect(markup).toContain('aria-pressed="true"');
  });

  it('labels collection and lookup cards as notices rather than buttons', () => {
    const markup = renderToStaticMarkup(<StoredVideoGuide />);

    expect(markup.match(/role="note"/g)).toHaveLength(2);
    expect(markup.match(/안내/g)).toHaveLength(2);
    expect(markup).not.toContain('<button');
  });
});
