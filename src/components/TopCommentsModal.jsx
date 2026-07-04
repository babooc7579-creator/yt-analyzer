import { Loader2, MessageSquareText, X } from 'lucide-react';
import TopCommentItem from './TopCommentItem';

export default function TopCommentsModal({ modal, onClose }) {
  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
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
        <div className="p-4 bg-indigo-50/50 border-b border-indigo-100 text-sm font-medium text-indigo-900 line-clamp-1">
          원본 영상: {modal.videoTitle}
        </div>
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {modal.loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" /> 댓글 데이터를 불러오는 중...
            </div>
          ) : modal.error ? (
            <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl border border-red-100">{modal.error}</div>
          ) : modal.comments.length === 0 ? (
            <div className="text-center py-10 text-slate-500">조회된 댓글이 없습니다.</div>
          ) : (
            modal.comments.map((comment) => (
              <TopCommentItem key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
