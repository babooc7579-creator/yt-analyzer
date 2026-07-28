import { getVideoListTableViewProps } from '../utils/videoListTableProps';
import VideoMobileListItem from './VideoMobileListItem';
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
        모바일 리스트는 제목·조회수·대박 지수·게시일과 핵심 작업만 간단히 보여줍니다.
      </p>
      <div className="space-y-3 overflow-y-auto bg-slate-100 p-3 md:hidden">
        {videoList.map((video) => (
          <VideoMobileListItem key={video.videoId} {...getRowProps(video)} />
        ))}
      </div>
      <div className="hidden min-h-0 flex-1 overflow-x-auto overflow-y-auto md:block">
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
