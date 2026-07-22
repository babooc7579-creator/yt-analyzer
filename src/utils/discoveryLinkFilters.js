import {
  ALL_DISCOVERY_LINK_STATUS_OPTION,
  ALL_DISCOVERY_RIGHTS_STATUS_OPTION,
  DISCOVERY_LINK_STATUS_OPTIONS,
  DISCOVERY_RIGHTS_STATUS_OPTIONS,
} from '../constants/discoveryLinks';
import {
  countDiscoveryLinksByRightsStatus,
  countDiscoveryLinksByStatus,
  filterDiscoveryLinksByRightsStatus,
  filterDiscoveryLinksBySearchQuery,
  filterDiscoveryLinksByStatus,
  getDiscoveryLinkUrlListItems,
} from './discoveryLinks';
import { formatNumberedUrlList } from './urls';

const toLinkList = (links) => (Array.isArray(links) ? links : []);

export const normalizeDiscoveryLinkSearchQuery = (searchQuery = '') => (
  String(searchQuery || '').trim().toLowerCase()
);

export const buildDiscoveryLinkFilterOptions = ({
  linkCount = 0,
  rightsCounts = {},
  statusCounts = {},
} = {}) => ({
  rightsFilterOptions: [
    { ...ALL_DISCOVERY_RIGHTS_STATUS_OPTION, count: linkCount },
    ...DISCOVERY_RIGHTS_STATUS_OPTIONS.map((option) => ({
      ...option,
      count: rightsCounts[option.value] || 0,
    })),
  ],
  statusFilterOptions: [
    { ...ALL_DISCOVERY_LINK_STATUS_OPTION, count: linkCount },
    ...DISCOVERY_LINK_STATUS_OPTIONS.map((option) => ({
      ...option,
      count: statusCounts[option.value] || 0,
    })),
  ],
});

export const getDiscoveryLinkFilterModel = ({
  links = [],
  rightsFilter = ALL_DISCOVERY_RIGHTS_STATUS_OPTION.value,
  searchQuery = '',
  statusFilter = ALL_DISCOVERY_LINK_STATUS_OPTION.value,
  targetDiscoveryLinkId = '',
} = {}) => {
  const linkList = toLinkList(links);
  const normalizedSearchQuery = normalizeDiscoveryLinkSearchQuery(searchQuery);
  const normalizedTargetId = String(targetDiscoveryLinkId || '').trim();
  const statusCounts = countDiscoveryLinksByStatus(linkList);
  const rightsCounts = countDiscoveryLinksByRightsStatus(linkList);
  const statusMatchedLinks = filterDiscoveryLinksByStatus(
    linkList,
    statusFilter,
    ALL_DISCOVERY_LINK_STATUS_OPTION.value
  );
  const rightsMatchedLinks = filterDiscoveryLinksByRightsStatus(
    statusMatchedLinks,
    rightsFilter,
    ALL_DISCOVERY_RIGHTS_STATUS_OPTION.value
  );
  const searchMatchedLinks = filterDiscoveryLinksBySearchQuery(rightsMatchedLinks, normalizedSearchQuery);
  const filteredLinks = normalizedTargetId
    ? searchMatchedLinks.filter(link => link?.id === normalizedTargetId)
    : searchMatchedLinks;
  const { rightsFilterOptions, statusFilterOptions } = buildDiscoveryLinkFilterOptions({
    linkCount: linkList.length,
    rightsCounts,
    statusCounts,
  });

  return {
    filteredDiscoveryLinkUrlList: formatNumberedUrlList(
      getDiscoveryLinkUrlListItems(filteredLinks)
    ),
    filteredLinks,
    hasActiveDiscoveryFilters: statusFilter !== ALL_DISCOVERY_LINK_STATUS_OPTION.value
      || rightsFilter !== ALL_DISCOVERY_RIGHTS_STATUS_OPTION.value
      || Boolean(normalizedSearchQuery)
      || Boolean(normalizedTargetId),
    rightsFilterOptions,
    statusFilterOptions,
  };
};

export const getDiscoveryLinksRouteContext = ({
  searchQuery = '',
  source = '',
  targetDiscoveryLinkId = '',
} = {}) => {
  const normalizedQuery = String(searchQuery || '').trim();
  const normalizedTargetId = String(targetDiscoveryLinkId || '').trim();

  if (source !== 'studio-candidates' || (!normalizedQuery && !normalizedTargetId)) return null;

  return {
    description: `제작 후보함에서 수정하려고 선택한 "${normalizedQuery || '발견 링크'}" ${normalizedTargetId ? '한 건을' : '항목을'} 바로 보여주고 있습니다. 전체 보기는 화면 조건만 초기화합니다.`,
    label: '제작 후보함에서 이어온 링크',
    resetLabel: '발견함 전체 보기',
    resetTitle: '이 링크 찾기 조건만 해제합니다. Cloud 데이터는 변경하지 않습니다.',
    returnLabel: '제작 후보함으로 돌아가기',
    returnTitle: '제작 후보함으로 돌아가 방금 선택한 링크를 다시 확인합니다. 화면 이동만 하며 Cloud 데이터는 변경하지 않습니다.',
  };
};
