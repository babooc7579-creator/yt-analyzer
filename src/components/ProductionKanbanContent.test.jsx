import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import ProductionKanbanContent from './ProductionKanbanContent';

describe('ProductionKanbanContent', () => {
  it('shows the script workspace action when its navigation handler is available', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanContent
        discoveryLinkCandidates={[]}
        focusVideos={[]}
        groupedVideos={{}}
        onOpenScriptBoard={vi.fn()}
        productionSummary={{ videoCount: 1 }}
      />,
    );

    expect(html).toContain('대본 작업실 열기');
  });
});
