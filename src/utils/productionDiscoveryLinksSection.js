const toArray = (items) => (Array.isArray(items) ? items : []);

const toRecordMap = (items) => (items && typeof items === 'object' ? items : {});

export const getProductionDiscoveryLinkList = (links) => toArray(links);

export const getProductionDiscoveryLinksSectionActions = ({ onOpenDiscoveryLinks }) => ({
  openDiscoveryLinksButtonProps: {
    'aria-label': '발견함 링크 관리 화면 열기, Cloud 저장 링크 조회와 수정, 외부 자동 수집 없음',
    onClick: onOpenDiscoveryLinks,
    title: 'Cloud 발견함에 저장된 링크 후보를 조회하고 수정합니다. 외부 사이트 자동 수집이나 다운로드는 실행하지 않습니다.',
  },
});

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
