import { Check, ExternalLink, Loader2, Search, UserPlus, Users } from 'lucide-react';
import { useMemo } from 'react';
import { useYoutubeChannelSearch } from '../hooks/useYoutubeChannelSearch';
import {
  formatYoutubeSearchCriteria,
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

function ChannelSearchResultCard({ item, registered, selected, onPrepare, onToggle }) {
  return (
    <article className={`rounded-xl border bg-slate-950/70 p-4 ${selected ? 'border-violet-400 ring-2 ring-violet-400/20' : 'border-slate-800'}`}>
      <div className="flex items-start gap-3">
        {item.thumbnail ? <img src={item.thumbnail} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover" /> : <div className="h-16 w-16 shrink-0 rounded-full bg-slate-800" />}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-black text-white">{item.title}</h3>
              <p className="mt-1 truncate text-[11px] text-slate-500">{item.customUrl || item.channelId}</p>
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
          onClick={() => onPrepare(item)}
          disabled={registered}
          className="inline-flex h-9 items-center gap-1 rounded-lg bg-emerald-500 px-3 text-xs font-black text-white disabled:cursor-default disabled:bg-slate-700 disabled:text-slate-400"
          title="채널 운영실의 등록 입력칸에 이 채널 주소를 채웁니다. 이동만으로 YouTube API 호출이나 Azure DB 저장은 실행되지 않습니다."
        >
          <UserPlus className="h-3.5 w-3.5" /> {registered ? '이미 등록된 채널' : '등록 검토하기'}
        </button>
        <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1 px-2 text-xs font-bold text-violet-300" title="YouTube 채널을 새 창에서 엽니다. 추가 API 호출이나 저장은 없습니다.">
          <ExternalLink className="h-3.5 w-3.5" /> YouTube 보기
        </a>
      </div>
    </article>
  );
}

export default function YoutubeChannelSearchPanel({ channelSearchSession, onChannelSearchSessionChange, onPrepareChannelRegistration, registeredChannelIds = [] }) {
  const search = useYoutubeChannelSearch({
    initialState: channelSearchSession,
    onStateChange: onChannelSearchSessionChange,
  });
  const registeredIds = useMemo(() => new Set(registeredChannelIds.map(String)), [registeredChannelIds]);
  const comparedItems = search.items.filter((item) => search.selectedIds.includes(item.channelId));

  const handleSubmit = (event) => {
    event.preventDefault();
    search.runSearch();
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
        <p className="mt-1 text-[11px] leading-5 text-slate-500">기본 12개 · 자동검색 없음 · 키워드나 조건 변경 후 검색 버튼을 눌러야 API 요청이 실행됩니다.</p>
      </form>

      {search.error ? <p role="alert" className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-200">{search.error}</p> : null}
      {search.notice ? <p className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-100">{search.notice}</p> : null}
      {search.appliedFilters ? (
        <div className="rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3">
          <p className="text-xs font-black text-slate-200">마지막 검색에 적용된 조건</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">{formatYoutubeSearchCriteria(search.appliedFilters, { includeVideoFilters: false })}</p>
        </div>
      ) : null}

      {comparedItems.length > 0 ? (
        <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4">
          <p className="text-sm font-black text-white">비교 중 {comparedItems.length}개 채널</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {comparedItems.map((item) => (
              <div key={item.channelId} className="rounded-lg bg-slate-950/70 p-3">
                <p className="truncate text-xs font-black text-white">{item.title}</p>
                <p className="mt-2 text-[11px] text-slate-400">구독자 {item.hiddenSubscriberCount ? '비공개' : formatNumber(item.subscriberCount)} · 영상당 평균 {formatNumber(item.avgViewCount)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {search.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {search.items.map((item) => (
              <ChannelSearchResultCard key={item.channelId} item={item} registered={registeredIds.has(String(item.channelId))} selected={search.selectedIds.includes(item.channelId)} onPrepare={onPrepareChannelRegistration} onToggle={search.toggleSelected} />
            ))}
          </div>
          {search.nextPageToken ? <button type="button" onClick={() => search.runSearch({ append: true })} disabled={search.loading} className="mx-auto flex h-10 items-center gap-2 rounded-lg border border-slate-700 px-5 text-xs font-extrabold text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed"><Users className="h-4 w-4" /> 다음 채널 12개 찾기</button> : null}
        </>
      ) : !search.loading && search.lastQuery ? (
        <div className="rounded-xl border border-dashed border-slate-700 px-5 py-12 text-center"><Users className="mx-auto h-8 w-8 text-slate-600" /><h3 className="mt-3 font-black text-white">조건에 맞는 채널이 없습니다</h3><p className="mt-2 text-sm text-slate-500">다른 키워드나 더 넓은 국가·언어 조건으로 다시 검색해 보세요.</p></div>
      ) : null}
    </section>
  );
}
