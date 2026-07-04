import CopyUrlButton from './CopyUrlButton';

export default function ProductionDiscoveryLinkCopyButton({
  disabled,
  link,
  linkTitle,
}) {
  return (
    <CopyUrlButton
      url={link.url}
      label="링크 복사"
      copiedLabel="복사 완료"
      copyingLabel="복사 중"
      errorLabel="복사 실패"
      disabled={disabled}
      ariaLabel={`${linkTitle} 원본 링크 URL 복사`}
      title="원본 링크 URL을 클립보드에 복사합니다. 외부 사이트 수집이나 저장 작업은 없습니다."
      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-extrabold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      iconClassName="h-3.5 w-3.5"
    />
  );
}
