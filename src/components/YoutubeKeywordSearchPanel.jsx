import {
  Check,
  ExternalLink,
  Inbox,
  Loader2,
  Search,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { DISCOVERY_LINK_SAVE_TAG_OPTIONS } from '../constants/discoveryLinks';
import { useYoutubeKeywordSearch } from '../hooks/useYoutubeKeywordSearch';
import KeywordResearchShortcuts from './KeywordResearchShortcuts';
import YoutubeChannelSearchPanel from './YoutubeChannelSearchPanel';
import CreatorActionFeedback from './CreatorActionFeedback';
import {
  formatYoutubeSearchCriteria,
  filterYoutubeVideoResultsByChannelRegistration,
  filterYoutubeVideoResultsByTitleScript,
  hasYoutubeSearchCriteriaChanges,
  summarizeYoutubeVideoSearchResults,
  sortYoutubeVideoResults,
  toDiscoveryLinkPayload,
  YOUTUBE_SEARCH_DATE_OPTIONS,
  YOUTUBE_SEARCH_DURATION_OPTIONS,
  YOUTUBE_SEARCH_LANGUAGE_OPTIONS,
  YOUTUBE_SEARCH_MINIMUM_VIEW_OPTIONS,
  YOUTUBE_SEARCH_ORDER_OPTIONS,
  YOUTUBE_SEARCH_REGION_OPTIONS,
  YOUTUBE_CHANNEL_REGISTRATION_FILTER_OPTIONS,
  YOUTUBE_VIDEO_TITLE_SCRIPT_FILTER_OPTIONS,
  YOUTUBE_VIDEO_RESULT_SORT_OPTIONS,
} from '../utils/youtubeKeywordSearch';

const formatNumber = (value) => Number(value || 0).toLocaleString('ko-KR');
const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('ko-KR');
};

function SearchSelect({ label, options, value, onChange, title }) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-bold text-slate-200 outline-none focus:border-red-400"
        title={title || `${label} 검색 조건입니다. 조건 변경만으로 YouTube API를 호출하지 않습니다.`}
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function YoutubeSearchResultCard({ channelRegistrationSelected, item, selected, saved, registeredChannel, onPrepareChannelRegistration, onToggle, onToggleChannelRegistration }) {
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
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-[11px] font-black text-red-200">영상 아이디어 작업</p>
          <button
            type="button"
            onClick={() => onToggle(item.videoId)}
            disabled={saved}
            className="mt-2 inline-flex h-9 w-full items-center justify-center gap-1 rounded-lg border border-red-500/40 px-3 text-xs font-black text-red-100 hover:bg-red-500/10 disabled:cursor-default disabled:border-emerald-500/30 disabled:text-emerald-200"
            title="영상 후보를 선택합니다. 선택만으로 저장되지 않으며 화면 상단의 발견 링크함에 담기 버튼을 눌러야 Azure DB에 저장됩니다."
          >
            {saved || selected ? <Check className="h-3.5 w-3.5" /> : <Inbox className="h-3.5 w-3.5" />}
            {saved ? '발견 링크함에 저장됨' : selected ? '영상 후보 선택 해제' : '영상 후보로 선택'}
          </button>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">선택만으로 저장되지 않습니다. 상단의 `발견 링크함에 담기`에서 저장합니다.</p>
        </div>
        <div className="mt-3 rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
          <p className="text-[11px] font-black text-violet-200">출처 채널 작업</p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onToggleChannelRegistration?.(item.channelId)}
              disabled={registeredChannel || !item.channelId}
              aria-pressed={channelRegistrationSelected}
              className={`inline-flex h-9 w-full items-center justify-center gap-1 rounded-lg border px-3 text-xs font-black disabled:cursor-default disabled:border-slate-700 disabled:bg-slate-700 disabled:text-slate-400 ${channelRegistrationSelected ? 'border-emerald-300 bg-emerald-500 text-white' : 'border-emerald-500/50 text-emerald-200 hover:bg-emerald-500/10'}`}
              title="이 출처 채널을 중요 채널 등록 후보로만 선택합니다. 선택만으로 YouTube API 호출이나 Azure DB 저장은 실행되지 않습니다."
            >
              {channelRegistrationSelected ? <Check className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />} {registeredChannel ? '이미 등록된 채널' : channelRegistrationSelected ? '중요 채널 선택됨' : '중요 채널로 선택'}
            </button>
            <button
              type="button"
              onClick={() => onPrepareChannelRegistration?.({
                channelId: item.channelId,
                registrationSource: 'youtube-video-search',
                title: item.channelTitle,
                url: `https://www.youtube.com/channel/${item.channelId}`,
              })}
              disabled={registeredChannel || !item.channelId}
              className="inline-flex h-9 w-full items-center justify-center gap-1 rounded-lg bg-violet-500 px-3 text-xs font-black text-white hover:bg-violet-400 disabled:cursor-default disabled:bg-slate-700 disabled:text-slate-400"
              title="채널 운영실의 등록 입력칸에 이 영상의 채널 주소를 채웁니다. 이동만으로 YouTube API 호출이나 Azure DB 저장은 실행되지 않습니다."
            >
              <UserPlus className="h-3.5 w-3.5" /> {registeredChannel ? '이미 등록된 채널' : '이 채널 등록 검토'}
            </button>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 w-full items-center justify-center gap-1 rounded-lg border border-slate-700 px-2 text-xs font-extrabold text-red-300 hover:bg-slate-900 hover:text-red-200"
              title="YouTube 원본을 새 창에서 엽니다. API 호출이나 저장은 실행하지 않습니다."
            >
              <ExternalLink className="h-3.5 w-3.5" /> YouTube 원본 보기
            </a>
          </div>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">채널 등록 검토는 채널 운영실 입력 준비만 하며 자동 등록하거나 영상을 저장하지 않습니다.</p>
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
  onOpenWorkTools,
  onPrepareBulkChannelRegistration,
  onPrepareChannelRegistration,
  onSaveDiscoveryLink,
  onVideoSearchSessionChange,
  registeredChannelIds = [],
  videoSearchSession,
}) {
  const search = useYoutubeKeywordSearch({
    initialState: videoSearchSession,
    onStateChange: onVideoSearchSessionChange,
  });
  const [savingSelected, setSavingSelected] = useState(false);
  const [saveTag, setSaveTag] = useState('');
  const savedVideoIds = useMemo(() => new Set(
    discoveryLinks.map((link) => String(link?.linkedVideoId || '')).filter(Boolean),
  ), [discoveryLinks]);
  const registeredIds = useMemo(() => new Set(registeredChannelIds.map(String)), [registeredChannelIds]);
  const selectedItems = search.items.filter((item) => search.selectedIds.includes(item.videoId) && !savedVideoIds.has(item.videoId));
  const visibleItems = useMemo(() => sortYoutubeVideoResults(
    filterYoutubeVideoResultsByTitleScript(
      filterYoutubeVideoResultsByChannelRegistration(
        search.displayedItems,
        search.channelRegistrationFilter,
        registeredIds,
      ),
      search.titleScriptFilter,
    ),
    search.resultSort,
  ), [registeredIds, search.channelRegistrationFilter, search.displayedItems, search.resultSort, search.titleScriptFilter]);
  const hasPendingCriteria = hasYoutubeSearchCriteriaChanges(search.filters, search.appliedFilters);
  const resultSummary = useMemo(() => summarizeYoutubeVideoSearchResults(
    search.displayedItems,
    registeredIds,
  ), [registeredIds, search.displayedItems]);
  const trendRegionOption = YOUTUBE_SEARCH_REGION_OPTIONS.find((option) => option.value === search.filters.regionCode);
  const trendRegionCode = search.filters.regionCode || 'KR';
  const trendRegionLabel = search.filters.regionCode ? trendRegionOption?.label || search.filters.regionCode : '대한민국(기본)';
  const activeResultViewLabels = [
    YOUTUBE_CHANNEL_REGISTRATION_FILTER_OPTIONS.find((option) => option.value === search.channelRegistrationFilter),
    YOUTUBE_VIDEO_TITLE_SCRIPT_FILTER_OPTIONS.find((option) => option.value === search.titleScriptFilter),
    YOUTUBE_VIDEO_RESULT_SORT_OPTIONS.find((option) => option.value === search.resultSort),
  ].filter((option) => option && !['all', 'received'].includes(option.value)).map((option) => option.label);
  const channelRegistrationItems = useMemo(() => {
    const candidates = new Map();
    search.items.forEach((item) => {
      const channelId = String(item?.channelId || '');
      if (!channelId || registeredIds.has(channelId) || !search.channelRegistrationIds.includes(channelId) || candidates.has(channelId)) return;
      candidates.set(channelId, {
        channelId,
        registrationSource: 'youtube-video-search',
        title: item.channelTitle || '이름 미확인 채널',
        url: `https://www.youtube.com/channel/${channelId}`,
      });
    });
    return [...candidates.values()];
  }, [registeredIds, search.channelRegistrationIds, search.items]);
  const visibleUnregisteredChannelIds = useMemo(() => [...new Set(visibleItems
    .map((item) => String(item?.channelId || ''))
    .filter((channelId) => channelId && !registeredIds.has(channelId)))], [registeredIds, visibleItems]);

  const applyKoreanPreset = () => {
    search.changeFilter('regionCode', 'KR');
    search.changeFilter('language', 'ko');
  };

  const saveSelected = async () => {
    if (selectedItems.length === 0 || typeof onSaveDiscoveryLink !== 'function') return;
    setSavingSelected(true);
    let savedCount = 0;
    for (const item of selectedItems) {
      const saved = await onSaveDiscoveryLink(toDiscoveryLinkPayload(
        item,
        search.lastQuery || search.filters.query,
        saveTag ? [saveTag] : [],
      ));
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
          검색 버튼을 눌렀을 때만 YouTube API로 영상·통계·채널 정보를 확인합니다. 임시 결과는 같은 브라우저 탭에서 6시간 동안 새로고침 복구되며 탭을 닫으면 사라집니다. 선택한 영상만 발견 링크함에 저장됩니다.
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
          <SearchSelect label="검색 지역" options={YOUTUBE_SEARCH_REGION_OPTIONS} value={search.filters.regionCode} onChange={(value) => search.changeFilter('regionCode', value)} />
          <SearchSelect label="우선 언어" options={YOUTUBE_SEARCH_LANGUAGE_OPTIONS} value={search.filters.language} onChange={(value) => search.changeFilter('language', value)} />
          <SearchSelect label="업로드 시기" options={YOUTUBE_SEARCH_DATE_OPTIONS} value={search.filters.dateRange} onChange={(value) => search.changeFilter('dateRange', value)} />
          <SearchSelect label="영상 길이" options={YOUTUBE_SEARCH_DURATION_OPTIONS} value={search.filters.duration} onChange={(value) => search.changeFilter('duration', value)} />
          <SearchSelect label="최소 조회수" options={YOUTUBE_SEARCH_MINIMUM_VIEW_OPTIONS} value={search.filters.minimumViews} onChange={(value) => search.changeFilter('minimumViews', Number(value))} />
          <SearchSelect label="정렬" options={YOUTUBE_SEARCH_ORDER_OPTIONS} value={search.filters.order} onChange={(value) => search.changeFilter('order', value)} />
        </div>
        <button type="button" onClick={applyKoreanPreset} className="mt-3 rounded-lg border border-red-500/40 px-3 py-2 text-xs font-black text-red-200 hover:bg-red-500/10" title="대한민국 검색 지역과 한국어 우선을 한 번에 선택합니다. YouTube API는 호출하지 않습니다.">대한민국·한국어 우선 빠른 설정</button>
        <p className="mt-3 text-[11px] leading-5 text-slate-500">검색 지역은 해당 나라에서 시청 가능한 결과이며 제작 국가 제한이 아닙니다. 우선 언어는 관련 결과를 앞세우지만 다른 언어도 포함될 수 있습니다.</p>
        <p className="mt-1 text-[11px] leading-5 text-slate-500">기본 25개 · 자동검색 없음 · 조건 변경 후 검색 버튼을 눌러야 새 API 요청이 실행됩니다. 최소 조회수는 받은 결과를 화면에서만 좁힙니다.</p>
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
          <p className="mt-1 text-xs leading-5 text-slate-400">{formatYoutubeSearchCriteria(search.appliedFilters)}</p>
        </div>
      ) : null}
      {hasPendingCriteria ? <p role="status" className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm font-bold text-amber-100">검색 조건이 바뀌었습니다. 새 조건을 결과에 적용하려면 검색 버튼을 눌러주세요.</p> : null}

      {search.items.length > 0 ? (
        <>
          <section className="rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-4" aria-label="현재 검색 결과 요약">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-extrabold text-cyan-300">현재 받아온 결과 기준</p>
                <h3 className="mt-1 text-base font-black text-white">검색 결과 구성 요약</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">YouTube 전체 검색량이나 급상승 판정이 아닙니다. 현재 받아온 최대 25개씩의 임시 결과를 화면에서만 계산합니다.</p>
              </div>
              {resultSummary.unregisteredChannels > 0 ? (
                <button
                  type="button"
                  onClick={() => search.changeChannelRegistrationFilter('unregistered')}
                  className="h-10 shrink-0 rounded-lg border border-violet-400/50 px-4 text-xs font-black text-violet-100 hover:bg-violet-500/10"
                  title="현재 받은 결과를 미등록 출처 채널의 영상만 보이도록 좁힙니다. YouTube API나 Azure DB를 호출하지 않습니다."
                >미등록 채널 영상만 보기</button>
              ) : null}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-6">
              <Metric label="최근 7일" value={`${resultSummary.last7Days}개`} tone="text-cyan-200" />
              <Metric label="최근 30일" value={`${resultSummary.last30Days}개`} tone="text-cyan-200" />
              <Metric label="최근 60일" value={`${resultSummary.last60Days}개`} tone="text-cyan-200" />
              <Metric label="출처 채널" value={`${resultSummary.uniqueChannels}개`} tone="text-violet-200" />
              <Metric label="미등록 채널" value={`${resultSummary.unregisteredChannels}개`} tone="text-violet-200" />
              <Metric label="평균 조회수" value={formatNumber(resultSummary.averageViews)} tone="text-emerald-200" />
            </div>
            {resultSummary.repeatedUnregisteredChannels.length > 0 ? (
              <div className="mt-4 border-t border-cyan-500/20 pt-4">
                <p className="text-xs font-black text-violet-100">반복 등장한 미등록 출처 채널</p>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">현재 결과에 2개 이상 영상이 나온 채널만 표시합니다. 반복 등장은 등록 추천 점수나 성장률이 아니며, 버튼은 등록 입력만 준비합니다.</p>
                <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-3">
                  {resultSummary.repeatedUnregisteredChannels.map((channel) => (
                    <button
                      key={channel.channelId}
                      type="button"
                      onClick={() => onPrepareChannelRegistration?.({
                        channelId: channel.channelId,
                        registrationSource: 'youtube-video-search',
                        title: channel.title,
                        url: `https://www.youtube.com/channel/${channel.channelId}`,
                      })}
                      className="flex min-h-12 items-center justify-between gap-3 rounded-lg border border-violet-500/30 bg-violet-500/5 px-3 py-2 text-left hover:bg-violet-500/10"
                      title="채널 운영실의 등록 입력칸을 준비합니다. YouTube API 호출이나 Azure DB 저장은 실행되지 않습니다."
                    >
                      <span className="min-w-0 truncate text-xs font-black text-white">{channel.title}</span>
                      <span className="shrink-0 text-[11px] font-black text-violet-200">영상 {channel.count}개 · 등록 검토</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
          <section className="rounded-xl border border-violet-500/25 bg-violet-500/5 p-4" aria-label="중요 채널 등록 후보">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-extrabold text-violet-300">영상을 보며 출처 채널도 모으기</p>
                <h3 className="mt-1 text-sm font-black text-white">중요 채널 후보 {channelRegistrationItems.length}개 / 최대 50개</h3>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">영상 후보 선택과 별개입니다. 여기서는 채널만 고르고 채널 운영실에서 태그·언어와 최종 등록을 확인합니다.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button type="button" onClick={() => search.addChannelRegistrationIds(visibleUnregisteredChannelIds)} disabled={visibleUnregisteredChannelIds.length === 0} className="h-10 rounded-lg border border-violet-500/40 px-3 text-xs font-black text-violet-100 disabled:cursor-default disabled:text-slate-600">표시된 미등록 채널 선택</button>
                <button type="button" onClick={search.clearChannelRegistrationIds} disabled={search.channelRegistrationIds.length === 0} className="h-10 rounded-lg border border-slate-700 px-3 text-xs font-black text-slate-300 disabled:cursor-default disabled:text-slate-600">중요 채널 전체 해제</button>
                <button type="button" onClick={() => onPrepareBulkChannelRegistration?.(channelRegistrationItems)} disabled={channelRegistrationItems.length === 0} className="h-10 rounded-lg bg-violet-500 px-4 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400" title="채널 운영실의 일괄 등록 검토 화면으로 이동합니다. 이동만으로 YouTube API나 Azure DB 저장은 실행되지 않습니다.">선택 {channelRegistrationItems.length}개 일괄 등록 검토</button>
              </div>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">이동만으로는 등록되지 않습니다. 채널 운영실의 `YouTube API 확인 후 일괄 저장`을 직접 눌러야 확인·저장이 실행되며 새 영상 수집은 하지 않습니다.</p>
          </section>
          <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4" aria-label="검색 결과 좁히기">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-extrabold text-cyan-300">결과 좁히기 · 화면에서만 적용</p>
                <h3 className="mt-1 text-sm font-black text-white">표시 결과 {visibleItems.length}개 / 검색 결과 {search.displayedItems.length}개</h3>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">등록 상태·제목 문자·현재 결과 정렬은 YouTube API나 Azure DB를 호출하지 않습니다.</p>
              </div>
              <button type="button" onClick={search.resetResultView} disabled={activeResultViewLabels.length === 0} className="h-9 shrink-0 rounded-lg border border-slate-700 px-3 text-xs font-black text-slate-200 disabled:cursor-default disabled:opacity-40">화면 필터 초기화</button>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <SearchSelect label="출처 채널 등록 상태 필터" options={YOUTUBE_CHANNEL_REGISTRATION_FILTER_OPTIONS} value={search.channelRegistrationFilter} onChange={search.changeChannelRegistrationFilter} title="이미 받은 결과를 출처 채널의 등록 상태로만 좁힙니다. YouTube API나 Azure DB를 새로 호출하지 않습니다." />
              <SearchSelect label="영상 제목 한글 포함 필터" options={YOUTUBE_VIDEO_TITLE_SCRIPT_FILTER_OPTIONS} value={search.titleScriptFilter} onChange={search.changeTitleScriptFilter} title="이미 받은 결과의 제목에 한글 문자가 포함됐는지만 구분합니다. 언어 판정 기능이 아니며 YouTube API나 Azure DB를 새로 호출하지 않습니다." />
              <SearchSelect label="현재 검색 결과 정렬" options={YOUTUBE_VIDEO_RESULT_SORT_OPTIONS} value={search.resultSort} onChange={search.changeResultSort} title="이미 받은 결과의 표시 순서만 바꿉니다. YouTube API나 Azure DB를 새로 호출하지 않습니다." />
            </div>
            {activeResultViewLabels.length > 0 ? <div className="mt-3 flex flex-wrap gap-2" aria-label="적용 중인 화면 필터">{activeResultViewLabels.map((label) => <span key={label} className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-black text-cyan-100">{label}</span>)}</div> : <p className="mt-3 text-[11px] text-slate-500">적용 중인 화면 필터 없음 · 받은 결과 전체를 표시합니다.</p>}
            <button type="button" onClick={search.clearResults} className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-rose-500/40 px-3 text-xs font-black text-rose-200 hover:bg-rose-500/10" title="현재 브라우저의 임시 영상 결과·선택·화면 필터만 지웁니다. 입력한 검색 조건은 유지되며 YouTube API나 Azure DB를 호출하지 않습니다."><Trash2 className="h-3.5 w-3.5" /> 임시 결과 지우기</button>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">검색 조건을 남기고 결과·영상 선택·화면 필터만 정리합니다. 발견 링크함에 이미 저장한 항목은 삭제하지 않습니다.</p>
          </section>
          <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4" aria-label="선택 영상 저장 설정">
            <div>
              <p className="text-xs font-extrabold text-emerald-300">선택 영상 저장 설정</p>
              <h3 className="mt-1 text-sm font-black text-white">선택 {selectedItems.length}개</h3>
              <p className="mt-1 text-[11px] leading-5 text-slate-500">영상을 선택한 뒤 저장 분류를 정하고 발견 링크함에 담을 때만 Azure DB에 링크와 기본 정보가 저장됩니다.</p>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <label className="min-w-40 flex-1 sm:flex-none"><span className="sr-only">선택 영상 저장 분류</span><select value={saveTag} onChange={(event) => setSaveTag(event.target.value)} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-bold text-slate-200" title="선택한 영상을 발견 링크함에 저장할 때 함께 기록할 분류입니다. 선택만으로 Azure DB에 저장되지 않습니다.">{DISCOVERY_LINK_SAVE_TAG_OPTIONS.map((option) => <option key={option.value || 'none'} value={option.value}>{option.label}</option>)}</select></label>
              <button type="button" onClick={saveSelected} disabled={selectedItems.length === 0 || savingSelected || discoveryLinksSaving} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-700" title="선택한 영상의 링크와 기본 정보만 온라인 저장소(Azure DB)의 발견 링크함에 저장합니다. 영상 파일은 저장하지 않습니다.">{savingSelected ? <Loader2 className="h-4 w-4 animate-spin" /> : <Inbox className="h-4 w-4" />}{savingSelected ? '발견 링크함 저장 중...' : `선택 ${selectedItems.length}개 발견 링크함에 담기`}</button>
              <button type="button" onClick={onOpenDiscoveryLinks} className="h-10 rounded-lg border border-slate-700 px-4 text-xs font-extrabold text-slate-300 hover:bg-slate-800">발견 링크함 열기</button>
            </div>
          </section>
          <p className="-mt-1 px-4 text-[11px] leading-5 text-slate-500">제목 필터는 한글 문자 포함 여부만 확인합니다. 실제 음성·자막 언어를 판정하지 않으며 추가 API 호출이나 저장이 없습니다.</p>
          {visibleItems.length > 0 ? <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {visibleItems.map((item) => (
              <YoutubeSearchResultCard
                key={item.videoId}
                channelRegistrationSelected={!registeredIds.has(String(item.channelId || '')) && search.channelRegistrationIds.includes(String(item.channelId || ''))}
                item={item}
                onToggleChannelRegistration={search.toggleChannelRegistration}
                onToggle={search.toggleSelected}
                onPrepareChannelRegistration={onPrepareChannelRegistration}
                registeredChannel={registeredIds.has(String(item.channelId || ''))}
                saved={savedVideoIds.has(item.videoId)}
                selected={search.selectedIds.includes(item.videoId)}
              />
            ))}
          </div> : <div className="rounded-xl border border-dashed border-slate-700 px-5 py-10 text-center"><h3 className="font-black text-white">{search.titleScriptFilter === 'hangul' ? '한글 포함 제목이 없습니다' : '현재 화면 필터에 맞는 영상이 없습니다'}</h3><p className="mt-2 text-sm text-slate-500">{search.titleScriptFilter === 'hangul' ? '한국어 우선 검색도 한글 제목을 보장하지 않습니다. 전체 제목으로 돌아가면 받은 결과를 모두 볼 수 있습니다.' : '검색 결과는 그대로 유지됩니다. 화면 필터를 초기화하면 모든 결과를 다시 볼 수 있습니다.'}</p><button type="button" onClick={search.resetResultView} className="mt-4 h-10 rounded-lg border border-slate-700 px-4 text-xs font-black text-slate-200">전체 결과 보기</button></div>}
          {search.nextPageToken ? (
            <div className="space-y-2 text-center">
              <button
                type="button"
                onClick={() => search.runSearch({ append: true })}
                disabled={search.loading}
                className="mx-auto flex h-10 items-center gap-2 rounded-lg border border-slate-700 px-5 text-xs font-extrabold text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed"
                title="첫 검색의 키워드·국가·언어·기간·길이·정렬 조건을 그대로 유지해 다음 검색 결과 25개를 YouTube API로 추가 조회합니다."
              >
                {search.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} 다음 결과 25개 불러오기
              </button>
              <p className="text-[11px] leading-5 text-slate-500">첫 검색의 국가·언어·기간·길이·정렬 조건을 유지해 YouTube API로 다음 결과를 불러옵니다.</p>
            </div>
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
  const [searchTarget, setSearchTarget] = useState(props.searchTargetSession || 'video');
  const changeSearchTarget = (nextTarget) => {
    setSearchTarget(nextTarget);
    props.onSearchTargetChange?.(nextTarget);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-2">
        <button type="button" onClick={() => changeSearchTarget('video')} aria-pressed={searchTarget === 'video'} className={`rounded-lg px-4 py-3 text-sm font-black ${searchTarget === 'video' ? 'bg-red-500 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>영상 찾기</button>
        <button type="button" onClick={() => changeSearchTarget('channel')} aria-pressed={searchTarget === 'channel'} className={`rounded-lg px-4 py-3 text-sm font-black ${searchTarget === 'channel' ? 'bg-violet-500 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>채널 찾기·비교</button>
      </div>
      {searchTarget === 'channel'
        ? <YoutubeChannelSearchPanel channelSearchSession={props.channelSearchSession} onChannelSearchSessionChange={props.onChannelSearchSessionChange} onOpenWorkTools={props.onOpenWorkTools} onPrepareBulkChannelRegistration={props.onPrepareBulkChannelRegistration} onPrepareChannelRegistration={props.onPrepareChannelRegistration} registeredChannelIds={props.registeredChannelIds} />
        : <YoutubeVideoSearchPanel {...props} />}
    </div>
  );
}
