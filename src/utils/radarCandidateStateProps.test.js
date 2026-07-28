import { describe, expect, it, vi } from 'vitest';

import {
  getRadarCandidateActionErrorMessage,
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
    expect(props.descriptionText).toContain('온라인 저장소(Azure DB)의 판단 기록');
    expect(props.descriptionText).toContain('오늘의 레이더에서 숨겨집니다');
    expect(props.descriptionText).toContain('제작 후보함');
    expect(props.openVaultButtonProps).toMatchObject({
      label: '레퍼런스 금고 열기',
      title: '수집된 영상 정보 조회 화면으로 이동',
    });
    expect(props.openProductionButtonProps).toMatchObject({
      label: '제작 후보함 열기',
      title: '제작 후보로 표시한 영상과 발견함 링크를 확인합니다. 저장된 후보 조회이며 YouTube API를 새로 호출하지 않습니다.',
    });
    expect(props.openProductionButtonProps['aria-label']).toContain('YouTube API 호출 없음');
    expect(props.clearDecisionsButtonProps['aria-label']).toContain('온라인 저장소(Azure DB)에 저장된');
  });

  it('describes the empty radar state as stored-video lookup guidance', () => {
    const props = getRadarCandidateEmptyStateViewProps({ selectedChannelCount: 2 });

    expect(props.titleText).toBe('오늘 볼 후보');
    expect(props.descriptionText).toContain('수집 영상');
    expect(props.descriptionText).toContain('선택한 채널 2개');
    expect(props.descriptionText).toContain('YouTube API는 호출하지 않습니다');
    expect(props.channelWatchlistButtonProps.show).toBe(false);
    expect(props.openVaultButtonProps.label).toBe('레퍼런스 금고 열기');
  });

  it('guides users without selected channels to the channel watchlist first', () => {
    const props = getRadarCandidateEmptyStateViewProps();

    expect(props.descriptionText).toContain('아직 선택한 채널이 없습니다');
    expect(props.descriptionText).toContain('채널 선택만으로 YouTube API를 호출하지 않습니다');
    expect(props.channelWatchlistButtonProps).toMatchObject({
      label: '오늘 볼 채널 고르기',
      show: true,
    });
  });

  it('builds production promotion button copy without implying a YouTube API call', () => {
    const props = getRadarCandidateProductionButtonProps({
      videoTitle: 'Radar clip',
    });

    expect(props.label).toBe('제작 후보로');
    expect(props.title).toContain('온라인 저장소(Azure DB)의 판단 기록');
    expect(props.title).toContain('제작 후보로 표시');
    expect(props.title).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(props['aria-label']).toContain('Radar clip');
    expect(props['aria-label']).toContain('제작 후보로 표시');
    expect(props.title).not.toContain('제작 후보로 저장');

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

    expect(decisionProps.descriptionText).toContain('온라인 저장소(Azure DB)의 판단 기록');
    expect(decisionProps.descriptionText).toContain('만들 만하면 제작 후보로');
    expect(decisionProps.descriptionText).toContain('다음 후보가 자동으로 이어집니다');
    expect(decisionProps.descriptionText).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(saveProps).toMatchObject({
      buttonText: '소재 보관',
      title: '온라인 스크랩북(Azure DB)에 소재로 보관합니다',
    });
    expect(saveProps['aria-label']).toContain('Radar clip');
    expect(unsaveProps).toMatchObject({
      buttonText: '보관 해제',
      title: '온라인 스크랩북(Azure DB)에서 보관을 해제합니다',
    });
    expect(getRadarCandidateScrapButtonProps()['aria-label']).toContain('이 영상');
  });

  it('describes and locks radar actions while a Cloud save is pending', () => {
    const productionPending = getRadarCandidateDecisionActionsViewProps({
      pendingAction: 'production',
    });
    const statusPending = getRadarCandidateDecisionActionsViewProps({
      pendingAction: 'status',
    });
    const promotionProps = getRadarCandidateProductionButtonActionProps({
      onPromoteToProduction: vi.fn(),
      saving: true,
      video: { videoId: 'video-1' },
    });
    const scrapbookProps = getRadarCandidateScrapButtonActionProps({
      onToggleScrap: vi.fn(),
      saving: true,
      video: { videoId: 'video-1' },
    });

    expect(productionPending.pendingText).toContain('제작 후보 표시를 온라인 저장소(Azure DB)에 저장하는 중');
    expect(statusPending.pendingText).toContain('영상 판단 기록을 온라인 저장소(Azure DB)에 저장하는 중');
    expect(getRadarCandidateDecisionActionsViewProps().pendingText).toBe('');
    expect(promotionProps.disabled).toBe(true);
    expect(scrapbookProps.disabled).toBe(true);
    expect(promotionProps.title).toContain('저장이 끝날 때까지');
    expect(scrapbookProps.title).toContain('저장이 끝날 때까지');
  });

  it('explains Cloud failures for each radar decision action', () => {
    expect(getRadarCandidateActionErrorMessage('production')).toContain('제작 후보 표시');
    expect(getRadarCandidateActionErrorMessage('scrapbook')).toContain('소재 보관 상태');
    expect(getRadarCandidateActionErrorMessage('status')).toContain('영상 판단');
    expect(getRadarCandidateActionErrorMessage('unknown')).toContain('온라인 저장소(Azure DB) 저장');
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
    expect(missingIdProps.title).toBe('제작 후보로 표시할 영상 ID가 없어 온라인 저장소(Azure DB)의 판단 기록 저장을 실행하지 않습니다.');
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
    expect(missingIdProps.title).toBe('보관할 영상 ID가 없어 온라인 스크랩북(Azure DB) 저장을 실행하지 않습니다.');
    expect(missingHandlerProps.disabled).toBe(true);

    missingIdProps.onClick();
    missingHandlerProps.onClick();

    expect(onToggleScrap).toHaveBeenCalledTimes(1);
  });
});
