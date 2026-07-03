import { Search } from 'lucide-react';

export default function VideoToolbarSearchField({
  searchKeyword,
  setSearchKeyword,
}) {
  return (
    <div className="relative">
      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder="제목 검색..."
        className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-56 focus:ring-2 focus:ring-indigo-500 outline-none"
        title="불러온 저장 영상 제목 검색"
        aria-label="저장 영상 제목 검색"
      />
    </div>
  );
}
