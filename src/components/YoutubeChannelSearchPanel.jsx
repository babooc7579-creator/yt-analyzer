import { Check, ExternalLink, Loader2, Search, Trash2, UserPlus, Users } from 'lucide-react';
import { useMemo } from 'react';
import { useYoutubeChannelSearch } from '../hooks/useYoutubeChannelSearch';
import CreatorActionFeedback from './CreatorActionFeedback';
import KeywordResearchShortcuts from './KeywordResearchShortcuts';
import {
  formatYoutubeChannelCountry,
  formatYoutubeSearchCriteria,
  filterYoutubeChannelResults,
  hasYoutubeSearchCriteriaChanges,
  YOUTUBE_CHANNEL_COUNTRY_FILTER_OPTIONS,
  YOUTUBE_CHANNEL_REGISTRATION_FILTER_OPTIONS,
  YOUTUBE_CHANNEL_RESULT_SORT_OPTIONS,
  YOUTUBE_CHANNEL_SELECTION_FILTER_OPTIONS,
  YOUTUBE_SEARCH_LANGUAGE_OPTIONS,
  YOUTUBE_SEARCH_REGION_OPTIONS,
} from '../utils/youtubeKeywordSearch';

const formatNumber = (value) => Number(value || 0).toLocaleString('ko-KR');

function ChannelMetric({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-900 px-2 py-2 text-center">
      <span className="block text-[10px] font-bold text-slate-500">{label}</span>
      <strong className="mt-1 block truncate text-xs text-cyan-200">{value}</strong>
    </div>
  );
}

function ChannelSearchResultCard({ item, registered, registrationSelected, selected, onToggle, onToggleRegistration }) {
  return (
    <article className={`rounded-xl border bg-slate-950/70 p-4 ${selected ? 'border-violet-400 ring-2 ring-violet-400/20' : 'border-slate-800'}`}>
      <div className="flex items-start gap-3">
        {item.thumbnail ? <img src={item.thumbnail} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover" /> : <div className="h-16 w-16 shrink-0 rounded-full bg-slate-800" />}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-black text-white">{item.title}</h3>
              <p className="mt-1 truncate text-[11px] text-slate-500">{item.customUrl || item.channelId}</p>
              <p className="mt-1 text-[11px] font-bold text-slate-500">채널 설정 국가: {formatYoutubeChannelCountry(item.country)}</p>
            </div>
            {registered ? <span className="shrink-0 rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-black text-emerald-200">등록됨</span> : null}
          </div>
          <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-slate-400">{item.description || '채널 설명이 없습니다.'}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <ChannelMetric label="구독자" value={item.hiddenSubscriberCount ? '비공개' : formatNumber(item.subscriberCount)} />
        <ChannelMetric label="영상 수" value={formatNumber(item.totalVideoCount)} />
        <ChannelMetric label="누적 조회수" value={formatNumber(item.totalViewCount)} />
        <ChannelMetric label="영상당 평균" value={formatNumber(item.avgViewCount)} />
      </div>
      <p className="mt-3 text-[11px] leading-5 text-slate-500">영상당 평균은 현재 누적 조회수÷전체 영상 수의 참고값입니다. 최근 성장률을 뜻하지 않습니다.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onToggle(item.channelId)}
          className={`inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-xs font-black ${selected ? 'border-violet-300 bg-violet-500 text-white' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`}
          aria-pressed={selected}
        >
          {selected ? <Check className="h-3.5 w-3.5" /> : null} {selected ? '비교 선택됨' : '비교하기'}
        </button>
        <button
          type="button"
          onClick={() => onToggleRegistration(item.channelId)}
          disabled={registered}
          aria-pressed={registrationSelected}
          className={`inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-xs font-black disabled:cursor-default disabled:border-slate-700 disabled:bg-slate-700 disabled:text-slate-400 ${registrationSelected ? 'border-emerald-300 bg-emerald-500 text-white' : 'border-emerald-500/50 text-emerald-200 hover:bg-emerald-500/10'}`}
          title="등록 후보에만 선택합니다. YouTube API 호출이나 Azure DB 저장은 실행되지 않습니다."
        >
          {registrationSelected ? <Check className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />} {registered ? '이미 등록된 채널' : registrationSelected ? '등록 후보 선택됨' : '등록 후보 선택'}
        </button>
        <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1 px-2 text-xs font-bold text-violet-300" title="YouTube 채널을 새 창에서 엽니다. 추가 API 호출이나 저장은 없습니다.">
          <ExternalLink className="h-3.5 w-3.5" /> YouTube 보기
        </a>
      </div>
    </article>
  );
}

export default function YoutubeChannelSearchPanel({ channelSearchSession, onChannelSearchSessionChange, onOpenWorkTools, onPrepareBulkChannelRegistration, onPrepareChannelRegistration, registeredChannelIds = [] }) {
  const search = useYoutubeChannelSearch({
    initialState: channelSearchSession,
    onStateChange: onChannelSearchSessionChange,
  });
  const registrationIds = search.registrationIds || [];
  const registeredIds = useMemo(() => new Set(registeredChannelIds.map(String)), [registeredChannelIds]);
  const comparedItems = search.items.filter((item) => search.selectedIds.includes(item.channelId));
  const visibleItems = useMemo(() => filterYoutubeChannelResults(search.displayedItems, search.viewFilters, {
    registeredIds,
    selectedIds: search.selectedIds,
  }), [registeredIds, search.displayedItems, search.selectedIds, search.viewFilters]);
  const registrationItems = search.items.filter((item) => registrationIds.includes(item.channelId) && !registeredIds.has(String(item.channelId)));
  const visibleRegistrationIds = visibleItems.filter((item) => !registeredIds.has(String(item.channelId))).map((item) => item.channelId);
  const hasViewFilters = Object.values(search.viewFilters).some((value) => value !== 'all');
  const hasPendingCriteria = hasYoutubeSearchCriteriaChanges(search.filters, search.appliedFilters, { includeVideoFilters: false });
  const trendRegionOption = YOUTUBE_SEARCH_REGION_OPTIONS.find((option) => option.value === search.filters.regionCode);
  const trendRegionCode = search.filters.regionCode || 'KR';
  const trendRegionLabel = search.filters.regionCode ? trendRegionOption?.label || search.filters.regionCode : '대한민국(기본)';

  const applyKoreanPreset = () => {
    search.changeFilter('regionCode', 'KR');
    search.changeFilter('language', 'ko');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    search.runSearch();
  };

  const handlePrepareBulkRegistration = () => {
    if (registrationItems.length === 0) return;
    onPrepareBulkChannelRegistration?.(registrationItems);
  };

  return (
    <section className="space-y-4" data-testid="youtube-channel-search-panel">
      <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
        <p className="text-xs font-extrabold text-violet-300">새 참고 채널 검색</p>
        <h2 className="mt-1 text-xl font-black text-white">키워드로 YouTube 채널 찾기</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">검색 버튼을 눌렀을 때만 YouTube API를 사용합니다. 결과와 수치는 다른 화면에 다녀와도 유지되고 새로고침하면 초기화되는 임시 조회이며, 자동 등록하거나 Azure DB에 저장하지 않습니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-800 bg-slate-950/55 p-4">
        <div className="flex flex-col gap-2 lg:flex-row">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">YouTube 채널 검색 키워드</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="search" value={search.filters.query} onChange={(event) => search.changeFilter('query', event.target.value)} placeholder="예: 경제 해설, 바이브 코딩, 반전 이야기" className="h-11 w-full rounded-lg border border-slate-700 bg-slate-900 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400" />
          </label>
          <label>
            <span className="sr-only">검색 지역</span>
            <select value={search.filters.regionCode} onChange={(event) => search.changeFilter('regionCode', event.target.value)} className="h-11 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-bold text-slate-200" title="검색 지역 변경만으로 API를 호출하지 않습니다.">
              {YOUTUBE_SEARCH_REGION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">우선 언어</span>
            <select value={search.filters.language} onChange={(event) => search.changeFilter('language', event.target.value)} className="h-11 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-bold text-slate-200" title="우선 언어 변경만으로 API를 호출하지 않습니다.">
              {YOUTUBE_SEARCH_LANGUAGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <button type="submit" disabled={search.loading || !search.filters.query.trim()} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-violet-500 px-5 text-sm font-black text-white hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400" title="YouTube 채널 검색 1회와 채널 상세 정보 조회를 실행합니다.">
            {search.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {search.loading ? '채널 검색 중...' : 'YouTube에서 채널 검색'}
          </button>
        </div>
        <p className="mt-3 text-[11px] leading-5 text-slate-500">검색 지역은 해당 나라에서 시청 가능한 결과이며 채널의 운영 국가 제한이 아닙니다. 우선 언어는 관련 결과를 앞세우지만 다른 언어도 포함될 수 있습니다.</p>
        <button type="button" onClick={applyKoreanPreset} className="mt-3 rounded-lg border border-violet-500/40 px-3 py-2 text-xs font-black text-violet-200 hover:bg-violet-500/10" title="대한민국 검색 지역과 한국어 우선을 한 번에 선택합니다. YouTube API는 호출하지 않습니다.">대한민국·한국어 우선 빠른 설정</button>
        <p className="mt-1 text-[11px] leading-5 text-slate-500">기본 25개 · 자동검색 없음 · 키워드나 조건 변경 후 검색 버튼을 눌러야 API 요청이 실행됩니다.</p>
      </form>

      <KeywordResearchShortcuts
        keyword={search.filters.query}
        onOpenWorkTools={onOpenWorkTools}
        trendRegionCode={trendRegionCode}
        trendRegionLabel={trendRegionLabel}
      />

      <CreatorActionFeedback error={search.error} />
      {search.notice ? <p className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-100">{search.notice}</p> : null}
      {search.appliedFilters ? (
        <div className="rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3">
          <p className="text-xs font-black text-slate-200">마지막 검색에 적용된 조건</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">{formatYoutubeSearchCriteria(search.appliedFilters, { includeVideoFilters: false })}</p>
        </div>
      ) : null}
      {hasPendingCriteria ? <p role="status" className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm font-bold text-amber-100">검색 조건이 바뀌었습니다. 새 조건을 결과에 적용하려면 채널 검색 버튼을 눌러주세요.</p> : null}

      {comparedItems.length > 0 ? (
        <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-white">비교 중 {comparedItems.length}개 / 최대 4개 채널</p>
              <p className="mt-1 text-xs text-slate-400">현재 받은 통계의 단순 비교이며 최근 성장률은 아닙니다.</p>
            </div>
            <button type="button" onClick={search.clearSelected} className="h-9 rounded-lg border border-violet-400/40 px-3 text-xs font-black text-violet-100 hover:bg-violet-500/20">비교 선택 전체 해제</button>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {comparedItems.map((item) => (
              <div key={item.channelId} className="rounded-lg bg-slate-950/70 p-3">
                <p className="truncate text-xs font-black text-white">{item.title}</p>
                <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                  <div><dt className="text-slate-600">구독자</dt><dd className="font-bold text-slate-300">{item.hiddenSubscriberCount ? '비공개' : formatNumber(item.subscriberCount)}</dd></div>
                  <div><dt className="text-slate-600">영상 수</dt><dd className="font-bold text-slate-300">{formatNumber(item.totalVideoCount)}</dd></div>
                  <div><dt className="text-slate-600">누적 조회수</dt><dd className="font-bold text-slate-300">{formatNumber(item.totalViewCount)}</dd></div>
                  <div><dt className="text-slate-600">영상당 평균</dt><dd className="font-bold text-slate-300">{formatNumber(item.avgViewCount)}</dd></div>
                </dl>
                <p className="mt-1 text-[11px] text-slate-500">{registeredIds.has(String(item.channelId)) ? '등록됨' : '미등록'} · 채널 국가 {formatYoutubeChannelCountry(item.country)}</p>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => onPrepareChannelRegistration(item)}
                    disabled={registeredIds.has(String(item.channelId))}
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-emerald-500 px-3 text-[11px] font-black text-white disabled:cursor-default disabled:bg-slate-700 disabled:text-slate-400"
                    title="채널 운영실의 등록 입력칸을 준비합니다. 이동만으로 YouTube API나 Azure DB를 호출하지 않습니다."
                  >
                    <UserPlus className="h-3.5 w-3.5" /> {registeredIds.has(String(item.channelId)) ? '이미 등록됨' : '등록 검토'}
                  </button>
                  <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-slate-700 px-3 text-[11px] font-black text-violet-200" title="YouTube 채널을 새 창에서 엽니다. API 호출이나 저장은 없습니다.">
                    <ExternalLink className="h-3.5 w-3.5" /> YouTube 보기
                  </a>
                  <button type="button" onClick={() => search.toggleSelected(item.channelId)} className="h-9 rounded-lg border border-slate-700 px-3 text-[11px] font-black text-slate-300 sm:col-span-2">비교에서 빼기</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {search.items.length > 0 ? (
        <>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black text-white">등록 후보 {registrationItems.length}개 / 최대 50개</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">비교 선택과 별개입니다. 여기서는 후보만 고르고, 채널 운영실에서 태그·언어를 확인한 뒤 최종 등록합니다.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button type="button" onClick={() => search.addRegistrationIds?.(visibleRegistrationIds)} disabled={visibleRegistrationIds.length === 0} className="h-10 rounded-lg border border-emerald-500/40 px-3 text-xs font-black text-emerald-100 disabled:cursor-default disabled:text-slate-600">표시된 미등록 채널 선택</button>
                <button type="button" onClick={() => search.clearRegistration?.()} disabled={registrationIds.length === 0} className="h-10 rounded-lg border border-slate-700 px-3 text-xs font-black text-slate-300 disabled:cursor-default disabled:text-slate-600">등록 후보 전체 해제</button>
                <button type="button" onClick={handlePrepareBulkRegistration} disabled={registrationItems.length === 0} className="h-10 rounded-lg bg-emerald-500 px-4 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400" title="채널 운영실의 일괄 등록 검토 화면으로 이동합니다. 이동만으로 YouTube API나 Azure DB 저장은 실행되지 않습니다.">선택 {registrationItems.length}개 일괄 등록 검토</button>
              </div>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">이동만으로는 저장되지 않습니다. 채널 운영실의 최종 저장 버튼에서 최대 50개를 10개씩 확인·등록하며 영상 수집은 실행하지 않습니다.</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-white">표시 결과 {visibleItems.length}개 / 받은 결과 {search.displayedItems.length}개</p>
              <p className="mt-1 text-xs text-slate-500">받은 결과만 화면에서 필터·정렬하며 YouTube API를 다시 호출하지 않습니다.</p>
              <p className="mt-1 text-xs text-slate-500">채널 설정 국가는 채널 운영자가 YouTube에 등록한 값이며 미등록일 수 있습니다.</p>
            </div>
            <div className="flex flex-col gap-2 sm:w-auto sm:flex-row">
              <label className="sm:w-52">
                <span className="sr-only">채널 결과 정렬</span>
                <select value={search.sortBy} onChange={(event) => search.changeSort(event.target.value)} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-bold text-slate-200" title="현재 받은 채널 결과만 화면에서 정렬합니다. YouTube API는 호출하지 않습니다.">
                  {YOUTUBE_CHANNEL_RESULT_SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <button type="button" onClick={search.clearResults} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-rose-500/40 px-3 text-xs font-black text-rose-200 hover:bg-rose-500/10" title="현재 브라우저의 임시 채널 결과·비교 선택·등록 후보·화면 필터만 지웁니다. 입력한 검색 조건은 유지되며 YouTube API나 Azure DB를 호출하지 않습니다.">
                <Trash2 className="h-3.5 w-3.5" /> 임시 결과 지우기
              </button>
            </div>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">임시 결과 지우기는 검색 조건을 남기고 결과·비교 선택·등록 후보·화면 필터만 정리합니다. 다시 검색하기 전에는 YouTube API를 호출하지 않습니다.</p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <label>
                <span className="sr-only">채널 등록 상태 필터</span>
                <select value={search.viewFilters.registration} onChange={(event) => search.changeViewFilter('registration', event.target.value)} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-bold text-slate-200" title="현재 받은 결과의 채널 등록 상태만 화면에서 좁힙니다.">
                  {YOUTUBE_CHANNEL_REGISTRATION_FILTER_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label>
                <span className="sr-only">채널 설정 국가 필터</span>
                <select value={search.viewFilters.country} onChange={(event) => search.changeViewFilter('country', event.target.value)} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-bold text-slate-200" title="현재 받은 결과에서 채널 설정 국가의 등록 여부만 화면에서 좁힙니다.">
                  {YOUTUBE_CHANNEL_COUNTRY_FILTER_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label>
                <span className="sr-only">비교 선택 필터</span>
                <select value={search.viewFilters.selection} onChange={(event) => search.changeViewFilter('selection', event.target.value)} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-bold text-slate-200" title="현재 비교 대상으로 선택한 채널 카드만 보여줍니다.">
                  {YOUTUBE_CHANNEL_SELECTION_FILTER_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <button type="button" onClick={search.resetViewFilters} disabled={!hasViewFilters} className="h-10 rounded-lg border border-slate-700 px-3 text-xs font-black text-slate-200 hover:bg-slate-800 disabled:cursor-default disabled:text-slate-600">화면 필터 초기화</button>
            </div>
          </div>
          {visibleItems.length > 0 ? <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {visibleItems.map((item) => (
              <ChannelSearchResultCard key={item.channelId} item={item} registered={registeredIds.has(String(item.channelId))} registrationSelected={registrationIds.includes(item.channelId)} selected={search.selectedIds.includes(item.channelId)} onToggle={search.toggleSelected} onToggleRegistration={search.toggleRegistration} />
            ))}
          </div> : <div className="rounded-xl border border-dashed border-slate-700 px-5 py-10 text-center"><h3 className="font-black text-white">현재 화면 필터에 맞는 채널이 없습니다</h3><p className="mt-2 text-sm text-slate-500">검색 결과는 그대로 유지됩니다. 화면 필터만 초기화해 전체 결과를 다시 보세요.</p><button type="button" onClick={search.resetViewFilters} className="mt-4 h-10 rounded-lg border border-slate-700 px-4 text-xs font-black text-slate-200">화면 필터 초기화</button></div>}
          {search.nextPageToken ? <button type="button" onClick={() => search.runSearch({ append: true })} disabled={search.loading} className="mx-auto flex h-10 items-center gap-2 rounded-lg border border-slate-700 px-5 text-xs font-extrabold text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed"><Users className="h-4 w-4" /> 다음 채널 25개 찾기</button> : null}
        </>
      ) : !search.loading && search.lastQuery ? (
        <div className="rounded-xl border border-dashed border-slate-700 px-5 py-12 text-center"><Users className="mx-auto h-8 w-8 text-slate-600" /><h3 className="mt-3 font-black text-white">조건에 맞는 채널이 없습니다</h3><p className="mt-2 text-sm text-slate-500">다른 키워드나 더 넓은 국가·언어 조건으로 다시 검색해 보세요.</p></div>
      ) : null}
    </section>
  );
}
