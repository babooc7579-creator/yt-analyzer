import { Loader2 } from 'lucide-react';

import TopCommentItem from './TopCommentItem';

export default function TopCommentsModalBody({ modal }) {
  if (modal.loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" /> 댓글 데이터를 불러오는 중...
      </div>
    );
  }

  if (modal.error) {
    return (
      <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl border border-red-100">{modal.error}</div>
    );
  }

  if (modal.comments.length === 0) {
    return <div className="text-center py-10 text-slate-500">조회된 댓글이 없습니다.</div>;
  }

  return modal.comments.map((comment) => (
    <TopCommentItem key={comment.id} comment={comment} />
  ));
}
