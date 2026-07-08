import { getVideoToolbarViewModeOptions } from '../utils/videoToolbarFiltersProps';
import VideoToolbarToggleButton from './VideoToolbarToggleButton';

export default function VideoToolbarViewModeControl({ setViewMode, viewMode }) {
  const viewModeOptions = getVideoToolbarViewModeOptions();

  return (
    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
      {viewModeOptions.map((option) => (
        <VideoToolbarToggleButton
          key={option.value}
          activeClassName="text-indigo-700"
          ariaLabel={option.ariaLabel}
          inactiveClassName="text-slate-500 hover:text-slate-800"
          isActive={viewMode === option.value}
          label={option.label}
          onClick={() => setViewMode(option.value)}
          title={option.title}
        />
      ))}
    </div>
  );
}
