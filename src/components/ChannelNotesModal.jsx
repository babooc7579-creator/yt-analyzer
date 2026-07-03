import { History, Loader2, Plus, X } from 'lucide-react';

export default function ChannelNotesModal({
  modal,
  onChangeText,
  onAddNote,
  onClose,
}) {
  if (!modal.isOpen || !modal.channel) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            {modal.channel.title} - 분석 기록
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
            title="분석 기록 창 닫기"
            aria-label={`${modal.channel.title} 분석 기록 창 닫기`}
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100">
          <textarea
            value={modal.newNoteText}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder="예) 또 떡상함, 패턴인듯 / 시니어롱폼 소재로 쓰기 좋음 / 톤이 우리 채널이랑 비슷함..."
            className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg outline-none resize-none focus:ring-2 focus:ring-indigo-500"
            rows={2}
          />
          <button
            onClick={onAddNote}
            disabled={modal.saving || !modal.newNoteText.trim()}
            className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-sm font-semibold transition-colors"
            title="채널 분석 기록을 Cloud 채널 메모에 저장"
            aria-label={`${modal.channel.title} 분석 기록 추가`}
            type="button"
          >
            {modal.saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            기록 추가
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {(!modal.channel.notes || modal.channel.notes.length === 0) ? (
            <div className="text-center py-10 text-slate-400 text-sm">아직 기록이 없어요. 위에서 첫 기록을 남겨보세요!</div>
          ) : (
            modal.channel.notes.map((note, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-400 mb-1">{new Date(note.date).toLocaleString('ko-KR')}</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{note.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
