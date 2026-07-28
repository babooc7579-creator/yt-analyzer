import { Bookmark, Search } from 'lucide-react';
import { getWorkspaceTabsViewProps } from '../utils/appLayoutProps';

export default function WorkspaceTabs({
  activeTab,
  creatorView,
  savedVideoCount,
  onSelectTab,
}) {
  const {
    dashboardTab,
    scrapbookTab,
  } = getWorkspaceTabsViewProps({ creatorView, savedVideoCount });

  return (
    <div className="flex gap-2">
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'border-indigo-100 bg-white text-indigo-700 shadow-sm' : 'border-slate-700 bg-slate-800 text-slate-200 hover:border-indigo-300 hover:bg-slate-700 hover:text-white'}`}
        title={dashboardTab.title}
        aria-label={dashboardTab.ariaLabel}
        aria-pressed={activeTab === 'dashboard'}
        type="button"
      >
        <Search className="w-4 h-4" /> {dashboardTab.label}
        {activeTab === 'dashboard' ? (
          <span className="bg-indigo-100 px-2 py-0.5 text-[10px] font-black text-indigo-700">현재 화면</span>
        ) : null}
      </button>
      <button
        onClick={() => onSelectTab('scrapbook')}
        className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-all ${activeTab === 'scrapbook' ? 'border-yellow-100 bg-white text-yellow-700 shadow-sm' : 'border-slate-700 bg-slate-800 text-slate-200 hover:border-yellow-300 hover:bg-slate-700 hover:text-white'}`}
        title={scrapbookTab.title}
        aria-label={scrapbookTab.ariaLabel}
        aria-pressed={activeTab === 'scrapbook'}
        type="button"
      >
        <Bookmark className="w-4 h-4" /> {scrapbookTab.label}
        {scrapbookTab.countLabel !== null ? (
          <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">{scrapbookTab.countLabel}</span>
        ) : null}
        {activeTab === 'scrapbook' ? (
          <span className="bg-yellow-100 px-2 py-0.5 text-[10px] font-black text-yellow-800">현재 화면</span>
        ) : null}
      </button>
    </div>
  );
}
