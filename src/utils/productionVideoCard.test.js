import { describe, expect, it, vi } from 'vitest';

import {
  getProductionVideoCandidateReasonsViewProps,
  getProductionVideoCardViewProps,
  getProductionVideoDraftFieldProps,
  getProductionVideoDraftFieldsViewProps,
  getProductionVideoExternalActionsViewProps,
  getProductionVideoMetaBadgesViewProps,
} from './productionVideoCard';

describe('productionVideoCard utils', () => {
  const video = {
    videoId: 'video-1',
    title: 'Production idea',
    daysOld: 300,
    view_count: 1500000,
    like_ratio: 5,
    multiplier: 4,
  };

  it('builds production video card props with radar and action state', () => {
    const handlers = {
      onMove: () => 'move',
      onSave: () => 'save',
      onUpdateDraft: () => 'draft',
    };
    const record = { memo: 'draft memo' };
    const viewProps = getProductionVideoCardViewProps({
      ...handlers,
      columnId: 'production_active',
      isDirty: true,
      moveState: 'saving',
      record,
      saveState: 'saving',
      scheduleSignal: 'today',
      video,
    });

    expect(viewProps.videoTitle).toBe('Production idea');
    expect(viewProps.videoUrl).toBe('https://youtube.com/watch?v=video-1');
    expect(viewProps.candidateReasonsProps).toMatchObject({
      radarScore: 215,
    });
    expect(viewProps.draftFormProps).toMatchObject({
      isDirty: true,
      isSaving: true,
      record,
      saveState: 'saving',
      video,
      videoTitle: 'Production idea',
    });
    expect(viewProps.metaBadgesProps).toEqual({
      columnId: 'production_active',
      scheduleSignal: 'today',
      video,
    });
    expect(viewProps.statusActionsProps).toMatchObject({
      columnId: 'production_active',
      isMoving: true,
      moveState: 'saving',
      record,
      video,
      videoTitle: 'Production idea',
      videoUrl: 'https://youtube.com/watch?v=video-1',
    });
    expect(viewProps.thumbnailAlt).toBe('Production idea 썸네일');
    expect(viewProps.titleLinkAriaLabel).toBe('Production idea YouTube 원본 영상 열기');
  });

  it('uses fallback title and idle flags when optional state is missing', () => {
    const viewProps = getProductionVideoCardViewProps({
      columnId: 'production_candidate',
      isDirty: false,
      moveState: '',
      record: {},
      saveState: '',
      video: { videoId: 'missing-title' },
    });

    expect(viewProps.videoTitle).not.toBe('');
    expect(viewProps.videoUrl).toBe('https://youtube.com/watch?v=missing-title');
    expect(viewProps.draftFormProps.isSaving).toBe(false);
    expect(viewProps.statusActionsProps.isMoving).toBe(false);
  });

  it('builds candidate reason, draft field, external action, and meta badge copy', () => {
    expect(getProductionVideoCandidateReasonsViewProps({
      priorityLabel: '상',
      radarScore: 88,
    })).toEqual({
      label: '후보 근거',
      scoreText: '상 · 88점',
    });

    expect(getProductionVideoDraftFieldsViewProps({ videoTitle: 'Clip' })).toMatchObject({
      titleField: {
        label: '내가 만들 제목',
        title: '입력만으로는 Cloud에 저장되지 않습니다. 아래 Cloud에 변경 저장 버튼을 눌러야 반영됩니다.',
        'aria-label': 'Clip 내가 만들 제목 입력',
      },
      noteField: {
        label: '메모',
        title: '입력만으로는 Cloud에 저장되지 않습니다. 아래 Cloud에 변경 저장 버튼을 눌러야 반영됩니다.',
      },
      publishDateField: {
        label: '업로드 예정일',
        title: '입력만으로는 Cloud에 저장되지 않습니다. 아래 Cloud에 변경 저장 버튼을 눌러야 반영됩니다.',
      },
    });

    expect(getProductionVideoExternalActionsViewProps({
      videoTitle: 'Clip',
      videoUrl: 'https://youtube.com/watch?v=clip',
    })).toMatchObject({
      copyUrlButtonProps: {
        ariaLabel: 'Clip YouTube 원본 URL 복사',
        label: 'URL 복사',
        url: 'https://youtube.com/watch?v=clip',
      },
      openButtonLabel: '원본 보기',
      openButtonProps: {
        'aria-label': 'Clip YouTube 원본 보기',
      },
    });

    expect(getProductionVideoMetaBadgesViewProps({
      video: { channelTitle: 'Channel', multiplier: 3.25 },
    })).toEqual({
      channelLabel: 'Channel',
      multiplierLabel: '대박 지수 3.3x',
    });
  });

  it('builds safe draft field handlers', () => {
    const onUpdateDraft = vi.fn();
    const titleProps = getProductionVideoDraftFieldProps({
      fieldName: 'draftTitle',
      onUpdateDraft,
      videoId: 'video-1',
    });

    titleProps.onChange({ target: { value: 'New title' } });

    expect(titleProps.disabled).toBe(false);
    expect(onUpdateDraft).toHaveBeenCalledWith('video-1', {
      draftTitle: 'New title',
    });

    getProductionVideoDraftFieldProps({
      fieldName: 'note',
      onUpdateDraft,
    }).onChange({ target: { value: 'Ignored' } });

    getProductionVideoDraftFieldProps({
      fieldName: 'targetPublishDate',
      videoId: 'video-2',
    }).onChange({ target: { value: '2026-07-09' } });

    expect(getProductionVideoDraftFieldProps({
      fieldName: 'note',
    })).toMatchObject({
      disabled: true,
      title: '저장할 영상 ID가 없어 제작 메모를 수정할 수 없습니다.',
    });
    expect(onUpdateDraft).toHaveBeenCalledTimes(1);
  });
});
