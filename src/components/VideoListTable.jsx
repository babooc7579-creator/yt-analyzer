import React from 'react';
import { CheckSquare, Clock, MessageSquareText, Rocket, Square, Star, TrendingUp } from 'lucide-react';
import { LANGUAGES } from '../constants/languages';
import { hasStrongReaction, isTtoTtoCandidate, TTOTTO_MIN_DAYS_OLD, TTOTTO_MIN_MULTIPLIER } from '../utils/video';
import CopyUrlButton from './CopyUrlButton';
import { getYouTubeVideoUrl } from '../utils/urls';

export default function VideoListTable({
  videos,
  checkedVideos,
  isVideoSaved,
  isProductionCandidate,
  toggleCheckVideo,
  toggleScrapVideo,
  promoteVideoToProduction,
  fetchTopComments,
}) {
  return (
    <div className="overflow-x-auto overflow-y-auto flex-1">
      <table className="w-full text-sm text-left border-separate border-spacing-y-3">
        <thead className="text-xs text-slate-500 uppercase bg-slate-100 sticky top-0 shadow-sm z-10">
          <tr>
            <th className="px-3 py-3 text-center">AI 선택</th>
            <th className="px-2 py-3 text-center">소재</th>
            <th className="px-3 py-3">영상 정보</th>
            <th className="px-3 py-3 text-center">제작</th>
            <th className="px-3 py-3 text-right">총 조회수</th>
            <th className="px-3 py-3 text-right text-indigo-700 font-bold">대박 지수</th>
            <th className="px-3 py-3 text-right text-rose-600 font-bold">참여율</th>
            <th className="px-3 py-3 text-right">경과일</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => {
            const videoTitle = video.title || '제목 없는 영상';
            const isChecked = checkedVideos.includes(video.videoId);
            const isSaved = isVideoSaved(video.videoId);
            const productionCandidate = isProductionCandidate(video.videoId);
            const isStrongReaction = hasStrongReaction(video);
            const isTtoTto = isTtoTtoCandidate(video);
            const videoUrl = getYouTubeVideoUrl(video.videoId);

            return (
              <tr key={video.videoId} className={`group transition-all ${isChecked ? 'bg-indigo-50 ring-1 ring-indigo-200' : isStrongReaction || isTtoTto ? 'bg-rose-50/70 ring-1 ring-rose-100 hover:ring-rose-200' : 'bg-white hover:bg-slate-50 ring-1 ring-slate-100 hover:ring-slate-200'}`}>
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
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {isSaved && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-[10px] font-bold text-yellow-700">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-500" /> 소재 보관됨
                          </span>
                        )}
                        {productionCandidate && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
                            <Rocket className="w-3 h-3" /> 제작 후보
                          </span>
                        )}
                        {isChecked && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
                            <CheckSquare className="w-3 h-3" /> AI 리메이크 선택
                          </span>
                        )}
                        {(isStrongReaction || isTtoTto) && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm">
                            <Rocket className="w-3 h-3" /> 또터또 후보
                          </span>
                        )}
                        {isStrongReaction && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold text-orange-700">
                            <TrendingUp className="w-3 h-3" /> 강한 반응
                          </span>
                        )}
                      </div>
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
                    disabled={productionCandidate}
                    title={productionCandidate ? '이미 Cloud 판단 기록에 제작 후보로 저장됨' : 'Cloud 판단 기록에 제작 후보로 저장합니다. YouTube API를 새로 호출하지 않습니다.'}
                    aria-label={`${videoTitle} ${productionCandidate ? '이미 Cloud 판단 기록에 제작 후보로 저장됨' : 'Cloud 판단 기록에 제작 후보로 저장, YouTube API 호출 없음'}`}
                    className={`inline-flex min-w-[104px] items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-extrabold transition-colors ${productionCandidate ? 'cursor-not-allowed bg-indigo-100 text-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                  >
                    <Rocket className="h-3.5 w-3.5" />
                    {productionCandidate ? '등록됨' : '제작 후보로'}
                  </button>
                </td>
                <td className="px-4 py-5 text-right">
                  <div className="inline-flex min-w-[120px] flex-col rounded-xl bg-white/80 border border-slate-200 px-3 py-2 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400">총 조회수</span>
                    <span className="text-base font-extrabold text-slate-800">{video.view_count.toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-4 py-5 text-right">
                  <div className={`inline-flex min-w-[110px] flex-col rounded-xl border px-3 py-2 shadow-sm ${isStrongReaction ? 'bg-rose-600 border-rose-600 text-white' : video.multiplier >= TTOTTO_MIN_MULTIPLIER ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-white/80 border-slate-200 text-slate-600'}`}>
                    <span className={`text-[10px] font-bold ${isStrongReaction ? 'text-rose-100' : 'text-slate-400'}`}>대박 지수</span>
                    <span className="inline-flex items-center justify-end gap-1 text-lg font-extrabold">
                      {isStrongReaction && <TrendingUp className="w-4 h-4" />}
                      {video.multiplier.toFixed(1)}x
                    </span>
                  </div>
                </td>
                <td className="px-4 py-5 text-right">
                  <div className="inline-flex min-w-[110px] flex-col rounded-xl bg-white/80 border border-slate-200 px-3 py-2 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400">참여율</span>
                    <span className={`text-base font-extrabold ${video.like_ratio >= 3 ? 'text-rose-600' : 'text-slate-700'}`}>{video.like_ratio}%</span>
                    <span className="text-[10px] text-slate-400">좋아요 {video.like_count.toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-4 py-5 text-right rounded-r-2xl">
                  <div className={`inline-flex min-w-[120px] flex-col rounded-xl border px-3 py-2 shadow-sm ${video.daysOld >= TTOTTO_MIN_DAYS_OLD ? 'bg-orange-50 border-orange-100 text-orange-700' : 'bg-white/80 border-slate-200 text-slate-600'}`}>
                    <span className="text-[10px] font-bold text-slate-400">경과일</span>
                    <span className="text-base font-extrabold">{video.daysOld}일</span>
                    <span className="text-[10px] text-slate-400 font-normal">({video.upload_date})</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
