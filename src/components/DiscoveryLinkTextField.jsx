import DiscoveryLinkFieldLabel from './DiscoveryLinkFieldLabel';

export default function DiscoveryLinkTextField({
  ariaLabel,
  label,
  onChange,
  placeholder,
  value,
}) {
  return (
    <div className="space-y-1.5">
      <DiscoveryLinkFieldLabel>{label}</DiscoveryLinkFieldLabel>
      <input
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
        aria-label={ariaLabel}
      />
    </div>
  );
}
