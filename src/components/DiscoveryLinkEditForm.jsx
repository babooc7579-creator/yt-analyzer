import { Save, X } from 'lucide-react';

import { getDiscoveryLinkEditFormViewProps } from '../utils/discoveryLinkForm';

export default function DiscoveryLinkEditForm({
  draftMemo,
  draftTitle,
  linkId,
  onCancel,
  onSave,
  saving,
  setDraftMemo,
  setDraftTitle,
  title,
}) {
  const {
    cancelButtonProps,
    memoField,
    saveButtonProps,
    titleField,
  } = getDiscoveryLinkEditFormViewProps({
    draftMemo,
    draftTitle,
    linkId,
    onCancel,
    onSave,
    saving,
    setDraftMemo,
    setDraftTitle,
    title,
  });

  return (
    <div className="mt-3 space-y-3">
      <div>
        <label
          className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500"
          htmlFor={titleField.inputProps.id}
        >
          {titleField.label}
        </label>
        <input {...titleField.inputProps} />
      </div>

      <div>
        <label
          className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500"
          htmlFor={memoField.inputProps.id}
        >
          {memoField.label}
        </label>
        <textarea {...memoField.inputProps} />
      </div>

      <div className="flex flex-wrap gap-2">
        <button {...saveButtonProps}>
          <Save className="h-4 w-4" />
          저장
        </button>
        <button {...cancelButtonProps}>
          <X className="h-4 w-4" />
          취소
        </button>
      </div>
    </div>
  );
}
