import { describe, expect, it, vi } from 'vitest';

import {
  CHANNEL_GRADE,
  CHANNEL_STATUS,
} from '../constants/status';
import {
  CHANNEL_GRADE_OPTIONS,
  CHANNEL_STATUS_OPTIONS,
  getChannelMetadataControlsViewProps,
} from './channelMetadataControlsProps';

const channel = {
  id: 'channel-1',
  title: 'Peak Viral Shorts',
};

describe('channelMetadataControlsProps utils', () => {
  it('exposes grade and status options from channel status constants', () => {
    expect(CHANNEL_GRADE_OPTIONS).toEqual([
      { label: '등급 S', value: CHANNEL_GRADE.S },
      { label: '등급 A', value: CHANNEL_GRADE.A },
      { label: '등급 B', value: CHANNEL_GRADE.B },
      { label: '등급 C', value: CHANNEL_GRADE.C },
      { label: '등급 미분류', value: CHANNEL_GRADE.UNCLASSIFIED },
    ]);
    expect(CHANNEL_STATUS_OPTIONS).toEqual([
      { label: '활성', value: CHANNEL_STATUS.ACTIVE },
      { label: '보류', value: CHANNEL_STATUS.PAUSED },
      { label: '제외', value: CHANNEL_STATUS.DISCARDED },
    ]);
  });

  it('builds grade select props with no automatic scan-cycle wording', () => {
    const onUpdateMetadata = vi.fn();
    const props = getChannelMetadataControlsViewProps({
      channel,
      grade: CHANNEL_GRADE.A,
      isUpdating: false,
      onUpdateMetadata,
      status: CHANNEL_STATUS.ACTIVE,
    });

    expect(props.gradeSelectProps).toMatchObject({
      'aria-label': 'Peak Viral Shorts 채널 등급 선택, 중요도 표시',
      disabled: false,
      title: '채널 등급 변경 - 중요도 표시이며 새 영상 수집 주기를 자동으로 바꾸지 않습니다',
      value: CHANNEL_GRADE.A,
    });
    expect(props.gradeLabelText).toBe('채널 등급');

    props.gradeSelectProps.onChange({
      target: {
        value: CHANNEL_GRADE.S,
      },
    });

    expect(onUpdateMetadata).toHaveBeenCalledWith(channel, {
      grade: CHANNEL_GRADE.S,
    });
  });

  it('builds status select props with active-channel scan target wording', () => {
    const onUpdateMetadata = vi.fn();
    const props = getChannelMetadataControlsViewProps({
      channel,
      grade: CHANNEL_GRADE.B,
      isUpdating: true,
      onUpdateMetadata,
      status: CHANNEL_STATUS.PAUSED,
    });

    expect(props.statusSelectProps).toMatchObject({
      'aria-label': 'Peak Viral Shorts 채널 상태 선택, 활성 채널만 새 영상 수집 대상',
      disabled: true,
      title: '채널 상태 변경 - 활성 채널만 새 영상 수집 대상이며 변경 내용은 Cloud에 저장됩니다',
      value: CHANNEL_STATUS.PAUSED,
    });
    expect(props.statusLabelText).toBe('채널 상태');

    props.statusSelectProps.onChange({
      target: {
        value: CHANNEL_STATUS.ACTIVE,
      },
    });

    expect(onUpdateMetadata).toHaveBeenCalledWith(channel, {
      status: CHANNEL_STATUS.ACTIVE,
    });
  });
});
