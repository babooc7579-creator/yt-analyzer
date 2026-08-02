import { Database, Youtube } from 'lucide-react';

export default function KeywordExplorerSourceTabs({ source, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-2 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => onChange('stored')}
        aria-pressed={source === 'stored'}
        className={`rounded-lg px-4 py-3 text-left transition ${source === 'stored' ? 'bg-cyan-400 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
        title="온라인 저장소(Azure DB)에 이미 있는 수집 영상 정보를 검색합니다. YouTube API를 호출하지 않습니다."
      >
        <span className="flex items-center gap-2 text-sm font-black"><Database className="h-4 w-4" /> 수집 영상에서 찾기</span>
        <span className={`mt-1 block text-xs ${source === 'stored' ? 'text-slate-800' : 'text-slate-500'}`}>Azure DB 조회 · 새 API 검색 없음</span>
      </button>
      <button
        type="button"
        onClick={() => onChange('youtube')}
        aria-pressed={source === 'youtube'}
        className={`rounded-lg px-4 py-3 text-left transition ${source === 'youtube' ? 'bg-red-500 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
        title="검색 버튼을 눌렀을 때 YouTube API에서 새 영상 후보와 상세 통계를 조회합니다."
      >
        <span className="flex items-center gap-2 text-sm font-black"><Youtube className="h-4 w-4" /> YouTube에서 새로 찾기</span>
        <span className={`mt-1 block text-xs ${source === 'youtube' ? 'text-red-100' : 'text-slate-500'}`}>버튼 실행 시 YouTube API 사용</span>
      </button>
    </div>
  );
}
