import { MessageSquareText, X } from 'lucide-react';

import { getTopCommentsModalHeaderViewProps } from '../utils/topComments';

export default function TopCommentsModalHeader({ onClose }) {
  const viewProps = getTopCommentsModalHeaderViewProps({ onClose });

  return (
    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
      <h3 className="font-bold text-slate-800 flex items-center gap-2">
        <MessageSquareText className="w-5 h-5 text-indigo-500" />
        {viewProps.title}
      </h3>
      <button
        {...viewProps.closeButtonProps}
        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
