import DiscoveryLinkRow from './DiscoveryLinkRow';

export default function DiscoveryLinksGrid({
  filteredLinks,
  onDeleteLink,
  onUpdateLink,
  saving,
}) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-3">
      {filteredLinks.map((link) => {
        const rowProps = {
          link,
          onDelete: onDeleteLink,
          onUpdate: onUpdateLink,
          saving,
        };

        return (
          <DiscoveryLinkRow key={link.id} {...rowProps} />
        );
      })}
    </div>
  );
}
