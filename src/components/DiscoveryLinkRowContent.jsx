import DiscoveryLinkBadges from './DiscoveryLinkBadges';
import DiscoveryLinkEditForm from './DiscoveryLinkEditForm';
import DiscoveryLinkUpdatedAt from './DiscoveryLinkUpdatedAt';
import DiscoveryLinkViewDetails from './DiscoveryLinkViewDetails';

export default function DiscoveryLinkRowContent({
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
}) {
  return (
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
  );
}
