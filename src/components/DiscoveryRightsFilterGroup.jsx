import { DISCOVERY_RIGHTS_TONES } from '../constants/discoveryLinks';
import {
  getDiscoveryRightsFilterButtonProps,
  getDiscoveryRightsFilterGroupViewProps,
} from '../utils/discoveryLinksCopy';

const toArray = (items) => (Array.isArray(items) ? items : []);

export default function DiscoveryRightsFilterGroup({
  rightsFilter,
  rightsFilterOptions,
  setRightsFilter,
}) {
  const filterOptions = toArray(rightsFilterOptions);
  const { title } = getDiscoveryRightsFilterGroupViewProps();

  return (
    <>
      <p className="mt-4 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <div aria-label={title} className="mt-2 flex flex-wrap gap-2" role="group">
        {filterOptions.map((option) => {
          const isActive = rightsFilter === option.value;
          const rightsTone = DISCOVERY_RIGHTS_TONES[option.value];
          const buttonProps = getDiscoveryRightsFilterButtonProps({ option });
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
              title={buttonProps.title}
              aria-label={buttonProps['aria-label']}
              aria-pressed={isActive}
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
