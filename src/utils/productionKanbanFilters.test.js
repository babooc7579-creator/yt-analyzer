import { describe, expect, it } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import {
  PRODUCTION_KANBAN_FILTER,
  getFilteredProductionKanbanData,
  getProductionKanbanFilterSummary,
  getProductionKanbanSearchContext,
  matchesProductionLinkSearch,
  matchesProductionVideoSearch,
} from './productionKanbanFilters';

const videos = {
  candidate: { videoId: 'candidate', title: 'Concrete desk', channelTitle: 'Build Lab' },
  active: { videoId: 'active', title: 'Kitchen trick', channelTitle: 'Home Lab' },
  done: { videoId: 'done', title: 'Finished clip', channelTitle: 'Archive' },
  focus: { videoId: 'focus', title: 'Today idea', channelTitle: 'Focus Lab' },
};

const createDataModel = () => ({
  discoveryLinkCandidates: [
    { id: 'link-1', title: 'Instagram hook', url: 'https://instagram.com/p/1' },
  ],
  focusVideos: [videos.focus],
  groupedVideos: {
    [PRODUCTION_STATUS.CANDIDATE]: [videos.candidate],
    [PRODUCTION_STATUS.ACTIVE]: [videos.active],
    [PRODUCTION_STATUS.DONE]: [videos.done],
  },
  productionSummary: { videoCount: 4 },
});

const videoUserRecords = {
  active: { draftTitle: 'Quick recipe', note: 'Show result first', targetPublishDate: '2026-07-20' },
};

describe('productionKanbanFilters', () => {
  it('labels a calendar-originated search without changing production data', () => {
    expect(getProductionKanbanSearchContext({
      searchQuery: '예약 영상',
      source: 'upload-calendar',
    })).toEqual({
      description: '업로드 캘린더에서 선택한 "예약 영상" 항목을 찾고 있습니다. 검색을 해제하면 전체 제작 작업을 다시 볼 수 있습니다.',
      label: '캘린더에서 가져온 검색',
      resetLabel: '전체 작업 보기',
      resetTitle: '캘린더에서 가져온 화면 검색만 해제합니다. Cloud 데이터는 변경하지 않습니다.',
      returnLabel: '캘린더로 돌아가기',
      returnTarget: 'upload-calendar',
      returnTitle: '업로드 캘린더로 돌아갑니다. 화면 이동만 하며 Cloud 데이터는 변경하지 않습니다.',
    });
    expect(getProductionKanbanSearchContext({ searchQuery: '예약 영상' })).toBeNull();
    expect(getProductionKanbanSearchContext({ source: 'upload-calendar' })).toBeNull();

    expect(getProductionKanbanSearchContext({
      searchQuery: '예약 영상',
      source: 'upload-calendar',
      targetVideoId: 'video-1',
    })?.description).toContain('영상 한 건을');
  });

  it('labels a radar-originated candidate and keeps a route back to the radar', () => {
    expect(getProductionKanbanSearchContext({
      searchQuery: '오늘 만들 영상',
      source: 'today-radar',
      targetVideoId: 'video-1',
    })).toEqual({
      description: '오늘의 레이더에서 제작 후보로 표시한 "오늘 만들 영상" 영상 한 건을 바로 보여주고 있습니다. 검색을 해제하면 전체 제작 작업을 다시 볼 수 있습니다.',
      label: '오늘의 레이더에서 이어온 후보',
      resetLabel: '전체 작업 보기',
      resetTitle: '오늘의 레이더에서 이어온 후보 검색만 해제합니다. Cloud 데이터는 변경하지 않습니다.',
      returnLabel: '오늘의 레이더로 돌아가기',
      returnTarget: 'home',
      returnTitle: '오늘의 레이더로 돌아갑니다. 화면 이동만 하며 Cloud 데이터는 변경하지 않습니다.',
    });
  });

  it('searches source metadata and current production draft values', () => {
    expect(matchesProductionVideoSearch({
      searchQuery: 'build lab',
      video: videos.candidate,
      videoUserRecords,
    })).toBe(true);
    expect(matchesProductionVideoSearch({
      searchQuery: 'result first',
      video: videos.active,
      videoUserRecords,
    })).toBe(true);
    expect(matchesProductionVideoSearch({
      searchQuery: 'missing',
      video: videos.active,
      videoUserRecords,
    })).toBe(false);
  });

  it('searches manually saved discovery link fields', () => {
    expect(matchesProductionLinkSearch({
      link: { title: 'Hook idea', url: 'https://instagram.com/p/1' },
      searchQuery: 'instagram',
    })).toBe(true);
    expect(matchesProductionLinkSearch({
      link: { memo: 'Opening scene' },
      searchQuery: 'opening',
    })).toBe(true);
  });

  it('keeps only the selected production stage without changing records', () => {
    const dataModel = createDataModel();
    const filtered = getFilteredProductionKanbanData({
      dataModel,
      filterMode: PRODUCTION_KANBAN_FILTER.ACTIVE,
      today: '2026-07-13',
      videoUserRecords,
    });

    expect(filtered.focusVideos).toEqual([]);
    expect(filtered.groupedVideos[PRODUCTION_STATUS.CANDIDATE]).toEqual([]);
    expect(filtered.groupedVideos[PRODUCTION_STATUS.ACTIVE]).toEqual([videos.active]);
    expect(filtered.groupedVideos[PRODUCTION_STATUS.DONE]).toEqual([]);
    expect(filtered.discoveryLinkCandidates).toEqual([]);
    expect(filtered.productionSummary.videoCount).toBe(1);
    expect(filtered.productionSummary.nextScheduled).toMatchObject({
      date: '2026-07-20',
      video: videos.active,
    });
    expect(dataModel.groupedVideos[PRODUCTION_STATUS.CANDIDATE]).toEqual([videos.candidate]);
  });

  it('supports today focus, discovery links, and text filtering independently', () => {
    const focus = getFilteredProductionKanbanData({
      dataModel: createDataModel(),
      filterMode: PRODUCTION_KANBAN_FILTER.FOCUS,
    });
    const links = getFilteredProductionKanbanData({
      dataModel: createDataModel(),
      filterMode: PRODUCTION_KANBAN_FILTER.LINKS,
      searchQuery: 'hook',
    });

    expect(focus.focusVideos).toEqual([videos.focus]);
    expect(focus.productionSummary.videoCount).toBe(1);
    expect(links.productionSummary.videoCount).toBe(0);
    expect(links.discoveryLinkCandidates).toHaveLength(1);
  });

  it('limits a calendar-originated lookup to the selected video id', () => {
    const duplicateTitleModel = createDataModel();
    duplicateTitleModel.groupedVideos[PRODUCTION_STATUS.CANDIDATE] = [
      { videoId: 'first', title: '같은 제목' },
      { videoId: 'second', title: '같은 제목' },
    ];

    const filtered = getFilteredProductionKanbanData({
      dataModel: duplicateTitleModel,
      searchQuery: '같은 제목',
      targetVideoId: 'second',
    });

    expect(filtered.groupedVideos[PRODUCTION_STATUS.CANDIDATE]).toEqual([
      { videoId: 'second', title: '같은 제목' },
    ]);
    expect(filtered.discoveryLinkCandidates).toEqual([]);
  });

  it('reports visible work counts and active filter state', () => {
    const dataModel = createDataModel();
    const filteredDataModel = getFilteredProductionKanbanData({
      dataModel,
      filterMode: PRODUCTION_KANBAN_FILTER.ACTIVE,
      videoUserRecords,
    });

    expect(getProductionKanbanFilterSummary({ dataModel, filteredDataModel })).toEqual({
      hasActiveFilters: false,
      metricText: '작업 항목 5개',
      totalCount: 5,
      visibleCount: 1,
    });
    expect(getProductionKanbanFilterSummary({
      dataModel,
      filteredDataModel,
      filterMode: PRODUCTION_KANBAN_FILTER.ACTIVE,
    })).toEqual({
      hasActiveFilters: true,
      metricText: '전체 5개 중 1개 표시',
      totalCount: 5,
      visibleCount: 1,
    });
  });
});
