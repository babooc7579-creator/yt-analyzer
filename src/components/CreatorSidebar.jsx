import { CREATOR_OS_PRODUCT_MAP } from '../constants/creatorOs';
import CreatorSidebarHeader from './CreatorSidebarHeader';
import CreatorSidebarSection from './CreatorSidebarSection';

export default function CreatorSidebar({ activeView, onOpenView }) {
  return (
    <aside className="xl:sticky xl:top-6 xl:h-[calc(100vh-48px)] xl:w-[350px] shrink-0 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-2xl shadow-slate-950/40 [scrollbar-color:#334155_transparent] [scrollbar-width:thin]">
      <CreatorSidebarHeader />

      <div className="space-y-5">
        {CREATOR_OS_PRODUCT_MAP.map((section) => (
          <CreatorSidebarSection
            activeView={activeView}
            key={section.title}
            onOpenView={onOpenView}
            section={section}
          />
        ))}
      </div>
    </aside>
  );
}
