const toArray = (items) => (Array.isArray(items) ? items : []);

const toRecordMap = (items) => (items && typeof items === 'object' ? items : {});

export const getProductionDiscoveryLinkList = (links) => toArray(links);

export const getProductionDiscoveryLinkCardProps = ({
  link,
  linkMoveStates,
  onMoveLink,
  onOpenDiscoveryLinks,
}) => {
  const moveStateMap = toRecordMap(linkMoveStates);

  return {
    link,
    moveState: moveStateMap[link.id],
    onEditInDiscoveryLinks: onOpenDiscoveryLinks,
    onMove: onMoveLink,
  };
};
