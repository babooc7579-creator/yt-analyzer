import DiscoveryLinkFieldLabel from './DiscoveryLinkFieldLabel';
import { getDiscoveryLinkMemoFieldViewProps } from '../utils/discoveryLinksCopy';

export default function DiscoveryLinkMemoField({
  onChange,
  value,
}) {
  const viewProps = getDiscoveryLinkMemoFieldViewProps();

  return (
    <div className="space-y-1.5">
      <DiscoveryLinkFieldLabel>{viewProps.label}</DiscoveryLinkFieldLabel>
      <textarea
        className="min-h-28 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400"
        onChange={(event) => onChange(event.target.value)}
        placeholder={viewProps.placeholder}
        value={value}
        aria-label={viewProps['aria-label']}
      />
    </div>
  );
}
