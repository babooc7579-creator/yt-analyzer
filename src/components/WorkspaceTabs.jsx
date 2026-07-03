import { Bookmark, Search } from 'lucide-react';

export default function WorkspaceTabs({ activeTab, savedVideoCount, onSelectTab }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-indigo-700 ring-1 ring-indigo-100' : 'bg-slate-200/50 text-slate-500 hover:bg-white hover:shadow-sm'}`}
        title="저장 영상 분석 대시보드 보기"
        aria-label="분석 대시보드 탭 열기"
        type="button"
      >
        <Search className="w-4 h-4" /> 분석 대시보드
      </button>
      <button
        onClick={() => onSelectTab('scrapbook')}
        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'scrapbook' ? 'bg-white shadow-sm text-yellow-600 ring-1 ring-yellow-100' : 'bg-slate-200/50 text-slate-500 hover:bg-white hover:shadow-sm'}`}
        title={`Cloud 스크랩북 보기 - 보관 영상 ${savedVideoCount}개`}
        aria-label={`영구 스크랩북 탭 열기, 보관 영상 ${savedVideoCount}개`}
        type="button"
      >
        <Bookmark className="w-4 h-4" /> 영구 스크랩북 <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">{savedVideoCount}</span>
      </button>
    </div>
  );
}
