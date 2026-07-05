import { useMemo, useState } from 'react';

import {
  getDiscoveryPlatformFromUrl,
} from '../constants/discoveryLinks';
import {
  confirmRiskyDiscoveryCandidate,
  getDiscoveryLinkUrlPreview,
  getInitialDiscoveryLinkForm,
  needsRiskyDiscoveryCandidateConfirmation,
  normalizeDiscoveryLinkUrl,
} from '../utils/discoveryLinkForm';

export function useDiscoveryLinkForm({
  links,
  onCreateLink,
  saving,
}) {
  const [form, setForm] = useState(getInitialDiscoveryLinkForm);
  const trimmedFormUrl = form.url.trim();

  const updateForm = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const urlPreview = getDiscoveryLinkUrlPreview(form.url);
  const duplicateLink = useMemo(() => {
    const normalizedFormUrl = normalizeDiscoveryLinkUrl(trimmedFormUrl);
    if (!normalizedFormUrl) return null;

    return links.find((link) => normalizeDiscoveryLinkUrl(link.url) === normalizedFormUrl) || null;
  }, [links, trimmedFormUrl]);
  const hasInvalidUrl = urlPreview?.isValid === false;
  const isCreateDisabled = saving || !trimmedFormUrl || hasInvalidUrl || Boolean(duplicateLink);
  const showRiskyCandidateHint = needsRiskyDiscoveryCandidateConfirmation(form.status, form.rightsStatus);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isCreateDisabled) {
      return;
    }

    if (needsRiskyDiscoveryCandidateConfirmation(form.status, form.rightsStatus) && !confirmRiskyDiscoveryCandidate()) {
      return;
    }

    const success = await onCreateLink({
      url: trimmedFormUrl,
      platform: getDiscoveryPlatformFromUrl(trimmedFormUrl),
      title: form.title.trim(),
      memo: form.memo.trim(),
      status: form.status,
      rightsStatus: form.rightsStatus,
    });

    if (success) {
      setForm(getInitialDiscoveryLinkForm());
    }
  };

  return {
    duplicateLink,
    form,
    handleSubmit,
    isCreateDisabled,
    showRiskyCandidateHint,
    updateForm,
    urlPreview,
  };
}
