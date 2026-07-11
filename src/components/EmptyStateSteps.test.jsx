import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import EmptyStateSteps from './EmptyStateSteps';

describe('EmptyStateSteps', () => {
  it('renders nothing when there are no steps', () => {
    expect(renderToStaticMarkup(<EmptyStateSteps />)).toBe('');
  });

  it('renders step cards with per-step classes and safe default classes', () => {
    const html = renderToStaticMarkup(
      <EmptyStateSteps
        className="steps-grid"
        defaultDescriptionClassName="description-default"
        defaultStepClassName="step-default"
        defaultTitleClassName="title-default"
        descriptionClassNames={['description-one']}
        stepClassNames={['step-one']}
        steps={[
          { description: '첫 설명', key: 'one', title: '첫 단계' },
          { description: '둘 설명', key: 'two', title: '둘 단계' },
        ]}
        titleClassNames={['title-one']}
      />,
    );

    expect(html).toContain('steps-grid');
    expect(html).toContain('step-one');
    expect(html).toContain('step-default');
    expect(html).toContain('title-one');
    expect(html).toContain('title-default');
    expect(html).toContain('description-one');
    expect(html).toContain('description-default');
    expect(html).toContain('첫 단계');
    expect(html).toContain('둘 설명');
  });
});
