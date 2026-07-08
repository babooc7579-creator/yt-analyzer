import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { getProductionVideoSaveStatusViewProps } from '../utils/productionVideoStatusProps';

export default function ProductionVideoSaveStatus({ saveState }) {
  const statusProps = getProductionVideoSaveStatusViewProps(saveState);

  if (statusProps?.tone === 'success') {
    return (
      <p className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
        <CheckCircle2 className="h-3 w-3" /> {statusProps.message}
      </p>
    );
  }

  if (statusProps?.tone === 'danger') {
    return (
      <p className="inline-flex items-center gap-1 text-[10px] font-bold leading-relaxed text-red-600">
        <AlertCircle className="h-3 w-3 shrink-0" /> {statusProps.message}
      </p>
    );
  }

  return null;
}
