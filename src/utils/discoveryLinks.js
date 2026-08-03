import {
  DISCOVERY_RIGHTS_TONES,
  getDiscoveryLinkTags,
  getDiscoveryLinkHost,
  getDiscoveryLinkPlatform,
  getDiscoveryLinkRightsStatusValue,
  getDiscoveryLinkStatusLabel,
  getDiscoveryLinkStatusValue,
  getDiscoveryPlatformLabel,
  getDiscoveryRightsStatusLabel,
} from '../constants/discoveryLinks';

const toArray = (items) => (Array.isArray(items) ? items : []);

const toLinkObject = (link) => (
  link && typeof link === 'object' ? link : {}
);

const isLinkObject = (link) => link && typeof link === 'object';

const toLinkList = (links) => toArray(links).filter(isLinkObject);

export const DISCOVERY_LINK_DELETE_CONFIRM_MESSAGE =
  '이 발견 링크를 온라인 발견함(Azure DB)에서 삭제할까요?\n\n원본 사이트 게시물이나 외부 링크 자체는 삭제되지 않습니다. Creator OS 안의 발견함 기록만 삭제됩니다.';

export const getSearchableDiscoveryLinkText = (link) => {
  const sourceLink = toLinkObject(link);

  return [
    sourceLink.title,
    sourceLink.url,
    sourceLink.memo,
    ...getDiscoveryLinkTags(sourceLink),
    getDiscoveryLinkPlatform(sourceLink),
    getDiscoveryLinkHost(sourceLink.url),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
};

export const countDiscoveryLinksByStatus = (links = []) => (
  toLinkList(links).reduce((counts, link) => {
    const status = getDiscoveryLinkStatusValue(link);
    return {
      ...counts,
      [status]: (counts[status] || 0) + 1,
    };
  }, {})
);

export const countDiscoveryLinksByRightsStatus = (links = []) => (
  toLinkList(links).reduce((counts, link) => {
    const rightsStatus = getDiscoveryLinkRightsStatusValue(link);
    return {
      ...counts,
      [rightsStatus]: (counts[rightsStatus] || 0) + 1,
    };
  }, {})
);

export const filterDiscoveryLinksByStatus = (links = [], status, allStatus) => {
  const linkList = toLinkList(links);
  if (status === allStatus) return linkList;
  return linkList.filter((link) => getDiscoveryLinkStatusValue(link) === status);
};

export const filterDiscoveryLinksByRightsStatus = (links = [], rightsStatus, allRightsStatus) => {
  const linkList = toLinkList(links);
  if (rightsStatus === allRightsStatus) return linkList;
  return linkList.filter((link) => getDiscoveryLinkRightsStatusValue(link) === rightsStatus);
};

export const filterDiscoveryLinksBySearchQuery = (links = [], normalizedSearchQuery) => {
  const linkList = toLinkList(links);
  if (!normalizedSearchQuery) return linkList;
  return linkList.filter((link) => getSearchableDiscoveryLinkText(link).includes(normalizedSearchQuery));
};

export const getDiscoveryLinkUrlListItems = (links = []) => (
  toLinkList(links).map((link) => {
    const sourceLink = toLinkObject(link);
    const title = sourceLink.title || getDiscoveryLinkHost(sourceLink.url);

    return sourceLink.url ? [
      title,
      sourceLink.url,
      getDiscoveryLinkStatusAndRightsLine(sourceLink),
    ] : null;
  })
);

export const getProductionDiscoveryLinkTitle = (link) => {
  const sourceLink = toLinkObject(link);
  if (sourceLink.title) return sourceLink.title;
  return getDiscoveryLinkHost(sourceLink.url, '발견 링크');
};

export const getDiscoveryLinkRowMeta = (link = {}) => {
  const sourceLink = toLinkObject(link);
  const currentRightsStatus = getDiscoveryLinkRightsStatusValue(sourceLink);

  return {
    currentTags: getDiscoveryLinkTags(sourceLink),
    currentRightsStatus,
    currentStatus: getDiscoveryLinkStatusValue(sourceLink),
    platformLabel: getDiscoveryPlatformLabel(getDiscoveryLinkPlatform(sourceLink)),
    rightsTone: DISCOVERY_RIGHTS_TONES[currentRightsStatus] || DISCOVERY_RIGHTS_TONES.unknown,
    sourceHost: getDiscoveryLinkHost(sourceLink.url),
    title: sourceLink.title || getDiscoveryLinkHost(sourceLink.url),
  };
};

export const getDiscoveryLinkRowViewProps = ({
  cancelEdit,
  candidateSaveState,
  currentRightsStatus,
  currentStatus,
  currentTags,
  draftMemo,
  draftTitle,
  handleDelete,
  handleRightsStatusChange,
  handleTagsChange,
  handleSaveEdit,
  handleSendToCandidate,
  handleStatusChange,
  isEditing,
  link,
  openEdit,
  openProductionCandidate,
  platformLabel,
  rightsTone,
  saving,
  setDraftMemo,
  setDraftTitle,
  sourceHost,
  title,
}) => ({
  actionsProps: {
    currentRightsStatus,
    currentStatus,
    currentTags,
    candidateSaveState,
    isEditing,
    link,
    onDelete: handleDelete,
    onRightsStatusChange: handleRightsStatusChange,
    onTagsChange: handleTagsChange,
    onOpenProductionCandidate: openProductionCandidate,
    onSendToCandidate: handleSendToCandidate,
    onStatusChange: handleStatusChange,
    onToggleEdit: isEditing ? cancelEdit : openEdit,
    saving,
    title,
  },
  cardClassName: `rounded-xl border p-4 shadow-sm ${rightsTone.card}`,
  rowContentProps: {
    cancelEdit,
    currentRightsStatus,
    currentStatus,
    currentTags,
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
  },
});

export const getDiscoveryLinkStatusAndRightsLine = (link) => {
  const statusLabel = getDiscoveryLinkStatusLabel(getDiscoveryLinkStatusValue(link));
  const rightsLabel = getDiscoveryRightsStatusLabel(getDiscoveryLinkRightsStatusValue(link));
  return `상태: ${statusLabel} · 권리: ${rightsLabel}`;
};
