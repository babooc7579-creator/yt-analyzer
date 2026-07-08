import { getDiscoveryLinkActionsNoticeViewProps } from '../utils/discoveryLinksCopy';
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
  const { message } = getDiscoveryLinkActionsNoticeViewProps();

  return (
    <div className="grid min-w-[260px] grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto_auto_auto_auto] xl:grid-cols-1">
      <p className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-[11px] font-semibold leading-relaxed text-indigo-700 sm:col-span-2 lg:col-span-7 xl:col-span-1">
        {message}
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
