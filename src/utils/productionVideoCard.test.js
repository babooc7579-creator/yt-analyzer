import { describe, expect, it, vi } from 'vitest';

import {
  getProductionVideoCandidateReasonsViewProps,
  getProductionVideoCardViewProps,
  getProductionVideoDraftFieldProps,
  getProductionVideoDraftFieldsViewProps,
  getProductionVideoExternalActionsViewProps,
  getProductionVideoMetaBadgesViewProps,
  getProductionVideoReadinessChecklist,
  getProductionWorkPacketText,
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
    const record = { note: 'draft memo' };
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
    expect(viewProps.externalActionsProps).toMatchObject({
      columnId: 'production_active',
      record,
      video,
      videoTitle: 'Production idea',
      videoUrl: 'https://youtube.com/watch?v=video-1',
    });
    expect(viewProps.metaBadgesProps).toEqual({
      columnId: 'production_active',
      record,
      scheduleSignal: 'today',
      video,
    });
    expect(viewProps.readinessChecklistProps).toMatchObject({
      readyCount: 2,
      summaryText: '2개 남음',
      title: '남은 준비',
    });
    expect(viewProps.statusActionsProps).toMatchObject({
      columnId: 'production_active',
      isMoving: true,
      moveState: 'saving',
      record,
      video,
      videoTitle: 'Production idea',
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
    expect(viewProps.readinessChecklistProps.readyCount).toBe(1);
    expect(viewProps.statusActionsProps.isMoving).toBe(false);
  });

  it('builds a production readiness checklist from existing video record fields', () => {
    const emptyChecklist = getProductionVideoReadinessChecklist({
      record: {},
      video: { videoId: 'video-1' },
    });
    const readyChecklist = getProductionVideoReadinessChecklist({
      record: {
        draftTitle: 'My title',
        note: 'Hook and scenes',
        targetPublishDate: '2026-07-12',
      },
      video: { videoId: 'video-1' },
    });

    expect(emptyChecklist).toMatchObject({
      readyCount: 1,
      summaryText: '3개 남음',
      tone: 'working',
    });
    expect(emptyChecklist.description).toContain('저장이나 API 호출은 실행하지 않습니다');
    expect(emptyChecklist.items.map((item) => [item.key, item.isReady])).toEqual([
      ['source', true],
      ['title', false],
      ['note', false],
      ['publish-date', false],
    ]);
    expect(emptyChecklist.remainingItems.map((item) => item.key)).toEqual([
      'title',
      'note',
      'publish-date',
    ]);
    expect(readyChecklist).toMatchObject({
      readyCount: 4,
      summaryText: '4/4 준비',
      title: '작업 준비 완료',
      tone: 'ready',
    });
    expect(readyChecklist.remainingItems).toEqual([]);
    expect(readyChecklist.items.every((item) => item.title.includes('저장') || item.key === 'source')).toBe(true);
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
        title: '입력만으로는 온라인 저장소(Azure DB)에 저장되지 않습니다. 아래 ‘변경사항 저장’ 버튼을 눌러야 반영됩니다.',
        'aria-label': 'Clip 내가 만들 제목 입력',
      },
      noteField: {
        label: '메모',
        title: '입력만으로는 온라인 저장소(Azure DB)에 저장되지 않습니다. 아래 ‘변경사항 저장’ 버튼을 눌러야 반영됩니다.',
      },
      publishDateField: {
        label: '업로드 예정일',
        title: '입력만으로는 온라인 저장소(Azure DB)에 저장되지 않습니다. 아래 ‘변경사항 저장’ 버튼을 눌러야 반영됩니다.',
      },
    });

    expect(getProductionVideoExternalActionsViewProps({
      columnId: 'production_active',
      record: { draftTitle: 'My clip', note: 'Hook first', targetPublishDate: '2026-07-20' },
      video: { ...video, channelTitle: 'Channel' },
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
      workPacketCopyButtonProps: {
        ariaLabel: 'Clip 제작 작업 묶음 복사',
        label: '작업 묶음 복사',
      },
    });

    expect(getProductionVideoMetaBadgesViewProps({
      record: { targetPublishDate: '2026-07-30' },
      video: { channelTitle: 'Channel', multiplier: 3.25 },
    })).toEqual({
      channelLabel: 'Channel',
      multiplierLabel: '대박 지수 3.3x',
      targetPublishDateLabel: '업로드 26.07.30',
    });
    expect(getProductionVideoMetaBadgesViewProps({
      record: { targetPublishDate: 'invalid-date' },
      video: {},
    }).targetPublishDateLabel).toBe('');
  });

  it('builds a copyable production work packet from the current card values', () => {
    const packet = getProductionWorkPacketText({
      columnId: 'production_active',
      record: {
        draftTitle: 'My title',
        note: 'Start with the result',
        scriptAnalysis: 'The contrast drives attention',
        scriptBody: 'Full narration',
        scriptOutline: 'Hook → examples → conclusion',
        scriptStatus: 'revision',
        targetPublishDate: '2026-07-20',
      },
      video: {
        channel_title: 'Source channel',
        multiplier: 3.25,
        title: 'Source title',
        videoId: 'video-1',
      },
    });

    expect(packet).toContain('[Creator OS 제작 작업 묶음]');
    expect(packet).toContain('진행 단계: 제작 중');
    expect(packet).toContain('원본 제목: Source title');
    expect(packet).toContain('내가 만들 제목: My title');
    expect(packet).toContain('채널: Source channel');
    expect(packet).toContain('원본 URL: https://youtube.com/watch?v=video-1');
    expect(packet).toContain('대박 지수: 3.3x');
    expect(packet).toContain('대본 단계: 수정 중');
    expect(packet).toContain('업로드 예정일: 2026-07-20');
    expect(packet).toContain('준비 상태: 4/4 준비');
    expect(packet).toContain('[영상 분석]');
    expect(packet).toContain('The contrast drives attention');
    expect(packet).toContain('[대본 구성안]');
    expect(packet).toContain('Hook → examples → conclusion');
    expect(packet).toContain('[대본 본문]');
    expect(packet).toContain('Full narration');
    expect(packet).toContain('[기존 통합 작업 메모]');
    expect(packet).toContain('Start with the result');
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
