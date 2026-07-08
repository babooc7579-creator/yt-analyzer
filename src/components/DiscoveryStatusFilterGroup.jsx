import {
  getDiscoveryStatusFilterButtonProps,
  getDiscoveryStatusFilterGroupViewProps,
} from '../utils/discoveryLinksCopy';

const toArray = (items) => (Array.isArray(items) ? items : []);

export default function DiscoveryStatusFilterGroup({
  setStatusFilter,
  statusFilter,
  statusFilterOptions,
}) {
  const filterOptions = toArray(statusFilterOptions);
  const { title } = getDiscoveryStatusFilterGroupViewProps();

  return (
    <>
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {filterOptions.map((option) => {
          const isActive = statusFilter === option.value;
          const buttonProps = getDiscoveryStatusFilterButtonProps({ option });
          return (
            <button
              className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-extrabold transition ${
                isActive
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              title={buttonProps.title}
              aria-label={buttonProps['aria-label']}
              type="button"
            >
              <span>{option.label}</span>
              <span className={isActive ? 'text-indigo-500' : 'text-slate-400'}>
                {option.count}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
