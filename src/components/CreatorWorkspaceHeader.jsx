import { getCreatorWorkspaceHeaderStatCards } from '../utils/appLayoutProps';
import CreatorWorkspaceStatCard from './CreatorWorkspaceStatCard';

export default function CreatorWorkspaceHeader({
  item,
  channelCount,
  discoveryCandidateCount,
  videoCount,
  selectedChannelCount,
  savedVideoCount,
}) {
  const statCards = getCreatorWorkspaceHeaderStatCards({
    channelCount,
    discoveryCandidateCount,
    savedVideoCount,
    selectedChannelCount,
    videoCount,
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold text-indigo-300">{item?.sectionTitle}</p>
          <h2 className="mt-1 text-2xl font-extrabold text-white">{item?.label}</h2>
          <p className="mt-1 text-sm text-slate-400">{item?.summary}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {statCards.map((statCard) => (
            <CreatorWorkspaceStatCard key={statCard.label} {...statCard} />
          ))}
        </div>
      </div>
    </div>
  );
}
