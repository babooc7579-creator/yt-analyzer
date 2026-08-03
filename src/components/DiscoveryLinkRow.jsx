import { useDiscoveryLinkRow } from '../hooks/useDiscoveryLinkRow';
import { getDiscoveryLinkRowViewProps } from '../utils/discoveryLinks';
import DiscoveryLinkActions from './DiscoveryLinkActions';
import DiscoveryLinkRowContent from './DiscoveryLinkRowContent';

export default function DiscoveryLinkRow({
  link,
  onDelete,
  onOpenProductionCandidates,
  onUpdate,
  saving,
}) {
  const {
    cancelEdit,
    currentRightsStatus,
    currentStatus,
    currentTags,
    draftMemo,
    draftTitle,
    handleDelete,
    handleRightsStatusChange,
    handleTagsChange,
    handleSaveEdit,
    handleSendToCandidate,
    handleStatusChange,
    candidateSaveState,
    openProductionCandidate,
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
    onOpenProductionCandidates,
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
    currentTags,
    draftMemo,
    draftTitle,
    handleDelete,
    handleRightsStatusChange,
    handleTagsChange,
    handleSaveEdit,
    handleSendToCandidate,
    handleStatusChange,
    candidateSaveState,
    isEditing,
    link,
    openEdit,
    openProductionCandidate,
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
