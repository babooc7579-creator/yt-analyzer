import { describe, expect, it } from 'vitest';

import {
  getProductionKanbanScheduleSummaryViewProps,
  getProductionKanbanSummaryHeaderProps,
  getProductionKanbanSummaryLegendItems,
  getProductionKanbanSummaryMetricCards,
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
    expect(props.description).toContain('제작 후보로 표시한 항목');
    expect(props.description).not.toContain('제작 후보로 지정한');
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

  it('builds metric card copy for videos and discovery links', () => {
    const cards = getProductionKanbanSummaryMetricCards({
      discoveryLinkCandidateCount: 4,
      productionSummary: {
        activeCount: 2,
        candidateCount: 3,
        discoveryRightsWarningCount: 1,
        uploadedCount: 5,
      },
    });

    expect(cards.map(card => [card.key, card.label, card.value])).toEqual([
      ['candidate', '제작 후보', '3개'],
      ['active', '제작 중', '2개'],
      ['uploaded', '업로드 완료', '5개'],
      ['discovery-links', '링크 후보', '4개'],
    ]);
    expect(cards[3].showLinkIcon).toBe(true);
    expect(cards[3].warningText).toBe('권리 확인 필요 1개');
  });

  it('builds schedule summary copy from the production summary', () => {
    expect(getProductionKanbanScheduleSummaryViewProps({
      productionSummary: {
        activeWithoutDate: 2,
        nextScheduled: {
          date: '2026-07-08',
          video: { title: 'Clip' },
        },
        overdueCount: 1,
      },
    })).toMatchObject({
      activeWithoutDateText: '제작 중 2개 일정 미정',
      label: '다음 일정',
      nextScheduledText: '2026.07.08',
      nextScheduledTitle: 'Clip',
      overdueText: '지난 일정 1개 확인 필요',
    });

    expect(getProductionKanbanScheduleSummaryViewProps().nextScheduledText).toBe('일정 없음');
  });
});
