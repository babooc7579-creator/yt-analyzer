import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import CopyUrlButton from './CopyUrlButton';

describe('CopyUrlButton', () => {
  it('renders the default local clipboard title without implying data writes', () => {
    const html = renderToStaticMarkup(
      <CopyUrlButton
        className="copy-button"
        url="https://example.com/video"
      />,
    );

    expect(html).toContain('copy-button');
    expect(html).toContain('URL 복사');
    expect(html).toContain('title="URL 복사 - 브라우저의 로컬 클립보드에 복사합니다. API 호출이나 저장 작업은 없습니다."');
    expect(html).toContain('aria-label="URL 복사"');
    expect(html).not.toContain('disabled=""');
  });

  it('disables the button when there is no copyable URL', () => {
    const html = renderToStaticMarkup(
      <CopyUrlButton
        label="링크 복사"
        url=""
      />,
    );

    expect(html).toContain('disabled=""');
    expect(html).toContain('링크 복사');
    expect(html).toContain('title="링크 복사 - 브라우저의 로컬 클립보드에 복사합니다. API 호출이나 저장 작업은 없습니다."');
  });

  it('keeps custom accessibility text while preserving visible label feedback', () => {
    const html = renderToStaticMarkup(
      <CopyUrlButton
        ariaLabel="선택한 링크를 복사합니다"
        label="복사"
        title="직접 지정한 복사 설명"
        url="https://example.com/reference"
      />,
    );

    expect(html).toContain('aria-label="선택한 링크를 복사합니다"');
    expect(html).toContain('title="직접 지정한 복사 설명"');
    expect(html).toContain('<span class="sr-only">복사</span>');
  });
});
