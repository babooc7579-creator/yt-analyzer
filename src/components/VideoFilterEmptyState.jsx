import { Filter } from 'lucide-react';

import { VIDEO_FILTER_EMPTY_STATE } from '../constants/emptyStates';

export default function VideoFilterEmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
      <div className="mx-auto max-w-xl text-center bg-white border border-dashed border-slate-200 rounded-2xl p-8 shadow-sm">
        <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-base font-bold text-slate-700">{VIDEO_FILTER_EMPTY_STATE.title}</p>
        <p className="text-sm text-slate-500 mt-2">{VIDEO_FILTER_EMPTY_STATE.description}</p>
      </div>
    </div>
  );
}
