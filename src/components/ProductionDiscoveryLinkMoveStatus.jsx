import { AlertCircle } from 'lucide-react';

export default function ProductionDiscoveryLinkMoveStatus({ moveState }) {
  if (moveState !== 'error') {
    return null;
  }

  return (
    <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
      <AlertCircle className="h-3 w-3" /> 상태 저장 실패. 다시 눌러 주세요.
    </p>
  );
}
