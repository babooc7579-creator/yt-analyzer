import { getVideoToolbarSelectFiltersViewProps } from '../utils/videoToolbarFiltersProps';

export default function VideoToolbarSelectFilters({
  lengthFilter,
  setLengthFilter,
  setViewFilter,
  viewFilter,
}) {
  const {
    lengthFilterAriaLabel,
    lengthFilterOptions,
    lengthFilterTitle,
    viewFilterAriaLabel,
    viewFilterOptions,
    viewFilterTitle,
  } = getVideoToolbarSelectFiltersViewProps();

  return (
    <>
      <select
        value={viewFilter}
        onChange={(e) => setViewFilter(Number(e.target.value))}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer text-slate-700 font-medium sm:w-auto"
        title={viewFilterTitle}
        aria-label={viewFilterAriaLabel}
      >
        {viewFilterOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      <select
        value={lengthFilter}
        onChange={(e) => setLengthFilter(e.target.value)}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer text-slate-700 font-medium sm:w-auto"
        title={lengthFilterTitle}
        aria-label={lengthFilterAriaLabel}
      >
        {lengthFilterOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </>
  );
}
