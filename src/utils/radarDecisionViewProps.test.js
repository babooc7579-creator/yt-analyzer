import { describe, expect, it } from 'vitest';

import {
  getRadarCandidateStripHeaderViewProps,
  getRadarDecisionListsViewProps,
} from './radarDecisionViewProps';

describe('radarDecisionViewProps utils', () => {
  it('builds radar strip header copy and summary items from queue summary', () => {
    const props = getRadarCandidateStripHeaderViewProps({
      allDecisionCount: 5,
      queueSummary: {
        candidateLimit: 6,
        hiddenDecisionCount: 4,
        highPriorityCount: 2,
        shownCandidateCount: 3,
        visibleQueueCount: 9,
      },
      savedVideoCount: 7,
    });

    expect(props.title).toBe('오늘 볼 후보');
    expect(props.description).toContain('새 YouTube 스캔이 아니라');
    expect(props.queueHint).toContain('다음 미판단 후보가 자동으로 들어옵니다');
    expect(props.queueHint).toContain('별도의 다음 버튼 없이');
    expect(props.summaryItems).toEqual([
      { label: '남은 후보', value: '9개' },
      { label: '화면 후보', value: '3/6' },
      { label: '우선 검토', value: '2개' },
      { label: '판단 기록', value: '4개' },
    ]);
    expect(props.clearButtonProps).toMatchObject({
      label: '판단 초기화',
      show: true,
      title: 'Cloud에 저장된 오늘 판단 기록을 초기화합니다',
    });
    expect(props.scrapbookButtonProps['aria-label']).toContain('스크랩 7개');
  });

  it('hides the clear decision button when there are no decisions', () => {
    expect(getRadarCandidateStripHeaderViewProps({
      allDecisionCount: 0,
    }).clearButtonProps.show).toBe(false);
  });

  it('returns null for decision lists when no loaded decisions exist', () => {
    expect(getRadarDecisionListsViewProps({
      loadedDecisionCount: 0,
    })).toBeNull();
  });

  it('builds decision list groups with restore copy and overflow labels', () => {
    const props = getRadarDecisionListsViewProps({
      loadedDecisionCount: 4,
      groups: [
        {
          key: 'reviewed',
          label: '봤음',
          videos: [
            { videoId: 'a', title: 'A' },
            { videoId: 'b', title: 'B' },
            { videoId: 'c', title: 'C' },
            { videoId: 'd', title: 'D' },
          ],
        },
      ],
    });

    expect(props.title).toBe('처리 기록');
    expect(props.description).toContain('다시 레이더로 돌릴 수 있습니다');
    expect(props.groups[0]).toMatchObject({
      emptyText: '아직 없음',
      groupKey: 'reviewed',
      label: '봤음',
      overflowText: '외 1개',
    });
    expect(props.groups[0].videos).toHaveLength(3);
    expect(props.groups[0].videos[0]).toMatchObject({
      videoTitle: 'A',
      videoUrl: 'https://youtube.com/watch?v=a',
    });
    expect(props.groups[0].videos[0].restoreButtonProps).toMatchObject({
      label: '레이더로 되돌리기',
      title: '이 영상을 오늘 레이더 후보로 다시 표시',
    });
    expect(props.groups[0].videos[0].titleLinkProps['aria-label']).toContain('YouTube 원본 영상 열기');
  });
});
