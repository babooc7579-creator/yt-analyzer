import { useState } from 'react';
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
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(() => roadmapViewIds.has(activeView));

  return (
    <aside className="max-h-[46vh] shrink-0 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-2xl shadow-slate-950/40 [scrollbar-color:#334155_transparent] [scrollbar-width:thin] xl:sticky xl:top-6 xl:h-[calc(100vh-48px)] xl:max-h-none xl:w-[350px]">
      <CreatorSidebarHeader />

      <div className="space-y-5">
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
    </aside>
  );
}
