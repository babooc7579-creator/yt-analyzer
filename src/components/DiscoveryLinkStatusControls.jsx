import {
  DISCOVERY_LINK_SAVE_TAG_OPTIONS,
  DISCOVERY_LINK_TAGS,
  DISCOVERY_LINK_STATUS_OPTIONS,
  DISCOVERY_RIGHTS_STATUS_OPTIONS,
} from '../constants/discoveryLinks';
import { getDiscoveryLinkStatusControlsViewProps } from '../utils/discoveryLinksCopy';

export default function DiscoveryLinkStatusControls({
  currentRightsStatus,
  currentStatus,
  currentTags = [],
  onRightsStatusChange,
  onTagsChange,
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
        aria-label={`${title} 학습 분류`}
        className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none transition focus:border-indigo-400"
        disabled={saving}
        value={currentTags.includes(DISCOVERY_LINK_TAGS.KAION_LEARNING) ? DISCOVERY_LINK_TAGS.KAION_LEARNING : ''}
        onChange={onTagsChange}
        title="개별 영상·링크의 학습 목적 분류를 온라인 저장소(Azure DB)에 저장합니다. 출처 채널 태그와는 별도입니다."
      >
        {DISCOVERY_LINK_SAVE_TAG_OPTIONS.map((option) => (
          <option key={option.value || 'none'} value={option.value}>{option.label}</option>
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
