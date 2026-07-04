import { ThumbsUp } from 'lucide-react';

export default function TopCommentItem({ comment }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <span className="font-semibold text-sm text-slate-800">@{comment.author}</span>
        <span className="flex items-center gap-1 text-xs text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
          <ThumbsUp className="w-3 h-3" /> {comment.likeCount > 0 ? comment.likeCount.toLocaleString() : '0'}
        </span>
      </div>
      <p className="text-slate-600 text-sm whitespace-pre-wrap">{comment.text}</p>
    </div>
  );
}
