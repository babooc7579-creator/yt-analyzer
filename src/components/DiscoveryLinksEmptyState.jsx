export default function DiscoveryLinksEmptyState() {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="text-sm font-extrabold text-slate-700">아직 저장된 발견 링크가 없습니다.</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        왼쪽 입력창에 외부에서 본 URL을 직접 저장하면 Cloud 발견함에 검토 목록이 생깁니다.
      </p>
      <div className="mx-auto mt-5 grid max-w-3xl grid-cols-1 gap-3 text-left md:grid-cols-3">
        <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
          <p className="text-xs font-extrabold text-amber-800">1. URL 붙여넣기</p>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">인스타, 유튜브, 웹 링크를 수동으로 기록합니다.</p>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
          <p className="text-xs font-extrabold text-indigo-800">2. 상태 정리</p>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">받은 링크, 검토중, 저장, 제작 후보, 제외로 나눕니다.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-extrabold text-slate-700">3. 안전 기준</p>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">외부 사이트 자동 수집이나 파일 다운로드는 실행하지 않습니다.</p>
        </div>
      </div>
    </div>
  );
}
