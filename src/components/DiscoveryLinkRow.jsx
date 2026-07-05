import { useDiscoveryLinkRow } from '../hooks/useDiscoveryLinkRow';
import { getDiscoveryLinkRowViewProps } from '../utils/discoveryLinks';
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
  const {
    actionsProps,
    cardClassName,
    rowContentProps,
  } = getDiscoveryLinkRowViewProps({
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
    link,
    openEdit,
    platformLabel,
    rightsTone,
    saving,
    setDraftMemo,
    setDraftTitle,
    sourceHost,
    title,
  });

  return (
    <article className={cardClassName}>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <DiscoveryLinkRowContent {...rowContentProps} />

        <DiscoveryLinkActions {...actionsProps} />
      </div>
    </article>
  );
}
