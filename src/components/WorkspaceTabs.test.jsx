import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import WorkspaceTabs from './WorkspaceTabs';

describe('WorkspaceTabs', () => {
  it('renders the inactive scrapbook tab as a readable clickable control', () => {
    const markup = renderToStaticMarkup(
      <WorkspaceTabs activeTab="dashboard" savedVideoCount={2} onSelectTab={vi.fn()} />,
    );

    expect(markup).toContain('소재 보관함');
    expect(markup).toContain('수집 영상 목록');
    expect(markup).toContain('현재 화면');
    expect(markup).toContain('aria-pressed="false"');
    expect(markup).toContain('bg-slate-800');
    expect(markup).toContain('text-slate-200');
    expect(markup).not.toContain('disabled');
  });

  it('marks the scrapbook tab as active with a high-contrast style', () => {
    const markup = renderToStaticMarkup(
      <WorkspaceTabs activeTab="scrapbook" savedVideoCount={2} onSelectTab={vi.fn()} />,
    );

    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain('border-yellow-100 bg-white text-yellow-700');
    expect(markup).toContain('현재 화면');
  });

  it('shows the production candidate label instead of the scrapbook label in production view', () => {
    const markup = renderToStaticMarkup(
      <WorkspaceTabs
        activeTab="scrapbook"
        creatorView="studio-candidates"
        savedVideoCount={2}
        onSelectTab={vi.fn()}
      />,
    );

    expect(markup).toContain('제작 후보함');
    expect(markup).toContain('저장된 제작 후보 조회');
    expect(markup).not.toContain('소재 보관함');
  });
});
