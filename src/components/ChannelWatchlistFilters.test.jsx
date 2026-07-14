import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ChannelWatchlistFilters from './ChannelWatchlistFilters';

describe('ChannelWatchlistFilters', () => {
  it('keeps the primary narrowing controls in the intended workflow order', () => {
    const html = renderToStaticMarkup(
      <ChannelWatchlistFilters
        gradeFilter="all"
        hasActiveFilters={false}
        onChangeGradeFilter={() => {}}
        onChangeScanFilter={() => {}}
        onChangeSearchQuery={() => {}}
        onChangeSelectionFilter={() => {}}
        onChangeTagFilter={() => {}}
        onResetFilters={() => {}}
        scanFilter="all"
        searchQuery=""
        selectionFilter="all"
        tagFilter="all"
        tagOptions={[{ value: 'ranking', label: '랭킹형 (7)' }]}
      />,
    );

    const searchIndex = html.indexOf('채널 이름 또는 태그 검색');
    const categoryIndex = html.indexOf('채널 분류 필터');
    const gradeIndex = html.indexOf('채널 등급 필터');
    const scanIndex = html.indexOf('마지막 수집일 필터');
    const selectionIndex = html.indexOf('채널 선택 상태 필터');

    expect(searchIndex).toBeGreaterThanOrEqual(0);
    expect(categoryIndex).toBeGreaterThan(searchIndex);
    expect(gradeIndex).toBeGreaterThan(categoryIndex);
    expect(scanIndex).toBeGreaterThan(gradeIndex);
    expect(selectionIndex).toBeGreaterThan(scanIndex);
  });
});
