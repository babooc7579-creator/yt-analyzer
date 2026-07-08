import { Clock } from 'lucide-react';

import { getVideoCardMetaBadgesViewProps } from '../utils/videoCard';

export default function VideoCardMetaBadges({ video }) {
  const {
    durationBadge,
    languageLabel,
  } = getVideoCardMetaBadgesViewProps({ video });

  return (
    <>
      <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
        {languageLabel}
      </span>
      {durationBadge.isShorts ? (
        <span className="rounded-full bg-pink-100 px-2 py-1 text-[11px] font-bold text-pink-700">{durationBadge.text}</span>
      ) : (
        <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
          <Clock className="w-3 h-3" /> {durationBadge.text}
        </span>
      )}
    </>
  );
}
