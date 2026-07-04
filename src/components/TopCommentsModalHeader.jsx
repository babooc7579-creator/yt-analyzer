import { MessageSquareText, X } from 'lucide-react';

export default function TopCommentsModalHeader({ onClose }) {
  return (
    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
      <h3 className="font-bold text-slate-800 flex items-center gap-2">
        <MessageSquareText className="w-5 h-5 text-indigo-500" />
        찐팬 반응 분석 (Top 10)
      </h3>
      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
        title="댓글 Top 10 창 닫기"
        aria-label="댓글 Top 10 창 닫기"
        type="button"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
