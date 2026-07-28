import {
  DISCOVERY_RIGHTS_WARNINGS,
  getDiscoveryLinkRightsStatusValue,
} from '../constants/discoveryLinks';

const toArray = (items) => (Array.isArray(items) ? items : []);

const toRecordMap = (items) => (items && typeof items === 'object' ? items : {});

const isLinkObject = (link) => link && typeof link === 'object';

const isFunction = (value) => typeof value === 'function';

const RIGHTS_PRIORITY = {
  do_not_use: 0,
  needs_check: 1,
  unknown: 2,
  cleared: 3,
};

const getLinkTimestamp = (link) => new Date(link?.updatedAt || link?.createdAt || 0).getTime();

const getRightsPriority = (link) => {
  const rightsStatus = getDiscoveryLinkRightsStatusValue(link);
  return RIGHTS_PRIORITY[rightsStatus] ?? RIGHTS_PRIORITY.unknown;
};

export const getProductionDiscoveryLinkList = (links) => (
  toArray(links)
    .filter(isLinkObject)
    .sort((left, right) => {
      const priorityDiff = getRightsPriority(left) - getRightsPriority(right);
      if (priorityDiff !== 0) return priorityDiff;
      return getLinkTimestamp(right) - getLinkTimestamp(left);
    })
);

export const getProductionDiscoveryRightsWarningCount = (links) => (
  getProductionDiscoveryLinkList(links).filter(link => (
    DISCOVERY_RIGHTS_WARNINGS[getDiscoveryLinkRightsStatusValue(link)]
  )).length
);

export const getProductionDiscoveryLinksSectionHeaderProps = ({
  linkCount = 0,
  rightsWarningCount = 0,
} = {}) => ({
  badgeText: `링크 후보 ${linkCount}개`,
  badgeTitle: '온라인 발견함(Azure DB)에서 제작 후보로 표시한 외부 링크 수입니다. 영상 후보와 별도로 표시합니다.',
  eyebrow: '발견함 링크 후보',
  title: '외부에서 저장한 제작 후보 링크',
  description:
    '발견함에서 상태를 제작 후보로 바꾼 링크입니다. 별도 제작 DB로 옮긴 것이 아니라 온라인 발견함(Azure DB) 기록을 제작 참고 목록으로 보여줍니다. 자동 수집이나 다운로드는 실행하지 않습니다.',
  openButtonLabel: '발견함 열기',
  warningText: rightsWarningCount > 0
    ? `먼저 처리할 권리 확인 링크 ${rightsWarningCount}개가 위에 표시됩니다.`
    : '',
  warningTitle: rightsWarningCount > 0
    ? '사용 금지 또는 권리 확인 필요 링크를 먼저 보여줍니다. 화면 표시 순서만 바꾸며 저장이나 API 호출은 없습니다.'
    : '',
});

export const getProductionDiscoveryLinksSectionActions = ({ onOpenDiscoveryLinks }) => ({
  openDiscoveryLinksButtonProps: {
    'aria-label': '발견함 링크 관리 화면 열기, 온라인 저장소(Azure DB) 저장 링크 조회와 수정, 외부 자동 수집 없음',
    onClick: onOpenDiscoveryLinks,
    title: '온라인 발견함(Azure DB)에 저장된 링크 후보를 조회하고 수정합니다. 외부 사이트 자동 수집이나 다운로드는 실행하지 않습니다.',
  },
});

export const getProductionDiscoveryLinkCardProps = ({
  link,
  linkMoveStates,
  onMoveLink,
  onOpenDiscoveryLinks,
  onOpenScriptBoard,
}) => {
  const sourceLink = isLinkObject(link) ? link : {};
  const moveStateMap = toRecordMap(linkMoveStates);

  return {
    link: sourceLink,
    moveState: moveStateMap[sourceLink.id],
    onEditInDiscoveryLinks: isFunction(onOpenDiscoveryLinks)
      ? () => onOpenDiscoveryLinks(sourceLink)
      : undefined,
    onMove: onMoveLink,
    onOpenScriptBoard: isFunction(onOpenScriptBoard)
      ? () => onOpenScriptBoard(sourceLink)
      : undefined,
  };
};
