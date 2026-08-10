import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import VideoToolbar from './VideoToolbar';

describe('VideoToolbar layout', () => {
  it('keeps filters and quick views together while reserving a fixed scan column', () => {
    const noop = vi.fn();
    const html = renderToStaticMarkup(
      <VideoToolbar
        activeSelectedChannelCount={0}
        filteredCount={0}
        filteredVideoUrlList=""
        handleManualScan={noop}
        isReferenceVaultView
        isScanning={false}
        lengthFilter="all"
        onResetFilters={noop}
        quickFilter="all"
        quickFilterCounts={{ recent30: null, oldPopular: null, ttoTto: null }}
        scannableChannelCount={0}
        searchKeyword=""
        selectedChannelCount={0}
        selectedVideoCount={0}
        setLengthFilter={noop}
        setQuickFilter={noop}
        setSearchKeyword={noop}
        setShowWorkPanel={noop}
        setSortType={noop}
        setTtoTtoMode={noop}
        setViewFilter={noop}
        setViewMode={noop}
        showWorkPanel={false}
        sortType="recommended"
        totalCount={0}
        ttoTtoMode={false}
        viewFilter="all"
        viewMode="card"
      />,
    );

    expect(html).toContain('2xl:grid-cols-[minmax(0,1fr)_22rem]');
    expect(html).not.toContain('2xl:flex-row');
    expect(html.indexOf('수집 영상 빠른 필터')).toBeLessThan(html.indexOf('channel-operations-scan'));
    expect(html).toContain('버튼 결과');
    expect(html).toContain('제작 후보로 → 제작 후보함');
    expect(html).toContain('소재 보관 → 소재 보관함');
  });
});
