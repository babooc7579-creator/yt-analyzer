import { AlertCircle } from 'lucide-react';

import { PRODUCTION_STATUS } from '../constants/status';

export default function ProductionVideoMoveStatus({ columnId, moveState, uploadedAt }) {
  return (
    <>
      {moveState === 'error' && (
        <p className="inline-flex items-center justify-center gap-1 text-[10px] font-bold text-red-600">
          <AlertCircle className="h-3 w-3" /> 상태 저장 실패. 다시 눌러 주세요.
        </p>
      )}
      {columnId === PRODUCTION_STATUS.DONE && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-[11px] font-bold text-slate-600">
          업로드 완료일 {uploadedAt || '기록 없음'}
        </div>
      )}
    </>
  );
}
