const TONES = {
  slate: 'border-slate-300 bg-white/80 text-slate-400',
  yellow: 'border-yellow-200 bg-yellow-50 text-yellow-600',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-600',
  rose: 'border-rose-200 bg-rose-50 text-rose-600',
};

export default function ReferenceVaultSummaryCard({ label, value, tone = 'slate' }) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${TONES[tone]}`}>
      <p className="text-[10px] font-bold">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
