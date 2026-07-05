import { getVideoListTableViewProps } from '../utils/videoListTableProps';
import VideoListTableRow from './VideoListTableRow';

const toArray = (items) => (Array.isArray(items) ? items : []);

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
  const {
    getRowProps,
    headers,
  } = getVideoListTableViewProps({
    checkedVideos,
    isProductionCandidate,
    isVideoSaved,
    fetchTopComments,
    promoteVideoToProduction,
    toggleCheckVideo,
    toggleScrapVideo,
  });
  const headerList = toArray(headers);
  const videoList = toArray(videos);

  return (
    <div className="overflow-x-auto overflow-y-auto flex-1">
      <table className="w-full text-sm text-left border-separate border-spacing-y-3">
        <thead className="text-xs text-slate-500 uppercase bg-slate-100 sticky top-0 shadow-sm z-10">
          <tr>
            {headerList.map((header) => (
              <th key={header.key} className={header.className}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {videoList.map((video) => (
            <VideoListTableRow key={video.videoId} {...getRowProps(video)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
