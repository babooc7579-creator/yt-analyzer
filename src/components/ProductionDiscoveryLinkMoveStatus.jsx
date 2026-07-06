import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProductionDiscoveryLinkMoveStatus({ moveState }) {
  if (moveState !== 'error' && moveState !== 'saved') {
    return null;
  }

  if (moveState === 'saved') {
    return (
      <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold leading-relaxed text-emerald-700">
        <CheckCircle2 className="h-3 w-3 shrink-0" /> Cloud 발견함 상태 저장 완료. 링크 기록은 유지됩니다.
      </p>
    );
  }

  return (
    <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold leading-relaxed text-red-600">
      <AlertCircle className="h-3 w-3 shrink-0" /> Cloud 상태 저장 실패. 저장 완료 처리하지 않았습니다. 다시 눌러 주세요.
    </p>
  );
}
