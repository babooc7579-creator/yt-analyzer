import { describe, expect, it } from 'vitest';

import {
  getDiscoveryLinksFilteredEmptyStateViewProps,
  getDiscoveryLinksHeaderTitleViewProps,
  getDiscoveryLinksRefreshButtonProps,
} from './discoveryLinksCopy';

describe('discoveryLinksCopy utils', () => {
  it('builds Cloud discovery links header copy', () => {
    const props = getDiscoveryLinksHeaderTitleViewProps({ totalLinkCount: 3 });

    expect(props).toEqual({
      eyebrow: 'Cloud 발견함',
      title: '저장한 링크 3개',
      description: 'Cloud에 저장된 수동 링크입니다. 목록이 비어 있으면 Cloud 기준으로 아직 저장된 링크가 없는 상태입니다.',
    });
  });

  it('builds filtered empty state copy without implying data changes', () => {
    const props = getDiscoveryLinksFilteredEmptyStateViewProps({ allLinkCount: 7 });

    expect(props.title).toBe('조건에 맞는 링크가 없습니다.');
    expect(props.description).toContain('Cloud에는 링크 7개');
    expect(props.description).toContain('저장 데이터나 외부 사이트에는 영향을 주지 않습니다');
    expect(props.clearButtonProps).toMatchObject({
      label: '필터 초기화',
      title: '검색어와 필터를 모두 초기화합니다. Cloud 저장 데이터는 바꾸지 않습니다.',
    });
  });

  it('builds refresh button copy as a Cloud lookup only', () => {
    const props = getDiscoveryLinksRefreshButtonProps();

    expect(props.label).toBe('다시 조회');
    expect(props.title).toContain('Cloud 발견함 목록');
    expect(props.title).toContain('외부 사이트 수집이나 저장 변경은 없습니다');
    expect(props['aria-label']).toContain('외부 수집이나 저장 변경 없음');
  });
});
