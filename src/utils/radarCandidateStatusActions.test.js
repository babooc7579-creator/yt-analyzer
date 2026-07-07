import { describe, expect, it, vi } from 'vitest';

import { VIDEO_STATUS } from '../constants/status';
import {
  RADAR_STATUS_ACTION_ITEMS,
  getRadarCandidateStatusActionProps,
} from './radarCandidateStatusActions';

describe('radarCandidateStatusActions utils', () => {
  it('builds reviewed, later, and excluded actions for Cloud decision records', () => {
    const onMarkVideoStatus = vi.fn();
    const actionProps = getRadarCandidateStatusActionProps({
      onMarkVideoStatus,
      video: { videoId: 'radar-1', title: 'Radar video' },
      videoTitle: 'Display title',
    });

    expect(actionProps.map(action => action.status)).toEqual([
      VIDEO_STATUS.REVIEWED,
      VIDEO_STATUS.LEGACY_LATER,
      VIDEO_STATUS.EXCLUDED,
    ]);
    expect(actionProps.map(action => action.label)).toEqual([
      '봤음',
      '나중에 보기',
      '후보에서 제외',
    ]);
    expect(actionProps.every(action => action.title.includes('Cloud 판단 기록'))).toBe(true);
    expect(actionProps.every(action => action.title.includes('오늘 레이더'))).toBe(true);
    expect(actionProps.every(action => action.ariaLabel.includes('Display title'))).toBe(true);
    expect(RADAR_STATUS_ACTION_ITEMS).toHaveLength(3);
  });

  it('connects each action to the correct video status without calling eagerly', () => {
    const onMarkVideoStatus = vi.fn();
    const actionProps = getRadarCandidateStatusActionProps({
      onMarkVideoStatus,
      video: { videoId: 'radar-1' },
      videoTitle: 'Display title',
    });

    expect(onMarkVideoStatus).not.toHaveBeenCalled();

    actionProps[0].onClick();
    actionProps[1].onClick();
    actionProps[2].onClick();

    expect(onMarkVideoStatus).toHaveBeenNthCalledWith(1, 'radar-1', VIDEO_STATUS.REVIEWED);
    expect(onMarkVideoStatus).toHaveBeenNthCalledWith(2, 'radar-1', VIDEO_STATUS.LEGACY_LATER);
    expect(onMarkVideoStatus).toHaveBeenNthCalledWith(3, 'radar-1', VIDEO_STATUS.EXCLUDED);
  });

  it('uses safe fallbacks for unnamed videos', () => {
    const actionProps = getRadarCandidateStatusActionProps({
      onMarkVideoStatus: () => {},
      video: null,
      videoTitle: '',
    });

    expect(actionProps[0].ariaLabel).toContain('이 영상');
  });
});
