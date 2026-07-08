import { getChannelPreviewNoteFieldCopy } from '../utils/channelAddCopy';

export default function ChannelPreviewNoteField({
  note,
  setNote,
}) {
  const copy = getChannelPreviewNoteFieldCopy();

  return (
    <textarea
      value={note}
      onChange={(event) => setNote(event.target.value)}
      placeholder={copy.placeholder}
      className="w-full text-sm px-3 py-2 border border-indigo-200 rounded-lg outline-none resize-none"
      rows={2}
      aria-label={copy.ariaLabel}
    />
  );
}
