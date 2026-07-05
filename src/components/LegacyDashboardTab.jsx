import VideoDashboardControls from './VideoDashboardControls';
import VideoResultsPanel from './VideoResultsPanel';
import { getLegacyDashboardTabViewProps } from '../utils/legacyDashboardTabViewProps';

export default function LegacyDashboardTab(props) {
  const { controlsProps, resultsPanelProps } = getLegacyDashboardTabViewProps(props);

  return (
    <>
      <VideoDashboardControls {...controlsProps} />

      <div className="bg-slate-100 rounded-2xl shadow-sm border border-slate-300 overflow-hidden flex-1 relative flex flex-col min-h-[600px]">
        <p className="px-4 pt-3 text-[10px] text-slate-500">댓글 Top 10 보기는 YouTube API로 댓글을 조회합니다. 저장된 영상 불러오기와는 별도 기능입니다.</p>
        <VideoResultsPanel {...resultsPanelProps} />
      </div>
    </>
  );
}
