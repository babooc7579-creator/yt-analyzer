import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import CreatorAppRoutes from './CreatorAppRoutes';

describe('CreatorAppRoutes', () => {
  it('shows a readable loading state while a secondary workspace chunk is loading', () => {
    const markup = renderToStaticMarkup(
      <CreatorAppRoutes
        isSettingsView
        settingsRouteProps={{}}
      />,
    );

    expect(markup).toContain('role="status"');
    expect(markup).toContain('선택한 화면을 불러오는 중입니다');
  });

  it('renders nothing when no workspace route is active', () => {
    expect(renderToStaticMarkup(<CreatorAppRoutes />)).toBe('');
  });
});
