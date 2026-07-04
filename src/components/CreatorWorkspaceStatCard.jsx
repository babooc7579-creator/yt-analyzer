export default function CreatorWorkspaceStatCard({ value, label, description }) {
  return (
    <div
      className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-center"
      title={description}
      role="group"
      aria-label={`${label}: ${value}. ${description}`}
    >
      <p className="text-xl font-extrabold text-white">{value}</p>
      <p className="text-[10px] font-semibold text-slate-500">{label}</p>
    </div>
  );
}
