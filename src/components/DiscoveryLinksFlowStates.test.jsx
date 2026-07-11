import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import DiscoveryLinksEmptyState from './DiscoveryLinksEmptyState';
import DiscoveryLinksFilteredEmptyState from './DiscoveryLinksFilteredEmptyState';
import DiscoveryLinksHeaderActions from './DiscoveryLinksHeaderActions';

const noop = () => {};

describe('DiscoveryLinks flow states', () => {
  it('renders empty state as a manual Cloud discovery link workflow without automatic collection', () => {
    const html = renderToStaticMarkup(<DiscoveryLinksEmptyState />);

    expect(html).toContain('아직 저장된 발견 링크가 없습니다.');
    expect(html).toContain('Cloud 발견함');
    expect(html).toContain('URL 붙여넣기');
    expect(html).toContain('외부 사이트 자동 수집이나 파일 다운로드는 실행하지 않습니다.');
  });

  it('renders filtered empty state with a reset action that does not change saved data', () => {
    const html = renderToStaticMarkup(
      <DiscoveryLinksFilteredEmptyState allLinkCount={7} clearFilters={noop} />,
    );

    expect(html).toContain('조건에 맞는 링크가 없습니다.');
    expect(html).toContain('Cloud에는 링크 7개가 저장되어 있지만');
    expect(html).toContain('저장 데이터나 외부 사이트에는 영향을 주지 않습니다');
    expect(html).toContain('aria-label="발견함 화면 필터 초기화, 저장 데이터 변경 없음"');
  });

  it('renders header actions that separate URL copying, candidate navigation, and Cloud refresh', () => {
    const html = renderToStaticMarkup(
      <DiscoveryLinksHeaderActions
        filteredLinkCount={3}
        loading={false}
        onOpenProductionCandidates={noop}
        onRefresh={noop}
        saving={false}
        urlList={'A\\nhttps://example.com/a'}
      />,
    );

    expect(html).toContain('URL 목록 복사');
    expect(html).toContain('후보함 보기');
    expect(html).toContain('새로고침');
    expect(html).toContain('외부 사이트 수집이나 저장 작업은 없습니다.');
    expect(html).toContain('새 YouTube API 호출이나 외부 수집은 없습니다.');
    expect(html).toContain('Cloud 발견함 목록을 다시 조회합니다. 외부 사이트를 새로 수집하지 않습니다.');
  });
});
