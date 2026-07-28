import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  Clock3,
  GitBranch,
  ShieldCheck,
} from 'lucide-react';

import {
  CREATOR_OS_IMPROVEMENT_AREAS,
  IMPROVEMENT_CHECKPOINT_STATUS,
  IMPROVEMENT_LOG_LAST_UPDATED,
  IMPROVEMENT_STATUS_META,
} from '../constants/improvementLog';
import { getImprovementLogSummary } from '../utils/improvementLog';

const STATUS_CLASSES = {
  emerald: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
  cyan: 'border-cyan-400/30 bg-cyan-500/10 text-cyan-200',
  amber: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
  indigo: 'border-indigo-400/30 bg-indigo-500/10 text-indigo-200',
  slate: 'border-slate-700 bg-slate-900 text-slate-300',
};

const STATUS_ICONS = {
  [IMPROVEMENT_CHECKPOINT_STATUS.DONE]: CheckCircle2,
  [IMPROVEMENT_CHECKPOINT_STATUS.IN_PROGRESS]: Clock3,
  [IMPROVEMENT_CHECKPOINT_STATUS.DECISION_REQUIRED]: AlertTriangle,
  [IMPROVEMENT_CHECKPOINT_STATUS.PLANNED]: CircleDot,
  [IMPROVEMENT_CHECKPOINT_STATUS.LATER]: CircleDot,
};

function StatusBadge({ status }) {
  const meta = IMPROVEMENT_STATUS_META[status] || IMPROVEMENT_STATUS_META.later;

  return (
    <span className={`inline-flex items-center border px-2 py-1 text-[10px] font-extrabold ${STATUS_CLASSES[meta.tone]}`}>
      {meta.label}
    </span>
  );
}

function ImprovementAreaCard({ area }) {
  return (
    <article
      id={`improvement-${area.id}`}
      className="scroll-mt-6 border border-slate-800 bg-slate-900/85 p-4 sm:p-5"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={area.status} />
            <span className="border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] font-black text-slate-300">{area.priority}</span>
            <span className="text-[10px] font-bold text-slate-500">{area.section}</span>
          </div>
          <h3 className="mt-3 text-xl font-black text-white">{area.title}</h3>
        </div>
        <p className="text-xs font-semibold text-slate-500">마지막 점검 {area.lastReviewedAt}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
        <div className="border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-[10px] font-extrabold text-slate-500">현재 상태</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{area.currentSummary}</p>
        </div>
        <div className="border border-indigo-400/20 bg-indigo-500/5 p-4">
          <p className="text-[10px] font-extrabold text-indigo-300">목표 상태</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">{area.targetSummary}</p>
        </div>
      </div>

      <div className="mt-4 border border-cyan-400/25 bg-cyan-500/5 p-4">
        <p className="text-[10px] font-extrabold text-cyan-300">다음 작업</p>
        <p className="mt-2 text-sm font-bold leading-6 text-cyan-50">{area.nextAction}</p>
      </div>

      <div className="mt-5">
        <h4 className="text-xs font-black text-white">체크포인트</h4>
        <div className="mt-3 space-y-2">
          {area.checkpoints.map((checkpoint) => {
            const Icon = STATUS_ICONS[checkpoint.status] || CircleDot;
            return (
              <div
                key={checkpoint.id}
                className="flex items-start gap-3 border border-slate-800 bg-slate-950/50 px-3 py-3"
              >
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${
                  checkpoint.status === IMPROVEMENT_CHECKPOINT_STATUS.DONE
                    ? 'text-emerald-300'
                    : checkpoint.status === IMPROVEMENT_CHECKPOINT_STATUS.DECISION_REQUIRED
                      ? 'text-amber-300'
                      : 'text-slate-400'
                }`} />
                <p className="min-w-0 flex-1 text-xs font-semibold leading-5 text-slate-300">{checkpoint.label}</p>
                <StatusBadge status={checkpoint.status} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 border-t border-slate-800 pt-4">
        <h4 className="text-xs font-black text-white">결정·운영 기준</h4>
        <ul className="mt-3 space-y-2">
          {area.decisions.map((decision) => (
            <li key={decision} className="flex items-start gap-2 text-xs leading-5 text-slate-400">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-300" />
              <span>{decision}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function ImprovementLogWorkspace() {
  const summary = getImprovementLogSummary();
  const metrics = [
    { label: '관리 영역', value: summary.areaCount },
    { label: '전체 체크포인트', value: summary.checkpointCount },
    { label: '확인 완료', value: summary.doneCount },
    { label: '진행 중', value: summary.inProgressCount },
    { label: '결정 필요', value: summary.decisionRequiredCount },
  ];

  return (
    <section data-testid="creator-route-improvement-log" className="min-w-0 space-y-4">
      <header className="border border-violet-400/25 bg-violet-500/10 p-5 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-violet-300">
              <ClipboardList className="h-5 w-5" />
              <p className="text-xs font-extrabold">인사이트 / 학습</p>
            </div>
            <h2 className="mt-2 text-2xl font-black text-white">Creator OS 개선 기록</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              현재 구현, 목표 방향, 다음 작업과 결정이 필요한 항목을 한곳에서 추적합니다.
              이 화면은 코드와 Git 이력으로 관리하는 읽기 전용 기록이며 API 호출이나 온라인 저장소(Azure DB) 변경은 없습니다.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs font-bold text-slate-300">
            <GitBranch className="h-4 w-4 text-violet-300" /> 마지막 갱신 {IMPROVEMENT_LOG_LAST_UPDATED}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {metrics.map((metric) => (
          <div key={metric.label} className="border border-slate-800 bg-slate-900/90 p-3">
            <p className="text-[10px] font-extrabold text-slate-500">{metric.label}</p>
            <p className="mt-1 text-xl font-black text-white">{metric.value}개</p>
          </div>
        ))}
      </div>

      <div className="border border-emerald-400/20 bg-emerald-500/5 p-4">
        <p className="text-xs font-black text-emerald-200">완료 판단 기준</p>
        <p className="mt-2 text-xs leading-5 text-slate-300">
          코드나 버튼이 존재하는 것만으로 완료 처리하지 않습니다. 실제 클릭, 화면의 보이는 변화, 결과 위치,
          이름과 기능의 일치, 필요한 경우 API·온라인 저장소(Azure DB) 결과까지 확인한 뒤 체크포인트를 갱신합니다.
        </p>
      </div>

      <div className="space-y-4">
        {CREATOR_OS_IMPROVEMENT_AREAS.map((area) => (
          <ImprovementAreaCard area={area} key={area.id} />
        ))}
      </div>
    </section>
  );
}
