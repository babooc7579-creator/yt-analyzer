import { History, Loader2, Plus, X } from 'lucide-react';

import { getChannelNotesModalViewProps } from '../utils/channelNotesModal';
import ChannelNoteItem from './ChannelNoteItem';

export default function ChannelNotesModal({
  modal,
  onChangeText,
  onAddNote,
  onClose,
}) {
  const {
    addButtonAriaLabel,
    addButtonLabel,
    addButtonTitle,
    closeButtonAriaLabel,
    closeButtonTitle,
    emptyStateText,
    hasNotes,
    isAddDisabled,
    modalTitle,
    notes,
    shouldRender,
    textareaAriaLabel,
    textareaPlaceholder,
  } = getChannelNotesModalViewProps(modal);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            {modalTitle}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
            title={closeButtonTitle}
            aria-label={closeButtonAriaLabel}
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100">
          <textarea
            value={modal.newNoteText}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder={textareaPlaceholder}
            className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none resize-none focus:ring-2 focus:ring-indigo-500"
            rows={2}
            aria-label={textareaAriaLabel}
          />
          <button
            onClick={onAddNote}
            disabled={isAddDisabled}
            className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-sm font-semibold transition-colors"
            title={addButtonTitle}
            aria-label={addButtonAriaLabel}
            type="button"
          >
            {modal.saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {addButtonLabel}
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {!hasNotes ? (
            <div className="text-center py-10 text-slate-400 text-sm">{emptyStateText}</div>
          ) : (
            notes.map((note, idx) => (
              <ChannelNoteItem key={idx} note={note} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
