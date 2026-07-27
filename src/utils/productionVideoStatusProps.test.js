import { describe, expect, it, vi } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import {
  PRODUCTION_VIDEO_STATUS_HELP_TEXT,
  getProductionVideoDraftSaveButtonProps,
  getProductionVideoDraftSaveHandler,
  getProductionVideoDraftStatusBadgeProps,
  getProductionVideoFocusActionCopy,
  getProductionVideoFocusHandler,
  getProductionVideoMoveActionCopy,
  getProductionVideoMoveButtonViewProps,
  getProductionVideoMoveHandler,
  getProductionVideoMoveStatusViewProps,
  getProductionVideoSaveStatusViewProps,
} from './productionVideoStatusProps';

describe('productionVideoStatusProps utils', () => {
  it('keeps production status help text explicit about Cloud and YouTube API boundaries', () => {
    expect(PRODUCTION_VIDEO_STATUS_HELP_TEXT).toContain('Cloud 판단 기록');
    expect(PRODUCTION_VIDEO_STATUS_HELP_TEXT).toContain('YouTube API를 새로 호출하지 않습니다');
  });

  it('builds move action copy for each production status', () => {
    expect(getProductionVideoMoveActionCopy({
      targetStatus: PRODUCTION_STATUS.CANDIDATE,
      videoTitle: 'Clip',
    })).toEqual({
      ariaLabel: 'Clip 제작 후보 상태로 변경, Cloud 판단 기록 저장, YouTube API 호출 없음',
      label: '제작 후보로',
      title: '제작 진행 상태를 제작 후보로 변경해 Cloud 판단 기록에 저장합니다. YouTube API를 새로 호출하지 않습니다.',
    });

    expect(getProductionVideoMoveActionCopy({
      targetStatus: PRODUCTION_STATUS.ACTIVE,
      videoTitle: 'Clip',
    }).label).toBe('제작 중으로');
    expect(getProductionVideoMoveActionCopy({
      targetStatus: PRODUCTION_STATUS.ACTIVE,
      videoTitle: 'Clip',
    }).title).toContain('Cloud 판단 기록');

    expect(getProductionVideoMoveActionCopy({
      targetStatus: PRODUCTION_STATUS.DONE,
      videoTitle: '',
    }).ariaLabel).toBe('이 영상 업로드 완료 상태로 변경, Cloud 판단 기록 저장, YouTube API 호출 없음');
  });

  it('builds focus and unfocus copy without changing production status semantics', () => {
    expect(getProductionVideoFocusActionCopy({
      videoTitle: 'Clip',
    })).toMatchObject({
      label: '오늘 집중',
    });
    expect(getProductionVideoFocusActionCopy({
      isFocused: true,
      videoTitle: 'Clip',
    })).toMatchObject({
      label: '집중 해제',
    });
    expect(getProductionVideoFocusActionCopy({ videoTitle: 'Clip' }).title).toContain('직접 해제하거나 제작 상태를 옮길 때까지 유지');
  });

  it('builds draft save button copy from dirty and saving state', () => {
    expect(getProductionVideoDraftSaveButtonProps({
      isDirty: true,
      isSaving: false,
      videoTitle: 'Clip',
    })).toMatchObject({
      ariaLabel: 'Clip 제작 메모 Cloud 판단 기록에 저장, YouTube API 호출 없음',
      disabled: false,
      label: 'Cloud에 변경 저장',
    });
    expect(getProductionVideoDraftSaveButtonProps({
      isDirty: true,
      isSaving: false,
      videoTitle: 'Clip',
    }).title).toContain('YouTube API를 새로 호출하지 않습니다');

    expect(getProductionVideoDraftSaveButtonProps({
      isDirty: true,
      isSaving: true,
    })).toMatchObject({
      disabled: true,
      label: '온라인 저장소(Azure DB) 저장 중',
    });
    expect(getProductionVideoDraftSaveButtonProps({
      isDirty: true,
      isSaving: true,
    }).title).toContain('저장하는 중입니다');

    expect(getProductionVideoDraftSaveButtonProps({
      isDirty: false,
      isSaving: false,
    })).toMatchObject({
      disabled: true,
      label: '온라인 저장소(Azure DB) 저장됨',
    });
    expect(getProductionVideoDraftSaveButtonProps({
      isDirty: false,
      isSaving: false,
    }).title).toContain('Cloud 판단 기록에 저장된 상태입니다');

    expect(getProductionVideoDraftSaveButtonProps({
      hasSaveTarget: false,
      isDirty: true,
      isSaving: false,
    })).toMatchObject({
      disabled: true,
      label: '저장 대상 없음',
      title: '저장할 영상 ID가 없어 온라인 저장소(Azure DB) 저장을 실행하지 않습니다.',
    });
  });

  it('builds safe draft save handlers', () => {
    const onSave = vi.fn();

    getProductionVideoDraftSaveHandler({
      onSave,
      videoId: 'video-1',
    })();

    expect(onSave).toHaveBeenCalledWith('video-1');

    getProductionVideoDraftSaveHandler({ onSave })();
    getProductionVideoDraftSaveHandler({ videoId: 'video-2' })();

    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('builds visible draft save state badges without overstating Cloud success', () => {
    expect(getProductionVideoDraftStatusBadgeProps({
      isDirty: true,
    })).toMatchObject({
      label: '저장 전',
      tone: 'bg-amber-100 text-amber-700',
    });

    expect(getProductionVideoDraftStatusBadgeProps({
      isDirty: true,
      isSaving: true,
      saveState: 'error',
    })).toMatchObject({
      label: '저장 중',
      tone: 'bg-amber-100 text-amber-700',
    });

    expect(getProductionVideoDraftStatusBadgeProps({
      isDirty: true,
      saveState: 'error',
    })).toMatchObject({
      label: '저장 실패',
      tone: 'bg-rose-100 text-rose-700',
    });

    expect(getProductionVideoDraftStatusBadgeProps({
      saveState: 'saved',
    })).toMatchObject({
      label: '저장 완료',
      tone: 'bg-emerald-100 text-emerald-700',
    });

    expect(getProductionVideoDraftStatusBadgeProps()).toBeNull();
  });

  it('builds moving button visible labels', () => {
    expect(getProductionVideoMoveButtonViewProps({
      isMoving: true,
      label: '제작 중으로',
    }).visibleLabel).toBe('변경 중...');
    expect(getProductionVideoMoveButtonViewProps({
      isMoving: false,
      label: '제작 중으로',
    }).visibleLabel).toBe('제작 중으로');
    expect(getProductionVideoMoveButtonViewProps({
      disabled: true,
      isMoving: false,
      label: '제작 중으로',
    })).toMatchObject({
      disabled: true,
      visibleLabel: '제작 중으로',
    });
  });

  it('builds safe move handlers for production status updates', () => {
    const onMove = vi.fn();
    const moveToDone = getProductionVideoMoveHandler({
      onMove,
      targetStatus: PRODUCTION_STATUS.DONE,
      updates: { uploadedAt: '2026-07-09' },
      videoId: 'video-1',
    });

    moveToDone();

    expect(onMove).toHaveBeenCalledWith('video-1', PRODUCTION_STATUS.DONE, {
      uploadedAt: '2026-07-09',
    });

    getProductionVideoMoveHandler({
      onMove,
      targetStatus: PRODUCTION_STATUS.ACTIVE,
    })();

    getProductionVideoMoveHandler({
      targetStatus: PRODUCTION_STATUS.CANDIDATE,
      videoId: 'video-2',
    })();

    expect(onMove).toHaveBeenCalledTimes(1);
  });

  it('builds a focus handler with an explicit Cloud focus timestamp', () => {
    const onFocus = vi.fn();
    const focusVideo = getProductionVideoFocusHandler({
      getNow: () => '2026-07-13T09:30:00.000Z',
      onFocus,
      videoId: 'video-1',
    });

    focusVideo();

    expect(onFocus).toHaveBeenCalledWith('video-1', '2026-07-13T09:30:00.000Z');

    getProductionVideoFocusHandler({
      focusPinnedAt: '2026-07-13T09:30:00.000Z',
      onFocus,
      videoId: 'video-1',
    })();

    expect(onFocus).toHaveBeenLastCalledWith('video-1', '');

    getProductionVideoFocusHandler({ onFocus })();
    getProductionVideoFocusHandler({ videoId: 'video-2' })();
    expect(onFocus).toHaveBeenCalledTimes(2);
  });

  it('builds move and save status messages without pretending failed saves succeeded', () => {
    expect(getProductionVideoMoveStatusViewProps({
      columnId: PRODUCTION_STATUS.DONE,
      moveState: 'error',
      uploadedAt: '',
    })).toEqual({
      errorMessage: 'Cloud 상태 저장 실패. 저장 완료 처리하지 않았습니다. 다시 눌러 주세요.',
      uploadedAtText: '업로드 완료일 기록 없음',
    });

    expect(getProductionVideoMoveStatusViewProps({
      columnId: PRODUCTION_STATUS.ACTIVE,
      moveState: 'saved',
      uploadedAt: '2026-07-08',
    })).toEqual({
      errorMessage: '',
      uploadedAtText: '',
    });

    expect(getProductionVideoSaveStatusViewProps('saved')).toMatchObject({
      iconName: 'saved',
      message: 'Cloud에 저장됐습니다.',
      tone: 'success',
    });
    expect(getProductionVideoSaveStatusViewProps('error')).toMatchObject({
      iconName: 'error',
      tone: 'danger',
    });
    expect(getProductionVideoSaveStatusViewProps('idle')).toBeNull();
  });
});
