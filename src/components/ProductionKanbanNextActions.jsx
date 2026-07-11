import { Link as LinkIcon, Rocket } from 'lucide-react';

import EmptyStateActions from './EmptyStateActions';

const ACTION_ICONS = {
  discoveryLinks: LinkIcon,
  referenceVault: Rocket,
};

const ACTION_CLASSES = {
  indigo: 'border border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
  secondary: 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100',
};

export default function ProductionKanbanNextActions({ actions = [] }) {
  if (actions.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-extrabold text-slate-800">다음 행동</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            후보를 더 찾거나 외부 링크 후보를 정리합니다. 화면 이동만으로 YouTube API나 외부 자동 수집은 실행하지 않습니다.
          </p>
        </div>
        <EmptyStateActions
          actions={actions}
          buttonBaseClassName="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold"
          className="flex flex-wrap gap-2"
          fallbackIcon={Rocket}
          icons={ACTION_ICONS}
          variantClasses={{
            ...ACTION_CLASSES,
            default: ACTION_CLASSES.secondary,
          }}
        />
      </div>
    </div>
  );
}
