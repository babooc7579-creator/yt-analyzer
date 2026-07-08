import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { getProductionDiscoveryLinkMoveStatusViewProps } from '../utils/productionDiscoveryLinkActionProps';

export default function ProductionDiscoveryLinkMoveStatus({ moveState }) {
  const statusProps = getProductionDiscoveryLinkMoveStatusViewProps(moveState);

  if (!statusProps) return null;

  if (statusProps.tone === 'success') {
    return (
      <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold leading-relaxed text-emerald-700">
        <CheckCircle2 className="h-3 w-3 shrink-0" /> {statusProps.message}
      </p>
    );
  }

  return (
    <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold leading-relaxed text-red-600">
      <AlertCircle className="h-3 w-3 shrink-0" /> {statusProps.message}
    </p>
  );
}
