import { describe, expect, it } from 'vitest';

import {
  getHomeRadarWorkflowCards,
  getHomeRadarWorkflowSectionHeaderProps,
} from './homeRadarWorkflowSection';

describe('homeRadarWorkflowSection utils', () => {
  it('explains the home radar workflow as DB lookup, candidate judgment, and production handoff', () => {
    const headerProps = getHomeRadarWorkflowSectionHeaderProps();

    expect(headerProps.eyebrow).toBe('오늘 작업 흐름');
    expect(headerProps.description).toContain('수집된 영상 정보');
    expect(headerProps.description).toContain('레이더 후보');
    expect(headerProps.description).toContain('제작 후보로 표시');
    expect(headerProps.description).not.toContain('제작 후보로 넘깁니다');
    expect(headerProps.safetyNote).toContain('온라인 저장소(Azure DB) 조회');
    expect(headerProps.safetyNote).toContain('판단 기록 저장');
    expect(headerProps.safetyNote).toContain('선택 채널 새 영상 수집 버튼에서만 실행');
  });

  it('keeps stored video loading and radar judgment copy separate from YouTube API collection', () => {
    const [loadCard, judgeCard] = getHomeRadarWorkflowCards({
      loadedVideoCount: 17,
      openRadarCandidateCount: 4,
    });

    expect(loadCard).toMatchObject({
      key: 'load-stored-videos',
      title: '1. 수집 영상 목록 불러오기',
      value: '17개',
    });
    expect(loadCard.description).toContain('온라인 저장소(Azure DB)');
    expect(loadCard.description).toContain('새 YouTube API 호출은 없습니다');

    expect(judgeCard).toMatchObject({
      key: 'judge-radar-candidates',
      title: '2. 오늘 후보 판단',
      value: '4개 남음',
    });
    expect(judgeCard.description).toContain('점수순');
    expect(judgeCard.description).toContain('온라인 저장소(Azure DB)의 판단 기록');
    expect(judgeCard.description).toContain('오늘 레이더에서 숨겨집니다');
  });
});
