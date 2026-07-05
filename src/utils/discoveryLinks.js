import {
  DISCOVERY_RIGHTS_TONES,
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

export const getDiscoveryLinkDraft = (link = {}) => ({
  title: link.title || '',
  memo: link.memo || '',
});

export const getDiscoveryLinkDraftUpdates = (draftTitle, draftMemo) => ({
  title: draftTitle.trim(),
  memo: draftMemo.trim(),
});

export const hasDiscoveryLinkDraftChanges = (link = {}, draftUpdates = {}) => (
  draftUpdates.title !== (link.title || '')
  || draftUpdates.memo !== (link.memo || '')
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

export const getDiscoveryLinkEditFormViewProps = ({
  draftMemo,
  draftTitle,
  linkId,
  onCancel,
  onSave,
  saving,
  setDraftMemo,
  setDraftTitle,
  title,
}) => ({
  cancelButtonProps: {
    className: 'inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50',
    disabled: saving,
    onClick: onCancel,
    title: '수정 취소',
    'aria-label': `${title} 수정 취소`,
    type: 'button',
  },
  memoField: {
    inputProps: {
      className: 'mt-1 min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-relaxed text-slate-800 outline-none transition focus:border-indigo-400',
      disabled: saving,
      id: `discovery-memo-${linkId}`,
      onChange: (event) => setDraftMemo(event.target.value),
      placeholder: '왜 저장했는지, 어떤 포인트를 봐야 하는지 적어두세요.',
      value: draftMemo,
      'aria-label': `${title} 발견 링크 메모 수정`,
    },
    label: '메모',
  },
  saveButtonProps: {
    className: 'inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 text-xs font-extrabold text-white transition hover:bg-indigo-500 disabled:bg-slate-300',
    disabled: saving,
    onClick: onSave,
    title: '제목과 메모를 Cloud 발견함에 저장',
    'aria-label': `${title} 제목과 메모 저장`,
    type: 'button',
  },
  titleField: {
    inputProps: {
      className: 'mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 outline-none transition focus:border-indigo-400',
      disabled: saving,
      id: `discovery-title-${linkId}`,
      onChange: (event) => setDraftTitle(event.target.value),
      placeholder: '나중에 알아볼 수 있는 이름',
      value: draftTitle,
      'aria-label': `${title} 발견 링크 제목 수정`,
    },
    label: '제목',
  },
});

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
