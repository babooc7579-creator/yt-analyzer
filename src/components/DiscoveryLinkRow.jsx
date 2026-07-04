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

  return (
    <article className={`rounded-xl border p-4 shadow-sm ${rightsTone.card}`}>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <DiscoveryLinkRowContent
          cancelEdit={cancelEdit}
          currentRightsStatus={currentRightsStatus}
          currentStatus={currentStatus}
          draftMemo={draftMemo}
          draftTitle={draftTitle}
          handleSaveEdit={handleSaveEdit}
          isEditing={isEditing}
          link={link}
          platformLabel={platformLabel}
          rightsTone={rightsTone}
          saving={saving}
          setDraftMemo={setDraftMemo}
          setDraftTitle={setDraftTitle}
          sourceHost={sourceHost}
          title={title}
        />

        <DiscoveryLinkActions
          currentRightsStatus={currentRightsStatus}
          currentStatus={currentStatus}
          isEditing={isEditing}
          link={link}
          onDelete={handleDelete}
          onRightsStatusChange={handleRightsStatusChange}
          onSendToCandidate={handleSendToCandidate}
          onStatusChange={handleStatusChange}
          onToggleEdit={isEditing ? cancelEdit : openEdit}
          saving={saving}
          title={title}
        />
      </div>
    </article>
  );
}
