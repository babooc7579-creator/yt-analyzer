import { getYouTubeVideoUrl } from '../utils/urls';
import { hasStrongReaction, isTtoTtoCandidate } from '../utils/video';
import RadarCandidateBadges from './RadarCandidateBadges';
import RadarCandidateDecisionActions from './RadarCandidateDecisionActions';
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
        <RadarCandidateDecisionActions
          isSaved={isSaved}
          onMarkVideoStatus={onMarkVideoStatus}
          onPromoteToProduction={onPromoteToProduction}
          onToggleScrap={onToggleScrap}
          video={video}
          videoTitle={videoTitle}
        />
      </div>
    </article>
  );
}
