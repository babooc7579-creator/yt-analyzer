import { getDiscoveryLinksLoadingStateViewProps } from '../utils/discoveryLinksCopy';

export default function DiscoveryLinksLoadingState() {
  const { message } = getDiscoveryLinksLoadingStateViewProps();

  return (
    <div role="status" aria-live="polite" className="mt-5 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500">
      {message}
    </div>
  );
}
