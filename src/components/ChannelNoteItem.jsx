export default function ChannelNoteItem({ note }) {
  return (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
      <p className="text-[10px] text-slate-400 mb-1">{new Date(note.date).toLocaleString('ko-KR')}</p>
      <p className="text-sm text-slate-700 whitespace-pre-wrap">{note.text}</p>
    </div>
  );
}
