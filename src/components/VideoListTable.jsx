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
    <div className="flex min-h-0 flex-1 flex-col">
      <p className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold leading-relaxed text-slate-600 md:hidden">
        모바일에서는 카드 보기가 더 편합니다. 리스트 표는 좌우로 밀어서 확인할 수 있습니다.
      </p>
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
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
    </div>
  );
}
