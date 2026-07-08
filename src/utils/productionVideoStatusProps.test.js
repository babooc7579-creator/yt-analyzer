import { describe, expect, it } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import {
  PRODUCTION_VIDEO_STATUS_HELP_TEXT,
  getProductionVideoDraftSaveButtonProps,
  getProductionVideoMoveActionCopy,
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
      ariaLabel: 'Clip 제작 후보로 이동',
      label: '제작 후보로',
      title: '제작 상태를 후보로 되돌려 저장',
    });

    expect(getProductionVideoMoveActionCopy({
      targetStatus: PRODUCTION_STATUS.ACTIVE,
      videoTitle: 'Clip',
    }).label).toBe('제작 중으로');

    expect(getProductionVideoMoveActionCopy({
      targetStatus: PRODUCTION_STATUS.DONE,
      videoTitle: '',
    }).ariaLabel).toBe('이 영상 업로드 완료로 이동');
  });

  it('builds draft save button copy from dirty and saving state', () => {
    expect(getProductionVideoDraftSaveButtonProps({
      isDirty: true,
      isSaving: false,
      videoTitle: 'Clip',
    })).toMatchObject({
      ariaLabel: 'Clip 제작 메모 저장',
      disabled: false,
      label: 'Cloud에 변경 저장',
    });

    expect(getProductionVideoDraftSaveButtonProps({
      isDirty: true,
      isSaving: true,
    })).toMatchObject({
      disabled: true,
      label: 'Cloud 저장 중',
    });

    expect(getProductionVideoDraftSaveButtonProps({
      isDirty: false,
      isSaving: false,
    })).toMatchObject({
      disabled: true,
      label: 'Cloud 저장됨',
      title: 'Cloud에 저장된 상태',
    });
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
