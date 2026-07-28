import {
  getDiscoveryLinkHost,
  getDiscoveryLinkStatusLabel,
  getDiscoveryRightsStatusLabel,
} from '../constants/discoveryLinks';

const toArray = (items) => (Array.isArray(items) ? items : []);

const toLinkObject = (link) => (
  link && typeof link === 'object' ? link : {}
);

const isLinkObject = (link) => link && typeof link === 'object';

const toLinkList = (links) => toArray(links).filter(isLinkObject);

export const getDiscoveryLinksFromResponse = (data) => {
  if (Array.isArray(data?.links)) return data.links;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

export const getDiscoveryLinkFromResponse = (data) => (
  data?.link || data?.item || data?.discoveryLink || null
);

export const getDiscoveryLinkTimestamp = (link) => (
  new Date(link?.updatedAt || link?.createdAt || 0).getTime()
);

export const sortDiscoveryLinksByRecentUpdate = (links = []) => (
  [...toLinkList(links)].sort((left, right) => getDiscoveryLinkTimestamp(right) - getDiscoveryLinkTimestamp(left))
);

export const getDiscoveryLinkById = (links = [], id) => (
  toLinkList(links).find((link) => toLinkObject(link).id === id)
);

export const upsertDiscoveryLink = (links = [], nextLink) => {
  const link = toLinkObject(nextLink);
  if (!link.id) return toLinkList(links);

  return [
    link,
    ...toLinkList(links).filter((currentLink) => toLinkObject(currentLink).id !== link.id),
  ];
};

export const replaceDiscoveryLink = (links = [], nextLink) => {
  const link = toLinkObject(nextLink);
  if (!link.id) return toLinkList(links);

  return toLinkList(links).map((currentLink) => (
    toLinkObject(currentLink).id === link.id ? link : currentLink
  ));
};

export const removeDiscoveryLinkById = (links = [], id) => (
  toLinkList(links).filter((link) => toLinkObject(link).id !== id)
);

export const getDiscoveryLinkName = (link) => {
  if (link?.title) return link.title;
  if (link?.url) return getDiscoveryLinkHost(link.url, link.url);
  return '발견 링크';
};

export const getDiscoveryLinkSavingAction = (updates) => {
  const updateKeys = Object.keys(updates || {});
  if (updateKeys.length === 1 && updateKeys.includes('status')) return 'update_status';
  if (updateKeys.length === 1 && updateKeys.includes('rightsStatus')) return 'update_rights';
  if (updateKeys.length > 0 && updateKeys.every((key) => ['title', 'memo'].includes(key))) return 'update_text';
  return 'update';
};

export const getDiscoveryLinkUpdateNotice = (updates, link) => {
  const updateKeys = Object.keys(updates || {});
  const linkName = getDiscoveryLinkName(link);

  if (updateKeys.length === 1 && updates.status !== undefined) {
    const statusLabel = getDiscoveryLinkStatusLabel(updates.status);
    if (updates.status === 'candidate') {
      return `${linkName}의 검토 상태를 '${statusLabel}'로 표시했습니다. 제작 후보함에서 이어서 확인할 수 있습니다.`;
    }
    return `${linkName}의 검토 상태를 '${statusLabel}'로 저장했습니다.`;
  }

  if (updateKeys.length === 1 && updates.rightsStatus !== undefined) {
    const rightsLabel = getDiscoveryRightsStatusLabel(updates.rightsStatus);
    return `${linkName}의 권리 상태 표시를 '${rightsLabel}'로 저장했습니다.`;
  }

  if (updateKeys.length > 0 && updateKeys.every((key) => ['title', 'memo'].includes(key))) {
    if (updates.title !== undefined && updates.memo !== undefined) {
      return `${linkName}의 제목과 메모를 온라인 저장소(Azure DB)에 저장했습니다.`;
    }
    if (updates.title !== undefined) {
      return `${linkName}의 제목을 온라인 저장소(Azure DB)에 저장했습니다.`;
    }
    if (updates.memo !== undefined) {
      return `${linkName}의 메모를 온라인 저장소(Azure DB)에 저장했습니다.`;
    }
  }

  return `${linkName}의 변경 사항을 온라인 저장소(Azure DB)에 저장했습니다.`;
};
