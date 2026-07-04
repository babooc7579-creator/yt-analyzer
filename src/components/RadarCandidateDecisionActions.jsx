import { CheckCircle2, Clock, Rocket, XCircle } from 'lucide-react';

import { VIDEO_STATUS } from '../constants/status';
import RadarCandidateScrapButton from './RadarCandidateScrapButton';
import RadarCandidateStatusButton from './RadarCandidateStatusButton';

export default function RadarCandidateDecisionActions({
  isSaved,
  onMarkVideoStatus,
  onPromoteToProduction,
  onToggleScrap,
  video,
  videoTitle,
}) {
  return (
    <>
      <p className="mt-3 text-[10px] font-bold text-slate-400">2. 판단 결과는 Cloud 판단 기록에 저장되고 오늘 레이더에서 숨겨집니다. YouTube API를 새로 호출하지 않습니다.</p>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <RadarCandidateScrapButton
          isSaved={isSaved}
          onToggleScrap={onToggleScrap}
          video={video}
          videoTitle={videoTitle}
        />
        <button
          type="button"
          onClick={() => onPromoteToProduction(video)}
          className="inline-flex items-center justify-center gap-1 rounded-xl bg-indigo-500/15 px-3 py-2 text-[11px] font-extrabold text-indigo-100 ring-1 ring-indigo-400/20 hover:bg-indigo-500/20"
          title="Cloud 판단 기록에 제작 후보 상태로 저장하고 오늘 레이더에서 숨김. YouTube API를 새로 호출하지 않습니다."
          aria-label={`${videoTitle} Cloud 판단 기록에 제작 후보로 저장, YouTube API 호출 없음`}
        >
          <Rocket className="h-3.5 w-3.5" /> 제작 후보로
        </button>
        <RadarCandidateStatusButton
          ariaLabel={`${videoTitle} Cloud 판단 기록에 봤음으로 저장`}
          className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-500/10 px-3 py-2 text-[11px] font-extrabold text-emerald-100 ring-1 ring-emerald-400/20 hover:bg-emerald-500/15"
          icon={CheckCircle2}
          label="봤음"
          onClick={() => onMarkVideoStatus(video.videoId, VIDEO_STATUS.REVIEWED)}
          title="Cloud 판단 기록에 봤음으로 저장하고 오늘 레이더에서 숨김"
        />
        <RadarCandidateStatusButton
          ariaLabel={`${videoTitle} Cloud 판단 기록에 나중에 보기로 저장`}
          className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-[11px] font-extrabold text-slate-200 hover:bg-slate-700"
          icon={Clock}
          label="나중에 보기"
          onClick={() => onMarkVideoStatus(video.videoId, VIDEO_STATUS.LEGACY_LATER)}
          title="Cloud 판단 기록에 나중에 보기로 저장하고 오늘 레이더에서 숨김"
        />
        <RadarCandidateStatusButton
          ariaLabel={`${videoTitle} Cloud 판단 기록에 후보에서 제외로 저장`}
          className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-extrabold text-slate-300 ring-1 ring-slate-700 hover:bg-slate-800 sm:col-span-2"
          icon={XCircle}
          label="후보에서 제외"
          onClick={() => onMarkVideoStatus(video.videoId, VIDEO_STATUS.EXCLUDED)}
          title="Cloud 판단 기록에 후보 제외로 저장하고 오늘 레이더에서 숨김"
        />
      </div>
    </>
  );
}
