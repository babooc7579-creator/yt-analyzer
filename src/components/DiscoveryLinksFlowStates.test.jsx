import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import DiscoveryLinksEmptyState from './DiscoveryLinksEmptyState';
import DiscoveryLinksFilteredEmptyState from './DiscoveryLinksFilteredEmptyState';
import DiscoveryLinksFilters from './DiscoveryLinksFilters';
import DiscoveryLinksHeaderActions from './DiscoveryLinksHeaderActions';
import DiscoveryLinksNotices from './DiscoveryLinksNotices';
import DiscoveryLinkCandidateAction from './DiscoveryLinkCandidateAction';

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

  it('renders discovery link Cloud errors without implying localStorage merge', () => {
    const html = renderToStaticMarkup(
      <DiscoveryLinksNotices
        error="Cloud 연결 실패"
        loading={false}
        onRefresh={noop}
      />,
    );

    expect(html).toContain('Cloud 연결 실패');
    expect(html).toContain('Cloud 발견함 재조회만 실행합니다');
    expect(html).toContain('localStorage와 자동 병합');
    expect(html).toContain('링크를 자동 업로드하지 않습니다');
  });

  it('renders active discovery filters with accessible selected states and a safe reset button', () => {
    const html = renderToStaticMarkup(
      <DiscoveryLinksFilters
        filteredLinkCount={2}
        hasActiveFilters
        onClearFilters={noop}
        rightsFilter="needs_check"
        rightsFilterOptions={[
          { count: 4, label: '권리 전체', value: 'all' },
          { count: 2, label: '권리 확인 필요', value: 'needs_check' },
        ]}
        searchQuery="table"
        setRightsFilter={noop}
        setSearchQuery={noop}
        setStatusFilter={noop}
        statusFilter="candidate"
        statusFilterOptions={[
          { count: 4, label: '전체', value: 'all' },
          { count: 2, label: '제작 후보', value: 'candidate' },
        ]}
      />,
    );

    expect(html).toContain('현재 조건에 맞는 링크 2개를 보고 있습니다');
    expect(html).toContain('필터 초기화');
    expect(html).toContain('Cloud 저장 데이터 변경 없음');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('role="group"');
  });

  it('renders per-link Cloud candidate success and failure without implying rights clearance', () => {
    const successHtml = renderToStaticMarkup(
      <DiscoveryLinkCandidateAction
        candidateSaveState="saved"
        currentStatus="candidate"
        onOpenProductionCandidate={noop}
        onSendToCandidate={noop}
        title="참고 링크"
      />,
    );
    const errorHtml = renderToStaticMarkup(
      <DiscoveryLinkCandidateAction
        candidateSaveState="error"
        currentStatus="saved"
        onSendToCandidate={noop}
        title="참고 링크"
      />,
    );

    expect(successHtml).toContain('Cloud 발견함에 제작 후보로 표시했습니다');
    expect(successHtml).toContain('권리 상태는 별도로 확인해야 합니다');
    expect(successHtml).toContain('후보함에서 이어서');
    expect(errorHtml).toContain('Cloud 후보 표시를 완료하지 못했습니다');
    expect(errorHtml).not.toContain('후보함에서 이어서');
  });
});
