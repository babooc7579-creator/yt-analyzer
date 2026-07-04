import { useDiscoveryLinkRow } from '../hooks/useDiscoveryLinkRow';
import DiscoveryLinkActions from './DiscoveryLinkActions';
import DiscoveryLinkRowContent from './DiscoveryLinkRowContent';

export default function DiscoveryLinkRow({
  link,
  onDelete,
  onUpdate,
  saving,
}) {
  const {
    cancelEdit,
    currentRightsStatus,
    currentStatus,
    draftMemo,
    draftTitle,
    handleDelete,
    handleRightsStatusChange,
    handleSaveEdit,
    handleSendToCandidate,
    handleStatusChange,
    isEditing,
    openEdit,
    platformLabel,
    rightsTone,
    setDraftMemo,
    setDraftTitle,
    sourceHost,
    title,
  } = useDiscoveryLinkRow({
    link,
    onDelete,
    onUpdate,
  });
  const rowContentProps = {
    cancelEdit,
    currentRightsStatus,
    currentStatus,
    draftMemo,
    draftTitle,
    handleSaveEdit,
    isEditing,
    link,
    platformLabel,
    rightsTone,
    saving,
    setDraftMemo,
    setDraftTitle,
    sourceHost,
    title,
  };

  const actionsProps = {
    currentRightsStatus,
    currentStatus,
    isEditing,
    link,
    onDelete: handleDelete,
    onRightsStatusChange: handleRightsStatusChange,
    onSendToCandidate: handleSendToCandidate,
    onStatusChange: handleStatusChange,
    onToggleEdit: isEditing ? cancelEdit : openEdit,
    saving,
    title,
  };

  return (
    <article className={`rounded-xl border p-4 shadow-sm ${rightsTone.card}`}>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <DiscoveryLinkRowContent {...rowContentProps} />

        <DiscoveryLinkActions {...actionsProps} />
      </div>
    </article>
  );
}
