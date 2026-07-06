import { LANGUAGES } from '../constants/languages';

export const getVideoListRowMetaActionsViewProps = ({
  fetchTopComments,
  video,
  videoTitle,
  videoUrl,
}) => ({
  commentsButtonProps: {
    className: 'text-[11px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded-full font-bold border border-indigo-100 flex items-center gap-1 transition-colors',
    onClick: () => fetchTopComments(video.videoId, video.title),
    title: 'YouTube API로 댓글 Top 10을 조회합니다. 저장 영상 불러오기와 다른 작업입니다.',
    'aria-label': `${videoTitle} 댓글 Top 10 조회 - YouTube API 호출`,
    type: 'button',
  },
  copyUrlButtonProps: {
    ariaLabel: `${videoTitle} YouTube 원본 URL 복사`,
    className: 'text-[11px] bg-slate-50 text-slate-600 hover:bg-slate-100 px-2 py-1 rounded-full font-bold border border-slate-200 flex items-center gap-1 transition-colors disabled:text-slate-300',
    copiedLabel: '복사 완료',
    label: 'URL 복사',
    title: 'YouTube 원본 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다.',
    url: videoUrl,
  },
  durationBadge: {
    isShorts: video.isShorts,
    text: video.isShorts ? `Shorts (${video.duration})` : video.duration,
  },
  languageLabel: LANGUAGES.find((language) => language.code === video.language)?.label || '언어 미상',
});
