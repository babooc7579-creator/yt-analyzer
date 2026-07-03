import React from 'react';
import { CheckSquare, Clock, MessageSquareText, Rocket, Square, Star } from 'lucide-react';
import { LANGUAGES } from '../constants/languages';
import { hasStrongReaction, isTtoTtoCandidate } from '../utils/video';
import { getYouTubeVideoUrl } from '../utils/urls';
import CopyUrlButton from './CopyUrlButton';
import VideoListRowBadges from './VideoListRowBadges';
import VideoListRowStatsCells from './VideoListRowStatsCells';

export default function VideoListTableRow({
  fetchTopComments,
  isChecked,
  isProductionCandidate,
  isSaved,
  promoteVideoToProduction,
  toggleCheckVideo,
  toggleScrapVideo,
  video,
}) {
  const videoTitle = video.title || '제목 없는 영상';
  const isStrongReaction = hasStrongReaction(video);
  const isTtoTto = isTtoTtoCandidate(video);
  const videoUrl = getYouTubeVideoUrl(video.videoId);

  return (
    <tr className={`group transition-all ${isChecked ? 'bg-indigo-50 ring-1 ring-indigo-200' : isStrongReaction || isTtoTto ? 'bg-rose-50/70 ring-1 ring-rose-100 hover:ring-rose-200' : 'bg-white hover:bg-slate-50 ring-1 ring-slate-100 hover:ring-slate-200'}`}>
      <td className="px-4 py-5 text-center rounded-l-2xl">
        <button
          type="button"
          onClick={() => toggleCheckVideo(video.videoId)}
          title="AI 리메이크 요청문에 포함할 영상으로 선택"
          aria-label={`${videoTitle} AI 리메이크 요청문 선택 ${isChecked ? '해제' : '추가'}`}
          className="focus:outline-none rounded-lg p-1 hover:bg-white transition-colors"
        >
          {isChecked ? <CheckSquare className="w-6 h-6 text-indigo-600" /> : <Square className="w-6 h-6 text-slate-300 hover:text-indigo-400" />}
        </button>
      </td>
      <td className="px-2 py-5 text-center">
        <button
          type="button"
          onClick={() => toggleScrapVideo(video)}
          title={isSaved ? 'Cloud 스크랩북에서 보관 해제' : 'Cloud 스크랩북에 소재로 보관'}
          aria-label={`${videoTitle} ${isSaved ? 'Cloud 스크랩북에서 보관 해제' : 'Cloud 스크랩북에 소재로 보관'}`}
          className="p-2 rounded-full hover:bg-yellow-100 transition-colors"
        >
          <Star className={`w-6 h-6 ${isSaved ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 group-hover:text-yellow-400'}`} />
        </button>
      </td>
      <td className="px-4 py-5 min-w-[520px]">
        <div className="flex gap-5">
          <img src={video.thumbnail} alt={`${videoTitle} 썸네일`} className="w-36 h-20 object-cover rounded-xl shadow-sm border border-slate-200 shrink-0 bg-slate-100" />
          <div className="flex flex-col justify-center min-w-0">
            <VideoListRowBadges
              isChecked={isChecked}
              isProductionCandidate={isProductionCandidate}
              isSaved={isSaved}
              isStrongReaction={isStrongReaction}
              isTtoTto={isTtoTto}
            />
            <a href={videoUrl} target="_blank" rel="noreferrer" className="text-base font-extrabold text-slate-900 hover:text-indigo-600 line-clamp-2 leading-snug mb-2" title={videoTitle} aria-label={`${videoTitle} YouTube 원본 영상 열기`}>{videoTitle}</a>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full border border-slate-200 font-semibold">{LANGUAGES.find((language) => language.code === video.language)?.label || '언어 미상'}</span>
              {video.isShorts ? (
                <span className="text-[11px] bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-bold">Shorts ({video.duration})</span>
              ) : (
                <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> {video.duration}</span>
              )}
              <button
                type="button"
                onClick={() => fetchTopComments(video.videoId, video.title)}
                title="YouTube API로 댓글 Top 10을 조회합니다"
                aria-label={`${videoTitle} 댓글 Top 10 조회 - YouTube API 호출`}
                className="text-[11px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded-full font-bold border border-indigo-100 flex items-center gap-1 transition-colors"
              >
                <MessageSquareText className="w-3 h-3" /> 댓글 Top 10 보기
              </button>
              <CopyUrlButton
                url={videoUrl}
                label="URL 복사"
                copiedLabel="복사 완료"
                ariaLabel={`${videoTitle} YouTube 원본 URL 복사`}
                title="YouTube 원본 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다."
                className="text-[11px] bg-slate-50 text-slate-600 hover:bg-slate-100 px-2 py-1 rounded-full font-bold border border-slate-200 flex items-center gap-1 transition-colors disabled:text-slate-300"
              />
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 py-5 text-center">
        <button
          type="button"
          onClick={() => promoteVideoToProduction(video)}
          disabled={isProductionCandidate}
          title={isProductionCandidate ? '이미 Cloud 판단 기록에 제작 후보로 저장됨' : 'Cloud 판단 기록에 제작 후보로 저장합니다. YouTube API를 새로 호출하지 않습니다.'}
          aria-label={`${videoTitle} ${isProductionCandidate ? '이미 Cloud 판단 기록에 제작 후보로 저장됨' : 'Cloud 판단 기록에 제작 후보로 저장, YouTube API 호출 없음'}`}
          className={`inline-flex min-w-[104px] items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-extrabold transition-colors ${isProductionCandidate ? 'cursor-not-allowed bg-indigo-100 text-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
        >
          <Rocket className="h-3.5 w-3.5" />
          {isProductionCandidate ? '등록됨' : '제작 후보로'}
        </button>
      </td>
      <VideoListRowStatsCells isStrongReaction={isStrongReaction} video={video} />
    </tr>
  );
}
