import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import LazyRouteErrorBoundary from './LazyRouteErrorBoundary';

describe('LazyRouteErrorBoundary', () => {
  it('renders its child before a route loading error', () => {
    const html = renderToStaticMarkup(
      <LazyRouteErrorBoundary><p>route content</p></LazyRouteErrorBoundary>,
    );

    expect(html).toContain('route content');
  });

  it('shows a readable reload action after a route loading error', () => {
    const boundary = new LazyRouteErrorBoundary({ children: null });
    boundary.state = LazyRouteErrorBoundary.getDerivedStateFromError();
    const html = renderToStaticMarkup(boundary.render());

    expect(html).toContain('최신 화면을 다시 불러와야 합니다');
    expect(html).toContain('저장하지 않은 입력이 없다면');
    expect(html).toContain('최신 화면 다시 불러오기');
    expect(html).toContain('role="alert"');
  });
});
