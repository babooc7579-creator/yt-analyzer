import { ListChecks, Plus, RefreshCw } from 'lucide-react';

import { CHANNEL_OPERATION_STAGES } from '../utils/channelOperations';

const STAGE_ICONS = {
  manage: ListChecks,
  add: Plus,
  scan: RefreshCw,
};

export default function ChannelOperationsNavigator({ activeStage = 'manage', onSelectStage }) {
  return (
    <section className="border border-cyan-400/20 bg-slate-950/80 p-4" aria-labelledby="channel-operations-title">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold text-cyan-300">오퍼레이션 관제</p>
          <h2 id="channel-operations-title" className="mt-1 text-xl font-black text-white">채널 운영실</h2>
          <p className="mt-1 text-xs leading-5 text-slate-400">채널을 고르고 등록한 뒤, 필요할 때만 새 영상 수집을 실행합니다.</p>
        </div>
        <p className="text-[11px] font-bold text-emerald-200">채널 선택만으로 YouTube API는 호출되지 않습니다.</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 lg:grid-cols-3" role="navigation" aria-label="채널 운영 작업 단계">
        {CHANNEL_OPERATION_STAGES.map((stage) => {
          const Icon = STAGE_ICONS[stage.id];
          const isActive = stage.id === activeStage;

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onSelectStage?.(stage.id)}
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
              </span>
              <span className="mt-2 block text-[11px] leading-4 text-slate-400">{stage.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
