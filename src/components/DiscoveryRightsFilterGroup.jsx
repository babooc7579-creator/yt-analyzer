import { DISCOVERY_RIGHTS_TONES } from '../constants/discoveryLinks';

const toArray = (items) => (Array.isArray(items) ? items : []);

export default function DiscoveryRightsFilterGroup({
  rightsFilter,
  rightsFilterOptions,
  setRightsFilter,
}) {
  const filterOptions = toArray(rightsFilterOptions);

  return (
    <>
      <p className="mt-4 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
        권리 상태별 보기
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {filterOptions.map((option) => {
          const isActive = rightsFilter === option.value;
          const rightsTone = DISCOVERY_RIGHTS_TONES[option.value];
          const buttonTone = rightsTone
            ? `${rightsTone.badge} ${isActive ? 'shadow-sm ring-2 ring-white' : 'opacity-75 hover:opacity-100'}`
            : isActive
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100';
          return (
            <button
              className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-extrabold transition ${buttonTone}`}
              key={option.value}
              onClick={() => setRightsFilter(option.value)}
              title={`${option.label} 권리 상태 링크만 보기`}
              aria-label={`${option.label} 권리 상태 링크 ${option.count}개 보기`}
              type="button"
            >
              <span>{option.label}</span>
              <span className={isActive || rightsTone ? 'text-current opacity-75' : 'text-slate-400'}>
                {option.count}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
