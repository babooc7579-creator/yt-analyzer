export default function ProductionDiscoveryLinkEditButton({
  disabled,
  linkTitle,
  onClick,
}) {
  return (
    <button
      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-extrabold text-slate-700 transition hover:bg-slate-50"
      aria-label={`${linkTitle} 발견함에서 수정`}
      disabled={disabled}
      onClick={onClick}
      title="발견함 화면에서 링크 상태와 메모 수정"
      type="button"
    >
      발견함에서 수정
    </button>
  );
}
