import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProductionVideoSaveStatus({ saveState }) {
  if (saveState === 'saved') {
    return (
      <p className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
        <CheckCircle2 className="h-3 w-3" /> 클라우드에 저장됐습니다.
      </p>
    );
  }

  if (saveState === 'error') {
    return (
      <p className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
        <AlertCircle className="h-3 w-3" /> 저장 실패. 다시 저장해 주세요.
      </p>
    );
  }

  return null;
}
