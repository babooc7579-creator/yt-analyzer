import { Loader2 } from 'lucide-react';

import { getTopCommentsModalBodyViewProps } from '../utils/topComments';
import TopCommentItem from './TopCommentItem';

export default function TopCommentsModalBody({ modal }) {
  const viewProps = getTopCommentsModalBodyViewProps(modal);

  if (viewProps.state === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" /> {viewProps.loadingText}
      </div>
    );
  }

  if (viewProps.state === 'error') {
    return (
      <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl border border-red-100">{viewProps.errorText}</div>
    );
  }

  if (viewProps.state === 'empty') {
    return <div className="text-center py-10 text-slate-500">{viewProps.emptyText}</div>;
  }

  return viewProps.comments.map((comment) => (
    <TopCommentItem key={comment.id} comment={comment} />
  ));
}
