import { AlertTriangle } from 'lucide-react';

export default function DiscoveryLinkRiskyCandidateHint({ show }) {
  if (!show) return null;

  return (
    <div className="flex gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs leading-relaxed text-red-100">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p className="font-extrabold">사용 금지 링크를 제작 후보로 저장하려고 합니다</p>
        <p className="mt-1">
          저장 버튼을 누르면 한 번 더 확인합니다. 실제 제작에 쓰기 전에는 원본과 권리 상태를 다시 확인하세요.
        </p>
      </div>
    </div>
  );
}
