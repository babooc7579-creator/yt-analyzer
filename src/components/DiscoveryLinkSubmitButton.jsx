import { Plus, RefreshCw } from 'lucide-react';

export default function DiscoveryLinkSubmitButton({
  duplicateLink,
  isCreateDisabled,
  saving,
}) {
  return (
    <button
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700"
      disabled={isCreateDisabled}
      title="링크와 메모를 Cloud 발견함에 저장합니다. 외부 사이트 크롤링은 하지 않습니다."
      aria-label="Cloud 발견함에 링크 저장"
      type="submit"
    >
      {saving ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      {saving ? 'Cloud 저장 중' : duplicateLink ? '이미 저장된 링크' : '링크 저장'}
    </button>
  );
}
