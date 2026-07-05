import { Star } from 'lucide-react';

export default function ScrapbookEmptyState() {
  return (
    <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 px-6">
      <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h3 className="text-xl font-extrabold text-slate-700 mb-2">스크랩된 영상이 없습니다</h3>
      <p className="mx-auto max-w-xl text-sm text-slate-500">
        스크랩북은 나중에 다시 볼 영상을 모아두는 보관함입니다. 별표로 저장한 영상만 이곳에 표시됩니다.
      </p>
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 text-left">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-bold text-slate-700">1. 채널 저장</p>
          <p className="text-xs text-slate-500 mt-2">소재를 모을 채널을 Cloud 채널 목록에 저장합니다. 영상 수집은 별도 버튼에서 실행합니다.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-bold text-slate-700">2. 저장 영상 불러오기</p>
          <p className="text-xs text-slate-500 mt-2">Cloud DB에 저장된 영상만 조회합니다. 새 YouTube API 호출은 없습니다.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-bold text-slate-700">3. 별표 저장</p>
          <p className="text-xs text-slate-500 mt-2">다시 볼 영상에 별표를 눌러 Cloud 스크랩북에 보관합니다.</p>
        </div>
      </div>
    </div>
  );
}
