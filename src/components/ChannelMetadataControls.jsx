import { getChannelMetadataControlsViewProps } from '../utils/channelMetadataControlsProps';

const toArray = (items) => (Array.isArray(items) ? items : []);

export default function ChannelMetadataControls({
  channel,
  grade,
  isUpdating,
  onUpdateMetadata,
  status,
}) {
  const {
    gradeLabelText,
    gradeOptions,
    gradeSelectProps,
    statusLabelText,
    statusOptions,
    statusSelectProps,
  } = getChannelMetadataControlsViewProps({
    channel,
    grade,
    isUpdating,
    onUpdateMetadata,
    status,
  });
  const gradeOptionList = toArray(gradeOptions);
  const statusOptionList = toArray(statusOptions);

  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      <label className="block">
        <span className="sr-only">{gradeLabelText}</span>
        <select {...gradeSelectProps}>
          {gradeOptionList.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="sr-only">{statusLabelText}</span>
        <select {...statusSelectProps}>
          {statusOptionList.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
