import { Bookmark } from 'lucide-react';

export default function ReferenceVaultEmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5"><Bookmark className="w-10 h-10 text-indigo-400" /></div>
        <h3 className="text-2xl font-extrabold text-slate-800 mb-2">레퍼런스 금고가 비어 있습니다</h3>
        <p className="text-sm text-slate-500 mb-6">채널을 저장한 뒤, Cloud DB에 저장된 영상을 불러오면 금고에 제작 소재가 쌓입니다. 새 영상 수집은 필요할 때만 따로 실행합니다.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-left">
          <div className="border border-indigo-100 bg-indigo-50/60 rounded-xl p-4">
            <p className="text-sm font-bold text-indigo-800">1. 채널 저장</p>
            <p className="text-xs text-slate-600 mt-2">작업 패널에서 채널을 미리보기한 뒤 Cloud 채널 목록에 저장합니다. 이 단계만으로 영상 수집은 실행되지 않습니다.</p>
          </div>
          <div className="border border-emerald-100 bg-emerald-50 rounded-xl p-4">
            <p className="text-sm font-bold text-emerald-800">2. 선택 채널 새 영상 수집</p>
            <p className="text-xs text-slate-600 mt-2">새 데이터가 필요할 때만 실행합니다. 이 단계는 YouTube API를 호출할 수 있습니다.</p>
          </div>
          <div className="border border-blue-100 bg-blue-50 rounded-xl p-4">
            <p className="text-sm font-bold text-blue-800">3. 저장된 영상 불러오기</p>
            <p className="text-xs text-slate-600 mt-2">Cloud DB에 이미 저장된 영상만 조회합니다. 새 YouTube API 호출은 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
