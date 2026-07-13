import { useChannelWatchlistState } from '../hooks/useChannelWatchlistState';
import ChannelWatchlistCard from './ChannelWatchlistCard';
import ChannelWatchlistFilters from './ChannelWatchlistFilters';
import ChannelWatchlistHeader from './ChannelWatchlistHeader';

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
  onOpenSelectedScan,
  onRefreshChannels,
  onToggleSelection,
  selectedChannelIds,
}) {
  const {
    filteredChannels,
    gradeFilter,
    hasActiveFilters,
    resetFilters,
    scanFilter,
    searchQuery,
    setGradeFilter,
    setScanFilter,
    setSearchQuery,
    summary,
  } = useChannelWatchlistState({ channels, selectedChannelIds });
  const selectedIds = new Set(Array.isArray(selectedChannelIds) ? selectedChannelIds : []);

  return (
    <section data-testid="creator-route-channel-watchlist" className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-slate-950/30 sm:p-6">
      <ChannelWatchlistHeader
        channelsLoading={channelsLoading}
        onLoadStoredVideos={onLoadStoredVideos}
        onOpenSelectedScan={onOpenSelectedScan}
        onRefreshChannels={onRefreshChannels}
        selectedChannelCount={summary.selectedChannelCount}
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
          onResetFilters={resetFilters}
          scanFilter={scanFilter}
          searchQuery={searchQuery}
        />
      </div>

      {channelsLoading && (!Array.isArray(channels) || channels.length === 0) ? (
        <p role="status" className="py-12 text-center text-sm font-bold text-slate-400">Cloud 채널 목록을 불러오는 중입니다.</p>
      ) : filteredChannels.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredChannels.map((channel) => (
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
              <button type="button" onClick={resetFilters} className="rounded-lg bg-white px-4 py-2 text-xs font-extrabold text-slate-950">필터 초기화</button>
            )}
            <button type="button" onClick={onOpenChannelList} className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-extrabold text-slate-200">전체 채널 목록</button>
          </div>
        </div>
      )}
    </section>
  );
}
