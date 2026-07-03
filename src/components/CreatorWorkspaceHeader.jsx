function StatCard({ value, label }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-center">
      <p className="text-xl font-extrabold text-white">{value}</p>
      <p className="text-[10px] font-semibold text-slate-500">{label}</p>
    </div>
  );
}

export default function CreatorWorkspaceHeader({
  item,
  channelCount,
  discoveryCandidateCount,
  videoCount,
  selectedChannelCount,
  savedVideoCount,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold text-indigo-300">{item?.sectionTitle}</p>
          <h2 className="mt-1 text-2xl font-extrabold text-white">{item?.label}</h2>
          <p className="mt-1 text-sm text-slate-400">{item?.summary}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <StatCard value={channelCount} label="채널" />
          <StatCard value={videoCount} label="불러온 영상" />
          <StatCard value={selectedChannelCount} label="선택 채널" />
          <StatCard value={savedVideoCount} label="스크랩 영상" />
          <StatCard value={discoveryCandidateCount} label="링크 후보" />
        </div>
      </div>
    </div>
  );
}
