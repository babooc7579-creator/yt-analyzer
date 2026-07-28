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
    <div className="relative">
      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-56 focus:ring-2 focus:ring-indigo-500 outline-none"
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
