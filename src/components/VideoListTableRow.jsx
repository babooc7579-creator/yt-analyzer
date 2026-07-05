import { getVideoListTableRowViewProps } from '../utils/videoListTableRowProps';
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
  const {
    candidateActionProps,
    contentCellProps,
    markerCellsProps,
    rowClassName,
    statsCellsProps,
  } = getVideoListTableRowViewProps({
    fetchTopComments,
    isChecked,
    isProductionCandidate,
    isSaved,
    promoteVideoToProduction,
    toggleCheckVideo,
    toggleScrapVideo,
    video,
  });

  return (
    <tr className={rowClassName}>
      <VideoListRowMarkerCells {...markerCellsProps} />
      <VideoListRowContentCell {...contentCellProps} />
      <td className="px-3 py-5 text-center">
        <VideoListRowCandidateAction {...candidateActionProps} />
      </td>
      <VideoListRowStatsCells {...statsCellsProps} />
    </tr>
  );
}
