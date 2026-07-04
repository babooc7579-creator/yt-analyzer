export default function DiscoveryLinksEmptyState() {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="text-sm font-extrabold text-slate-700">아직 저장된 발견 링크가 없습니다.</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        왼쪽에서 링크를 하나 저장하면 이곳에 검토 목록이 생깁니다.
      </p>
    </div>
  );
}
