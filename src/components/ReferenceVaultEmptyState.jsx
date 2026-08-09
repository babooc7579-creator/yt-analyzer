import { Bookmark, Home, ListChecks, ScanSearch } from 'lucide-react';

import { REFERENCE_VAULT_EMPTY_STATE } from '../constants/emptyStates';
import EmptyStateActions from './EmptyStateActions';
import EmptyStateSteps from './EmptyStateSteps';
import LoadStoredVideosButton from './LoadStoredVideosButton';

const ICONS = {
  'channel-watchlist': ListChecks,
  home: Home,
};

const ACTION_BUTTON_CLASS_NAME = 'inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700';

const toSafeCount = (value) => (
  Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0
);

export default function ReferenceVaultEmptyState({
  actions = [],
  loading = false,
  loadResult = null,
  onLoadStoredVideos,
  onOpenSelectedScan,
  selectedChannelCount = 0,
}) {
  const safeSelectedChannelCount = toSafeCount(selectedChannelCount);
  const hasSelectedChannels = safeSelectedChannelCount > 0;
  const loadFailed = Boolean(loadResult && loadResult.success !== true);
  const loadedEmpty = Boolean(
    loadResult?.success === true && toSafeCount(loadResult.videoCount) === 0,
  );

  const statusTitle = loadFailed
    ? '온라인 저장소의 영상 정보를 불러오지 못했습니다'
    : loadedEmpty
      ? '조회는 완료됐지만 수집된 영상 정보가 없습니다'
      : hasSelectedChannels
        ? `오늘 볼 채널 ${safeSelectedChannelCount}개가 선택되었습니다`
        : '먼저 오늘 확인할 채널을 선택하세요';
  const statusDescription = loadFailed
    ? '같은 버튼으로 다시 시도해 주세요. 실패한 조회는 YouTube API를 호출하지 않습니다.'
    : loadedEmpty
      ? '다른 채널을 선택하거나, 새 데이터가 필요하면 새 영상 수집 화면에서 별도로 실행하세요.'
      : hasSelectedChannels
        ? '아래 버튼으로 Azure DB에 이미 기록된 영상 정보만 불러옵니다. YouTube API는 호출하지 않습니다.'
        : '영상 자체를 고르는 것이 아니라, 등록된 채널 중 오늘 살펴볼 채널을 먼저 고릅니다.';

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5"><Bookmark className="w-10 h-10 text-indigo-400" /></div>
        <h3 className="text-2xl font-extrabold text-slate-800 mb-2">{REFERENCE_VAULT_EMPTY_STATE.title}</h3>
        <p className="text-sm text-slate-500">{REFERENCE_VAULT_EMPTY_STATE.description}</p>

        <section className={`mx-auto mt-6 max-w-2xl rounded-2xl border p-5 text-left ${loadFailed ? 'border-rose-200 bg-rose-50' : loadedEmpty ? 'border-amber-200 bg-amber-50' : 'border-indigo-200 bg-indigo-50/70'}`} aria-label="수집 영상 목록 현재 상태와 다음 행동">
          <p className="text-[11px] font-black tracking-wide text-slate-500">현재 상태 · 선택 채널 {safeSelectedChannelCount}개 · 불러온 영상 0개</p>
          <h4 className="mt-2 text-base font-extrabold text-slate-900">{statusTitle}</h4>
          <p className="mt-1 text-xs leading-5 text-slate-600">{statusDescription}</p>

          {hasSelectedChannels && typeof onLoadStoredVideos === 'function' ? (
            <LoadStoredVideosButton
              loading={loading}
              onLoad={onLoadStoredVideos}
              selectedChannelCount={safeSelectedChannelCount}
            />
          ) : (
            <EmptyStateActions
              actions={actions.filter(action => action.key === 'channel-watchlist')}
              buttonBaseClassName="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-indigo-500"
              className="mt-4 flex flex-wrap gap-3"
              fallbackIcon={Bookmark}
              icons={ICONS}
            />
          )}

          {loadedEmpty && typeof onOpenSelectedScan === 'function' ? (
            <button
              type="button"
              onClick={onOpenSelectedScan}
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-xs font-extrabold text-amber-900 hover:bg-amber-100"
              title="새 영상 수집 화면으로 이동합니다. 이동만으로 YouTube API 호출이나 수집은 시작되지 않습니다."
              aria-label="선택 채널 새 영상 수집 화면 열기, 이동만으로 YouTube API 호출 없음"
            >
              <ScanSearch className="h-4 w-4" /> 새 영상 수집 화면 열기
            </button>
          ) : null}
        </section>

        <EmptyStateSteps
          className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 text-left"
          defaultDescriptionClassName="text-xs text-slate-600 mt-2"
          stepClassNames={[
            'border border-indigo-100 bg-indigo-50/60 rounded-xl p-4',
            'border border-emerald-100 bg-emerald-50 rounded-xl p-4',
            'border border-blue-100 bg-blue-50 rounded-xl p-4',
          ]}
          steps={REFERENCE_VAULT_EMPTY_STATE.steps}
          titleClassNames={[
            'text-sm font-bold text-indigo-800',
            'text-sm font-bold text-emerald-800',
            'text-sm font-bold text-blue-800',
          ]}
        />
        <EmptyStateActions
          actions={actions.filter(action => action.key !== 'channel-watchlist')}
          buttonBaseClassName={ACTION_BUTTON_CLASS_NAME}
          fallbackIcon={Bookmark}
          icons={ICONS}
        />
      </div>
    </div>
  );
}
