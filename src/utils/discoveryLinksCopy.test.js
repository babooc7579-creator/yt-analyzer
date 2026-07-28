import { describe, expect, it } from 'vitest';

import {
  getDiscoveryLinkActionsNoticeViewProps,
  getDiscoveryLinkFormHeaderViewProps,
  getDiscoveryLinkMemoFieldViewProps,
  getDiscoveryLinkRiskyCandidateHintViewProps,
  getDiscoveryLinkSafetyNoticeViewProps,
  getDiscoveryLinkSearchBoxViewProps,
  getDiscoveryLinkSourceBadgeLabel,
  getDiscoveryLinkStatusControlsViewProps,
  getDiscoveryLinkStatusFieldsViewProps,
  getDiscoveryLinkSubmitButtonViewProps,
  getDiscoveryLinkUpdatedAtViewProps,
  getDiscoveryLinkUrlFieldViewProps,
  getDiscoveryRightsFilterButtonProps,
  getDiscoveryRightsFilterGroupViewProps,
  getDiscoveryStatusFilterButtonProps,
  getDiscoveryStatusFilterGroupViewProps,
  getDiscoveryLinksActiveFilterSummaryViewProps,
  getDiscoveryLinksErrorNoticeViewProps,
  getDiscoveryLinksFilteredEmptyStateViewProps,
  getDiscoveryLinksHeaderActionsViewProps,
  getDiscoveryLinksHeaderTitleViewProps,
  getDiscoveryLinksLoadingStateViewProps,
  getDiscoveryLinksRefreshButtonProps,
} from './discoveryLinksCopy';

describe('discoveryLinksCopy utils', () => {
  it('builds Cloud discovery links header copy', () => {
    const props = getDiscoveryLinksHeaderTitleViewProps({ totalLinkCount: 3 });

    expect(props).toEqual({
      eyebrow: '온라인 발견함(Azure DB)',
      title: '저장한 링크 3개',
      description: '온라인 저장소(Azure DB)에 저장된 수동 링크입니다. 목록이 비어 있으면 온라인 저장소(Azure DB) 기준으로 아직 저장된 링크가 없는 상태입니다.',
    });
  });

  it('builds filtered empty state copy without implying data changes', () => {
    const props = getDiscoveryLinksFilteredEmptyStateViewProps({ allLinkCount: 7 });

    expect(props.title).toBe('조건에 맞는 링크가 없습니다.');
    expect(props.description).toContain('온라인 저장소(Azure DB)에는 링크 7개');
    expect(props.description).toContain('저장 데이터나 외부 사이트에는 영향을 주지 않습니다');
    expect(props.clearButtonProps).toMatchObject({
      label: '필터 초기화',
      title: '검색어와 필터를 모두 초기화합니다. 온라인 저장소(Azure DB) 저장 데이터는 바꾸지 않습니다.',
    });
  });

  it('builds refresh button copy as a Cloud lookup only', () => {
    const props = getDiscoveryLinksRefreshButtonProps();

    expect(props.label).toBe('다시 조회');
    expect(props.title).toContain('온라인 발견함(Azure DB) 목록');
    expect(props.title).toContain('외부 사이트 수집이나 저장 변경은 없습니다');
    expect(props['aria-label']).toContain('외부 수집이나 저장 변경 없음');
    expect(getDiscoveryLinksErrorNoticeViewProps().recoveryText).toContain('localStorage와 자동 병합');
    expect(getDiscoveryLinksErrorNoticeViewProps().recoveryText).toContain('자동 업로드하지 않습니다');
  });

  it('builds discovery form guidance without implying crawling or downloads', () => {
    expect(getDiscoveryLinkFormHeaderViewProps()).toMatchObject({
      title: '수동 링크 저장',
    });
    expect(getDiscoveryLinkFormHeaderViewProps().description).toContain('외부 사이트 자동 수집');
    expect(getDiscoveryLinkMemoFieldViewProps()).toMatchObject({
      label: '메모',
      'aria-label': '발견 링크 메모',
    });
    expect(getDiscoveryLinkRiskyCandidateHintViewProps().title).toContain('제작 후보로 표시');
    expect(getDiscoveryLinkRiskyCandidateHintViewProps().title).not.toContain('제작 후보로 저장');
    expect(getDiscoveryLinkRiskyCandidateHintViewProps().description).toContain('권리 확인 완료를 의미하지 않습니다');
    expect(getDiscoveryLinkSafetyNoticeViewProps().description).toContain('외부 사이트 크롤링을 실행하지 않습니다');
    expect(getDiscoveryLinkSafetyNoticeViewProps().description).toContain('사용 허가나 자동 권리 확인을 의미하지 않습니다');
  });

  it('builds discovery search, loading, and active-filter copy', () => {
    expect(getDiscoveryLinkSearchBoxViewProps()).toMatchObject({
      label: '발견 링크 검색',
      inputPlaceholder: '제목, 메모, URL 검색',
    });
    expect(getDiscoveryLinkSearchBoxViewProps().clearButtonProps.title).toBe('검색어 지우기');
    expect(getDiscoveryLinksLoadingStateViewProps().message).toBe(
      '온라인 발견함(Azure DB)을 불러오는 중입니다. 외부 사이트 수집이나 자동 업로드는 실행하지 않습니다.'
    );
    expect(getDiscoveryLinksActiveFilterSummaryViewProps({ filteredLinkCount: 4 }).message).toBe(
      '현재 조건에 맞는 링크 4개를 보고 있습니다.'
    );
  });

  it('builds discovery header and filter action props as non-collection actions', () => {
    const onOpenProductionCandidates = () => 'open candidates';
    const onRefresh = () => 'refresh';
    const urlList = [['Clip', 'https://example.com']];
    const headerProps = getDiscoveryLinksHeaderActionsViewProps({
      filteredLinkCount: 2,
      loading: true,
      onOpenProductionCandidates,
      onRefresh,
      saving: false,
      urlList,
    });

    expect(headerProps.copyUrlButtonProps).toMatchObject({
      label: 'URL 목록 복사',
      copiedLabel: '목록 복사 완료',
      disabled: false,
      url: urlList,
    });
    expect(headerProps.copyUrlButtonProps.title).toContain('외부 사이트 수집이나 저장 작업은 없습니다');
    expect(headerProps.productionCandidatesButtonLabel).toBe('후보함 보기');
    expect(headerProps.productionCandidatesButtonProps.disabled).toBe(true);
    expect(headerProps.productionCandidatesButtonProps.onClick).toBe(onOpenProductionCandidates);
    expect(headerProps.productionCandidatesButtonProps.title).toContain('새 YouTube API 호출');
    expect(headerProps.productionCandidatesButtonProps.title).toContain('외부 수집은 없습니다');
    expect(headerProps.refreshButtonProps.disabled).toBe(true);
    expect(headerProps.refreshButtonProps.onClick).toBe(onRefresh);
    expect(headerProps.refreshButtonLabel).toBe('새로고침');
    expect(headerProps.isRefreshing).toBe(true);
    expect(getDiscoveryLinksHeaderActionsViewProps({
      filteredLinkCount: 0,
      urlList: [],
    }).copyUrlButtonProps.disabled).toBe(true);
    expect(getDiscoveryStatusFilterGroupViewProps().title).toBe('검토 상태별 보기');
    expect(getDiscoveryRightsFilterGroupViewProps().title).toBe('권리 상태별 보기');
    expect(getDiscoveryStatusFilterButtonProps({ option: { label: '보관', count: 3 } }).title).toBe('보관 상태 링크만 보기');
    expect(getDiscoveryRightsFilterButtonProps({ option: { label: '미확인', count: 5 } })['aria-label']).toBe(
      '미확인 권리 상태 링크 5개 보기'
    );
  });

  it('builds discovery form field and status-control copy', () => {
    expect(getDiscoveryLinkStatusFieldsViewProps().statusField).toMatchObject({
      label: '검토 상태',
    });
    expect(getDiscoveryLinkStatusFieldsViewProps().rightsField.selectProps.title).toContain('사용 허가나 권리 확인 완료');
    expect(getDiscoveryLinkSubmitButtonViewProps({ saving: true }).label).toBe('온라인 저장소(Azure DB) 저장 중');
    expect(getDiscoveryLinkSubmitButtonViewProps({ duplicateLink: { id: 'link-1' } }).label).toBe('이미 저장된 링크');
    expect(getDiscoveryLinkSubmitButtonViewProps().label).toBe('링크 저장');
    expect(getDiscoveryLinkUrlFieldViewProps({
      duplicateLink: { id: 'link-1' },
      urlPreview: { host: 'instagram.com' },
    })).toMatchObject({
      label: '원본 링크',
      previewHostText: '출처 도메인: instagram.com',
      duplicateWarning: {
        title: '이미 온라인 발견함(Azure DB)에 저장된 링크입니다.',
      },
    });
    expect(getDiscoveryLinkStatusControlsViewProps({ title: 'Clip' }).statusSelectProps['aria-label']).toBe(
      'Clip 검토 상태 변경, 온라인 발견함(Azure DB) 기록 저장'
    );
    expect(getDiscoveryLinkActionsNoticeViewProps().message).toContain('외부 사이트를 새로 수집하지 않습니다');
  });

  it('builds discovery badge and updated-at copy', () => {
    expect(getDiscoveryLinkSourceBadgeLabel('instagram.com')).toBe('출처 instagram.com');
    expect(getDiscoveryLinkUpdatedAtViewProps().fallbackText).toBe('기록 없음');
    expect(getDiscoveryLinkUpdatedAtViewProps({ formattedDate: '2026.07.08 19:00' }).message).toBe(
      '마지막 저장: 2026.07.08 19:00'
    );
  });
});
