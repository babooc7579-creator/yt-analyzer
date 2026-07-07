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
      channelTitle: 'Peak Viral Shorts',
      closeButtonAriaLabel: 'Peak Viral Shorts 분석 기록 창 닫기',
      hasNotes: true,
      isAddDisabled: false,
      notes: ['first note', 'second note'],
      textareaAriaLabel: 'Peak Viral Shorts 채널 분석 기록 입력',
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
