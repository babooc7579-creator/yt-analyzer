import { Plus, RefreshCw } from 'lucide-react';

import { getDiscoveryLinkSubmitButtonViewProps } from '../utils/discoveryLinksCopy';

export default function DiscoveryLinkSubmitButton({
  duplicateLink,
  isCreateDisabled,
  saving,
}) {
  const { buttonProps, label } = getDiscoveryLinkSubmitButtonViewProps({
    duplicateLink,
    saving,
  });

  return (
    <button
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700"
      disabled={isCreateDisabled}
      {...buttonProps}
    >
      {saving ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      {label}
    </button>
  );
}
