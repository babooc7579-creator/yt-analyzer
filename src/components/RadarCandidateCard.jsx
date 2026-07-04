import { getYouTubeVideoUrl } from '../utils/urls';
import { hasStrongReaction, isTtoTtoCandidate } from '../utils/video';
import RadarCandidateBadges from './RadarCandidateBadges';
import RadarCandidateDecisionActions from './RadarCandidateDecisionActions';
import RadarCandidateMetrics from './RadarCandidateMetrics';
import RadarCandidatePrimaryActions from './RadarCandidatePrimaryActions';
import RadarCandidateScorePanel from './RadarCandidateScorePanel';
import RadarCandidateThumbnail from './RadarCandidateThumbnail';
import RadarCandidateTitleLink from './RadarCandidateTitleLink';

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
      <RadarCandidateThumbnail
        index={index}
        priorityLabel={priorityLabel}
        video={video}
        videoTitle={videoTitle}
      />
      <div className="p-4">
        <RadarCandidateBadges isStrong={isStrong} isTtoTto={isTtoTto} />
        <RadarCandidateTitleLink videoTitle={videoTitle} videoUrl={videoUrl} />
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
