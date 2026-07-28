import { describe, expect, it } from 'vitest';

import { getScrapbookHeaderViewProps } from './scrapbookHeaderProps';

describe('scrapbookHeaderProps utils', () => {
  it('builds Cloud scrapbook header copy by default', () => {
    const props = getScrapbookHeaderViewProps();

    expect(props).toMatchObject({
      iconName: 'bookmark',
      isProductionMode: false,
      title: '영구 보관 스크랩북',
    });
    expect(props.description).toContain('온라인 저장소 기준');
    expect(props.description).toContain('브라우저 임시 기록');
  });

  it('builds production candidate header copy for production mode', () => {
    const props = getScrapbookHeaderViewProps({ variant: 'production' });

    expect(props).toMatchObject({
      iconName: 'rocket',
      isProductionMode: true,
      title: '제작 후보함',
    });
    expect(props.description).toContain('발견함 링크');
    expect(props.description).toContain('제작 후보로 표시한 영상');
    expect(props.description).not.toContain('제작 후보로 지정한');
    expect(props.description).toContain('온라인 저장소(Azure DB)의 판단 기록');
  });
});
