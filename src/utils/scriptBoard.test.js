import { describe, expect, it } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import {
  getScriptBoardEmptyState,
  getScriptBoardItems,
  getScriptBoardSummary,
  getScriptBoardVisibleItems,
} from './scriptBoard';

const videos = [
  { videoId: 'candidate', title: '원본 후보', channel_title: '랭킹 채널', multiplier: 8 },
  { videoId: 'active', title: '제작 중 원본', channel_title: '예능 채널', multiplier: 2 },
  { videoId: 'done', title: '완료 원본', channel_title: '영화 채널', multiplier: 3 },
  { videoId: 'plain', title: '일반 수집 영상' },
];

describe('scriptBoard utils', () => {
  it('builds a focused writing list from existing production records', () => {
    const items = getScriptBoardItems({
      videoUserRecords: {
        candidate: {
          status: PRODUCTION_STATUS.CANDIDATE,
          draftTitle: '내가 만들 랭킹',
          focusPinnedAt: '2026-07-26T01:00:00.000Z',
        },
        active: {
          statusIds: [PRODUCTION_STATUS.ACTIVE],
          note: '첫 3초 훅',
          targetPublishDate: '2026-07-30',
        },
        done: { status: PRODUCTION_STATUS.DONE },
        plain: { status: 'reference_material' },
      },
      videos,
    });

    expect(items.map((item) => item.id)).toEqual(['candidate', 'active', 'done']);
    expect(items[0]).toMatchObject({
      groupStatus: PRODUCTION_STATUS.CANDIDATE,
      isFocus: true,
      statusLabel: '제작 후보',
    });
    expect(items[1]).toMatchObject({
      groupStatus: PRODUCTION_STATUS.ACTIVE,
      statusLabel: '제작 중',
    });
  });

  it('filters by progress and searches source plus draft text', () => {
    const items = getScriptBoardItems({
      videoUserRecords: {
        candidate: { status: PRODUCTION_STATUS.CANDIDATE, draftTitle: '내 제목' },
        active: { statusIds: [PRODUCTION_STATUS.ACTIVE], note: '인트로 훅' },
      },
      videos,
    });

    expect(getScriptBoardVisibleItems({
      filterMode: PRODUCTION_STATUS.ACTIVE,
      items,
    }).map((item) => item.id)).toEqual(['active']);
    expect(getScriptBoardVisibleItems({
      items,
      searchQuery: '랭킹 채널',
    }).map((item) => item.id)).toEqual(['candidate']);
    expect(getScriptBoardVisibleItems({
      items,
      searchQuery: '인트로',
    }).map((item) => item.id)).toEqual(['active']);
  });

  it('summarizes stages and distinguishes source-empty from filter-empty', () => {
    const items = getScriptBoardItems({
      videoUserRecords: {
        candidate: { status: PRODUCTION_STATUS.CANDIDATE, focusPinnedAt: '2026-07-26T01:00:00.000Z' },
        active: { status: PRODUCTION_STATUS.ACTIVE },
        done: { status: PRODUCTION_STATUS.DONE },
      },
      videos,
    });

    expect(getScriptBoardSummary(items)).toEqual({
      activeCount: 1,
      candidateCount: 1,
      doneCount: 1,
      focusCount: 1,
      totalCount: 3,
    });
    expect(getScriptBoardEmptyState({ totalCount: 0, visibleCount: 0 })).toMatchObject({
      actionLabel: '제작 후보 고르기',
      type: 'source',
    });
    expect(getScriptBoardEmptyState({ totalCount: 3, visibleCount: 0 })).toMatchObject({
      actionLabel: '전체 작업 보기',
      type: 'filter',
    });
  });
});
