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
    <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-sm font-bold transition-all sm:gap-2 sm:px-5 ${activeTab === 'dashboard' ? 'border-indigo-100 bg-white text-indigo-700 shadow-sm' : 'border-slate-700 bg-slate-800 text-slate-200 hover:border-indigo-300 hover:bg-slate-700 hover:text-white'}`}
        title={dashboardTab.title}
        aria-label={dashboardTab.ariaLabel}
        aria-pressed={activeTab === 'dashboard'}
        type="button"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="sm:hidden">{dashboardTab.mobileLabel}</span>
        <span className="hidden sm:inline">{dashboardTab.label}</span>
        {activeTab === 'dashboard' ? (
          <span className="hidden bg-indigo-100 px-2 py-0.5 text-[10px] font-black text-indigo-700 sm:inline">현재 화면</span>
        ) : null}
      </button>
      <button
        onClick={() => onSelectTab('scrapbook')}
        className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-sm font-bold transition-all sm:gap-2 sm:px-5 ${activeTab === 'scrapbook' ? 'border-yellow-100 bg-white text-yellow-700 shadow-sm' : 'border-slate-700 bg-slate-800 text-slate-200 hover:border-yellow-300 hover:bg-slate-700 hover:text-white'}`}
        title={scrapbookTab.title}
        aria-label={scrapbookTab.ariaLabel}
        aria-pressed={activeTab === 'scrapbook'}
        type="button"
      >
        <Bookmark className="h-4 w-4 shrink-0" />
        <span className="sm:hidden">{scrapbookTab.mobileLabel}</span>
        <span className="hidden sm:inline">{scrapbookTab.label}</span>
        {scrapbookTab.countLabel !== null ? (
          <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">{scrapbookTab.countLabel}</span>
        ) : null}
        {activeTab === 'scrapbook' ? (
          <span className="hidden bg-yellow-100 px-2 py-0.5 text-[10px] font-black text-yellow-800 sm:inline">현재 화면</span>
        ) : null}
      </button>
    </div>
  );
}
