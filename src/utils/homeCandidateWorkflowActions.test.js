import { describe, expect, it } from 'vitest';

import { getHomeCandidateWorkflowActions } from './homeCandidateWorkflowActions';

describe('homeCandidateWorkflowActions utils', () => {
  it('returns handlers for production candidates and discovery links', () => {
    const onOpenDiscoveryLinks = () => 'discovery links';
    const onOpenProductionCandidates = () => 'production candidates';

    const actions = getHomeCandidateWorkflowActions({
      hasCandidates: true,
      onOpenDiscoveryLinks,
      onOpenProductionCandidates,
    });

    expect(actions.productionCandidates.onClick).toBe(onOpenProductionCandidates);
    expect(actions.discoveryLinks.onClick).toBe(onOpenDiscoveryLinks);
  });

  it('keeps production candidate copy clear that it is a stored candidate lookup', () => {
    const withCandidates = getHomeCandidateWorkflowActions({ hasCandidates: true });
    const withoutCandidates = getHomeCandidateWorkflowActions({ hasCandidates: false });

    expect(withCandidates.productionCandidates.title).toContain('저장된 후보 조회');
    expect(withCandidates.productionCandidates.title).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(withCandidates.productionCandidates.ariaLabel).toContain('YouTube API 호출 없음');

    expect(withoutCandidates.productionCandidates.title).toContain('빈 상태 안내');
    expect(withoutCandidates.productionCandidates.title).toContain('저장된 후보 조회');
    expect(withoutCandidates.productionCandidates.title).toContain('YouTube API를 새로 호출하지 않습니다');
  });

  it('keeps discovery link copy clear that it is manual and does not collect or download externally', () => {
    const actions = getHomeCandidateWorkflowActions({});

    expect(actions.discoveryLinks.title).toContain('수동 저장');
    expect(actions.discoveryLinks.title).toContain('외부 사이트 자동 수집');
    expect(actions.discoveryLinks.title).toContain('다운로드는 실행하지 않습니다');
    expect(actions.discoveryLinks.ariaLabel).toContain('외부 자동 수집이나 다운로드 없음');
  });
});
