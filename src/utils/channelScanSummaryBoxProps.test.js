import { describe, expect, it } from 'vitest';

import { getChannelScanSummaryBoxViewProps } from './channelScanSummaryBoxProps';

describe('channelScanSummaryBoxProps utils', () => {
  it('builds summary box props with coverage and error details', () => {
    const props = getChannelScanSummaryBoxViewProps({
      hasSummary: true,
      newVideosFound: '3',
      statsRefreshed: '12',
      coverageRate: '87.5%',
      error: 'quota warning',
      scannedText: '2시간 전',
      statusMeta: {
        className: 'border-amber-200 text-amber-700',
        label: 'partial',
      },
    });

    expect(props).toMatchObject({
      summaryText: '새 영상 3 · 갱신 12 · 87.5% · quota warning',
      summaryTitle: 'quota warning',
      scannedText: '최근 수집: 2시간 전',
      statusBadgeProps: {
        label: 'partial',
      },
    });
    expect(props.statusBadgeProps.className).toContain('border-amber-200');
    expect(props.statusBadgeProps.className).toContain('rounded-full');
  });

  it('omits optional coverage and error text when they are missing', () => {
    const props = getChannelScanSummaryBoxViewProps({
      hasSummary: true,
      newVideosFound: '0',
      statsRefreshed: '5',
      coverageRate: null,
      error: null,
      scannedText: '방금 전',
      statusMeta: {
        className: 'border-emerald-200 text-emerald-700',
        label: 'success',
      },
    });

    expect(props.summaryText).toBe('새 영상 0 · 갱신 5');
    expect(props.summaryTitle).toBeUndefined();
    expect(props.scannedText).toBe('최근 수집: 방금 전');
    expect(props.statusBadgeProps.label).toBe('success');
  });

  it('shows a no-summary message while preserving scan status badge props', () => {
    const props = getChannelScanSummaryBoxViewProps({
      hasSummary: false,
      newVideosFound: '-',
      statsRefreshed: '-',
      coverageRate: null,
      error: null,
      scannedText: '미수집',
      statusMeta: {
        className: 'border-slate-200 text-slate-500',
        label: '미수집',
      },
    });

    expect(props).toMatchObject({
      summaryText: '수집 요약 없음',
      summaryTitle: undefined,
      scannedText: '최근 수집: 미수집',
      statusBadgeProps: {
        label: '미수집',
      },
    });
    expect(props.statusBadgeProps.className).toContain('border-slate-200');
  });
});
