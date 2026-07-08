import { Sparkles } from 'lucide-react';

import { getHomeRadarHeroViewProps } from '../utils/creatorHomeViewProps';

export default function HomeRadarHero() {
  const viewProps = getHomeRadarHeroViewProps();

  return (
    <div className="flex items-start gap-4">
      <div className="rounded-2xl bg-indigo-500/15 p-4">
        <Sparkles className="h-8 w-8 text-indigo-600" />
      </div>
      <div>
        <p className="text-sm font-extrabold text-indigo-300">{viewProps.eyebrow}</p>
        <h3 className="mt-1 text-2xl font-extrabold text-white">{viewProps.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{viewProps.description}</p>
      </div>
    </div>
  );
}
