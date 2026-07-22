import DiscoveryLinkRow from './DiscoveryLinkRow';

const toArray = (items) => (Array.isArray(items) ? items : []);

export default function DiscoveryLinksGrid({
  filteredLinks,
  onDeleteLink,
  onOpenProductionCandidates,
  onUpdateLink,
  saving,
}) {
  const linkList = toArray(filteredLinks);

  return (
    <div className="mt-5 grid grid-cols-1 gap-3">
      {linkList.map((link) => {
        const rowProps = {
          link,
          onDelete: onDeleteLink,
          onOpenProductionCandidates,
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
