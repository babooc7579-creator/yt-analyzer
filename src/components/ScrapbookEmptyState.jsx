import { Star } from 'lucide-react';

export default function ScrapbookEmptyState() {
  return (
    <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 px-6">
      <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h3 className="text-xl font-extrabold text-slate-700 mb-2">스크랩된 영상이 없습니다</h3>
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 text-left">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-bold text-slate-700">1. 채널 저장</p>
          <p className="text-xs text-slate-500 mt-2">먼저 소재를 모을 채널을 저장합니다.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-bold text-slate-700">2. 영상 불러오기</p>
          <p className="text-xs text-slate-500 mt-2">“저장된 영상 불러오기”로 영상을 확인합니다.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-bold text-slate-700">3. 별표 저장</p>
          <p className="text-xs text-slate-500 mt-2">분석 대시보드에서 별표 버튼을 눌러 모읍니다.</p>
        </div>
      </div>
    </div>
  );
}
