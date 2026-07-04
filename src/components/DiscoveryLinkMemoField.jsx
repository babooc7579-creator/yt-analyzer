import DiscoveryLinkFieldLabel from './DiscoveryLinkFieldLabel';

export default function DiscoveryLinkMemoField({
  onChange,
  value,
}) {
  return (
    <div className="space-y-1.5">
      <DiscoveryLinkFieldLabel>메모</DiscoveryLinkFieldLabel>
      <textarea
        className="min-h-28 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400"
        onChange={(event) => onChange(event.target.value)}
        placeholder="왜 저장했는지, 어떤 포인트를 봐야 하는지 적어두세요."
        value={value}
        aria-label="발견 링크 메모"
      />
    </div>
  );
}
