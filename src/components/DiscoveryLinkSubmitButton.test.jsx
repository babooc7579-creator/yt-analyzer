import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import DiscoveryLinkSubmitButton from './DiscoveryLinkSubmitButton';

describe('DiscoveryLinkSubmitButton', () => {
  it('renders Cloud discovery link save copy without external crawling wording confusion', () => {
    const html = renderToStaticMarkup(
      <DiscoveryLinkSubmitButton
        duplicateLink={false}
        isCreateDisabled={false}
        saving={false}
      />,
    );

    expect(html).toContain('링크 저장');
    expect(html).toContain('title="링크와 메모를 온라인 발견함(Azure DB)에 저장합니다. 외부 사이트 크롤링은 하지 않습니다."');
    expect(html).toContain('aria-label="온라인 발견함(Azure DB)에 링크 저장"');
    expect(html).not.toContain('disabled=""');
  });

  it('renders duplicate link guidance while keeping the button disabled', () => {
    const html = renderToStaticMarkup(
      <DiscoveryLinkSubmitButton
        duplicateLink
        isCreateDisabled
        saving={false}
      />,
    );

    expect(html).toContain('이미 저장된 링크');
    expect(html).toContain('disabled=""');
  });

  it('renders explicit Cloud saving state', () => {
    const html = renderToStaticMarkup(
      <DiscoveryLinkSubmitButton
        duplicateLink={false}
        isCreateDisabled
        saving
      />,
    );

    expect(html).toContain('온라인 저장소(Azure DB) 저장 중');
    expect(html).toContain('disabled=""');
  });
});
