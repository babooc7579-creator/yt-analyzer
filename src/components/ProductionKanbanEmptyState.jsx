import { Link as LinkIcon, Rocket, Star } from 'lucide-react';

export default function ProductionKanbanEmptyState({
  onOpenDiscoveryLinks,
  onOpenReferenceVault,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <Star className="mx-auto h-12 w-12 text-slate-300" />
      <h3 className="mt-4 text-lg font-extrabold text-slate-800">아직 제작 후보가 없습니다</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
        스크랩북에 저장된 모든 영상이 자동으로 제작 후보가 되지는 않습니다.
        레이더, 레퍼런스 금고, 발견함에서 만들 만한 항목만 제작 후보로 보내면 이곳에 모입니다.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={onOpenReferenceVault}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
          title="저장된 영상 후보를 볼 수 있는 레퍼런스 금고 열기"
          aria-label="저장된 영상 후보를 볼 수 있는 레퍼런스 금고 열기"
        >
          <Rocket className="h-4 w-4" /> 레퍼런스 금고 열기
        </button>
        <button
          type="button"
          onClick={onOpenDiscoveryLinks}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          title="외부 링크 후보를 저장하고 관리하는 발견함 열기"
          aria-label="외부 링크 후보를 저장하고 관리하는 발견함 열기"
        >
          <LinkIcon className="h-4 w-4" /> 발견함 열기
        </button>
      </div>
    </div>
  );
}
