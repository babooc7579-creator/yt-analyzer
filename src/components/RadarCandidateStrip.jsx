import React, { useMemo } from 'react';
import { Star } from 'lucide-react';
import RadarCandidateCard, { getRadarScore } from './RadarCandidateCard';
import RadarCandidateCompletedState from './RadarCandidateCompletedState';
import RadarCandidateEmptyState from './RadarCandidateEmptyState';
import RadarDecisionPanel from './RadarDecisionPanel';
import {
  PRODUCTION_STATUS,
  VIDEO_STATUS,
  hasAnyVideoReviewStatus,
  hasProductionStatus,
  hasVideoReviewStatus,
  isRadarHiddenRecord,
} from '../constants/status';

export default function RadarCandidateStrip({
  videos,
  savedVideos,
  videoUserRecords,
  isVideoSaved,
  onToggleScrap,
  onMarkVideoStatus,
  onPromoteToProduction,
  onRestoreVideo,
  onClearDecisions,
  onOpenVault,
  onOpenScrapbook,
}) {
  const decisionBuckets = useMemo(() => (
    videos.reduce((buckets, video) => {
      const record = videoUserRecords[video.videoId];
      if (hasVideoReviewStatus(record, VIDEO_STATUS.REVIEWED)) buckets.reviewed.push(video);
      if (hasAnyVideoReviewStatus(record, [VIDEO_STATUS.LEGACY_LATER, VIDEO_STATUS.WATCH_LATER])) buckets.later.push(video);
      if (hasVideoReviewStatus(record, VIDEO_STATUS.EXCLUDED)) buckets.excluded.push(video);
      if (hasProductionStatus(record, PRODUCTION_STATUS.CANDIDATE)) buckets.production.push(video);
      return buckets;
    }, { reviewed: [], later: [], excluded: [], production: [] })
  ), [videos, videoUserRecords]);

  const decisionSummary = {
    reviewed: decisionBuckets.reviewed.length,
    later: decisionBuckets.later.length,
    excluded: decisionBuckets.excluded.length,
    production: decisionBuckets.production.length,
  };

  const loadedDecisionCount = decisionSummary.reviewed + decisionSummary.later + decisionSummary.excluded + decisionSummary.production;

  const allDecisionCount = useMemo(() => (
    Object.values(videoUserRecords).filter(isRadarHiddenRecord).length
  ), [videoUserRecords]);

  const candidates = useMemo(() => (
    [...videos]
      .filter((video) => {
        const record = videoUserRecords[video.videoId];
        return !isRadarHiddenRecord(record);
      })
      .sort((a, b) => getRadarScore(b) - getRadarScore(a))
      .slice(0, 3)
  ), [videos, videoUserRecords]);

  const decisionGroups = [
    { key: 'reviewed', label: '봤음', videos: decisionBuckets.reviewed },
    { key: 'later', label: '나중에 보기', videos: decisionBuckets.later },
    { key: 'production', label: '제작 후보', videos: decisionBuckets.production },
    { key: 'excluded', label: '제외', videos: decisionBuckets.excluded },
  ];

  if (videos.length === 0) {
    return <RadarCandidateEmptyState onOpenVault={onOpenVault} />;
  }

  if (candidates.length === 0) {
    return (
      <RadarCandidateCompletedState
        decisionGroups={decisionGroups}
        decisionSummary={decisionSummary}
        loadedDecisionCount={loadedDecisionCount}
        onClearDecisions={onClearDecisions}
        onOpenVault={onOpenVault}
        onRestoreVideo={onRestoreVideo}
      />
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-extrabold text-rose-100">오늘 볼 후보</p>
          <p className="mt-1 text-xs text-rose-100/70">현재 불러온 영상에서 또터또 가능성과 반응 강도를 기준으로 먼저 볼 3개를 고릅니다. 전체 처리 기록 {allDecisionCount}개는 숨겨집니다.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {allDecisionCount > 0 && (
            <button
              type="button"
              onClick={onClearDecisions}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-950/50 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-900"
              title="Cloud에 저장된 판단 기록을 초기화"
              aria-label="Cloud에 저장된 오늘 레이더 판단 기록 초기화"
            >
              판단 초기화
            </button>
          )}
          <button
            type="button"
            onClick={onOpenScrapbook}
            className="inline-flex items-center gap-2 rounded-xl border border-yellow-400/20 bg-yellow-500/10 px-3 py-2 text-xs font-bold text-yellow-100 hover:bg-yellow-500/15"
            title="Cloud 스크랩북 화면으로 이동"
            aria-label={`Cloud 스크랩북 화면으로 이동, 스크랩 ${savedVideos.length}개`}
          >
            <Star className="h-4 w-4" /> 스크랩 {savedVideos.length}개
          </button>
        </div>
      </div>

      <RadarDecisionPanel
        decisionGroups={decisionGroups}
        decisionSummary={decisionSummary}
        loadedDecisionCount={loadedDecisionCount}
        onRestoreVideo={onRestoreVideo}
      />

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {candidates.map((video, index) => (
          <RadarCandidateCard
            key={video.videoId}
            index={index}
            isSaved={isVideoSaved(video.videoId)}
            video={video}
            onMarkVideoStatus={onMarkVideoStatus}
            onPromoteToProduction={onPromoteToProduction}
            onToggleScrap={onToggleScrap}
          />
        ))}
      </div>
    </div>
  );
}
