import HomeOperatingGuidelineCard from './HomeOperatingGuidelineCard';
import { getHomeOperatingGuidelinesViewProps } from '../utils/creatorHomeViewProps';

export default function HomeOperatingGuidelines() {
  const viewProps = getHomeOperatingGuidelinesViewProps();

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/30">
      <p className="text-sm font-extrabold text-white">{viewProps.sectionTitle}</p>
      <div className="mt-4 space-y-3 text-sm text-slate-400">
        {viewProps.guidelines.map(guideline => (
          <HomeOperatingGuidelineCard key={guideline.title} guideline={guideline} />
        ))}
      </div>
    </section>
  );
}
