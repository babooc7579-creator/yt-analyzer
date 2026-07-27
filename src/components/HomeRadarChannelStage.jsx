import { Check, Database, ExternalLink, RefreshCw, Search, Square, Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  CHANNEL_WATCH_GRADE_OPTIONS,
  CHANNEL_WATCH_SCAN_OPTIONS,
  filterAndSortChannelWatchlist,
  getChannelWatchTagOptions,
  getChannelWatchlistCardViewProps,
} from '../utils/channelWatchlist';
import { hasEmptyStoredVideoLoad } from '../utils/homeRadarJourney';

const VISIBLE_CHANNEL_LIMIT = 6;

const toArray = (items) => (Array.isArray(items) ? items : []);

export default function HomeRadarChannelStage({
  channelsLoading = false,
  onLoadStoredVideos,
  onOpenAddChannel,
  onOpenChannelWatchlist,
  onOpenSelectedScan,
  savedChannels,
  selectedChannelIds,
  selectedLoadedVideoCount = 0,
  storedVideoLoadResult,
  storedVideoLoadPending = false,
  toggleChannelSelection,
}) {
  const [gradeFilter, setGradeFilter] = useState('all');
  const [scanFilter, setScanFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const channelList = toArray(savedChannels);
  const selectedIds = toArray(selectedChannelIds);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const tagOptions = useMemo(() => getChannelWatchTagOptions(channelList), [channelList]);
  const filteredChannels = useMemo(() => filterAndSortChannelWatchlist({
    channels: channelList,
    gradeFilter,
    scanFilter,
    searchQuery,
    selectedChannelIds: selectedIds,
    tagFilter,
  }), [channelList, gradeFilter, scanFilter, searchQuery, selectedIds, tagFilter]);
  const visibleChannels = filteredChannels.slice(0, VISIBLE_CHANNEL_LIMIT);
  const explicitLoadSucceeded = storedVideoLoadResult?.success === true;
  const inheritedLoadedVideoCount = Math.max(0, Number(selectedLoadedVideoCount) || 0);
  const loadedVideoCount = explicitLoadSucceeded
    ? Math.max(0, Number(storedVideoLoadResult?.videoCount) || 0)
    : inheritedLoadedVideoCount;
  const loadSucceeded = explicitLoadSucceeded || inheritedLoadedVideoCount > 0;
  const emptyLoad = hasEmptyStoredVideoLoad(storedVideoLoadResult);
  const canLoad = selectedIds.length > 0
    && !storedVideoLoadPending
    && typeof onLoadStoredVideos === 'function';
  const loadFailed = storedVideoLoadResult?.success === false;

  return (
    <section id="today-radar-channels" className="mt-4 scroll-mt-5 border border-cyan-400/25 bg-cyan-500/5 p-4" aria-labelledby="home-radar-channel-stage-title">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[11px] font-extrabold text-cyan-300">STAGE 1–2 · 오늘의 탐색 범위와 수집 영상</p>
          <h3 id="home-radar-channel-stage-title" className="mt-1 text-lg font-black text-white">
            어떤 분야의 채널에서 소재를 찾을까요?
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            분야와 채널을 고른 뒤 같은 화면에서 수집 영상을 펼칩니다. 채널 선택만으로 조회나 YouTube API 호출은 실행되지 않습니다.
          </p>
          <p className="mt-1 text-[11px] font-bold text-slate-500">
            오늘 선택은 화면을 이동해도 유지되지만 브라우저를 새로고침하면 초기화됩니다. 영상 판단과 제작 후보 기록은 온라인 저장소(Azure DB)에 보존됩니다.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 border border-cyan-300/20 bg-slate-950/60 px-3 py-2">
          <Users className="h-4 w-4 text-cyan-300" />
          <span className="text-xs font-bold text-slate-300">오늘 선택</span>
          <strong className="text-base text-white">{selectedIds.length}개</strong>
        </div>
      </div>

      <div id="today-radar-load" className="scroll-mt-5">
        {channelsLoading ? (
          <div className="mt-4 flex items-center justify-center gap-3 border border-blue-400/25 bg-blue-500/10 px-5 py-8 text-center" role="status">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-200" />
            <div className="text-left">
              <p className="font-extrabold text-white">온라인 저장소(Azure DB)의 채널 목록을 불러오는 중입니다</p>
              <p className="mt-1 text-xs text-blue-100/70">등록된 채널 조회이며 YouTube API는 호출하지 않습니다.</p>
            </div>
          </div>
        ) : channelList.length === 0 ? (
          <div className="mt-4 border border-dashed border-slate-700 bg-slate-950/50 px-5 py-8 text-center">
            <p className="font-extrabold text-white">먼저 소재를 찾을 채널이 필요합니다</p>
            <p className="mt-2 text-xs text-slate-400">채널을 등록해도 새 영상 수집은 자동으로 시작되지 않습니다.</p>
            <button
              type="button"
              onClick={onOpenAddChannel}
              className="mt-4 bg-indigo-200 px-4 py-2 text-xs font-extrabold text-indigo-950"
              title="새 채널 등록 화면으로 이동합니다. 이동만으로 채널 저장이나 YouTube API 호출은 실행되지 않습니다."
              aria-label="새 채널 등록 화면으로 이동, 채널 저장 및 YouTube API 호출 없음"
            >
              첫 채널 등록하기
            </button>
          </div>
        ) : (
          <>
          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label="채널 이름 또는 태그 검색"
                placeholder="채널 이름 또는 태그 검색"
                className="h-10 w-full border border-slate-700 bg-slate-950 pl-9 pr-10 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                disabled={!searchQuery}
                title="채널 검색어 지우기"
                aria-label="채널 검색어 지우기"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-slate-400 hover:text-white disabled:pointer-events-none disabled:opacity-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)} aria-label="오늘 탐색 분야" className="h-10 border border-slate-700 bg-slate-950 px-3 text-sm font-bold text-slate-200 outline-none focus:border-cyan-400">
              <option value="all">분야 전체</option>
              {tagOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select value={gradeFilter} onChange={(event) => setGradeFilter(event.target.value)} aria-label="채널 등급" className="h-10 border border-slate-700 bg-slate-950 px-3 text-sm font-bold text-slate-200 outline-none focus:border-cyan-400">
              {CHANNEL_WATCH_GRADE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select value={scanFilter} onChange={(event) => setScanFilter(event.target.value)} aria-label="마지막 수집일" className="h-10 border border-slate-700 bg-slate-950 px-3 text-sm font-bold text-slate-200 outline-none focus:border-cyan-400">
              {CHANNEL_WATCH_SCAN_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-slate-400">조건에 맞는 채널 <span className="text-white">{filteredChannels.length}개</span></p>
            <button
              type="button"
              onClick={onOpenChannelWatchlist}
              className="text-xs font-extrabold text-cyan-300 hover:text-cyan-100"
              title="전체 채널 선택 화면으로 이동합니다. 이동만으로 온라인 저장소(Azure DB) 조회나 YouTube API 호출은 실행되지 않습니다."
              aria-label="전체 채널 선택 화면으로 이동, 온라인 저장소(Azure DB) 조회 및 YouTube API 호출 없음"
            >
              전체 채널 선택 화면
            </button>
          </div>

          {visibleChannels.length > 0 ? (
            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
              {visibleChannels.map((channel) => {
                const viewProps = getChannelWatchlistCardViewProps({
                  channel,
                  isSelected: selectedSet.has(channel.id),
                });
                const isSelected = selectedSet.has(channel.id);

                return (
                  <article key={channel.id} className={`border p-3 ${isSelected ? 'border-cyan-300/50 bg-cyan-500/10' : 'border-slate-800 bg-slate-950/60'}`}>
                    <div className="flex items-start gap-3">
                      {viewProps.thumbnail ? <img src={viewProps.thumbnail} alt="" className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-slate-800" />}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-extrabold text-white" title={viewProps.channelTitle}>{viewProps.channelTitle}</p>
                          <a href={viewProps.channelUrl} target="_blank" rel="noreferrer" title="YouTube 채널 열기" aria-label={`${viewProps.channelTitle} YouTube 채널 열기`} className="text-slate-500 hover:text-white"><ExternalLink className="h-4 w-4" /></a>
                        </div>
                        <p className="mt-1 text-[10px] font-bold text-slate-500">{viewProps.gradeLabel} · {viewProps.scanText}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleChannelSelection?.(channel.id)}
                      className={`mt-3 flex w-full items-center justify-center gap-2 border px-3 py-2 text-xs font-extrabold ${isSelected ? 'border-cyan-200 bg-cyan-200 text-cyan-950' : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-500'}`}
                      title="오늘 볼 범위만 선택합니다. 조회나 수집은 실행되지 않습니다."
                    >
                      {isSelected ? <Check className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                      {isSelected ? '오늘 범위에서 빼기' : '오늘 볼 채널에 담기'}
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 border border-dashed border-slate-700 px-4 py-8 text-center text-sm font-bold text-slate-400">조건에 맞는 채널이 없습니다. 검색 또는 필터를 바꿔주세요.</div>
          )}

          <div className={`mt-4 flex flex-col gap-3 border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${loadSucceeded ? (emptyLoad ? 'border-amber-400/30 bg-amber-500/10' : 'border-emerald-400/30 bg-emerald-500/10') : 'border-blue-400/25 bg-blue-500/10'}`}>
            <div>
              <p className="text-sm font-extrabold text-white">
                {storedVideoLoadPending
                  ? '온라인 저장소(Azure DB)에서 수집 영상을 불러오는 중입니다'
                  : loadFailed
                    ? '수집 영상을 불러오지 못했습니다'
                    : loadSucceeded
                  ? emptyLoad
                    ? '수집된 영상 정보가 없는 채널 조합입니다'
                    : `수집 영상 ${loadedVideoCount}개가 판정대에 준비됐습니다`
                  : selectedIds.length > 0
                    ? `선택한 ${selectedIds.length}개 채널의 수집 영상을 펼쳐보세요`
                    : '먼저 오늘 볼 채널을 1개 이상 담아주세요'}
              </p>
              <p className="mt-1 text-[11px] font-bold text-slate-400">
                {loadFailed
                  ? '연결 상태를 확인한 뒤 같은 버튼으로 다시 시도하세요. 실패해도 YouTube API는 호출되지 않습니다.'
                  : loadSucceeded && !emptyLoad
                    ? '아래 STAGE 3에서 오늘의 후보를 바로 판단할 수 있습니다.'
                    : '수집 영상 목록 불러오기는 온라인 저장소(Azure DB) 조회이며 YouTube API를 호출하지 않습니다.'}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              {loadSucceeded && !emptyLoad ? (
                <a
                  href="#today-radar-candidates"
                  className="inline-flex items-center gap-2 bg-emerald-200 px-4 py-2.5 text-xs font-extrabold text-emerald-950"
                  title="같은 화면의 오늘 후보 판정 영역으로 이동합니다. 이동만으로 온라인 저장소(Azure DB) 저장이나 YouTube API 호출은 실행되지 않습니다."
                  aria-label="오늘 후보 판정 영역으로 이동, 온라인 저장소(Azure DB) 데이터 변경 및 YouTube API 호출 없음"
                >
                  후보 판정 시작 <span aria-hidden="true">↓</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onLoadStoredVideos}
                  disabled={!canLoad}
                  className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2.5 text-xs font-extrabold text-blue-950 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
                  title="선택 채널의 수집 영상을 온라인 저장소(Azure DB)에서 조회합니다. YouTube API는 호출하지 않습니다."
                >
                  {storedVideoLoadPending
                    ? <RefreshCw className="h-4 w-4 animate-spin" />
                    : <Database className="h-4 w-4" />}
                  {storedVideoLoadPending
                    ? '수집 영상 불러오는 중...'
                    : loadFailed
                      ? '수집 영상 다시 불러오기'
                      : '수집 영상 목록 불러오기'}
                </button>
              )}
              {emptyLoad && (
                <button
                  type="button"
                  onClick={onOpenSelectedScan}
                  className="border border-emerald-400/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-extrabold text-emerald-100"
                  title="선택 채널 새 영상 수집 화면으로 이동합니다. 이동만으로 수집은 실행되지 않으며, 실제 수집 버튼에서 YouTube API를 사용할 수 있습니다."
                  aria-label="새 영상 수집 화면으로 이동, 이동만으로 YouTube API 호출 없음"
                >
                  새 영상 수집 단계로
                </button>
              )}
            </div>
          </div>
          </>
        )}
      </div>
    </section>
  );
}
