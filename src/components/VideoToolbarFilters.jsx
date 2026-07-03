import { Search } from 'lucide-react';
import VideoToolbarSortControl from './VideoToolbarSortControl';

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

      <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
        <button type="button" onClick={() => setViewMode('card')} title="영상 후보를 카드 형태로 보기" aria-label="카드 보기로 전환" className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${viewMode === 'card' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}>카드 보기</button>
        <button type="button" onClick={() => setViewMode('list')} title="영상 후보를 표 형태로 보기" aria-label="리스트 보기로 전환" className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}>리스트 보기</button>
      </div>

      <button
        type="button"
        onClick={() => setShowWorkPanel(!showWorkPanel)}
        className={`px-3 py-2 rounded-lg text-sm font-bold transition-all border ${showWorkPanel ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-700'}`}
        title={showWorkPanel ? '작업 패널 숨기기' : '카드 보기에서 작업 패널 함께 보기'}
        aria-label={showWorkPanel ? '작업 패널 닫기' : '작업 패널 열기'}
      >
        {showWorkPanel ? '작업 패널 닫기' : '작업 패널 열기'}
      </button>
    </div>
  );
}
