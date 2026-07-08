import { getCreatorSidebarHeaderViewProps } from '../utils/appLayoutProps';

export default function CreatorSidebarHeader() {
  const {
    brandLabel,
    description,
    title,
  } = getCreatorSidebarHeaderViewProps();

  return (
    <div className="mb-5 rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-slate-950 to-indigo-950/80 p-4 text-white">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-200">{brandLabel}</p>
      <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-2 text-xs leading-relaxed text-slate-300">{description}</p>
    </div>
  );
}
