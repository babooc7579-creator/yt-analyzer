import { describe, expect, it } from 'vitest';

import { buildLayoutProps } from './appLayoutProps';

describe('appLayoutProps utils', () => {
  it('builds layout counts from channel, video, and selected channel lists', () => {
    const props = buildLayoutProps({
      activeCreatorItem: { id: 'today' },
      addChannelNote: () => 'add note',
      changeNoteText: () => 'change note',
      closeNotesModal: () => 'close notes',
      closeTopCommentsModal: () => 'close comments',
      commentModal: { isOpen: true },
      creatorView: 'today',
      discoveryCandidateCount: 3,
      notesModal: { isOpen: false },
      openCreatorView: () => 'open',
      savedChannels: [{ id: 'channel1' }, { id: 'channel2' }],
      savedVideos: [{ videoId: 'video1' }],
      selectedChannelIds: ['channel1'],
      syncWarnings: ['warning'],
      videos: [{ videoId: 'video1' }, { videoId: 'video2' }],
    });

    expect(props).toMatchObject({
      activeCreatorItem: { id: 'today' },
      channelCount: 2,
      commentModal: { isOpen: true },
      creatorView: 'today',
      discoveryCandidateCount: 3,
      notesModal: { isOpen: false },
      savedVideoCount: 1,
      selectedChannelCount: 1,
      syncWarnings: ['warning'],
      videoCount: 2,
    });
  });

  it('forwards layout handlers without invoking them', () => {
    const addChannelNote = () => 'add note';
    const changeNoteText = () => 'change note';
    const closeNotesModal = () => 'close notes';
    const closeTopCommentsModal = () => 'close comments';
    const openCreatorView = () => 'open';

    const props = buildLayoutProps({
      addChannelNote,
      changeNoteText,
      closeNotesModal,
      closeTopCommentsModal,
      openCreatorView,
    });

    expect(props.onAddNote).toBe(addChannelNote);
    expect(props.onChangeNoteText).toBe(changeNoteText);
    expect(props.onCloseNotes).toBe(closeNotesModal);
    expect(props.onCloseTopComments).toBe(closeTopCommentsModal);
    expect(props.onOpenCreatorView).toBe(openCreatorView);
  });

  it('uses safe zero counts for invalid list inputs', () => {
    const props = buildLayoutProps({
      savedChannels: null,
      savedVideos: 'bad',
      selectedChannelIds: undefined,
      videos: {},
    });

    expect(props.channelCount).toBe(0);
    expect(props.savedVideoCount).toBe(0);
    expect(props.selectedChannelCount).toBe(0);
    expect(props.videoCount).toBe(0);
  });
});
