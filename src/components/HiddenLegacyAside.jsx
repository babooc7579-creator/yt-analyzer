export default function HiddenLegacyAside({
  checkedVideoCount,
  savedVideoCount,
  selectedChannelCount,
  videoCount,
}) {
  return (
    <aside className="hidden">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <p className="text-sm font-extrabold text-slate-900 mb-3">오늘의 다음 행동</p>
        <div className="space-y-3">
          <div className="border border-indigo-100 bg-indigo-50/60 rounded-xl p-3">
            <p className="text-xs font-bold text-indigo-800">1. 채널 저장</p>
            <p className="text-[11px] text-slate-600 mt-1">아직 없는 채널은 왼쪽에서 먼저 저장합니다.</p>
          </div>
          <div className="border border-emerald-100 bg-emerald-50 rounded-xl p-3">
            <p className="text-xs font-bold text-emerald-800">2. 새 영상 수집</p>
            <p className="text-[11px] text-slate-600 mt-1">새 데이터가 필요할 때만 실행합니다.</p>
          </div>
          <div className="border border-blue-100 bg-blue-50 rounded-xl p-3">
            <p className="text-xs font-bold text-blue-800">3. 저장 영상 조회</p>
            <p className="text-[11px] text-slate-600 mt-1">저장된 데이터만 보고 싶을 때 사용합니다.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <p className="text-sm font-extrabold text-slate-900 mb-3">현재 상태</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-slate-800">{selectedChannelCount}</p>
            <p className="text-[11px] text-slate-500">선택 채널</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-slate-800">{videoCount}</p>
            <p className="text-[11px] text-slate-500">불러온 영상</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-slate-800">{savedVideoCount}</p>
            <p className="text-[11px] text-slate-500">스크랩</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-slate-800">{checkedVideoCount}</p>
            <p className="text-[11px] text-slate-500">선택 영상</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <p className="text-sm font-extrabold text-slate-900 mb-3">수집과 조회 차이</p>
        <div className="space-y-3 text-[11px] text-slate-600 leading-relaxed">
          <p><span className="font-bold text-emerald-700">선택 채널 새 영상 수집</span>은 YouTube API를 호출해 새 영상 여부를 확인합니다.</p>
          <p><span className="font-bold text-blue-700">저장된 영상 불러오기</span>는 이미 저장된 데이터만 조회합니다.</p>
          <p className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-amber-800">API 호출이 필요한 작업은 필요한 때만 실행하세요.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <p className="text-sm font-extrabold text-slate-900 mb-3">터또터 발굴 기준</p>
        <div className="space-y-2 text-[11px] text-slate-600">
          <p>업로드 후 6개월 이상 지난 영상</p>
          <p>채널 평균보다 반응이 컸던 영상</p>
          <p>지금 다시 써도 소재로 확장 가능한 영상</p>
        </div>
      </div>
    </aside>
  );
}
