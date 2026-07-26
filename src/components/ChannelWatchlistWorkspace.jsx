import { useChannelWatchlistState } from '../hooks/useChannelWatchlistState';
import { useStoredVideoLoadFeedback } from '../hooks/useStoredVideoLoadFeedback';
import ChannelWatchlistCard from './ChannelWatchlistCard';
import ChannelWatchlistFilters from './ChannelWatchlistFilters';
import ChannelWatchlistHeader from './ChannelWatchlistHeader';
import ChannelWatchlistNextStep from './ChannelWatchlistNextStep';
import { getChannelWatchBulkSelection } from '../utils/channelWatchlist';

const SUMMARY_ITEMS = [
  ['savedChannelCount', '저장 채널'],
  ['activeChannelCount', '운영중'],
  ['highGradeChannelCount', 'S/A 등급'],
  ['neverScannedChannelCount', '미수집'],
  ['selectedChannelCount', '현재 선택'],
  ['filteredChannelCount', '현재 표시'],
];

export default function ChannelWatchlistWorkspace({
  channels,
  channelsLoading,
  onLoadStoredVideos,
  onOpenChannelList,
  onOpenRadar,
  onOpenStoredVideos,
  onOpenSelectedScan,
  onOpenTtoTto,
  onRefreshChannels,
  onSetSelectedChannelIds,
  onToggleSelection,
  selectedChannelIds,
}) {
  const selectedChannelKey = [...(Array.isArray(selectedChannelIds) ? selectedChannelIds : [])]
    .sort()
    .join('|');
  const {
    loadResult: storedVideoLoadResult,
    loading: storedVideoLoadPending,
    onLoadStoredVideos: loadStoredVideos,
  } = useStoredVideoLoadFeedback({
    onLoad: onLoadStoredVideos,
    selectionKey: selectedChannelKey,
  });

  const {
    filteredChannels,
    gradeFilter,
    hasActiveFilters,
    resetFilters,
    scanFilter,
    searchQuery,
    selectionFilter,
    setSelectionFilter,
    setGradeFilter,
    setScanFilter,
    setSearchQuery,
    setTagFilter,
    showMoreChannels,
    summary,
    tagFilter,
    tagOptions,
    visibleChannels,
  } = useChannelWatchlistState({ channels, selectedChannelIds });
  const selectedIds = new Set(Array.isArray(selectedChannelIds) ? selectedChannelIds : []);
  const allFilteredSelected = filteredChannels.length > 0
    && filteredChannels.every((channel) => selectedIds.has(channel.id));
  const canBulkSelect = filteredChannels.length > 0 && typeof onSetSelectedChannelIds === 'function';

  const toggleFilteredSelection = () => {
    if (!canBulkSelect) return;
    onSetSelectedChannelIds(getChannelWatchBulkSelection({
      channels: filteredChannels,
      selectedChannelIds,
      shouldSelect: !allFilteredSelected,
    }));
  };

  return (
    <section data-testid="creator-route-channel-watchlist" className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-slate-950/30 sm:p-6">
      <ChannelWatchlistHeader
        channelsLoading={channelsLoading}
        onLoadStoredVideos={loadStoredVideos}
        onOpenStoredVideos={onOpenStoredVideos}
        onOpenSelectedScan={onOpenSelectedScan}
        onOpenTtoTto={onOpenTtoTto}
        onRefreshChannels={onRefreshChannels}
        selectedChannelCount={summary.selectedChannelCount}
        storedVideoLoadPending={storedVideoLoadPending}
      />

      <ChannelWatchlistNextStep
        loadResult={storedVideoLoadResult}
        loading={storedVideoLoadPending}
        onOpenRadar={onOpenRadar}
        onOpenSelectedScan={onOpenSelectedScan}
        onRetry={loadStoredVideos}
      />

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {SUMMARY_ITEMS.map(([key, label]) => (
          <div key={key} className="border-l-2 border-slate-700 bg-slate-950/50 px-3 py-2">
            <p className="text-[10px] font-bold text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-black text-white">{Number(summary[key] || 0)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <ChannelWatchlistFilters
          gradeFilter={gradeFilter}
          hasActiveFilters={hasActiveFilters}
          onChangeGradeFilter={setGradeFilter}
          onChangeScanFilter={setScanFilter}
          onChangeSearchQuery={setSearchQuery}
          onChangeSelectionFilter={setSelectionFilter}
          onChangeTagFilter={setTagFilter}
          onResetFilters={resetFilters}
          scanFilter={scanFilter}
          searchQuery={searchQuery}
          selectionFilter={selectionFilter}
          tagFilter={tagFilter}
          tagOptions={tagOptions}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-y border-slate-800 py-3">
        <p className="text-xs font-bold text-slate-400">
          조건에 맞는 채널 <span className="text-white">{filteredChannels.length}개</span> · 현재 <span className="text-cyan-200">{visibleChannels.length}개 표시</span>
        </p>
        <button
          type="button"
          onClick={toggleFilteredSelection}
          disabled={!canBulkSelect}
          className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-extrabold text-cyan-100 hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          title="현재 검색과 분류 조건에 맞는 채널만 선택하거나 선택 해제합니다. 조회나 수집은 실행되지 않습니다."
        >
          {allFilteredSelected ? `현재 결과 ${filteredChannels.length}개 선택 해제` : `현재 결과 ${filteredChannels.length}개 모두 선택`}
        </button>
      </div>

      {channelsLoading && (!Array.isArray(channels) || channels.length === 0) ? (
        <p role="status" className="py-12 text-center text-sm font-bold text-slate-400">Cloud 채널 목록을 불러오는 중입니다.</p>
      ) : filteredChannels.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {visibleChannels.map((channel) => (
            <ChannelWatchlistCard
              key={channel.id}
              channel={channel}
              isSelected={selectedIds.has(channel.id)}
              onToggleSelection={onToggleSelection}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 border border-dashed border-slate-700 bg-slate-950/40 px-5 py-12 text-center">
          <h3 className="text-base font-extrabold text-white">표시할 운영중 채널이 없습니다</h3>
          <p className="mt-2 text-sm text-slate-400">필터를 초기화하거나 전체 채널 목록에서 상태와 등급을 확인하세요.</p>
          <div className="mt-4 flex justify-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-lg bg-white px-4 py-2 text-xs font-extrabold text-slate-950"
                title="채널 검색과 분류 필터를 초기화합니다. 화면 표시만 바꾸며 조회나 수집은 실행되지 않습니다."
                aria-label="채널 필터 초기화, 화면 표시만 변경"
              >
                필터 초기화
              </button>
            )}
            <button
              type="button"
              onClick={onOpenChannelList}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-extrabold text-slate-200"
              title="전체 채널 목록 화면으로 이동합니다. 이동만으로 Cloud DB 조회나 YouTube API 호출은 실행되지 않습니다."
              aria-label="전체 채널 목록 화면으로 이동, Cloud DB 조회 및 YouTube API 호출 없음"
            >
              전체 채널 목록
            </button>
          </div>
        </div>
      )}

      {visibleChannels.length < filteredChannels.length && (
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={showMoreChannels}
            className="rounded-lg border border-slate-600 bg-slate-950 px-5 py-2.5 text-xs font-extrabold text-slate-200 hover:border-cyan-500 hover:text-white"
            title="다음 채널을 화면에 더 표시합니다. 조회나 수집은 실행되지 않습니다."
          >
            채널 더 보기 ({visibleChannels.length}/{filteredChannels.length})
          </button>
        </div>
      )}
    </section>
  );
}
