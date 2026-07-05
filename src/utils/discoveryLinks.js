import {
  DISCOVERY_RIGHTS_TONES,
  getDiscoveryLinkHost,
  getDiscoveryLinkPlatform,
  getDiscoveryLinkRightsStatusValue,
  getDiscoveryLinkStatusLabel,
  getDiscoveryLinkStatusValue,
  getDiscoveryPlatformLabel,
  getDiscoveryRightsStatusLabel,
} from '../constants/discoveryLinks';

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

export const getDiscoveryLinkRowMeta = (link = {}) => {
  const currentRightsStatus = getDiscoveryLinkRightsStatusValue(link);

  return {
    currentRightsStatus,
    currentStatus: getDiscoveryLinkStatusValue(link),
    platformLabel: getDiscoveryPlatformLabel(getDiscoveryLinkPlatform(link)),
    rightsTone: DISCOVERY_RIGHTS_TONES[currentRightsStatus] || DISCOVERY_RIGHTS_TONES.unknown,
    sourceHost: getDiscoveryLinkHost(link.url),
    title: link.title || getDiscoveryLinkHost(link.url),
  };
};

export const getDiscoveryLinkRowViewProps = ({
  cancelEdit,
  currentRightsStatus,
  currentStatus,
  draftMemo,
  draftTitle,
  handleDelete,
  handleRightsStatusChange,
  handleSaveEdit,
  handleSendToCandidate,
  handleStatusChange,
  isEditing,
  link,
  openEdit,
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
    isEditing,
    link,
    onDelete: handleDelete,
    onRightsStatusChange: handleRightsStatusChange,
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
