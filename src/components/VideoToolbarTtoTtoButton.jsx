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
      className={`flex items-center gap-2 rounded-xl border px-4 py-2 font-extrabold shadow-sm transition-all duration-300 ${ttoTtoMode ? 'scale-105 border-orange-500 bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-rose-200 ring-2 ring-rose-200 ring-offset-1' : 'border-orange-300 bg-orange-100 text-orange-800 hover:border-orange-400 hover:bg-orange-200'}`}
      title={title}
      aria-label={ariaLabel}
      aria-pressed={ttoTtoMode}
    >
      <Rocket className={`w-5 h-5 ${ttoTtoMode ? 'animate-bounce' : ''}`} />
      {label}
    </button>
  );
}
