import React from 'react';
import VideoListTableRow from './VideoListTableRow';

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
          {videos.map((video) => (
            <VideoListTableRow
              key={video.videoId}
              fetchTopComments={fetchTopComments}
              isChecked={checkedVideos.includes(video.videoId)}
              isProductionCandidate={isProductionCandidate(video.videoId)}
              isSaved={isVideoSaved(video.videoId)}
              promoteVideoToProduction={promoteVideoToProduction}
              toggleCheckVideo={toggleCheckVideo}
              toggleScrapVideo={toggleScrapVideo}
              video={video}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
