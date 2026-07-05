import { AlertCircle } from 'lucide-react';

export default function ProductionDiscoveryLinkMoveStatus({ moveState }) {
  if (moveState !== 'error') {
    return null;
  }

  return (
    <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold leading-relaxed text-red-600">
      <AlertCircle className="h-3 w-3 shrink-0" /> Cloud 상태 저장 실패. 저장 완료 처리하지 않았습니다. 다시 눌러 주세요.
    </p>
  );
}
