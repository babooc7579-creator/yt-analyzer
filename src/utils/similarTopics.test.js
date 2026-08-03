import { describe, expect, it } from 'vitest';

import {
  annotateSimilarTopicVideos,
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
      'microsoft', 'copilot', '업무', '자동화',
    ]);
  });

  it('groups only titles with at least two sufficiently overlapping topic tokens', () => {
    const groups = getSimilarTopicGroups(videos);

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({ count: 2, label: 'microsoft · copilot · 업무' });
    expect(groups[0].videoIds).toEqual(['v1', 'v2']);
  });

  it('adds temporary group metadata without changing unrelated videos', () => {
    const annotated = annotateSimilarTopicVideos(videos);

    expect(annotated[0].similarTopic).toMatchObject({ count: 2 });
    expect(annotated[1].similarTopic).toMatchObject({ count: 2 });
    expect(annotated[2]).toBe(videos[2]);
    expect(annotated[3]).toBe(videos[3]);
  });
});
