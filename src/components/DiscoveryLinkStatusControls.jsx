import {
  DISCOVERY_LINK_STATUS_OPTIONS,
  DISCOVERY_RIGHTS_STATUS_OPTIONS,
} from '../constants/discoveryLinks';

export default function DiscoveryLinkStatusControls({
  currentRightsStatus,
  currentStatus,
  onRightsStatusChange,
  onStatusChange,
  saving,
  title,
}) {
  return (
    <>
      <select
        className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none transition focus:border-indigo-400"
        disabled={saving}
        value={currentStatus}
        onChange={onStatusChange}
        title="검토 상태 변경 - Cloud 발견함 기록에 저장됩니다. 원본 사이트를 새로 수집하지 않습니다."
        aria-label={`${title} 검토 상태 변경, Cloud 발견함 기록 저장`}
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
        title="권리 상태 표시 변경 - Cloud 발견함 기록에 저장됩니다. 사용 허가나 권리 확인 완료를 의미하지 않습니다."
        aria-label={`${title} 권리 상태 표시 변경, Cloud 발견함 기록 저장, 사용 허가 의미 아님`}
      >
        {DISCOVERY_RIGHTS_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </>
  );
}
