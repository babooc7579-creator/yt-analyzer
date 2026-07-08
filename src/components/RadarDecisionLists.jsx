import { RotateCcw } from 'lucide-react';

import { getRadarDecisionListsViewProps } from '../utils/radarDecisionViewProps';

export default function RadarDecisionLists({
  groups,
  loadedDecisionCount,
  onRestoreVideo,
}) {
  const viewProps = getRadarDecisionListsViewProps({
    groups,
    loadedDecisionCount,
  });
  if (!viewProps) return null;

  return (
    <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-950/50 p-3">
      <div>
        <p className="text-xs font-extrabold text-white">{viewProps.title}</p>
        <p className="mt-0.5 text-[10px] text-slate-400">{viewProps.description}</p>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
        {viewProps.groups.map((group) => (
          <div key={group.groupKey} className="rounded-xl border border-slate-800 bg-slate-900/70 p-2.5">
            <p className="text-[10px] font-extrabold text-slate-300">{group.label}</p>
            {group.videos.length === 0 ? (
              <p className="mt-2 text-[10px] text-slate-500">아직 없음</p>
            ) : (
              <div className="mt-2 space-y-1.5">
                {group.videos.map((item) => (
                    <div key={`${group.groupKey}-${item.video.videoId}`} className="rounded-lg bg-slate-950/70 p-1.5">
                      <a
                        href={item.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-[10px] font-bold text-slate-200 hover:text-white"
                        title={item.videoTitle}
                        aria-label={`${item.videoTitle} YouTube 원본 영상 열기`}
                      >
                        {item.videoTitle}
                      </a>
                      <button
                        type="button"
                        onClick={() => onRestoreVideo(item.video.videoId)}
                        className="mt-1 inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-200 hover:text-white"
                        title={item.restoreButtonProps.title}
                        aria-label={item.restoreButtonProps['aria-label']}
                      >
                        <RotateCcw className="h-3 w-3" /> {item.restoreButtonProps.label}
                      </button>
                    </div>
                  ))}
                {group.overflowText && (
                  <p className="text-[10px] font-bold text-slate-500">{group.overflowText}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
