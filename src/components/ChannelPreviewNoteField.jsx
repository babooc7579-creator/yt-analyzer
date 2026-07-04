export default function ChannelPreviewNoteField({
  note,
  setNote,
}) {
  return (
    <textarea
      value={note}
      onChange={(event) => setNote(event.target.value)}
      placeholder="첫 기록 메모 (선택) - 예) 시니어롱폼 소재용, 톤 비슷함"
      className="w-full text-sm px-3 py-2 border border-indigo-200 rounded-lg outline-none resize-none"
      rows={2}
      aria-label="새 채널 첫 기록 메모"
    />
  );
}
