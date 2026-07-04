import { Rocket } from 'lucide-react';

export default function VideoToolbarTtoTtoButton({
  setTtoTtoMode,
  ttoTtoMode,
}) {
  return (
    <button
      type="button"
      onClick={() => setTtoTtoMode(!ttoTtoMode)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold transition-all duration-300 shadow-sm ${ttoTtoMode ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-rose-200 ring-2 ring-rose-200 ring-offset-1 scale-105' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'}`}
      title="6개월 이상 지난 또터또 후보 중심으로 보기"
      aria-label={ttoTtoMode ? '터또터 발굴 모드 끄기' : '터또터 발굴 모드 켜기'}
    >
      <Rocket className={`w-5 h-5 ${ttoTtoMode ? 'animate-bounce' : ''}`} />
      터또터 발굴 (6개월+)
    </button>
  );
}
