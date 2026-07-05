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
      <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-3 text-left md:grid-cols-3">
        <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-4">
          <p className="text-sm font-extrabold text-rose-800">1. 오늘 레이더에서 고르기</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            저장 영상을 불러온 뒤 오늘 볼 후보에서 제작 후보로 보낼 영상을 고릅니다.
          </p>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
          <p className="text-sm font-extrabold text-indigo-800">2. 저장 영상에서 고르기</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            Cloud DB에 저장된 영상만 훑고 제작 후보로 표시합니다. 새 YouTube API 호출은 없습니다.
          </p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
          <p className="text-sm font-extrabold text-amber-800">3. 발견 링크에서 보내기</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            외부에서 본 링크를 Cloud 발견함에 저장하고 상태를 제작 후보로 바꿉니다.
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={onOpenReferenceVault}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
          title="저장 영상 탐색 화면을 엽니다. Cloud DB 조회이며 YouTube API를 새로 호출하지 않습니다."
          aria-label="저장 영상 탐색 화면 열기, Cloud DB 조회이며 YouTube API 호출 없음"
        >
          <Rocket className="h-4 w-4" /> 저장 영상 탐색
        </button>
        <button
          type="button"
          onClick={onOpenDiscoveryLinks}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          title="발견 링크 저장 화면을 엽니다. 외부 사이트 자동 수집이나 다운로드는 실행하지 않습니다."
          aria-label="발견 링크 저장 화면 열기, 외부 자동 수집이나 다운로드 없음"
        >
          <LinkIcon className="h-4 w-4" /> 발견 링크 저장
        </button>
      </div>
    </div>
  );
}
