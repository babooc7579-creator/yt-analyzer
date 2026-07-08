import { AlertCircle } from 'lucide-react';

import { getProductionVideoMoveStatusViewProps } from '../utils/productionVideoStatusProps';

export default function ProductionVideoMoveStatus({ columnId, moveState, uploadedAt }) {
  const {
    errorMessage,
    uploadedAtText,
  } = getProductionVideoMoveStatusViewProps({
    columnId,
    moveState,
    uploadedAt,
  });

  return (
    <>
      {errorMessage && (
        <p className="inline-flex items-center justify-center gap-1 text-[10px] font-bold leading-relaxed text-red-600">
          <AlertCircle className="h-3 w-3 shrink-0" /> {errorMessage}
        </p>
      )}
      {uploadedAtText && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-[11px] font-bold text-slate-600">
          {uploadedAtText}
        </div>
      )}
    </>
  );
}
