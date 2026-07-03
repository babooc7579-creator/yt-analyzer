import { useDiscoveryLinkRow } from '../hooks/useDiscoveryLinkRow';
import DiscoveryLinkActions from './DiscoveryLinkActions';
import DiscoveryLinkBadges from './DiscoveryLinkBadges';
import DiscoveryLinkEditForm from './DiscoveryLinkEditForm';
import DiscoveryLinkUpdatedAt from './DiscoveryLinkUpdatedAt';
import DiscoveryLinkViewDetails from './DiscoveryLinkViewDetails';

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
        <div className="min-w-0">
          <DiscoveryLinkBadges
            currentRightsStatus={currentRightsStatus}
            currentStatus={currentStatus}
            platformLabel={platformLabel}
            rightsTone={rightsTone}
            sourceHost={sourceHost}
          />

          {isEditing ? (
            <DiscoveryLinkEditForm
              draftMemo={draftMemo}
              draftTitle={draftTitle}
              linkId={link.id}
              onCancel={cancelEdit}
              onSave={handleSaveEdit}
              saving={saving}
              setDraftMemo={setDraftMemo}
              setDraftTitle={setDraftTitle}
              title={title}
            />
          ) : (
            <DiscoveryLinkViewDetails link={link} title={title} />
          )}
          <DiscoveryLinkUpdatedAt link={link} />
        </div>

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
