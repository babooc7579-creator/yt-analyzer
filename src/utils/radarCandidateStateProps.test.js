import { describe, expect, it, vi } from 'vitest';

import {
  getRadarCandidateDecisionActionsViewProps,
  getRadarCandidateCompletedStateViewProps,
  getRadarCandidateEmptyStateViewProps,
  getRadarCandidateProductionButtonActionProps,
  getRadarCandidateProductionButtonProps,
  getRadarCandidateScrapButtonActionProps,
  getRadarCandidateScrapButtonProps,
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

  it('builds radar decision and scrapbook copy as Cloud-only user actions', () => {
    const decisionProps = getRadarCandidateDecisionActionsViewProps();
    const saveProps = getRadarCandidateScrapButtonProps({
      isSaved: false,
      videoTitle: 'Radar clip',
    });
    const unsaveProps = getRadarCandidateScrapButtonProps({
      isSaved: true,
      videoTitle: 'Radar clip',
    });

    expect(decisionProps.descriptionText).toContain('Cloud 판단 기록');
    expect(decisionProps.descriptionText).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(saveProps).toMatchObject({
      buttonText: '소재 보관',
      title: 'Cloud 스크랩북에 소재로 보관합니다',
    });
    expect(saveProps['aria-label']).toContain('Radar clip');
    expect(unsaveProps).toMatchObject({
      buttonText: '보관 해제',
      title: 'Cloud 스크랩북에서 보관을 해제합니다',
    });
    expect(getRadarCandidateScrapButtonProps()['aria-label']).toContain('이 영상');
  });

  it('guards radar production promotion action when video id or handler is missing', () => {
    const onPromoteToProduction = vi.fn();
    const enabledProps = getRadarCandidateProductionButtonActionProps({
      onPromoteToProduction,
      video: { videoId: 'video-1', title: 'Radar clip' },
      videoTitle: 'Radar clip',
    });

    expect(enabledProps.disabled).toBe(false);
    enabledProps.onClick();
    expect(onPromoteToProduction).toHaveBeenCalledWith({ videoId: 'video-1', title: 'Radar clip' });

    const missingIdProps = getRadarCandidateProductionButtonActionProps({
      onPromoteToProduction,
      video: { title: 'No ID' },
    });
    const missingHandlerProps = getRadarCandidateProductionButtonActionProps({
      video: { videoId: 'video-2' },
    });

    expect(missingIdProps.disabled).toBe(true);
    expect(missingIdProps.title).toBe('제작 후보로 저장할 영상 ID가 없어 Cloud 판단 기록 저장을 실행하지 않습니다.');
    expect(missingHandlerProps.disabled).toBe(true);

    missingIdProps.onClick();
    missingHandlerProps.onClick();

    expect(onPromoteToProduction).toHaveBeenCalledTimes(1);
  });

  it('guards radar scrapbook action when video id or handler is missing', () => {
    const onToggleScrap = vi.fn();
    const enabledProps = getRadarCandidateScrapButtonActionProps({
      isSaved: false,
      onToggleScrap,
      video: { videoId: 'video-1', title: 'Radar clip' },
      videoTitle: 'Radar clip',
    });

    expect(enabledProps.disabled).toBe(false);
    enabledProps.onClick();
    expect(onToggleScrap).toHaveBeenCalledWith({ videoId: 'video-1', title: 'Radar clip' });

    const missingIdProps = getRadarCandidateScrapButtonActionProps({
      onToggleScrap,
      video: { title: 'No ID' },
    });
    const missingHandlerProps = getRadarCandidateScrapButtonActionProps({
      video: { videoId: 'video-2' },
    });

    expect(missingIdProps.disabled).toBe(true);
    expect(missingIdProps.title).toBe('보관할 영상 ID가 없어 Cloud 스크랩북 저장을 실행하지 않습니다.');
    expect(missingHandlerProps.disabled).toBe(true);

    missingIdProps.onClick();
    missingHandlerProps.onClick();

    expect(onToggleScrap).toHaveBeenCalledTimes(1);
  });
});
