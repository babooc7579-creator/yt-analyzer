import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import EmptyStateActions from './EmptyStateActions';

function TestIcon(props) {
  return <svg data-icon="test" {...props} />;
}

describe('EmptyStateActions', () => {
  it('renders nothing when there are no actions', () => {
    expect(renderToStaticMarkup(<EmptyStateActions />)).toBe('');
  });

  it('renders action buttons with icons, labels, accessibility text, and variant classes', () => {
    const html = renderToStaticMarkup(
      <EmptyStateActions
        actions={[
          {
            ariaLabel: 'Open home without API calls',
            iconKey: 'home',
            key: 'home',
            label: '오늘 레이더로',
            onClick: () => 'home',
            title: '저장, 수집, YouTube API 호출은 실행하지 않습니다',
            variant: 'primary',
          },
        ]}
        buttonBaseClassName="base-button"
        className="actions-wrapper"
        fallbackIcon={TestIcon}
        icons={{ home: TestIcon }}
        variantClasses={{ primary: 'primary-button' }}
      />,
    );

    expect(html).toContain('actions-wrapper');
    expect(html).toContain('base-button primary-button');
    expect(html).toContain('aria-label="Open home without API calls"');
    expect(html).toContain('title="저장, 수집, YouTube API 호출은 실행하지 않습니다"');
    expect(html).toContain('data-icon="test"');
    expect(html).toContain('오늘 레이더로');
  });
});
