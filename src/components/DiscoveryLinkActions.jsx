import DiscoveryLinkCandidateAction from './DiscoveryLinkCandidateAction';
import DiscoveryLinkStatusControls from './DiscoveryLinkStatusControls';
import DiscoveryLinkUtilityActions from './DiscoveryLinkUtilityActions';

export default function DiscoveryLinkActions({
  currentRightsStatus,
  currentStatus,
  isEditing,
  link,
  onDelete,
  onRightsStatusChange,
  onSendToCandidate,
  onStatusChange,
  onToggleEdit,
  saving,
  title,
}) {
  return (
    <div className="grid min-w-[260px] grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto_auto_auto_auto] xl:grid-cols-1">
      <p className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-[11px] font-semibold leading-relaxed text-indigo-700 sm:col-span-2 lg:col-span-7 xl:col-span-1">
        검토 상태와 권리 상태 표시는 바꾸는 즉시 Cloud 발견함에 저장됩니다. 외부 사이트를 새로 수집하지 않습니다.
      </p>
      <DiscoveryLinkStatusControls
        currentRightsStatus={currentRightsStatus}
        currentStatus={currentStatus}
        onRightsStatusChange={onRightsStatusChange}
        onStatusChange={onStatusChange}
        saving={saving}
        title={title}
      />

      <DiscoveryLinkCandidateAction
        currentStatus={currentStatus}
        onSendToCandidate={onSendToCandidate}
        saving={saving}
        title={title}
      />

      <DiscoveryLinkUtilityActions
        isEditing={isEditing}
        link={link}
        onDelete={onDelete}
        onToggleEdit={onToggleEdit}
        saving={saving}
        title={title}
      />
    </div>
  );
}
