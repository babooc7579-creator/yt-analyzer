import React, { useMemo } from 'react';
import { Bookmark, CheckCircle2, Clock, ExternalLink, Play, Rocket, Star, TrendingUp, XCircle } from 'lucide-react';
import { hasAnyVideoStatus, hasVideoStatus, PRODUCTION_STATUS, RADAR_HIDDEN_VIDEO_STATUSES, VIDEO_STATUS } from '../constants/status';
import { hasStrongReaction, isTtoTtoCandidate } from '../utils/video';

const getRadarScore = (video) => {
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

export default function RadarCandidateStrip({
  videos,
  savedVideos,
  videoUserRecords,
  isVideoSaved,
  onToggleScrap,
  onMarkVideoStatus,
  onPromoteToProduction,
  onClearDecisions,
  onOpenVault,
  onOpenScrapbook,
}) {
  const decidedCount = useMemo(() => (
    Object.values(videoUserRecords).filter((record) => hasAnyVideoStatus(record, RADAR_HIDDEN_VIDEO_STATUSES)).length
  ), [videoUserRecords]);

  const decisionSummary = useMemo(() => (
    videos.reduce((summary, video) => {
      const record = videoUserRecords[video.videoId];
      if (hasVideoStatus(record, VIDEO_STATUS.REVIEWED)) summary.reviewed += 1;
      if (hasAnyVideoStatus(record, [VIDEO_STATUS.LEGACY_LATER, VIDEO_STATUS.WATCH_LATER])) summary.later += 1;
      if (hasVideoStatus(record, VIDEO_STATUS.EXCLUDED)) summary.excluded += 1;
      if (hasAnyVideoStatus(record, [VIDEO_STATUS.PRODUCTION_CANDIDATE, PRODUCTION_STATUS.CANDIDATE])) summary.production += 1;
      return summary;
    }, { reviewed: 0, later: 0, excluded: 0, production: 0 })
  ), [videos, videoUserRecords]);

  const decisionBuckets = useMemo(() => (
    videos.reduce((buckets, video) => {
      const record = videoUserRecords[video.videoId];
      if (hasVideoStatus(record, VIDEO_STATUS.REVIEWED)) buckets.reviewed.push(video);
      if (hasAnyVideoStatus(record, [VIDEO_STATUS.LEGACY_LATER, VIDEO_STATUS.WATCH_LATER])) buckets.later.push(video);
      if (hasVideoStatus(record, VIDEO_STATUS.EXCLUDED)) buckets.excluded.push(video);
      if (hasAnyVideoStatus(record, [VIDEO_STATUS.PRODUCTION_CANDIDATE, PRODUCTION_STATUS.CANDIDATE])) buckets.production.push(video);
      return buckets;
    }, { reviewed: [], later: [], excluded: [], production: [] })
  ), [videos, videoUserRecords]);

  const candidates = useMemo(() => (
    [...videos]
      .filter((video) => {
        const record = videoUserRecords[video.videoId];
        return !hasAnyVideoStatus(record, RADAR_HIDDEN_VIDEO_STATUSES);
      })
      .sort((a, b) => getRadarScore(b) - getRadarScore(a))
      .slice(0, 3)
  ), [videos, videoUserRecords]);

  if (videos.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 p-5">
        <p className="text-sm font-extrabold text-white">오늘 볼 후보</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">아직 화면에 불러온 영상이 없습니다. 저장된 영상 불러오기를 실행하면 여기에서 오늘 먼저 볼 후보를 보여줍니다.</p>
        <button onClick={onOpenVault} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-200 hover:bg-blue-500/15">
          <Bookmark className="h-4 w-4" /> 레퍼런스 금고 열기
        </button>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
        <p className="text-sm font-extrabold text-emerald-100">오늘 볼 후보를 모두 처리했습니다</p>
        <p className="mt-2 text-xs leading-relaxed text-emerald-100/70">검토 완료 또는 나중에 보기로 표시한 후보는 오늘의 레이더에서 숨겨집니다. 필요하면 판단 기록을 초기화할 수 있습니다.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={onOpenVault} className="inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-100 hover:bg-blue-500/15">
            <Bookmark className="h-4 w-4" /> 레퍼런스 금고 열기
          </button>
          <button onClick={onClearDecisions} className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-100 hover:bg-emerald-500/15">
            <CheckCircle2 className="h-4 w-4" /> 판단 기록 초기화
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-extrabold text-rose-100">오늘 볼 후보</p>
          <p className="mt-1 text-xs text-rose-100/70">현재 불러온 영상에서 터또터 가능성과 반응 강도를 기준으로 먼저 볼 3개를 골랐습니다. 처리한 후보 {decidedCount}개는 숨겨집니다.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {decidedCount > 0 && (
            <button onClick={onClearDecisions} className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-950/50 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-900">
              판단 초기화
            </button>
          )}
          <button onClick={onOpenScrapbook} className="inline-flex items-center gap-2 rounded-xl border border-yellow-400/20 bg-yellow-500/10 px-3 py-2 text-xs font-bold text-yellow-100 hover:bg-yellow-500/15">
            <Star className="h-4 w-4" /> 스크랩 {savedVideos.length}개
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2">
          <p className="text-[10px] font-extrabold text-emerald-100">봤음</p>
          <p className="mt-1 text-lg font-black text-white">{decisionSummary.reviewed}</p>
        </div>
        <div className="rounded-xl border border-slate-500/30 bg-slate-900/60 px-3 py-2">
          <p className="text-[10px] font-extrabold text-slate-200">나중에 보기</p>
          <p className="mt-1 text-lg font-black text-white">{decisionSummary.later}</p>
        </div>
        <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-3 py-2">
          <p className="text-[10px] font-extrabold text-indigo-100">제작 후보</p>
          <p className="mt-1 text-lg font-black text-white">{decisionSummary.production}</p>
        </div>
        <div className="rounded-xl border border-slate-500/30 bg-slate-950/70 px-3 py-2">
          <p className="text-[10px] font-extrabold text-slate-300">제외</p>
          <p className="mt-1 text-lg font-black text-white">{decisionSummary.excluded}</p>
        </div>
      </div>

      {decidedCount > 0 && (
        <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-950/50 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold text-white">처리 기록</p>
              <p className="mt-0.5 text-[10px] text-slate-400">현재 불러온 영상에서 이미 판단한 항목입니다. 제목을 누르면 YouTube에서 다시 확인할 수 있습니다.</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
            {[
              { key: 'reviewed', label: '봤음', videos: decisionBuckets.reviewed },
              { key: 'later', label: '나중에 보기', videos: decisionBuckets.later },
              { key: 'production', label: '제작 후보', videos: decisionBuckets.production },
              { key: 'excluded', label: '제외', videos: decisionBuckets.excluded },
            ].map((group) => (
              <div key={group.key} className="rounded-xl border border-slate-800 bg-slate-900/70 p-2.5">
                <p className="text-[10px] font-extrabold text-slate-300">{group.label}</p>
                {group.videos.length === 0 ? (
                  <p className="mt-2 text-[10px] text-slate-500">아직 없음</p>
                ) : (
                  <div className="mt-2 space-y-1.5">
                    {group.videos.slice(0, 3).map((video) => (
                      <a
                        key={`${group.key}-${video.videoId}`}
                        href={`https://youtube.com/watch?v=${video.videoId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate rounded-lg bg-slate-950/70 px-2 py-1.5 text-[10px] font-bold text-slate-200 hover:text-white"
                        title={video.title}
                      >
                        {video.title}
                      </a>
                    ))}
                    {group.videos.length > 3 && (
                      <p className="text-[10px] font-bold text-slate-500">외 {group.videos.length - 3}개</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {candidates.map((video, index) => {
          const isTtoTto = isTtoTtoCandidate(video);
          const isStrong = hasStrongReaction(video);
          const saved = isVideoSaved(video.videoId);
          const radarScore = Math.round(getRadarScore(video));
          const priorityLabel = getPriorityLabel(radarScore);
          const reasons = getRadarReasons(video);

          return (
            <article key={video.videoId} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
              <div className="relative">
                <img src={video.thumbnail} alt="" className="aspect-video w-full object-cover" />
                <span className="absolute left-2 top-2 rounded-full bg-black/80 px-2 py-1 text-[10px] font-extrabold text-white">#{index + 1}</span>
                <span className="absolute right-2 top-2 rounded-full bg-rose-600 px-2 py-1 text-[10px] font-extrabold text-white">{priorityLabel}</span>
              </div>
              <div className="p-4">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {isTtoTto && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2 py-1 text-[10px] font-extrabold text-white">
                      <Rocket className="h-3 w-3" /> 터또터
                    </span>
                  )}
                  {isStrong && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-700">
                      <TrendingUp className="h-3 w-3" /> 강한 반응
                    </span>
                  )}
                </div>
                <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noreferrer" className="line-clamp-2 text-sm font-extrabold leading-snug text-white hover:text-rose-100">
                  {video.title}
                </a>
                <div className="mt-3 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-extrabold text-rose-100">후보 판단 점수</p>
                    <p className="text-sm font-black text-white">{radarScore}</p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {reasons.map((reason) => (
                      <span key={reason} className="rounded-full border border-rose-300/20 bg-white/10 px-2 py-1 text-[10px] font-bold text-rose-50">
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-slate-900 px-2 py-2">
                    <p className="text-[9px] font-bold text-slate-500">대박지수</p>
                    <p className="text-sm font-extrabold text-white">{Number(video.multiplier || 0).toFixed(1)}x</p>
                  </div>
                  <div className="rounded-xl bg-slate-900 px-2 py-2">
                    <p className="text-[9px] font-bold text-slate-500">경과</p>
                    <p className="text-sm font-extrabold text-white">{video.daysOld}일</p>
                  </div>
                  <div className="rounded-xl bg-slate-900 px-2 py-2">
                    <p className="text-[9px] font-bold text-slate-500">참여율</p>
                    <p className="text-sm font-extrabold text-white">{video.like_ratio}%</p>
                  </div>
                </div>
                <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-extrabold text-slate-900 hover:bg-rose-50">
                  <Play className="h-4 w-4" /> 1. 영상 열고 판단 <ExternalLink className="h-3 w-3" />
                </a>
                <p className="mt-3 text-[10px] font-bold text-slate-400">2. 판단 결과를 남기면 오늘 레이더에서 숨겨집니다.</p>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button onClick={() => onToggleScrap(video)} className={`inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-[11px] font-extrabold ${saved ? 'bg-yellow-400 text-slate-950 hover:bg-yellow-300' : 'bg-yellow-500/10 text-yellow-100 ring-1 ring-yellow-400/20 hover:bg-yellow-500/15'}`}>
                    <Star className={`h-3.5 w-3.5 ${saved ? 'fill-slate-950' : ''}`} /> {saved ? '보관됨' : '소재 보관'}
                  </button>
                  <button onClick={() => onPromoteToProduction(video)} className="inline-flex items-center justify-center gap-1 rounded-xl bg-indigo-500/15 px-3 py-2 text-[11px] font-extrabold text-indigo-100 ring-1 ring-indigo-400/20 hover:bg-indigo-500/20">
                    <Rocket className="h-3.5 w-3.5" /> 제작 후보로
                  </button>
                  <button onClick={() => onMarkVideoStatus(video.videoId, VIDEO_STATUS.REVIEWED)} className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-500/10 px-3 py-2 text-[11px] font-extrabold text-emerald-100 ring-1 ring-emerald-400/20 hover:bg-emerald-500/15">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 봤음
                  </button>
                  <button onClick={() => onMarkVideoStatus(video.videoId, VIDEO_STATUS.LEGACY_LATER)} className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-[11px] font-extrabold text-slate-200 hover:bg-slate-700">
                    <Clock className="h-3.5 w-3.5" /> 나중에 보기
                  </button>
                  <button onClick={() => onMarkVideoStatus(video.videoId, VIDEO_STATUS.EXCLUDED)} className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-extrabold text-slate-300 ring-1 ring-slate-700 hover:bg-slate-800 sm:col-span-2">
                    <XCircle className="h-3.5 w-3.5" /> 후보에서 제외
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
