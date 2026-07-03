import { CheckCircle2, Clock, Rocket, Star, XCircle } from 'lucide-react';
import { VIDEO_STATUS } from '../constants/status';
import { getYouTubeVideoUrl } from '../utils/urls';
import { hasStrongReaction, isTtoTtoCandidate } from '../utils/video';
import RadarCandidateBadges from './RadarCandidateBadges';
import RadarCandidateMetrics from './RadarCandidateMetrics';
import RadarCandidatePrimaryActions from './RadarCandidatePrimaryActions';
import RadarCandidateScorePanel from './RadarCandidateScorePanel';

export const getRadarScore = (video) => {
  const ttoTtoBonus = isTtoTtoCandidate(video) ? 100 : 0;
  const strongBonus = hasStrongReaction(video) ? 60 : 0;
  const savedAgeBonus = Math.min(Number(video.daysOld || 0) / 30, 20);

  return ttoTtoBonus + strongBonus + Number(video.multiplier || 0) * 10 + Number(video.like_ratio || 0) + savedAgeBonus;
};

const getRadarReasons = (video) => {
  const reasons = [];

  if (isTtoTtoCandidate(video)) reasons.push('오래됐지만 다시 볼 만함');
  if (hasStrongReaction(video)) reasons.push('채널 평균보다 강한 반응');
  if (Number(video.like_ratio || 0) >= 3) reasons.push('참여율 양호');
  if (Number(video.view_count || 0) >= 1000000) reasons.push('검증된 조회수');

  return reasons.length > 0 ? reasons : ['기본 점수 상위'];
};

const getPriorityLabel = (score) => {
  if (score >= 180) return '최우선';
  if (score >= 120) return '우선 검토';
  return '확인 필요';
};

export default function RadarCandidateCard({
  index,
  isSaved,
  video,
  onMarkVideoStatus,
  onPromoteToProduction,
  onToggleScrap,
}) {
  const videoTitle = video.title || '제목 없는 영상';
  const isTtoTto = isTtoTtoCandidate(video);
  const isStrong = hasStrongReaction(video);
  const radarScore = Math.round(getRadarScore(video));
  const priorityLabel = getPriorityLabel(radarScore);
  const reasons = getRadarReasons(video);
  const videoUrl = getYouTubeVideoUrl(video.videoId);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
      <div className="relative">
        <img src={video.thumbnail} alt={`${videoTitle} 썸네일`} className="aspect-video w-full object-cover" />
        <span className="absolute left-2 top-2 rounded-full bg-black/80 px-2 py-1 text-[10px] font-extrabold text-white">#{index + 1}</span>
        <span className="absolute right-2 top-2 rounded-full bg-rose-600 px-2 py-1 text-[10px] font-extrabold text-white">{priorityLabel}</span>
      </div>
      <div className="p-4">
        <RadarCandidateBadges isStrong={isStrong} isTtoTto={isTtoTto} />
        <a href={videoUrl} target="_blank" rel="noreferrer" className="line-clamp-2 text-sm font-extrabold leading-snug text-white hover:text-rose-100" title={videoTitle} aria-label={`${videoTitle} YouTube 원본 영상 열기`}>
          {video.title}
        </a>
        <RadarCandidateScorePanel radarScore={radarScore} reasons={reasons} />
        <RadarCandidateMetrics video={video} />
        <RadarCandidatePrimaryActions videoTitle={videoTitle} videoUrl={videoUrl} />
        <p className="mt-3 text-[10px] font-bold text-slate-400">2. 판단 결과는 Cloud 판단 기록에 저장되고 오늘 레이더에서 숨겨집니다. YouTube API를 새로 호출하지 않습니다.</p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onToggleScrap(video)}
            className={`inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-[11px] font-extrabold ${isSaved ? 'bg-yellow-400 text-slate-950 hover:bg-yellow-300' : 'bg-yellow-500/10 text-yellow-100 ring-1 ring-yellow-400/20 hover:bg-yellow-500/15'}`}
            title={isSaved ? 'Cloud 스크랩북에서 보관 해제' : 'Cloud 스크랩북에 소재로 보관'}
            aria-label={`${videoTitle} ${isSaved ? 'Cloud 스크랩북에서 보관 해제' : 'Cloud 스크랩북에 소재로 보관'}`}
          >
            <Star className={`h-3.5 w-3.5 ${isSaved ? 'fill-slate-950' : ''}`} /> {isSaved ? '보관됨' : '소재 보관'}
          </button>
          <button
            type="button"
            onClick={() => onPromoteToProduction(video)}
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-indigo-500/15 px-3 py-2 text-[11px] font-extrabold text-indigo-100 ring-1 ring-indigo-400/20 hover:bg-indigo-500/20"
            title="Cloud 판단 기록에 제작 후보 상태로 저장하고 오늘 레이더에서 숨김. YouTube API를 새로 호출하지 않습니다."
            aria-label={`${videoTitle} Cloud 판단 기록에 제작 후보로 저장, YouTube API 호출 없음`}
          >
            <Rocket className="h-3.5 w-3.5" /> 제작 후보로
          </button>
          <button
            type="button"
            onClick={() => onMarkVideoStatus(video.videoId, VIDEO_STATUS.REVIEWED)}
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-500/10 px-3 py-2 text-[11px] font-extrabold text-emerald-100 ring-1 ring-emerald-400/20 hover:bg-emerald-500/15"
            title="Cloud 판단 기록에 봤음으로 저장하고 오늘 레이더에서 숨김"
            aria-label={`${videoTitle} Cloud 판단 기록에 봤음으로 저장`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> 봤음
          </button>
          <button
            type="button"
            onClick={() => onMarkVideoStatus(video.videoId, VIDEO_STATUS.LEGACY_LATER)}
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-[11px] font-extrabold text-slate-200 hover:bg-slate-700"
            title="Cloud 판단 기록에 나중에 보기로 저장하고 오늘 레이더에서 숨김"
            aria-label={`${videoTitle} Cloud 판단 기록에 나중에 보기로 저장`}
          >
            <Clock className="h-3.5 w-3.5" /> 나중에 보기
          </button>
          <button
            type="button"
            onClick={() => onMarkVideoStatus(video.videoId, VIDEO_STATUS.EXCLUDED)}
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-extrabold text-slate-300 ring-1 ring-slate-700 hover:bg-slate-800 sm:col-span-2"
            title="Cloud 판단 기록에 후보 제외로 저장하고 오늘 레이더에서 숨김"
            aria-label={`${videoTitle} Cloud 판단 기록에 후보에서 제외로 저장`}
          >
            <XCircle className="h-3.5 w-3.5" /> 후보에서 제외
          </button>
        </div>
      </div>
    </article>
  );
}
