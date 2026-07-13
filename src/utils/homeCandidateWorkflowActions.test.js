import { describe, expect, it } from 'vitest';

import {
  getHomeCandidateWorkflowActions,
  getHomeCandidateWorkflowCardViewProps,
  getHomeCandidateWorkflowStatusViewProps,
} from './homeCandidateWorkflowActions';

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
    expect(actions.productionCandidates.label).toBe('후보함');
    expect(actions.discoveryLinks.label).toBe('발견함');
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

  it('uses rights-check copy when discovery link candidates need rights review', () => {
    const actions = getHomeCandidateWorkflowActions({
      hasCandidates: true,
      hasRightsWarning: true,
    });

    expect(actions.productionCandidates.label).toBe('권리 확인');
    expect(actions.productionCandidates.title).toContain('권리 확인이 필요한 링크 후보');
    expect(actions.productionCandidates.title).toContain('저장된 후보 조회');
    expect(actions.productionCandidates.title).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(actions.productionCandidates.ariaLabel).toContain('권리 확인 후보 보기');
    expect(actions.productionCandidates.ariaLabel).toContain('YouTube API 호출 없음');
  });

  it('uses a direct today-focus action when pinned candidates are waiting', () => {
    const actions = getHomeCandidateWorkflowActions({
      hasCandidates: true,
      hasFocusCandidates: true,
    });

    expect(actions.productionCandidates.label).toBe('오늘 집중 보기');
    expect(actions.productionCandidates.title).toContain('오늘 집중 영역');
    expect(actions.productionCandidates.title).toContain('저장된 후보 조회');
    expect(actions.productionCandidates.ariaLabel).toContain('오늘 집중 후보 보기');
    expect(actions.productionCandidates.ariaLabel).toContain('YouTube API 호출 없음');
  });

  it('builds candidate workflow card and status copy from video and link counts', () => {
    const normalCard = getHomeCandidateWorkflowCardViewProps({
      discoveryCandidateCount: 2,
      discoveryRightsWarningCount: 0,
      productionCandidateCount: 1,
      productionFocusCount: 2,
    });
    const warningCard = getHomeCandidateWorkflowCardViewProps({
      discoveryCandidateCount: 1,
      discoveryRightsWarningCount: 3,
      productionCandidateCount: 0,
    });
    const normalStatus = getHomeCandidateWorkflowStatusViewProps({
      discoveryCandidateCount: 2,
      productionCandidateCount: 1,
      productionFocusCount: 2,
    });
    const warningStatus = getHomeCandidateWorkflowStatusViewProps({
      discoveryCandidateCount: 1,
      discoveryRightsWarningCount: 3,
      hasRightsWarning: true,
      productionCandidateCount: 0,
    });

    expect(normalCard).toMatchObject({
      hasCandidates: true,
      hasFocusCandidates: true,
      hasRightsWarning: false,
      titleText: '3. 오늘 집중 후보 이어가기',
    });
    expect(normalCard.titleText).not.toContain('넘기기');
    expect(warningCard.hasRightsWarning).toBe(true);
    expect(normalStatus.descriptionText).toContain('오늘 집중으로 고정한 영상 2개');
    expect(normalStatus.metricText).toBe('오늘 집중 2개 · 영상 1개 · 링크 2개');
    expect(warningStatus.descriptionText).toContain('권리 확인이 필요한 항목 3개');
    expect(warningStatus.metricText).toBe('오늘 집중 0개 · 영상 0개 · 링크 1개');
  });
});
