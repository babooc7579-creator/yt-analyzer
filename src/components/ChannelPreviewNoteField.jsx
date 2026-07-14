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
      className="w-full resize-none rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400"
      rows={2}
      aria-label={copy.ariaLabel}
    />
  );
}
