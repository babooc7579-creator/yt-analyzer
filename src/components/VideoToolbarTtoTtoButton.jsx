import { Rocket } from 'lucide-react';
import { getVideoToolbarTtoTtoButtonViewProps } from '../utils/videoToolbarProps';

export default function VideoToolbarTtoTtoButton({
  setTtoTtoMode,
  ttoTtoMode,
}) {
  const {
    ariaLabel,
    label,
    title,
  } = getVideoToolbarTtoTtoButtonViewProps({ ttoTtoMode });

  return (
    <button
      type="button"
      onClick={() => setTtoTtoMode(!ttoTtoMode)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold transition-all duration-300 shadow-sm ${ttoTtoMode ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-rose-200 ring-2 ring-rose-200 ring-offset-1 scale-105' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'}`}
      title={title}
      aria-label={ariaLabel}
    >
      <Rocket className={`w-5 h-5 ${ttoTtoMode ? 'animate-bounce' : ''}`} />
      {label}
    </button>
  );
}
