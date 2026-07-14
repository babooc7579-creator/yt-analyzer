import { useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import { CREATOR_OS_PRODUCT_MAP } from '../constants/creatorOs';
import { getCreatorSidebarNavigationGroups } from '../utils/appLayoutProps';
import CreatorAccessControl from './CreatorAccessControl';
import CreatorSidebarHeader from './CreatorSidebarHeader';
import CreatorSidebarRoadmap from './CreatorSidebarRoadmap';
import CreatorSidebarSection from './CreatorSidebarSection';

const {
  liveSections,
  roadmapItemCount,
  roadmapSections,
} = getCreatorSidebarNavigationGroups(CREATOR_OS_PRODUCT_MAP);
const roadmapViewIds = new Set(
  roadmapSections.flatMap((section) => section.items.map((item) => item.id)),
);

export default function CreatorSidebar({ activeView, onOpenView }) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(() => roadmapViewIds.has(activeView));

  return (
    <aside className={`shrink-0 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-2xl shadow-slate-950/40 [scrollbar-color:#334155_transparent] [scrollbar-width:thin] ${isNavigationOpen ? 'max-h-[72vh]' : 'max-h-none'} xl:sticky xl:top-6 xl:h-[calc(100vh-48px)] xl:max-h-none xl:w-[350px]`}>
      <CreatorSidebarHeader />

      <button
        type="button"
        onClick={() => setIsNavigationOpen((currentValue) => !currentValue)}
        className="mt-4 flex w-full items-center justify-between border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-xs font-extrabold text-slate-200 xl:hidden"
        aria-expanded={isNavigationOpen}
        aria-label={`전체 메뉴 ${isNavigationOpen ? '접기' : '펼치기'}`}
      >
        <span className="inline-flex items-center gap-2"><Menu className="h-4 w-4" /> 전체 메뉴</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isNavigationOpen ? 'rotate-180' : ''}`} />
      </button>

      <div className={`${isNavigationOpen ? 'block' : 'hidden'} xl:block`}>
        <div className="mt-5 space-y-5 xl:mt-0">
          {liveSections.map((section) => (
            <CreatorSidebarSection
              activeView={activeView}
              key={section.title}
              onOpenView={onOpenView}
              section={section}
            />
          ))}
        </div>

        <CreatorSidebarRoadmap
          activeView={activeView}
          isOpen={isRoadmapOpen}
          onOpenView={onOpenView}
          onToggle={() => setIsRoadmapOpen((currentValue) => !currentValue)}
          roadmapItemCount={roadmapItemCount}
          roadmapSections={roadmapSections}
        />

        <CreatorAccessControl />
      </div>
    </aside>
  );
}
