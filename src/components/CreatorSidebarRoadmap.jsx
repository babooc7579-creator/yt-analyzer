import { ChevronDown, Map } from 'lucide-react';
import { getCreatorSidebarRoadmapViewProps } from '../utils/appLayoutProps';
import CreatorSidebarSection from './CreatorSidebarSection';

export default function CreatorSidebarRoadmap({
  activeView,
  isOpen,
  onOpenView,
  onToggle,
  roadmapItemCount,
  roadmapSections,
}) {
  const {
    ariaLabel,
    countLabel,
    description,
    title,
  } = getCreatorSidebarRoadmapViewProps({
    isOpen,
    roadmapItemCount,
  });

  return (
    <div className="mt-5 border-y border-slate-800 py-3">
      <button
        type="button"
        aria-controls="creator-sidebar-roadmap-items"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className="flex w-full items-center gap-3 px-1 py-1.5 text-left text-slate-300 transition hover:text-white"
        onClick={onToggle}
        title={ariaLabel}
      >
        <Map aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-500" />
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-extrabold">{title}</span>
          <span className="block text-[10px] text-slate-500">{description}</span>
        </span>
        <span className="shrink-0 text-[10px] font-bold text-slate-500">{countLabel}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="mt-4 space-y-5 border-t border-slate-800 pt-4"
          id="creator-sidebar-roadmap-items"
        >
          {roadmapSections.map((section) => (
            <CreatorSidebarSection
              activeView={activeView}
              key={section.title}
              onOpenView={onOpenView}
              section={section}
            />
          ))}
        </div>
      )}
    </div>
  );
}
