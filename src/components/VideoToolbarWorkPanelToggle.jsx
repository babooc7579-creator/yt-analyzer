import { getVideoToolbarWorkPanelToggleViewProps } from '../utils/videoToolbarFiltersProps';

export default function VideoToolbarWorkPanelToggle({
  setShowWorkPanel,
  showWorkPanel,
}) {
  const {
    ariaLabel,
    label,
    title,
  } = getVideoToolbarWorkPanelToggleViewProps({ showWorkPanel });

  return (
    <button
      type="button"
      onClick={() => setShowWorkPanel(!showWorkPanel)}
      className={`px-3 py-2 rounded-lg text-sm font-bold transition-all border ${
        showWorkPanel
          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
          : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-700'
      }`}
      title={title}
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );
}
