import {
  DISCOVERY_LINK_STATUS_OPTIONS,
  DISCOVERY_RIGHTS_STATUS_OPTIONS,
} from '../constants/discoveryLinks';
import DiscoveryLinkFieldLabel from './DiscoveryLinkFieldLabel';

export default function DiscoveryLinkStatusFields({ onChange, rightsStatus, status }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-1">
      <div className="space-y-1.5">
        <DiscoveryLinkFieldLabel>검토 상태</DiscoveryLinkFieldLabel>
        <select
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm font-bold text-white outline-none transition focus:border-indigo-400"
          onChange={(event) => onChange('status', event.target.value)}
          value={status}
          title="발견 링크 검토 상태 선택"
          aria-label="발견 링크 검토 상태 선택"
        >
          {DISCOVERY_LINK_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <DiscoveryLinkFieldLabel>권리 확인</DiscoveryLinkFieldLabel>
        <select
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm font-bold text-white outline-none transition focus:border-indigo-400"
          onChange={(event) => onChange('rightsStatus', event.target.value)}
          value={rightsStatus}
          title="발견 링크 권리 확인 상태 선택"
          aria-label="발견 링크 권리 확인 상태 선택"
        >
          {DISCOVERY_RIGHTS_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
