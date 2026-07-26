import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import KeywordResearchShortcuts from './KeywordResearchShortcuts';

describe('KeywordResearchShortcuts', () => {
  it('offers explicit external-tool shortcuts without implying automatic collection', () => {
    const html = renderToStaticMarkup(<KeywordResearchShortcuts keyword="고양이 행동" />);

    expect(html).toContain('외부 관심도 확인');
    expect(html).toContain('외부 검색량을 자동 수집하지 않습니다');
    expect(html).toContain('Google Trends');
    expect(html).toContain('네이버 DataLab');
    expect(html).toContain('네이버 검색광고');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('q=%EA%B3%A0%EC%96%91%EC%9D%B4%20%ED%96%89%EB%8F%99');
  });

  it('disables keyword copy until a keyword is selected', () => {
    const html = renderToStaticMarkup(<KeywordResearchShortcuts keyword="" />);

    expect(html).toContain('먼저 검색창에 키워드를 입력');
    expect(html).toContain('disabled');
  });
});
