import DiscoveryLinkFieldLabel from './DiscoveryLinkFieldLabel';

export default function DiscoveryLinkUrlField({
  duplicateLink,
  onChange,
  url,
  urlPreview,
}) {
  return (
    <div className="space-y-1.5">
      <DiscoveryLinkFieldLabel>원본 링크</DiscoveryLinkFieldLabel>
      <input
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400"
        onChange={(event) => onChange('url', event.target.value)}
        placeholder="https://..."
        required
        type="url"
        value={url}
        aria-label="저장할 원본 링크 URL"
      />
      {urlPreview && (
        <div className={`rounded-lg border px-3 py-2 text-xs leading-relaxed ${
          urlPreview.isValid
            ? 'border-indigo-400/20 bg-indigo-500/10 text-indigo-100'
            : 'border-red-400/30 bg-red-500/10 text-red-100'
        }`}
        >
          <p className="font-extrabold">{urlPreview.label}</p>
          {urlPreview.host ? (
            <p className="mt-0.5 text-[11px] opacity-80">
              출처 도메인: {urlPreview.host}
            </p>
          ) : null}
        </div>
      )}
      {duplicateLink ? (
        <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-100">
          <p className="font-extrabold">이미 Cloud 발견함에 저장된 링크입니다.</p>
          <p className="mt-0.5">
            새로 저장하지 말고 오른쪽 목록에서 기존 항목을 수정하세요.
          </p>
        </div>
      ) : null}
    </div>
  );
}
