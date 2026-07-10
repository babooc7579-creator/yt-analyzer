import { describe, expect, it } from 'vitest';

import { getChannelNotesModalViewProps } from './channelNotesModal';

const channel = {
  title: 'Peak Viral Shorts',
  notes: ['first note', 'second note'],
};

describe('channelNotesModal utils', () => {
  it('does not render when modal is closed or channel is missing', () => {
    expect(getChannelNotesModalViewProps({
      isOpen: false,
      channel,
    })).toEqual({
      shouldRender: false,
    });
    expect(getChannelNotesModalViewProps({
      isOpen: true,
      channel: null,
    })).toEqual({
      shouldRender: false,
    });
  });

  it('builds open modal props from channel notes and title', () => {
    const props = getChannelNotesModalViewProps({
      isOpen: true,
      channel,
      newNoteText: '  useful hook  ',
      saving: false,
    });

    expect(props).toEqual({
      shouldRender: true,
      addButtonAriaLabel: 'Peak Viral Shorts 분석 기록 추가',
      addButtonLabel: '기록 추가',
      addButtonTitle: '채널 분석 기록을 Cloud 채널 메모에 저장',
      channelTitle: 'Peak Viral Shorts',
      closeButtonAriaLabel: 'Peak Viral Shorts 분석 기록 창 닫기',
      closeButtonTitle: '분석 기록 창 닫기',
      emptyStateText: '아직 기록이 없어요. 위에서 첫 기록을 남겨보세요!',
      hasNotes: true,
      isAddDisabled: false,
      modalTitle: 'Peak Viral Shorts - 분석 기록',
      notes: ['first note', 'second note'],
      textareaAriaLabel: 'Peak Viral Shorts 채널 분석 기록 입력',
      textareaPlaceholder: '예) 또 떡상함, 패턴인듯 / 시니어롱폼 소재로 쓰기 좋음 / 톤이 우리 채널이랑 비슷함...',
      textareaTitle: '입력만으로는 Cloud에 저장되지 않습니다. 기록 추가 버튼을 눌러야 Cloud 채널 메모에 저장됩니다.',
    });
  });

  it('disables note add when saving or text is blank', () => {
    expect(getChannelNotesModalViewProps({
      isOpen: true,
      channel,
      newNoteText: 'new note',
      saving: true,
    }).isAddDisabled).toBe(true);

    expect(getChannelNotesModalViewProps({
      isOpen: true,
      channel,
      newNoteText: '   ',
      saving: false,
    }).isAddDisabled).toBe(true);
  });

  it('falls back to an empty note list when channel notes are missing', () => {
    const props = getChannelNotesModalViewProps({
      isOpen: true,
      channel: {
        title: 'No Notes Channel',
        notes: null,
      },
      newNoteText: 'memo',
      saving: false,
    });

    expect(props.hasNotes).toBe(false);
    expect(props.notes).toEqual([]);
  });
});
