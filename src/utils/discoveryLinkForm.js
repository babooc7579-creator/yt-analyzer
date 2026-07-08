import {
  getDiscoveryLinkHost,
  getDiscoveryPlatformFromUrl,
  getDiscoveryPlatformLabel,
} from '../constants/discoveryLinks';

const toLinkObject = (link) => (
  link && typeof link === 'object' ? link : {}
);

const toText = (value) => (typeof value === 'string' ? value : '');

export const getDiscoveryLinkDraft = (link = {}) => {
  const sourceLink = toLinkObject(link);

  return {
    title: sourceLink.title || '',
    memo: sourceLink.memo || '',
  };
};

export const getDiscoveryLinkDraftUpdates = (draftTitle, draftMemo) => ({
  title: toText(draftTitle).trim(),
  memo: toText(draftMemo).trim(),
});

export const hasDiscoveryLinkDraftChanges = (link = {}, draftUpdates = {}) => {
  const sourceLink = toLinkObject(link);
  const updates = toLinkObject(draftUpdates);

  return (
    updates.title !== (sourceLink.title || '')
    || updates.memo !== (sourceLink.memo || '')
  );
};

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
  cancelButtonLabel: '취소',
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
  saveButtonLabel: '저장',
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

export const getDiscoveryLinkFormProps = ({
  duplicateLink,
  form,
  isCreateDisabled,
  onChange,
  saving,
  showRiskyCandidateHint,
  urlPreview,
}) => {
  const sourceForm = toLinkObject(form);

  return {
    memoFieldProps: {
      onChange: (value) => onChange('memo', value),
      value: sourceForm.memo,
    },
    riskyCandidateHintProps: {
      show: showRiskyCandidateHint,
    },
    statusFieldsProps: {
      onChange,
      rightsStatus: sourceForm.rightsStatus,
      status: sourceForm.status,
    },
    submitButtonProps: {
      duplicateLink,
      isCreateDisabled,
      saving,
    },
    titleFieldProps: {
      ariaLabel: '발견 링크 제목 또는 기억할 이름',
      label: '제목 또는 기억할 이름',
      onChange: (value) => onChange('title', value),
      placeholder: '나중에 알아볼 수 있는 이름',
      value: sourceForm.title,
    },
    urlFieldProps: {
      duplicateLink,
      onChange,
      url: sourceForm.url,
      urlPreview,
    },
  };
};

export const getDiscoveryLinkUrlPreview = (url) => {
  const trimmedUrl = toText(url).trim();
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
  const trimmedUrl = toText(url).trim();
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
  '이 링크는 "사용 금지"로 표시되어 있습니다.\n\n그래도 제작 후보로 보내시겠어요?\n이 작업은 Cloud 발견함 상태만 바꾸며, 사용 허가나 권리 확인 완료를 의미하지 않습니다. 나중에 제작 후보함에서 강한 경고로 표시됩니다.'
);

export const getInitialDiscoveryLinkForm = () => ({
  url: '',
  title: '',
  memo: '',
  status: 'inbox',
  rightsStatus: 'unknown',
});
