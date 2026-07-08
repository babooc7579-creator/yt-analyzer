import { Bookmark, Search } from 'lucide-react';
import { getWorkspaceTabsViewProps } from '../utils/appLayoutProps';

export default function WorkspaceTabs({ activeTab, savedVideoCount, onSelectTab }) {
  const {
    dashboardTab,
    scrapbookTab,
  } = getWorkspaceTabsViewProps({ savedVideoCount });

  return (
    <div className="flex gap-2">
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-indigo-700 ring-1 ring-indigo-100' : 'bg-slate-200/50 text-slate-500 hover:bg-white hover:shadow-sm'}`}
        title={dashboardTab.title}
        aria-label={dashboardTab.ariaLabel}
        type="button"
      >
        <Search className="w-4 h-4" /> {dashboardTab.label}
      </button>
      <button
        onClick={() => onSelectTab('scrapbook')}
        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'scrapbook' ? 'bg-white shadow-sm text-yellow-600 ring-1 ring-yellow-100' : 'bg-slate-200/50 text-slate-500 hover:bg-white hover:shadow-sm'}`}
        title={scrapbookTab.title}
        aria-label={scrapbookTab.ariaLabel}
        type="button"
      >
        <Bookmark className="w-4 h-4" /> {scrapbookTab.label} <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">{savedVideoCount}</span>
      </button>
    </div>
  );
}
