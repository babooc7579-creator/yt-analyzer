import { useState } from 'react';

const EMPTY_NOTES_MODAL = {
  channel: null,
  isOpen: false,
  newNoteText: '',
  saving: false,
};

export function useChannelNotesModal({ saveChannelNote, onError }) {
  const [notesModal, setNotesModal] = useState(EMPTY_NOTES_MODAL);

  const openNotesModal = (channel) => {
    setNotesModal({ isOpen: true, channel, newNoteText: '', saving: false });
  };

  const closeNotesModal = () => {
    setNotesModal(EMPTY_NOTES_MODAL);
  };

  const changeNoteText = (value) => {
    setNotesModal(prev => ({ ...prev, newNoteText: value }));
  };

  const addChannelNote = async () => {
    const text = notesModal.newNoteText.trim();
    if (!text || !notesModal.channel) return;

    setNotesModal(prev => ({ ...prev, saving: true }));
    try {
      const { id, category } = notesModal.channel;
      const channel = await saveChannelNote({ id, category, text });
      setNotesModal({ isOpen: true, channel, newNoteText: '', saving: false });
    } catch (err) {
      onError(err.message);
      setNotesModal(prev => ({ ...prev, saving: false }));
    }
  };

  return {
    addChannelNote,
    changeNoteText,
    closeNotesModal,
    notesModal,
    openNotesModal,
  };
}
