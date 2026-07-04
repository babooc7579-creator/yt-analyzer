import React from 'react';
import { hasStrongReaction, isTtoTtoCandidate } from '../utils/video';
import { getYouTubeVideoUrl } from '../utils/urls';
import VideoListRowCandidateAction from './VideoListRowCandidateAction';
import VideoListRowContentCell from './VideoListRowContentCell';
import VideoListRowMarkerCells from './VideoListRowMarkerCells';
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
  const markerCellsProps = {
    isChecked,
    isSaved,
    onToggleCheck: () => toggleCheckVideo(video.videoId),
    onToggleScrap: () => toggleScrapVideo(video),
    videoTitle,
  };

  const contentCellProps = {
    fetchTopComments,
    isChecked,
    isProductionCandidate,
    isSaved,
    isStrongReaction,
    isTtoTto,
    video,
    videoTitle,
    videoUrl,
  };

  const candidateActionProps = {
    isProductionCandidate,
    onPromote: () => promoteVideoToProduction(video),
    videoTitle,
  };

  const statsCellsProps = {
    isStrongReaction,
    video,
  };

  return (
    <tr className={`group transition-all ${isChecked ? 'bg-indigo-50 ring-1 ring-indigo-200' : isStrongReaction || isTtoTto ? 'bg-rose-50/70 ring-1 ring-rose-100 hover:ring-rose-200' : 'bg-white hover:bg-slate-50 ring-1 ring-slate-100 hover:ring-slate-200'}`}>
      <VideoListRowMarkerCells {...markerCellsProps} />
      <VideoListRowContentCell {...contentCellProps} />
      <td className="px-3 py-5 text-center">
        <VideoListRowCandidateAction {...candidateActionProps} />
      </td>
      <VideoListRowStatsCells {...statsCellsProps} />
    </tr>
  );
}
