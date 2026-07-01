export default function SyncWarningBanner({ message }) {
  if (!message) return null;

  return (
    <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-xs font-semibold leading-relaxed text-amber-100">
      {message}
    </div>
  );
}
