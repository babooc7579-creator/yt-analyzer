import { ArrowRight, Database, ListChecks, Plus, Radar, RefreshCw } from 'lucide-react';

import { CHANNEL_OPERATION_STAGES, getChannelOperationsJourney } from '../utils/channelOperations';

const STAGE_ICONS = {
  manage: ListChecks,
  add: Plus,
  scan: RefreshCw,
};

const ACTION_ICONS = {
  'load-stored': Database,
  'open-add': Plus,
  'open-manage': ListChecks,
  'open-radar': Radar,
  'open-scan': RefreshCw,
  'open-videos': Database,
};

const STATUS_STYLES = {
  active: 'bg-emerald-100 text-emerald-800',
  complete: 'bg-cyan-100 text-cyan-900',
  ready: 'bg-amber-100 text-amber-900',
  waiting: 'bg-slate-800 text-slate-300',
};

export default function ChannelOperationsNavigator({
  activeStage = 'manage',
  isLoading = false,
  isScanning = false,
  onLoadStoredVideos,
  onOpenHome,
  onOpenStoredVideos,
  onSelectStage,
  savedChannels = [],
  selectedChannelIds = [],
  storedVideoLoadResult,
  videos = [],
}) {
  const journey = getChannelOperationsJourney({
    isLoading,
    isScanning,
    savedChannels,
    selectedChannelIds,
    storedVideoLoadResult,
    videos,
  });

  const handleJourneyAction = (actionId) => {
    if (actionId === 'open-add') onSelectStage?.('add');
    if (actionId === 'open-manage') onSelectStage?.('manage');
    if (actionId === 'open-scan') onSelectStage?.('scan');
    if (actionId === 'load-stored') onLoadStoredVideos?.();
    if (actionId === 'open-videos') onOpenStoredVideos?.();
    if (actionId === 'open-radar') onOpenHome?.();
  };

  const renderJourneyAction = (action, secondary = false) => {
    if (!action) return null;
    const Icon = ACTION_ICONS[action.id] || ArrowRight;

    return (
      <button
        type="button"
        aria-label={action.title}
        disabled={action.disabled}
        onClick={() => handleJourneyAction(action.id)}
        title={action.title}
        className={`flex min-h-10 items-center justify-center gap-2 px-4 py-2 text-xs font-black transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          secondary
            ? 'border border-slate-600 bg-slate-900 text-slate-200 hover:border-cyan-400'
            : 'bg-cyan-200 text-cyan-950 hover:bg-cyan-100'
        }`}
      >
        <Icon className="h-4 w-4" />
        {action.label}
      </button>
    );
  };

  return (
    <section className="border border-cyan-400/20 bg-slate-950/80 p-4" aria-labelledby="channel-operations-journey-title">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold text-cyan-300">오퍼레이션 관제</p>
          <h2 id="channel-operations-journey-title" className="mt-1 text-xl font-black text-white">오늘의 채널 운영 순서</h2>
          <p className="mt-1 text-xs leading-5 text-slate-400">아래 3단계 중 하나를 고르면 해당 작업 화면만 열립니다.</p>
        </div>
        <p className="text-[11px] font-bold text-emerald-200">채널 선택만으로 YouTube API는 호출되지 않습니다.</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 lg:grid-cols-3" role="tablist" aria-label="채널 운영 작업 단계">
        {CHANNEL_OPERATION_STAGES.map((stage) => {
          const Icon = STAGE_ICONS[stage.id];
          const isActive = stage.id === activeStage;
          const stageStatus = journey.stageStatusById[stage.id];

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onSelectStage?.(stage.id)}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'step' : undefined}
              className={`min-h-[82px] border px-4 py-3 text-left transition-colors ${
                isActive
                  ? 'border-cyan-300 bg-cyan-400/15 text-white'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-500/60 hover:bg-slate-800'
              }`}
              title={`${stage.label} 영역으로 이동합니다. 이동만으로 API 호출이나 Cloud 저장은 실행되지 않습니다.`}
            >
              <span className="flex items-center gap-2 text-sm font-black">
                <span className={`flex h-7 w-7 items-center justify-center ${isActive ? 'bg-cyan-200 text-cyan-950' : 'bg-slate-800 text-slate-300'}`}>
                  <Icon className="h-4 w-4" />
                </span>
                {stage.step}. {stage.label}
                <span className={`ml-auto px-2 py-1 text-[10px] ${STATUS_STYLES[stageStatus.tone]}`}>
                  {stageStatus.label}
                </span>
              </span>
              <span className="mt-2 block text-[11px] leading-4 text-slate-400">{stage.description}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-col gap-3 border-t border-slate-700 pt-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-black text-amber-300">다음 추천 행동</p>
          <p className="mt-1 text-sm font-black text-white">{journey.title}</p>
          <p className="mt-1 text-[11px] leading-4 text-slate-400">{journey.description}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
          {renderJourneyAction(journey.secondaryAction, true)}
          {renderJourneyAction(journey.primaryAction)}
        </div>
      </div>
    </section>
  );
}
