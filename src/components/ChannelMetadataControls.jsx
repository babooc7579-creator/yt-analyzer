import { getChannelMetadataControlsViewProps } from '../utils/channelMetadataControlsProps';

export default function ChannelMetadataControls({
  channel,
  grade,
  isUpdating,
  onUpdateMetadata,
  status,
}) {
  const {
    gradeOptions,
    gradeSelectProps,
    statusOptions,
    statusSelectProps,
  } = getChannelMetadataControlsViewProps({
    channel,
    grade,
    isUpdating,
    onUpdateMetadata,
    status,
  });

  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      <label className="block">
        <span className="sr-only">채널 등급</span>
        <select {...gradeSelectProps}>
          {gradeOptions.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="sr-only">채널 상태</span>
        <select {...statusSelectProps}>
          {statusOptions.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
