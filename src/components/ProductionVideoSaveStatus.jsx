import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProductionVideoSaveStatus({ saveState }) {
  if (saveState === 'saved') {
    return (
      <p className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
        <CheckCircle2 className="h-3 w-3" /> Cloud에 저장됐습니다.
      </p>
    );
  }

  if (saveState === 'error') {
    return (
      <p className="inline-flex items-center gap-1 text-[10px] font-bold leading-relaxed text-red-600">
        <AlertCircle className="h-3 w-3 shrink-0" /> Cloud 저장 실패. 저장 완료 처리하지 않았습니다. 다시 저장해 주세요.
      </p>
    );
  }

  return null;
}
