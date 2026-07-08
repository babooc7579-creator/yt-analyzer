import { describe, expect, it } from 'vitest';

import {
  getProductionKanbanSummaryHeaderProps,
  getProductionKanbanSummaryLegendItems,
} from './productionKanbanSummary';

describe('productionKanbanSummary utils', () => {
  it('builds production kanban header copy as a stored candidate view', () => {
    const props = getProductionKanbanSummaryHeaderProps({
      discoveryLinkCandidateCount: 3,
      videoCount: 7,
    });

    expect(props.eyebrow).toBe('제작 칸반');
    expect(props.title).toContain('제작 후보');
    expect(props.description).toContain('스크랩북 전체가 아니라');
    expect(props.description).toContain('레이더와 발견함');
    expect(props.description).toContain('저장된 데이터 기준');
    expect(props.description).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(props.metric).toBe('영상 7개 관리 · 링크 3개 후보');
  });

  it('separates video records, discovery links, and YouTube API safety in the legend', () => {
    const items = getProductionKanbanSummaryLegendItems();
    const labelsByKey = Object.fromEntries(items.map((item) => [item.key, item.label]));

    expect(labelsByKey['video-records']).toContain('Cloud 판단 기록');
    expect(labelsByKey['video-records']).toContain('제작 상태');
    expect(labelsByKey['discovery-links']).toContain('Cloud 발견함');
    expect(labelsByKey['discovery-links']).toContain('제작 후보');
    expect(labelsByKey['no-youtube-api']).toBe('YouTube API 호출 없음');
  });
});
