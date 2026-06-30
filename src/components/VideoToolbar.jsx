import React from 'react';
import { Loader2, RefreshCw, Rocket, Search } from 'lucide-react';

export default function VideoToolbar({
  isReferenceVaultView,
  filteredCount,
  totalCount,
  searchKeyword,
  setSearchKeyword,
  viewFilter,
  setViewFilter,
  lengthFilter,
  setLengthFilter,
  sortType,
  setSortType,
  viewMode,
  setViewMode,
  showWorkPanel,
  setShowWorkPanel,
  isScanning,
  selectedChannelCount,
  activeSelectedChannelCount,
  scannableChannelCount,
  handleManualScan,
  ttoTtoMode,
  setTtoTtoMode,
}) {
  const scanTargetCount = selectedChannelCount > 0 ? activeSelectedChannelCount : scannableChannelCount;

  return (
    <div className="bg-slate-100 rounded-2xl shadow-sm border border-slate-300 p-4 flex flex-col 2xl:flex-row gap-4 justify-between items-stretch z-20">
      <div className="flex flex-col gap-3 min-w-0 flex-1">
        {isReferenceVaultView && (
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold text-slate-900">보관함 도구막대</p>
              <p className="text-[11px] text-slate-500">검색, 필터, 정렬, 보기 방식을 바꿔 제작 소재를 좁혀봅니다.</p>
            </div>
            <p className="text-[10px] font-semibold text-slate-500">현재 표시 {filteredCount}개 / 전체 {totalCount}개</p>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3 w-full">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} placeholder="제목 검색..." className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-56 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <select value={viewFilter} onChange={(e) => setViewFilter(Number(e.target.value))} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer text-slate-700 font-medium">
            <option value={0}>👁️ 조회수 전체</option>
            <option value={100000}>🔥 10만 이상</option>
            <option value={500000}>🔥🔥 50만 이상</option>
            <option value={1000000}>👑 100만 이상</option>
          </select>

          <select value={lengthFilter} onChange={(e) => setLengthFilter(e.target.value)} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer text-slate-700 font-medium">
            <option value="all">🎬 길이 전체</option>
            <option value="shorts">📱 쇼츠만</option>
            <option value="long">🎞️ 롱폼만</option>
          </select>

          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button onClick={() => setSortType('multiplier')} className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${sortType === 'multiplier' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}>대박지수</button>
            <button onClick={() => setSortType('viral')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${sortType === 'viral' ? 'bg-white shadow text-orange-600' : 'text-slate-500 hover:text-slate-800'}`}>화제성(일평균)</button>
            <button onClick={() => setSortType('date')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${sortType === 'date' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>최신순</button>
            <button onClick={() => setSortType('likes')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${sortType === 'likes' ? 'bg-white shadow text-rose-600' : 'text-slate-500 hover:text-slate-800'}`}>참여율(좋아요)</button>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button onClick={() => setViewMode('card')} className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${viewMode === 'card' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}>카드 보기</button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}>리스트 보기</button>
          </div>

          <button
            onClick={() => setShowWorkPanel(!showWorkPanel)}
            className={`px-3 py-2 rounded-lg text-sm font-bold transition-all border ${showWorkPanel ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-700'}`}
          >
            {showWorkPanel ? '작업 패널 닫기' : '작업 패널 열기'}
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-3 2xl:max-w-[520px]">
        <button
          onClick={handleManualScan}
          disabled={isScanning}
          className={`shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm ${isScanning ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
        >
          {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
          {isScanning ? '새 영상 수집 중...' : selectedChannelCount > 0 ? `선택 채널 새 영상 수집 (${scanTargetCount}/${selectedChannelCount}개)` : `전체 운영중 채널 새 영상 수집 (${scanTargetCount}개)`}
        </button>
        <p className="max-w-[260px] text-[10px] leading-snug text-slate-600">
          {selectedChannelCount > 0
            ? '체크한 채널 중 운영중 채널만 YouTube API로 새 영상 여부를 확인합니다. 보류/제외 채널은 수집하지 않습니다.'
            : '선택한 채널이 없으면 전체 운영중 채널만 YouTube API로 확인합니다. 필요한 채널만 수집하려면 먼저 채널을 체크하세요.'}
        </p>
      </div>

      <button
        onClick={() => setTtoTtoMode(!ttoTtoMode)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold transition-all duration-300 shadow-sm ${ttoTtoMode ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-rose-200 ring-2 ring-rose-200 ring-offset-1 scale-105' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'}`}
      >
        <Rocket className={`w-5 h-5 ${ttoTtoMode ? 'animate-bounce' : ''}`} />
        터또터 발굴 (6개월+)
      </button>
    </div>
  );
}
