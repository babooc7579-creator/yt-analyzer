import DiscoveryLinkRow from './DiscoveryLinkRow';

export default function DiscoveryLinksGrid({
  filteredLinks,
  onDeleteLink,
  onUpdateLink,
  saving,
}) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-3">
      {filteredLinks.map((link) => (
        <DiscoveryLinkRow
          key={link.id}
          link={link}
          onDelete={onDeleteLink}
          onUpdate={onUpdateLink}
          saving={saving}
        />
      ))}
    </div>
  );
}
