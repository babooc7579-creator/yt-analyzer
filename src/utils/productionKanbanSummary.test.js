import { describe, expect, it } from 'vitest';

import {
  getProductionKanbanScheduleSummaryViewProps,
  getProductionKanbanPriorityGuideProps,
  getProductionKanbanSummaryHeaderProps,
  getProductionKanbanSummaryLegendItems,
  getProductionKanbanSummaryMetricCards,
} from './productionKanbanSummary';
import { PRODUCTION_KANBAN_FILTER } from './productionKanbanFilters';

describe('productionKanbanSummary utils', () => {
  it('builds production kanban header copy as a stored candidate view', () => {
    const props = getProductionKanbanSummaryHeaderProps({
      discoveryLinkCandidateCount: 3,
      videoCount: 7,
    });

    expect(props.eyebrow).toBe('제작 칸반');
    expect(props.title).toBe('제작 후보를 실제 작업 순서로 정리합니다');
    expect(props.title).not.toContain('넘깁니다');
    expect(props.description).toContain('오늘 무엇을 만들지');
    expect(props.description).toContain('소재 보관함 전체를 자동으로 끌어오지 않고');
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

    expect(labelsByKey['video-records']).toContain('온라인 저장소(Azure DB)의 판단 기록');
    expect(labelsByKey['video-records']).toContain('제작 상태');
    expect(labelsByKey['discovery-links']).toContain('온라인 발견함(Azure DB)');
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
    expect(cards[0].title).toContain('온라인 저장소(Azure DB)의 판단 기록');
    expect(cards[0].title).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(cards[3].title).toContain('온라인 발견함(Azure DB)');
    expect(cards[3].title).toContain('별도 제작 DB');
    expect(cards[3].warningText).toBe('권리 확인 필요 1개');
    expect(cards.map(card => card.filterMode)).toEqual([
      PRODUCTION_KANBAN_FILTER.CANDIDATE,
      PRODUCTION_KANBAN_FILTER.ACTIVE,
      PRODUCTION_KANBAN_FILTER.DONE,
      PRODUCTION_KANBAN_FILTER.LINKS,
    ]);
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

  it('builds a priority guide for the next production decision', () => {
    expect(getProductionKanbanPriorityGuideProps({
      productionSummary: { discoveryRightsWarningCount: 2 },
    })).toMatchObject({
      actionFilterMode: PRODUCTION_KANBAN_FILTER.LINKS,
      actionLabel: '권리 확인 링크 보기',
      badge: '권리 확인',
      nextAction: '오늘 순서: 원본 링크 열기 → 출처/권리 확인 → 사용 가능 또는 제외로 정리',
      tone: 'warning',
    });

    expect(getProductionKanbanPriorityGuideProps({
      productionSummary: { overdueCount: 1 },
    })).toMatchObject({
      actionLabel: '업로드 일정 열기',
      actionTarget: 'upload-calendar',
    });
    expect(getProductionKanbanPriorityGuideProps({
      productionSummary: { overdueCount: 1 },
    }).title).toContain('지난 업로드 예정일');
    expect(getProductionKanbanPriorityGuideProps({
      productionSummary: { overdueCount: 1 },
    }).nextAction).toContain('완료/일정 변경/후보 제외');

    expect(getProductionKanbanPriorityGuideProps({
      productionSummary: { activeWithoutDate: 3 },
    })).toMatchObject({
      actionFilterMode: PRODUCTION_KANBAN_FILTER.ACTIVE,
      actionLabel: '일정 없는 제작 중 보기',
    });
    expect(getProductionKanbanPriorityGuideProps({
      productionSummary: { activeWithoutDate: 3 },
    }).description).toContain('일정이 없는 영상 3개');
    expect(getProductionKanbanPriorityGuideProps({
      productionSummary: { activeWithoutDate: 3 },
    }).nextAction).toContain('업로드 예정일 입력');

    expect(getProductionKanbanPriorityGuideProps({
      productionSummary: { activeCount: 2 },
    })).toMatchObject({
      actionFilterMode: PRODUCTION_KANBAN_FILTER.ACTIVE,
      actionLabel: '제작 중 작업 보기',
      badge: '제작 진행',
      nextAction: '오늘 순서: 제작 중 후보 하나 선택 → 부족한 준비 항목 채우기 → 업로드 완료로 이동',
      tone: 'ready',
    });

    expect(getProductionKanbanPriorityGuideProps({
      productionSummary: { candidateCount: 4 },
    })).toMatchObject({
      actionFilterMode: PRODUCTION_KANBAN_FILTER.CANDIDATE,
      actionLabel: '제작 후보 보기',
    });
    expect(getProductionKanbanPriorityGuideProps({
      productionSummary: { candidateCount: 4 },
    }).description).toContain('영상 후보 4개');
    expect(getProductionKanbanPriorityGuideProps({
      productionSummary: { candidateCount: 4 },
    }).nextAction).toContain('하나만 제작 중으로 이동');

    expect(getProductionKanbanPriorityGuideProps({
      discoveryLinkCandidateCount: 5,
      productionSummary: {},
    })).toMatchObject({
      actionFilterMode: PRODUCTION_KANBAN_FILTER.LINKS,
      actionLabel: '링크 후보 보기',
    });
    expect(getProductionKanbanPriorityGuideProps({
      discoveryLinkCandidateCount: 5,
      productionSummary: {},
    }).description).toContain('링크 후보 5개');
    expect(getProductionKanbanPriorityGuideProps({
      discoveryLinkCandidateCount: 5,
      productionSummary: {},
    }).nextAction).toContain('영상 후보와 따로 판단');

    expect(getProductionKanbanPriorityGuideProps().description).toContain('새 YouTube API 호출');
    expect(getProductionKanbanPriorityGuideProps().nextAction).toContain('오늘 레이더');
  });
});
