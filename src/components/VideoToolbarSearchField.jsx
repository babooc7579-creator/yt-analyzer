import { Search, X } from 'lucide-react';
import { getVideoToolbarSearchFieldViewProps } from '../utils/videoToolbarFiltersProps';

export default function VideoToolbarSearchField({
  searchKeyword,
  setSearchKeyword,
}) {
  const {
    ariaLabel,
    clearAriaLabel,
    clearTitle,
    placeholder,
    showClearButton,
    title,
  } = getVideoToolbarSearchFieldViewProps({ searchKeyword });

  return (
    <div className="relative w-full min-w-0">
      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder={placeholder}
        className="w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-9 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        title={title}
        aria-label={ariaLabel}
      />
      {showClearButton && (
        <button
          type="button"
          onClick={() => setSearchKeyword('')}
          title={clearTitle}
          aria-label={clearAriaLabel}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
