import {
  getDiscoveryLinkHost,
  getDiscoveryLinkPlatform,
  getDiscoveryLinkRightsStatusValue,
  getDiscoveryLinkStatusLabel,
  getDiscoveryLinkStatusValue,
  getDiscoveryPlatformFromUrl,
  getDiscoveryPlatformLabel,
  getDiscoveryRightsStatusLabel,
} from '../constants/discoveryLinks';

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
  [...links].sort((left, right) => getDiscoveryLinkTimestamp(right) - getDiscoveryLinkTimestamp(left))
);

export const getDiscoveryLinkById = (links = [], id) => (
  links.find((link) => link.id === id)
);

export const upsertDiscoveryLink = (links = [], nextLink) => [
  nextLink,
  ...links.filter((link) => link.id !== nextLink.id),
];

export const replaceDiscoveryLink = (links = [], nextLink) => (
  links.map((link) => (link.id === nextLink.id ? nextLink : link))
);

export const removeDiscoveryLinkById = (links = [], id) => (
  links.filter((link) => link.id !== id)
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
    return `${linkName}의 검토 상태를 '${statusLabel}'로 저장했습니다.`;
  }

  if (updateKeys.length === 1 && updates.rightsStatus !== undefined) {
    const rightsLabel = getDiscoveryRightsStatusLabel(updates.rightsStatus);
    return `${linkName}의 권리 확인 상태를 '${rightsLabel}'로 저장했습니다.`;
  }

  if (updateKeys.length > 0 && updateKeys.every((key) => ['title', 'memo'].includes(key))) {
    if (updates.title !== undefined && updates.memo !== undefined) {
      return `${linkName}의 제목과 메모를 Cloud에 저장했습니다.`;
    }
    if (updates.title !== undefined) {
      return `${linkName}의 제목을 Cloud에 저장했습니다.`;
    }
    if (updates.memo !== undefined) {
      return `${linkName}의 메모를 Cloud에 저장했습니다.`;
    }
  }

  return `${linkName}의 변경 사항을 Cloud에 저장했습니다.`;
};

export const getSearchableDiscoveryLinkText = (link) => (
  [
    link.title,
    link.url,
    link.memo,
    getDiscoveryLinkPlatform(link),
    getDiscoveryLinkHost(link.url),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
);

export const countDiscoveryLinksByStatus = (links = []) => (
  links.reduce((counts, link) => {
    const status = getDiscoveryLinkStatusValue(link);
    return {
      ...counts,
      [status]: (counts[status] || 0) + 1,
    };
  }, {})
);

export const countDiscoveryLinksByRightsStatus = (links = []) => (
  links.reduce((counts, link) => {
    const rightsStatus = getDiscoveryLinkRightsStatusValue(link);
    return {
      ...counts,
      [rightsStatus]: (counts[rightsStatus] || 0) + 1,
    };
  }, {})
);

export const filterDiscoveryLinksByStatus = (links = [], status, allStatus) => {
  if (status === allStatus) return links;
  return links.filter((link) => getDiscoveryLinkStatusValue(link) === status);
};

export const filterDiscoveryLinksByRightsStatus = (links = [], rightsStatus, allRightsStatus) => {
  if (rightsStatus === allRightsStatus) return links;
  return links.filter((link) => getDiscoveryLinkRightsStatusValue(link) === rightsStatus);
};

export const filterDiscoveryLinksBySearchQuery = (links = [], normalizedSearchQuery) => {
  if (!normalizedSearchQuery) return links;
  return links.filter((link) => getSearchableDiscoveryLinkText(link).includes(normalizedSearchQuery));
};

export const getDiscoveryLinkUrlListItems = (links = []) => (
  links.map((link) => {
    const title = link.title || getDiscoveryLinkHost(link.url);

    return link.url ? [
      title,
      link.url,
      getDiscoveryLinkStatusAndRightsLine(link),
    ] : null;
  })
);

export const getDiscoveryLinkUrlPreview = (url) => {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return null;

  try {
    new URL(trimmedUrl);
    const host = getDiscoveryLinkHost(trimmedUrl);
    const platform = getDiscoveryPlatformLabel(getDiscoveryPlatformFromUrl(trimmedUrl));

    return {
      host,
      label: `${platform} 링크로 보입니다`,
      isValid: true,
    };
  } catch {
    return {
      host: '',
      label: '올바른 URL 형식이 아닙니다',
      isValid: false,
    };
  }
};

export const normalizeDiscoveryLinkUrl = (url) => {
  const trimmedUrl = (url || '').trim();
  if (!trimmedUrl) return '';

  try {
    const parsedUrl = new URL(trimmedUrl);
    const pathname = parsedUrl.pathname.replace(/\/$/, '');
    const host = parsedUrl.hostname.replace(/^www\./, '');
    return `${parsedUrl.protocol}//${host}${pathname}${parsedUrl.search}`.toLowerCase();
  } catch {
    return trimmedUrl.replace(/\/$/, '').toLowerCase();
  }
};

export const needsRiskyDiscoveryCandidateConfirmation = (status, rightsStatus) => (
  status === 'candidate' && rightsStatus === 'do_not_use'
);

export const confirmRiskyDiscoveryCandidate = () => window.confirm(
  '이 링크는 "사용 금지"로 표시되어 있습니다.\n\n그래도 제작 후보로 보내시겠어요?\n나중에 제작 후보함에서 강한 경고로 표시됩니다.'
);

export const getInitialDiscoveryLinkForm = () => ({
  url: '',
  title: '',
  memo: '',
  status: 'inbox',
  rightsStatus: 'unknown',
});

export const getDiscoveryLinkStatusAndRightsLine = (link) => {
  const statusLabel = getDiscoveryLinkStatusLabel(getDiscoveryLinkStatusValue(link));
  const rightsLabel = getDiscoveryRightsStatusLabel(getDiscoveryLinkRightsStatusValue(link));
  return `상태: ${statusLabel} · 권리: ${rightsLabel}`;
};
