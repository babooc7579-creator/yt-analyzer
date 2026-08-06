import { describe, expect, it } from 'vitest';

import {
  annotateSimilarTopicVideos,
  filterVideosByTopicGroup,
  getSimilarTopicGroups,
  getTitleTopicTokens,
} from './similarTopics';

const videos = [
  { videoId: 'v1', title: 'Microsoft Copilot 업무 자동화 완벽 가이드', view_count: 1000 },
  { videoId: 'v2', title: 'Microsoft Copilot 업무 자동화 실제 사용법', view_count: 5000 },
  { videoId: 'v3', title: 'Microsoft Copilot 보안 설정 가이드', view_count: 3000 },
  { videoId: 'v4', title: 'Canva 썸네일 디자인 초보 강의', view_count: 2000 },
];

describe('similar topic grouping', () => {
  it('normalizes titles while removing generic title words', () => {
    expect(getTitleTopicTokens('Microsoft Copilot 업무 자동화 완벽 가이드')).toEqual([
      'copilot', '업무', '자동화',
    ]);
  });

  it('excludes years, pronouns, and recommendation phrasing from topic tokens', () => {
    expect(getTitleTopicTokens('5 Copilot features you should use in 2026')).toEqual([
      'copilot', 'features',
    ]);
  });

  it('groups only titles with at least two sufficiently overlapping topic tokens', () => {
    const groups = getSimilarTopicGroups(videos);

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({ count: 2, label: 'copilot · 업무 · 자동화' });
    expect(groups[0].representativeVideoId).toBe('v1');
    expect(groups[0].videoIds).toEqual(['v1', 'v2']);
  });

  it('ignores words repeated across most of a large result set', () => {
    const repeatedVideos = Array.from({ length: 10 }, (_, index) => ({
      videoId: `common-${index}`,
      title: index < 2
        ? `Microsoft Copilot Excel formula automation ${index}`
        : `Microsoft Copilot distinct topic ${index}`,
    }));

    const groups = getSimilarTopicGroups(repeatedVideos);

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({ count: 2, label: 'excel · formula · automation' });
  });

  it('does not group different SharePoint objects using only generic platform wording', () => {
    const groups = getSimilarTopicGroups([
      { videoId: 'library', title: 'How to Create a Document Library in SharePoint Online' },
      { videoId: 'communication', title: 'How To Create Communication Site in SharePoint Online' },
      { videoId: 'hub', title: 'Create Hub Sites in SharePoint Online' },
    ]);

    expect(groups).toEqual([]);
  });

  it('does not mix Microsoft Lists with an Excel drop-down list', () => {
    const groups = getSimilarTopicGroups([
      { videoId: 'lists', title: 'Microsoft Lists: The Ultimate Tutorial' },
      { videoId: 'excel', title: 'How to Create Drop Down Lists in Microsoft Excel Cells' },
    ]);

    expect(groups).toEqual([]);
  });

  it('adds temporary group metadata without changing unrelated videos', () => {
    const annotated = annotateSimilarTopicVideos(videos);

    expect(annotated[0].similarTopic).toMatchObject({ count: 2, isRepresentative: true });
    expect(annotated[1].similarTopic).toMatchObject({ count: 2, isRepresentative: false });
    expect(annotated[2]).toBe(videos[2]);
    expect(annotated[3]).toBe(videos[3]);
  });

  it('filters only the selected topic group and restores the full list when cleared', () => {
    const groups = getSimilarTopicGroups(videos);

    expect(filterVideosByTopicGroup(videos, groups, groups[0].id).map((video) => video.videoId)).toEqual([
      'v1', 'v2',
    ]);
    expect(filterVideosByTopicGroup(videos, groups, '')).toEqual(videos);
    expect(filterVideosByTopicGroup(videos, groups, 'missing-group')).toEqual(videos);
  });
});
