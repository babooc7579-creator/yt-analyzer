import { History, Trash2 } from 'lucide-react';

import { getChannelListItemActionsViewProps } from '../utils/channelListItemActionsProps';
import CopyUrlButton from './CopyUrlButton';

export default function ChannelListItemActions({
  channel,
  onDelete,
  onOpenNotes,
}) {
  const {
    copyUrlButtonProps,
    deleteButtonProps,
    noteCount,
    notesButtonProps,
  } = getChannelListItemActionsViewProps({
    channel,
    onDelete,
    onOpenNotes,
  });

  return (
    <>
      <button {...notesButtonProps}>
        <History className="w-4 h-4" />
        {noteCount > 0 && <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{noteCount}</span>}
      </button>
      <CopyUrlButton {...copyUrlButtonProps} />
      <button {...deleteButtonProps}>
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );
}
