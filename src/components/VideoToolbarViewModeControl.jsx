import VideoToolbarToggleButton from './VideoToolbarToggleButton';

const VIEW_MODE_OPTIONS = [
  {
    value: 'card',
    label: '카드 보기',
    title: '영상 후보를 카드 형태로 보기',
    ariaLabel: '카드 보기로 전환',
  },
  {
    value: 'list',
    label: '리스트 보기',
    title: '영상 후보를 표 형태로 보기',
    ariaLabel: '리스트 보기로 전환',
  },
];

export default function VideoToolbarViewModeControl({ setViewMode, viewMode }) {
  return (
    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
      {VIEW_MODE_OPTIONS.map((option) => (
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
