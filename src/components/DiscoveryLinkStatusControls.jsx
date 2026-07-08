import {
  DISCOVERY_LINK_STATUS_OPTIONS,
  DISCOVERY_RIGHTS_STATUS_OPTIONS,
} from '../constants/discoveryLinks';
import { getDiscoveryLinkStatusControlsViewProps } from '../utils/discoveryLinksCopy';

export default function DiscoveryLinkStatusControls({
  currentRightsStatus,
  currentStatus,
  onRightsStatusChange,
  onStatusChange,
  saving,
  title,
}) {
  const {
    rightsSelectProps,
    statusSelectProps,
  } = getDiscoveryLinkStatusControlsViewProps({ title });

  return (
    <>
      <select
        className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none transition focus:border-indigo-400"
        disabled={saving}
        value={currentStatus}
        onChange={onStatusChange}
        {...statusSelectProps}
      >
        {DISCOVERY_LINK_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      <select
        className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none transition focus:border-indigo-400"
        disabled={saving}
        value={currentRightsStatus}
        onChange={onRightsStatusChange}
        {...rightsSelectProps}
      >
        {DISCOVERY_RIGHTS_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </>
  );
}
