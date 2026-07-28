import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HomeSummaryCard from './HomeSummaryCard';

describe('HomeSummaryCard', () => {
  it('uses the visible description as the hover title', () => {
    const description = '온라인 저장소(Azure DB)에 저장된 채널 자산입니다. 숫자 확인만으로 YouTube API를 호출하지 않습니다.';

    const html = renderToStaticMarkup(
      <HomeSummaryCard
        description={description}
        label="저장된 채널"
        value={12}
      />,
    );

    expect(html).toContain(`title="${description}"`);
    expect(html).toContain('저장된 채널');
    expect(html).toContain('12');
    expect(html).toContain(description);
  });
});
