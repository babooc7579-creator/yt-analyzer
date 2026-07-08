import { describe, expect, it } from 'vitest';

import {
  getRadarCandidateCompletedStateViewProps,
  getRadarCandidateEmptyStateViewProps,
  getRadarCandidateProductionButtonProps,
} from './radarCandidateStateProps';

describe('radarCandidateStateProps utils', () => {
  it('describes the completed radar state as Cloud decision records', () => {
    const props = getRadarCandidateCompletedStateViewProps();

    expect(props.titleText).toBe('오늘 볼 후보를 모두 처리했습니다');
    expect(props.descriptionText).toContain('Cloud 판단 기록');
    expect(props.descriptionText).toContain('오늘의 레이더에서 숨겨집니다');
    expect(props.openVaultButtonProps).toMatchObject({
      label: '레퍼런스 금고 열기',
      title: '저장된 영상 조회 화면으로 이동',
    });
    expect(props.clearDecisionsButtonProps['aria-label']).toContain('Cloud에 저장된');
  });

  it('describes the empty radar state as stored-video lookup guidance', () => {
    const props = getRadarCandidateEmptyStateViewProps();

    expect(props.titleText).toBe('오늘 볼 후보');
    expect(props.descriptionText).toContain('저장된 영상');
    expect(props.openVaultButtonProps.label).toBe('레퍼런스 금고 열기');
  });

  it('builds production promotion button copy without implying a YouTube API call', () => {
    const props = getRadarCandidateProductionButtonProps({
      videoTitle: 'Radar clip',
    });

    expect(props.label).toBe('제작 후보로');
    expect(props.title).toContain('Cloud 판단 기록');
    expect(props.title).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(props['aria-label']).toContain('Radar clip');

    expect(getRadarCandidateProductionButtonProps()['aria-label']).toContain('이 영상');
  });
});
