import { Loader2 } from 'lucide-react';

import TopCommentItem from './TopCommentItem';

const toArray = (items) => (Array.isArray(items) ? items : []);
const toModalObject = (modal) => (modal && typeof modal === 'object' ? modal : {});

export default function TopCommentsModalBody({ modal }) {
  const safeModal = toModalObject(modal);
  const comments = toArray(safeModal.comments);

  if (safeModal.loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" /> 댓글 데이터를 불러오는 중...
      </div>
    );
  }

  if (safeModal.error) {
    return (
      <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl border border-red-100">{safeModal.error}</div>
    );
  }

  if (comments.length === 0) {
    return <div className="text-center py-10 text-slate-500">조회된 댓글이 없습니다.</div>;
  }

  return comments.map((comment) => (
    <TopCommentItem key={comment.id} comment={comment} />
  ));
}
