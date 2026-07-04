import CreatorSidebarItem from './CreatorSidebarItem';

export default function CreatorSidebarSection({
  activeView,
  onOpenView,
  section,
}) {
  return (
    <div>
      <div className="mb-2.5 px-1">
        <p className="text-[11px] font-extrabold tracking-wide text-slate-100">{section.title}</p>
        <p className="text-[10px] leading-snug text-slate-500">{section.description}</p>
      </div>
      <div className="space-y-1.5">
        {section.items.map((item) => (
          <CreatorSidebarItem
            isActive={activeView === item.id}
            item={item}
            key={item.id}
            onOpenView={onOpenView}
          />
        ))}
      </div>
    </div>
  );
}
