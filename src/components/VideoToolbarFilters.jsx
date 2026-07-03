import { Search } from 'lucide-react';
import VideoToolbarSortControl from './VideoToolbarSortControl';
import VideoToolbarViewModeControl from './VideoToolbarViewModeControl';
import VideoToolbarWorkPanelToggle from './VideoToolbarWorkPanelToggle';

export default function VideoToolbarFilters({
  lengthFilter,
  searchKeyword,
  setLengthFilter,
  setSearchKeyword,
  setShowWorkPanel,
  setSortType,
  setViewFilter,
  setViewMode,
  showWorkPanel,
  sortType,
  viewFilter,
  viewMode,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="제목 검색..."
          className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-56 focus:ring-2 focus:ring-indigo-500 outline-none"
          title="불러온 저장 영상 제목 검색"
          aria-label="저장 영상 제목 검색"
        />
      </div>

      <select
        value={viewFilter}
        onChange={(e) => setViewFilter(Number(e.target.value))}
        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer text-slate-700 font-medium"
        title="불러온 저장 영상의 조회수 조건 필터"
        aria-label="조회수 조건 필터"
      >
        <option value={0}>👁️ 조회수 전체</option>
        <option value={100000}>🔥 10만 이상</option>
        <option value={500000}>🔥🔥 50만 이상</option>
        <option value={1000000}>👑 100만 이상</option>
      </select>

      <select
        value={lengthFilter}
        onChange={(e) => setLengthFilter(e.target.value)}
        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer text-slate-700 font-medium"
        title="쇼츠/롱폼 길이 필터"
        aria-label="영상 길이 필터"
      >
        <option value="all">🎬 길이 전체</option>
        <option value="shorts">📱 쇼츠만</option>
        <option value="long">🎞️ 롱폼만</option>
      </select>

      <VideoToolbarSortControl setSortType={setSortType} sortType={sortType} />

      <VideoToolbarViewModeControl setViewMode={setViewMode} viewMode={viewMode} />

      <VideoToolbarWorkPanelToggle
        setShowWorkPanel={setShowWorkPanel}
        showWorkPanel={showWorkPanel}
      />
    </div>
  );
}
