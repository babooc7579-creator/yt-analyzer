import {
  Check,
  ExternalLink,
  Inbox,
  Loader2,
  Search,
  UserPlus,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useYoutubeKeywordSearch } from '../hooks/useYoutubeKeywordSearch';
import YoutubeChannelSearchPanel from './YoutubeChannelSearchPanel';
import {
  toDiscoveryLinkPayload,
  YOUTUBE_SEARCH_DATE_OPTIONS,
  YOUTUBE_SEARCH_DURATION_OPTIONS,
  YOUTUBE_SEARCH_LANGUAGE_OPTIONS,
  YOUTUBE_SEARCH_MINIMUM_VIEW_OPTIONS,
  YOUTUBE_SEARCH_ORDER_OPTIONS,
  YOUTUBE_SEARCH_REGION_OPTIONS,
} from '../utils/youtubeKeywordSearch';

const formatNumber = (value) => Number(value || 0).toLocaleString('ko-KR');
const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('ko-KR');
};

function SearchSelect({ label, options, value, onChange }) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-bold text-slate-200 outline-none focus:border-red-400"
        title={`${label} 검색 조건입니다. 조건 변경만으로 YouTube API를 호출하지 않습니다.`}
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function YoutubeSearchResultCard({ item, selected, saved, registeredChannel, onPrepareChannelRegistration, onToggle }) {
  return (
    <article className={`overflow-hidden rounded-xl border bg-slate-950/70 ${selected ? 'border-red-400 ring-2 ring-red-400/20' : 'border-slate-800'}`}>
      <button
        type="button"
        onClick={() => onToggle(item.videoId)}
        disabled={saved}
        className="relative block aspect-video w-full overflow-hidden bg-slate-900 text-left disabled:cursor-default"
        aria-label={saved ? `${item.title} 발견 링크함에 저장됨` : `${item.title} 선택`}
      >
        {item.thumbnail ? <img src={item.thumbnail} alt="" className="h-full w-full object-cover" /> : null}
        <span className={`absolute left-2 top-2 inline-flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-xs font-black ${saved ? 'border-emerald-300 bg-emerald-500 text-white' : selected ? 'border-red-200 bg-red-500 text-white' : 'border-slate-500 bg-slate-950/90 text-white'}`}>
          {saved ? <Check className="h-4 w-4" /> : selected ? '선택됨' : '선택'}
        </span>
        <span className="absolute bottom-2 right-2 rounded bg-black/85 px-2 py-1 text-[11px] font-black text-white">{item.duration || '-'}</span>
      </button>
      <div className="p-4">
        <h3 className="line-clamp-2 min-h-12 text-sm font-black leading-6 text-white">{item.title}</h3>
        <div className="mt-2 flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-xs font-bold text-slate-400">{item.channelTitle}</p>
          {registeredChannel ? <span className="shrink-0 rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-black text-emerald-200">등록 채널</span> : null}
        </div>
        <p className="mt-1 text-[11px] text-slate-500">게시 {formatDate(item.publishedAt)}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Metric label="조회수" value={formatNumber(item.viewCount)} tone="text-cyan-300" />
          <Metric label="구독자" value={item.hiddenSubscriberCount ? '비공개' : formatNumber(item.subscriberCount)} tone="text-violet-300" />
          <Metric label="대박 비율" value={item.viralRatio === null ? '-' : `${formatNumber(item.viralRatio)}%`} tone="text-emerald-300" />
        </div>
        <p className="mt-3 text-[11px] leading-5 text-slate-500">
          대박 비율은 현재 조회수÷현재 구독자 수의 추정값이며, 하루 평균 {item.lifetimeViewsPerDay === null ? '-' : formatNumber(item.lifetimeViewsPerDay)}회는 게시 후 전체 기간 평균입니다.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onPrepareChannelRegistration?.({
              channelId: item.channelId,
              title: item.channelTitle,
              url: `https://www.youtube.com/channel/${item.channelId}`,
            })}
            disabled={registeredChannel || !item.channelId}
            className="inline-flex h-9 items-center gap-1 rounded-lg bg-violet-500 px-3 text-xs font-black text-white hover:bg-violet-400 disabled:cursor-default disabled:bg-slate-700 disabled:text-slate-400"
            title="채널 운영실의 등록 입력칸에 이 영상의 채널 주소를 채웁니다. 이동만으로 YouTube API 호출이나 Azure DB 저장은 실행되지 않습니다."
          >
            <UserPlus className="h-3.5 w-3.5" /> {registeredChannel ? '이미 등록된 채널' : '이 채널 등록 검토'}
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-1 px-2 text-xs font-extrabold text-red-300 hover:text-red-200"
            title="YouTube 원본을 새 창에서 엽니다. API 호출이나 저장은 실행하지 않습니다."
          >
            <ExternalLink className="h-3.5 w-3.5" /> YouTube 원본 보기
          </a>
        </div>
      </div>
    </article>
  );
}

function Metric({ label, tone, value }) {
  return (
    <div className="rounded-lg bg-slate-900 px-2 py-2">
      <span className="block text-[10px] font-bold text-slate-500">{label}</span>
      <strong className={`mt-1 block truncate text-xs ${tone}`}>{value}</strong>
    </div>
  );
}

function YoutubeVideoSearchPanel({
  discoveryLinks = [],
  discoveryLinksSaving = false,
  onOpenDiscoveryLinks,
  onPrepareChannelRegistration,
  onSaveDiscoveryLink,
  registeredChannelIds = [],
}) {
  const search = useYoutubeKeywordSearch();
  const [savingSelected, setSavingSelected] = useState(false);
  const savedVideoIds = useMemo(() => new Set(
    discoveryLinks.map((link) => String(link?.linkedVideoId || '')).filter(Boolean),
  ), [discoveryLinks]);
  const registeredIds = useMemo(() => new Set(registeredChannelIds.map(String)), [registeredChannelIds]);
  const selectedItems = search.items.filter((item) => search.selectedIds.includes(item.videoId) && !savedVideoIds.has(item.videoId));

  const saveSelected = async () => {
    if (selectedItems.length === 0 || typeof onSaveDiscoveryLink !== 'function') return;
    setSavingSelected(true);
    let savedCount = 0;
    for (const item of selectedItems) {
      const saved = await onSaveDiscoveryLink(toDiscoveryLinkPayload(item, search.lastQuery || search.filters.query));
      if (!saved) break;
      savedCount += 1;
    }
    search.removeSelected(selectedItems.slice(0, savedCount).map((item) => item.videoId));
    search.setNotice(savedCount === selectedItems.length
      ? `선택한 영상 ${savedCount}개를 발견 링크함에 저장했습니다.`
      : `${savedCount}개를 저장했습니다. 저장하지 못한 항목은 다시 확인해 주세요.`);
    setSavingSelected(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    search.runSearch();
  };

  return (
    <section className="space-y-4" data-testid="youtube-keyword-search-panel">
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
        <p className="text-xs font-extrabold text-red-300">새 영상 후보 검색</p>
        <h2 className="mt-1 text-xl font-black text-white">키워드로 YouTube 영상 찾기</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          검색 버튼을 눌렀을 때만 YouTube API로 영상·통계·채널 정보를 확인합니다. 검색 결과는 임시이며 선택한 영상만 발견 링크함에 저장됩니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-800 bg-slate-950/55 p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">YouTube 영상 검색 키워드</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={search.filters.query}
              onChange={(event) => search.changeFilter('query', event.target.value)}
              placeholder="예: 경제 전망, 바이브 코딩, 반전 이야기"
              className="h-11 w-full rounded-lg border border-slate-700 bg-slate-900 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-red-400"
            />
          </label>
          <button
            type="submit"
            disabled={search.loading || !search.filters.query.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-red-500 px-5 text-sm font-black text-white hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            title="YouTube 검색 1회를 실행하고 결과 영상과 채널의 상세 정보를 추가로 조회합니다. 입력만으로는 API를 호출하지 않습니다."
          >
            {search.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {search.loading ? 'YouTube 검색 중...' : 'YouTube에서 검색'}
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-6">
          <SearchSelect label="국가" options={YOUTUBE_SEARCH_REGION_OPTIONS} value={search.filters.regionCode} onChange={(value) => search.changeFilter('regionCode', value)} />
          <SearchSelect label="언어" options={YOUTUBE_SEARCH_LANGUAGE_OPTIONS} value={search.filters.language} onChange={(value) => search.changeFilter('language', value)} />
          <SearchSelect label="업로드 시기" options={YOUTUBE_SEARCH_DATE_OPTIONS} value={search.filters.dateRange} onChange={(value) => search.changeFilter('dateRange', value)} />
          <SearchSelect label="영상 길이" options={YOUTUBE_SEARCH_DURATION_OPTIONS} value={search.filters.duration} onChange={(value) => search.changeFilter('duration', value)} />
          <SearchSelect label="최소 조회수" options={YOUTUBE_SEARCH_MINIMUM_VIEW_OPTIONS} value={search.filters.minimumViews} onChange={(value) => search.changeFilter('minimumViews', Number(value))} />
          <SearchSelect label="정렬" options={YOUTUBE_SEARCH_ORDER_OPTIONS} value={search.filters.order} onChange={(value) => search.changeFilter('order', value)} />
        </div>
        <p className="mt-3 text-[11px] leading-5 text-slate-500">기본 25개 · 자동검색 없음 · 조건 변경 후 검색 버튼을 눌러야 새 API 요청이 실행됩니다. 최소 조회수는 받은 결과를 화면에서만 좁힙니다.</p>
      </form>

      {search.error ? <p role="alert" className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-200">{search.error}</p> : null}
      {search.notice ? <p className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-100">{search.notice}</p> : null}

      {search.items.length > 0 ? (
        <>
          <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-white">검색 결과 {search.displayedItems.length}개 · 선택 {selectedItems.length}개</p>
              <p className="mt-1 text-xs text-slate-500">선택하지 않은 검색 결과는 Azure DB에 저장되지 않습니다.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={saveSelected}
                disabled={selectedItems.length === 0 || savingSelected || discoveryLinksSaving}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-4 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-700"
                title="선택한 영상의 링크와 기본 정보만 온라인 저장소(Azure DB)의 발견 링크함에 저장합니다. 영상 파일은 저장하지 않습니다."
              >
                {savingSelected ? <Loader2 className="h-4 w-4 animate-spin" /> : <Inbox className="h-4 w-4" />}
                {savingSelected ? '발견 링크함 저장 중...' : `선택 ${selectedItems.length}개 발견 링크함에 담기`}
              </button>
              <button type="button" onClick={onOpenDiscoveryLinks} className="h-10 rounded-lg border border-slate-700 px-4 text-xs font-extrabold text-slate-300 hover:bg-slate-800">발견 링크함 열기</button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {search.displayedItems.map((item) => (
              <YoutubeSearchResultCard
                key={item.videoId}
                item={item}
                onToggle={search.toggleSelected}
                onPrepareChannelRegistration={onPrepareChannelRegistration}
                registeredChannel={registeredIds.has(String(item.channelId || ''))}
                saved={savedVideoIds.has(item.videoId)}
                selected={search.selectedIds.includes(item.videoId)}
              />
            ))}
          </div>
          {search.nextPageToken ? (
            <button
              type="button"
              onClick={() => search.runSearch({ append: true })}
              disabled={search.loading}
              className="mx-auto flex h-10 items-center gap-2 rounded-lg border border-slate-700 px-5 text-xs font-extrabold text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed"
              title="다음 검색 결과 25개를 YouTube API로 추가 조회합니다."
            >
              {search.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} 다음 결과 25개 불러오기
            </button>
          ) : null}
        </>
      ) : !search.loading && search.lastQuery ? (
        <div className="rounded-xl border border-dashed border-slate-700 px-5 py-12 text-center">
          <Users className="mx-auto h-8 w-8 text-slate-600" />
          <h3 className="mt-3 font-black text-white">조건에 맞는 영상이 없습니다</h3>
          <p className="mt-2 text-sm text-slate-500">기간이나 길이 조건을 넓힌 뒤 검색 버튼을 다시 눌러보세요.</p>
        </div>
      ) : null}
    </section>
  );
}

export default function YoutubeKeywordSearchPanel(props) {
  const [searchTarget, setSearchTarget] = useState('video');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-2">
        <button type="button" onClick={() => setSearchTarget('video')} aria-pressed={searchTarget === 'video'} className={`rounded-lg px-4 py-3 text-sm font-black ${searchTarget === 'video' ? 'bg-red-500 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>영상 찾기</button>
        <button type="button" onClick={() => setSearchTarget('channel')} aria-pressed={searchTarget === 'channel'} className={`rounded-lg px-4 py-3 text-sm font-black ${searchTarget === 'channel' ? 'bg-violet-500 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>채널 찾기·비교</button>
      </div>
      {searchTarget === 'channel'
        ? <YoutubeChannelSearchPanel onPrepareChannelRegistration={props.onPrepareChannelRegistration} registeredChannelIds={props.registeredChannelIds} />
        : <YoutubeVideoSearchPanel {...props} />}
    </div>
  );
}
