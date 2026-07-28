import { CalendarDays, ClipboardList, FilePenLine, Search, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { PRODUCTION_STATUS } from '../constants/status';
import { getScriptWorkflowStatusLabel } from '../constants/scriptWorkspace';
import { useProductionKanbanActions } from '../hooks/useProductionKanbanActions';
import {
  SCRIPT_BOARD_FILTERS,
  getScriptBoardEmptyState,
  getScriptBoardItems,
  getScriptBoardSummary,
  getScriptBoardVisibleItems,
} from '../utils/scriptBoard';
import {
  getGuardedProductionNavigationHandlers,
  registerProductionBeforeUnloadGuard,
} from '../utils/productionNavigation';
import ScriptBoardEditor from './ScriptBoardEditor';

const SUMMARY_ITEMS = [
  { key: 'totalCount', label: '전체 작업' },
  { key: 'focusCount', label: '오늘 집중' },
  { key: 'candidateCount', label: '제작 후보' },
  { key: 'activeCount', label: '제작 중' },
  { key: 'doneCount', label: '업로드 완료' },
];

export default function ScriptBoardWorkspace({
  initialTargetVideoId = '',
  onConfirmUnsavedNavigation,
  onOpenHome,
  onOpenImprovementLog,
  onOpenProductionCandidates,
  onOpenUploadCalendar,
  onUnsavedDraftsChange,
  onUpdateVideoRecord,
  videoUserRecords = {},
  videos = [],
}) {
  const [filterMode, setFilterMode] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState(initialTargetVideoId);
  const {
    draftRecords,
    hasUnsavedChanges,
    saveDraftRecord,
    saveStates,
    updateDraftRecord,
  } = useProductionKanbanActions({
    onUpdateVideoRecord,
    videoUserRecords,
  });
  const visibleRecordSource = useMemo(() => ({
    ...videoUserRecords,
    ...draftRecords,
  }), [draftRecords, videoUserRecords]);
  const items = useMemo(() => getScriptBoardItems({
    videoUserRecords: visibleRecordSource,
    videos,
  }), [visibleRecordSource, videos]);
  const visibleItems = useMemo(() => getScriptBoardVisibleItems({
    filterMode,
    items,
    searchQuery,
  }), [filterMode, items, searchQuery]);
  const summary = useMemo(() => getScriptBoardSummary(items), [items]);
  const selectedItem = visibleItems.find((item) => item.id === selectedVideoId) || visibleItems[0] || null;
  const unsavedCount = items.filter((item) => hasUnsavedChanges(item.id)).length;
  const hasUnsavedDrafts = unsavedCount > 0;
  const emptyState = getScriptBoardEmptyState({
    totalCount: summary.totalCount,
    visibleCount: visibleItems.length,
  });

  useEffect(() => registerProductionBeforeUnloadGuard({
    hasUnsavedDrafts,
    target: typeof window === 'undefined' ? undefined : window,
  }), [hasUnsavedDrafts]);
  useEffect(() => {
    onUnsavedDraftsChange?.(hasUnsavedDrafts);
  }, [hasUnsavedDrafts, onUnsavedDraftsChange]);
  useEffect(() => () => onUnsavedDraftsChange?.(false), [onUnsavedDraftsChange]);

  const confirmNavigation = (message) => {
    if (typeof onConfirmUnsavedNavigation === 'function') {
      return onConfirmUnsavedNavigation(message);
    }
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      return window.confirm(message);
    }
    return false;
  };
  const navigation = getGuardedProductionNavigationHandlers({
    confirmNavigation,
    handlers: {
      home: onOpenHome,
      production: () => onOpenProductionCandidates(selectedItem?.video),
      schedule: () => onOpenUploadCalendar(selectedItem),
    },
    hasUnsavedDrafts,
  });
  const resetFilters = () => {
    setFilterMode('all');
    setSearchQuery('');
  };

  return (
    <section data-testid="creator-route-script-board" className="min-w-0 space-y-4">
      <header className="border border-indigo-400/25 bg-indigo-500/10 p-5 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-300">
              <FilePenLine className="h-5 w-5" />
              <p className="text-xs font-extrabold">제작 스튜디오</p>
            </div>
            <h2 className="mt-2 text-2xl font-black text-white">대본 분석·작성·수정 작업</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              제작 후보의 원본을 분석하고 구성안과 대본 본문을 단계별로 작성·수정합니다.
              현재는 기존 온라인 저장소(Azure DB)의 제작 기록을 사용하며 새 YouTube API 호출은 없습니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onOpenImprovementLog}
              className="inline-flex items-center gap-2 border border-violet-300/30 bg-violet-400/10 px-3 py-2 text-xs font-extrabold text-violet-100 hover:bg-violet-400/20"
              title="대본 작업실의 현재 지원 범위와 다음 개선 체크포인트를 확인합니다. 화면 이동만 하며 API 호출이나 온라인 저장소(Azure DB) 변경은 없습니다."
            >
              <ClipboardList className="h-4 w-4" /> 개선 기록
            </button>
            <button
              type="button"
              onClick={navigation.production}
              className="inline-flex items-center gap-2 border border-indigo-300/30 bg-indigo-400/10 px-3 py-2 text-xs font-extrabold text-indigo-100 hover:bg-indigo-400/20"
              title="제작 후보함으로 이동합니다. 화면 이동만으로 온라인 저장소(Azure DB) 데이터는 변경되지 않습니다."
            >
              <Sparkles className="h-4 w-4" /> 제작 후보함
            </button>
            <button
              type="button"
              onClick={navigation.schedule}
              className="inline-flex items-center gap-2 border border-amber-300/30 bg-amber-400/10 px-3 py-2 text-xs font-extrabold text-amber-100 hover:bg-amber-400/20"
              title="업로드 캘린더로 이동합니다. 화면 이동만으로 온라인 저장소(Azure DB) 저장이나 YouTube API 호출은 없습니다."
            >
              <CalendarDays className="h-4 w-4" /> 업로드 캘린더
            </button>
          </div>
        </div>
      </header>

      <div className="border border-emerald-400/25 bg-emerald-500/5 p-4">
        <p className="text-xs font-black text-emerald-200">현재 지원 범위</p>
        <p className="mt-2 text-xs leading-5 text-slate-300">
          제목, 영상 분석, 대본 구성안, 대본 본문, 진행 단계와 업로드 예정일을 분리해 저장합니다.
          기존 통합 작업 메모는 그대로 보존하며, 수정 이력과 AI 작성 보조는 이후 개선 기록에서 관리합니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {SUMMARY_ITEMS.map((item) => (
          <div key={item.key} className="border border-slate-800 bg-slate-900/90 p-3">
            <p className="text-[10px] font-extrabold text-slate-500">{item.label}</p>
            <p className="mt-1 text-xl font-black text-white">{summary[item.key]}개</p>
          </div>
        ))}
      </div>

      <div className="border border-slate-800 bg-slate-900/80 p-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <label className="relative block min-w-0 xl:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="원본 제목, 채널, 분석, 구성안, 대본 검색"
              className="w-full border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-xs font-semibold text-white outline-none focus:border-indigo-400"
              aria-label="대본 작업실 작업 검색"
            />
          </label>
          <div className="flex flex-wrap gap-2" aria-label="대본 작업실 진행 단계 필터">
            {SCRIPT_BOARD_FILTERS.map((filter) => (
              <button
                type="button"
                key={filter.id}
                onClick={() => setFilterMode(filter.id)}
                className={`border px-3 py-2 text-xs font-extrabold ${
                  filterMode === filter.id
                    ? 'border-indigo-300 bg-indigo-400 text-slate-950'
                    : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500'
                }`}
                title={`${filter.label} 작업만 표시합니다. 화면 필터만 바꾸며 온라인 저장소(Azure DB) 데이터는 변경하지 않습니다.`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        {hasUnsavedDrafts && (
          <p className="mt-3 border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-200" role="status">
            온라인 저장소(Azure DB)에 저장하지 않은 작업 {unsavedCount}개가 있습니다. 다른 화면으로 이동하기 전에 저장해주세요.
          </p>
        )}
      </div>

      {emptyState ? (
        <div className="border border-dashed border-slate-700 bg-slate-950/40 px-5 py-14 text-center">
          <h3 className="text-base font-extrabold text-white">{emptyState.title}</h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-400">{emptyState.description}</p>
          <button
            type="button"
            onClick={emptyState.type === 'filter' ? resetFilters : navigation.production}
            className="mt-4 bg-white px-4 py-2 text-xs font-extrabold text-slate-950"
            title={emptyState.type === 'filter'
              ? '검색어와 진행 단계 필터를 초기화합니다. 온라인 저장소(Azure DB) 데이터는 변경하지 않습니다.'
              : '제작 후보함으로 이동합니다. 화면 이동만으로 온라인 저장소(Azure DB) 저장이나 YouTube API 호출은 없습니다.'}
          >
            {emptyState.actionLabel}
          </button>
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="min-w-0 border border-slate-800 bg-slate-900/90 p-2 xl:max-h-[760px] xl:overflow-y-auto" aria-label="대본 작업실 작업 목록">
            <p className="px-2 pb-2 pt-1 text-[10px] font-extrabold text-slate-500">표시 중 {visibleItems.length}개</p>
            <div className="space-y-2">
              {visibleItems.map((item) => {
                const isSelected = item.id === selectedItem?.id;
                const title = item.record.draftTitle || item.video.title || '제목 없는 영상';
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedVideoId(item.id)}
                    className={`w-full border p-3 text-left ${
                      isSelected
                        ? 'border-indigo-400 bg-indigo-500/15'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-600'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold text-indigo-300">{item.isFocus ? '오늘 집중' : item.statusLabel}</span>
                      {hasUnsavedChanges(item.id) && <span className="text-[10px] font-black text-amber-300">미저장</span>}
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs font-extrabold leading-5 text-white">{title}</p>
                    <p className="mt-1 truncate text-[10px] text-slate-500">
                      {item.video.channel_title || item.video.channelTitle || '채널 정보 없음'}
                    </p>
                    {item.record.scriptStatus && (
                      <p className="mt-2 text-[10px] font-bold text-indigo-200">
                        대본 {getScriptWorkflowStatusLabel(item.record.scriptStatus)}
                      </p>
                    )}
                    {item.record.targetPublishDate && (
                      <p className="mt-2 text-[10px] font-bold text-amber-200">목표 {item.record.targetPublishDate}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          <ScriptBoardEditor
            isDirty={hasUnsavedChanges(selectedItem.id)}
            item={selectedItem}
            onOpenUploadCalendar={navigation.schedule}
            onSave={saveDraftRecord}
            onUpdateDraft={updateDraftRecord}
            saveState={saveStates[selectedItem.id]}
          />
        </div>
      )}
    </section>
  );
}
