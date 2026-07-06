import { Rocket } from 'lucide-react';

export default function DiscoveryLinkCandidateAction({
  currentStatus,
  onSendToCandidate,
  saving,
  title,
}) {
  const isCandidate = currentStatus === 'candidate';

  return (
    <button
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-xs font-extrabold transition disabled:cursor-not-allowed ${
        isCandidate
          ? 'border border-indigo-100 bg-indigo-50 text-indigo-500'
          : 'bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-slate-300'
      }`}
      aria-label={
        isCandidate
          ? `${title} 이미 Cloud 발견함 기록에 제작 후보로 저장됨, 권리 확인 상태는 별도 확인 필요`
          : `${title} Cloud 발견함 기록에 제작 후보로 저장, 권리 확인 완료 의미 아님`
      }
      disabled={saving || isCandidate}
      onClick={onSendToCandidate}
      title={
        isCandidate
          ? '이미 Cloud 발견함 기록에 제작 후보로 저장되어 제작실에 표시됩니다. 권리 확인 상태는 별도로 확인해야 합니다.'
          : '검토 상태를 제작 후보로 저장하고 제작실에 표시합니다. 권리 확인 완료를 의미하지 않으며, 외부 사이트를 새로 수집하지 않습니다.'
      }
      type="button"
    >
      <Rocket className="h-4 w-4" />
      {isCandidate ? '후보 등록됨' : '제작 후보로'}
    </button>
  );
}
