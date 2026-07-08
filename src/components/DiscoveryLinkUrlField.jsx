import { getDiscoveryLinkUrlFieldViewProps } from '../utils/discoveryLinksCopy';
import DiscoveryLinkFieldLabel from './DiscoveryLinkFieldLabel';

export default function DiscoveryLinkUrlField({
  duplicateLink,
  onChange,
  url,
  urlPreview,
}) {
  const {
    duplicateWarning,
    inputAriaLabel,
    label,
    previewHostText,
  } = getDiscoveryLinkUrlFieldViewProps({ duplicateLink, urlPreview });

  return (
    <div className="space-y-1.5">
      <DiscoveryLinkFieldLabel>{label}</DiscoveryLinkFieldLabel>
      <input
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400"
        onChange={(event) => onChange('url', event.target.value)}
        placeholder="https://..."
        required
        type="url"
        value={url}
        aria-label={inputAriaLabel}
      />
      {urlPreview && (
        <div className={`rounded-lg border px-3 py-2 text-xs leading-relaxed ${
          urlPreview.isValid
            ? 'border-indigo-400/20 bg-indigo-500/10 text-indigo-100'
            : 'border-red-400/30 bg-red-500/10 text-red-100'
        }`}
        >
          <p className="font-extrabold">{urlPreview.label}</p>
          {urlPreview.host ? (
            <p className="mt-0.5 text-[11px] opacity-80">
              {previewHostText}
            </p>
          ) : null}
        </div>
      )}
      {duplicateWarning ? (
        <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-100">
          <p className="font-extrabold">{duplicateWarning.title}</p>
          <p className="mt-0.5">
            {duplicateWarning.description}
          </p>
        </div>
      ) : null}
    </div>
  );
}
