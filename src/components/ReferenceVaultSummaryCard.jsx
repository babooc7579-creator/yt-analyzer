import { REFERENCE_VAULT_SUMMARY_TONES } from '../constants/referenceVault';

export default function ReferenceVaultSummaryCard({ label, value, tone = 'slate' }) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${REFERENCE_VAULT_SUMMARY_TONES[tone]}`}>
      <p className="text-[10px] font-bold">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
